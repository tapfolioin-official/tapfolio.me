import 'dart:convert';
import 'package:app/core/api/security_service.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;

void main() {
  setUp(() {
    TransactionSecurityService.clearSessionKeys();
  });

  group('1. Request Signing & Payload Hashing Tests', () {
    test('Non-empty body produces expected 64-char SHA-256 hash', () {
      final body = jsonEncode({'title': 'Personal Card', 'active': true});
      final hash = TransactionSecurityService.computeBodyHash(body);
      expect(hash.length, 64);
      expect(RegExp(r'^[0-9a-f]{64}$').hasMatch(hash), isTrue);
    });

    test('Null and empty body both produce standard SHA-256 empty hash', () {
      final nullHash = TransactionSecurityService.computeBodyHash(null);
      final emptyHash = TransactionSecurityService.computeBodyHash('');
      const expectedEmpty =
          'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
      expect(nullHash, expectedEmpty);
      expect(emptyHash, expectedEmpty);
    });

    test('signRequest generates all required headers including client, nonce, timestamp, hash, signature', () {
      final headers = TransactionSecurityService.signRequest(
        method: 'POST',
        path: '/api/cards',
        body: jsonEncode({'title': 'Personal Card'}),
      );

      expect(headers['X-Pertap-Client'], 'mobile-app');
      expect(headers['X-Pertap-Timestamp'], isNotEmpty);
      expect(headers['X-Pertap-Nonce'], hasLength(32));
      expect(headers['X-Pertap-Body-Hash'], hasLength(64));
      expect(headers['X-Pertap-Signature'], hasLength(64));
    });

    test('Canonical path and query parameters are signed consistently', () {
      const urlWithQuery = 'https://api.tapfolio.me/api/lookup?username=nibras&category=tech';
      final headers1 = TransactionSecurityService.signRequest(
        method: 'GET',
        path: urlWithQuery,
        body: null,
        explicitNonce: '11111111111111111111111111111111',
      );

      // Same request without query must produce DIFFERENT signature
      final headers2 = TransactionSecurityService.signRequest(
        method: 'GET',
        path: 'https://api.tapfolio.me/api/lookup',
        body: null,
        explicitNonce: '11111111111111111111111111111111',
      );

      expect(headers1['X-Pertap-Signature'], isNot(equals(headers2['X-Pertap-Signature'])));
    });
  });

  group('2. Anti-Replay & Nonce Generation Tests', () {
    test('Nonces generated consecutively are unique high-entropy strings', () {
      final nonces = <String>{};
      for (int i = 0; i < 100; i++) {
        final nonce = TransactionSecurityService.generateNonce();
        expect(nonce.length, 32);
        expect(nonces.contains(nonce), isFalse, reason: 'Duplicate nonce generated!');
        nonces.add(nonce);
      }
      expect(nonces.length, 100);
    });
  });

  group('3. Response Integrity Verification Tests', () {
    const testKey = 'test_key_secret_2026_abcdef123456';
    const nonce = 'a1b2c3d4e5f60718293a4b5c6d7e8f90';
    const timestamp = '1715000000000';
    const statusCode = 200;

    test('Valid response signature passes verification cleanly', () {
      TransactionSecurityService.setSessionKey(testKey);

      const responseBody = '{"success":true}';
      final bodyHash = TransactionSecurityService.computeBodyHash(responseBody);
      final authenticSignature = TransactionSecurityService.computeResponseSignature(
        statusCode: statusCode,
        timestamp: timestamp,
        nonce: nonce,
        bodyHash: bodyHash,
        explicitKey: testKey,
      );

      final response = http.Response(
        responseBody,
        statusCode,
        headers: {
          'x-pertap-response-timestamp': timestamp,
          'x-pertap-response-signature': authenticSignature,
        },
      );

      expect(
        () => TransactionSecurityService.verifyResponseIntegrity(
          response: response,
          requestNonce: nonce,
          explicitKey: testKey,
        ),
        returnsNormally,
      );
    });

    test('Tampered response body causes signature verification failure', () {
      TransactionSecurityService.setSessionKey(testKey);

      const originalBody = '{"balance": 1000}';
      final originalBodyHash = TransactionSecurityService.computeBodyHash(originalBody);
      final authenticSignature = TransactionSecurityService.computeResponseSignature(
        statusCode: statusCode,
        timestamp: timestamp,
        nonce: nonce,
        bodyHash: originalBodyHash,
        explicitKey: testKey,
      );

      // MITM attacker tampers with body
      const tamperedBody = '{"balance": 9999999}';
      final tamperedResponse = http.Response(
        tamperedBody,
        statusCode,
        headers: {
          'x-pertap-response-timestamp': timestamp,
          'x-pertap-response-signature': authenticSignature,
        },
      );

      expect(
        () => TransactionSecurityService.verifyResponseIntegrity(
          response: tamperedResponse,
          requestNonce: nonce,
          explicitKey: testKey,
        ),
        throwsA(isA<SecurityException>()),
      );
    });

    test('Tampered response signature throws SecurityException', () {
      TransactionSecurityService.setSessionKey(testKey);

      final tamperedResponse = http.Response(
        '{"success":true}',
        statusCode,
        headers: {
          'x-pertap-response-timestamp': timestamp,
          'x-pertap-response-signature': 'badbadbadbadbadbadbadbadbadbadbadbadbadbadbadbadbadbadbadbadbadb',
        },
      );

      expect(
        () => TransactionSecurityService.verifyResponseIntegrity(
          response: tamperedResponse,
          requestNonce: nonce,
          explicitKey: testKey,
        ),
        throwsA(isA<SecurityException>()),
      );
    });

    test('Tampered response with wrong nonce throws SecurityException', () {
      TransactionSecurityService.setSessionKey(testKey);

      final response = http.Response(
        '{"success":true}',
        statusCode,
        headers: {
          'x-pertap-response-timestamp': timestamp,
          'x-pertap-response-signature':
              TransactionSecurityService.signRequest(
            method: '200',
            path: timestamp,
            body: null,
            explicitNonce: 'DIFFERENT_NONCE_0000000000000000',
            explicitKey: testKey,
          )['X-Pertap-Signature']!,
        },
      );

      expect(
        () => TransactionSecurityService.verifyResponseIntegrity(
          response: response,
          requestNonce: nonce, // original request nonce does not match
          explicitKey: testKey,
        ),
        throwsA(isA<SecurityException>()),
      );
    });
  });

  group('4. Key Provisioning, Rotation & Logout Revocation Tests', () {
    test('Session key can be provisioned dynamically and wiped on logout', () {
      expect(TransactionSecurityService.hasActiveKey, isFalse);

      TransactionSecurityService.setSessionKey('dynamic_session_key_123');
      expect(TransactionSecurityService.hasActiveKey, isTrue);

      // Sign with provisioned key
      final sig1 = TransactionSecurityService.signRequest(
        method: 'POST',
        path: '/api/cards',
        body: null,
        explicitNonce: '00000000000000000000000000000000',
      )['X-Pertap-Signature'];

      // Rotate to new session key
      TransactionSecurityService.setSessionKey('dynamic_session_key_456');
      final sig2 = TransactionSecurityService.signRequest(
        method: 'POST',
        path: '/api/cards',
        body: null,
        explicitNonce: '00000000000000000000000000000000',
      )['X-Pertap-Signature'];

      expect(sig1, isNot(equals(sig2)), reason: 'Key rotation must change signature output!');

      // Logout / Revocation
      TransactionSecurityService.clearSessionKeys();
      expect(TransactionSecurityService.hasActiveKey, isFalse);
    });

    test('Handshake credentials attach X-Pertap-Handshake header before auth', () {
      TransactionSecurityService.clearSessionKeys();
      TransactionSecurityService.setHandshakeCredentials(
        token: 'hs_1715000000_abcdef',
        key: 'handshake_key_999',
      );

      final headers = TransactionSecurityService.signRequest(
        method: 'POST',
        path: '/api/auth/login',
        body: jsonEncode({'email': 'test@tapfolio.me'}),
      );

      expect(headers['X-Pertap-Handshake'], 'hs_1715000000_abcdef');
      expect(headers['X-Pertap-Signature'], hasLength(64));
    });
  });
}

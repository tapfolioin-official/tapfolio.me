import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import '../storage/local_storage.dart';
import '../utils/logger.dart';
import '../utils/error_handler.dart';
import 'security_service.dart';
import '../../services/client_stub.dart' if (dart.library.js_util) '../../services/client_web.dart';

class ApiClient {
  static final ApiClient _instance = ApiClient._internal();
  factory ApiClient() => _instance;
  ApiClient._internal();

  static const String productionUrl = 'https://www.tapfolio.me';
  static const String envApiUrl = String.fromEnvironment('API_URL');

  final http.Client _client = getClient();
  final LocalStorage _storage = LocalStorage();

  String get baseUrl {
    if (envApiUrl.isNotEmpty) {
      return envApiUrl;
    }
    if (kDebugMode) {
      // Default to production URL so it works on physical devices (cellular/5G) out of the box.
      // If you are testing against your local Mac server:
      // 1. Ensure your iPhone and Mac are on the SAME Wi-Fi network.
      // 2. Change this to 'http://10.250.40.192:3000' (your Mac's current local IP: 10.250.40.192).
      return productionUrl;
    }
    return productionUrl;
  }

  Map<String, String> _getHeaders() {
    final headers = <String, String>{
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    final token = _storage.jwtToken;
    if (token != null && token.isNotEmpty) {
      headers['Cookie'] = 'pertap_jwt=$token';
      headers['Authorization'] = 'Bearer $token';
      headers['X-Pertap-Token'] = token;
    }
    return headers;
  }

  Future<void> _updateToken(http.Response response) async {
    String? token;

    // 1. Try to read token from JSON body first (safest for mobile)
    try {
      final body = response.body.trim();
      if (body.isNotEmpty) {
        final decoded = jsonDecode(body);
        if (decoded is Map<String, dynamic>) {
          if (decoded['token'] != null) {
            token = decoded['token'];
          }
          if (decoded['transactionKey'] != null) {
            TransactionSecurityService.setSessionKey(decoded['transactionKey'].toString());
          }
        }
      }
    } catch (_) {}

    // 2. Try the custom proxy echo header (works on web)
    if (token == null || token.isEmpty) {
      token = response.headers['x-pertap-token'];
    }

    // 3. Fall back to parsing Set-Cookie (works on mobile)
    if (token == null || token.isEmpty) {
      final rawCookie = response.headers['set-cookie'] ?? response.headers['Set-Cookie'];
      if (rawCookie != null) {
        final match = RegExp(r'pertap_jwt=([^;]+)').firstMatch(rawCookie);
        token = match?.group(1);
      }
    }

    if (token != null && token.isNotEmpty) {
      await _storage.setJwtToken(token);
      AppLogger.debug('JWT persisted (len=${token.length})');
    }
  }

  Future<http.Response> sendRequest(
    String method,
    String path, {
    bool authenticated = true,
    Map<String, String>? headers,
    Object? body,
    int retryCount = 1,
  }) async {
    final url = Uri.parse('$baseUrl$path');
    AppLogger.info('HTTP $method -> $url');

    final finalHeaders = _getHeaders();
    if (!authenticated) {
      finalHeaders.remove('Cookie');
      finalHeaders.remove('Authorization');
      finalHeaders.remove('X-Pertap-Token');
    }
    if (headers != null) {
      finalHeaders.addAll(headers);
    }

    http.Response? response;
    dynamic lastError;
    String lastNonce = '';

    for (int i = 0; i <= retryCount; i++) {
      try {
        final request = http.Request(method, url);
        request.headers.addAll(finalHeaders);

        // Sign transaction with fresh nonce, timestamp, and body hash
        final nonce = TransactionSecurityService.generateNonce();
        lastNonce = nonce;
        final securityHeaders = TransactionSecurityService.signRequest(
          method: method,
          path: url.toString(),
          body: body,
          explicitNonce: nonce,
        );
        request.headers.addAll(securityHeaders);

        if (body != null) {
          if (body is String) {
            request.body = body;
          } else if (body is List<int>) {
            request.bodyBytes = body;
          } else if (body is Map<String, String>) {
            request.bodyFields = body;
          }
        }

        final streamedResponse = await _client.send(request).timeout(const Duration(seconds: 12));
        response = await http.Response.fromStream(streamedResponse);
        break; // Success, break loop
      } catch (e) {
        lastError = e;
        AppLogger.warn('Request attempt $i failed: $e');
        if (i < retryCount) {
          await Future.delayed(Duration(seconds: i + 1));
        }
      }
    }

    if (response == null) {
      throw ErrorHandler.handle(lastError ?? Exception('Request failed'));
    }

    AppLogger.info('HTTP ${response.statusCode} <- $url');

    // Cryptographic verification of server response
    TransactionSecurityService.verifyResponseIntegrity(
      response: response,
      requestNonce: lastNonce,
    );

    // Automatically check for JWT updates in headers/body
    await _updateToken(response);

    // Auto clear credentials if server explicitly revokes them
    if (response.statusCode == 401 && authenticated) {
      AppLogger.warn('Auth token rejected (401). Purging credentials.');
      await _storage.clearJwtToken();
      TransactionSecurityService.clearSessionKeys();
    }

    return response;
  }
}

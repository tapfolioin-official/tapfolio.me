import 'package:flutter_test/flutter_test.dart';
import 'package:qr_flutter/qr_flutter.dart';
import 'package:app/features/card_export/models/profile_share_data.dart';

void main() {
  group('QR Generation & Scan Reliability Tests', () {
    test('QR matrix is successfully validated with Error Correction H', () {
      final canonicalUrl = ProfileShareData.normalizeProfileUrl('nibras.in');
      expect(canonicalUrl, startsWith('https://'));

      final qrValidationResult = QrValidator.validate(
        data: canonicalUrl,
        version: QrVersions.auto,
        errorCorrectionLevel: QrErrorCorrectLevel.H,
      );

      expect(qrValidationResult.status, equals(QrValidationStatus.valid));
      expect(qrValidationResult.qrCode, isNotNull);
      expect(qrValidationResult.qrCode!.moduleCount, greaterThan(20));
    });

    test('validates QR matrix across multiple Tapfolio username patterns', () {
      final testCases = [
        'john_doe',
        'sarah.design',
        'alex-developer-123',
        'mohammed.nibrasul.haqq',
        'https://www.tapfolio.me/connect/custom.user',
      ];

      for (final input in testCases) {
        final url = ProfileShareData.normalizeProfileUrl(input);
        expect(ProfileShareData.isValidUrl(url), isTrue);

        final result = QrValidator.validate(
          data: url,
          version: QrVersions.auto,
          errorCorrectionLevel: QrErrorCorrectLevel.H,
        );

        expect(
          result.status,
          equals(QrValidationStatus.valid),
          reason: 'Failed for input: $input -> $url',
        );
        expect(result.qrCode, isNotNull);
      }
    });

    test('URL validator correctly rejects invalid or empty strings', () {
      expect(ProfileShareData.isValidUrl(''), isFalse);
      expect(ProfileShareData.isValidUrl('   '), isFalse);
      expect(ProfileShareData.isValidUrl('null'), isFalse);
      expect(ProfileShareData.isValidUrl('undefined'), isFalse);
      expect(ProfileShareData.isValidUrl('javascript:alert(1)'), isFalse);
      expect(ProfileShareData.isValidUrl(null), isFalse);
    });
  });
}

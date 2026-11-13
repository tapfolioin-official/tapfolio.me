import 'dart:io';
import 'dart:ui' as ui;
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:qr_flutter/qr_flutter.dart';
import 'package:app/features/card_export/widgets/qr_section.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  group('Share Card QR Validation & Pipeline Tests', () {
    test('Strict URL validation accepts canonical HTTPS Tapfolio routes', () {
      expect(
        QrSection.isValidUrl('https://tapfolio.me/connect/nibras.in'),
        isTrue,
      );
      expect(
        QrSection.isValidUrl('https://www.tapfolio.me/connect/mohammed'),
        isTrue,
      );
      expect(
        QrSection.isValidUrl('http://tapfolio.me/connect/test'),
        isTrue,
      );
    });

    test('Strict URL validation rejects invalid, empty, or malicious payloads',
        () {
      expect(QrSection.isValidUrl(''), isFalse);
      expect(QrSection.isValidUrl('   '), isFalse);
      expect(QrSection.isValidUrl(null), isFalse);
      expect(QrSection.isValidUrl('null'), isFalse);
      expect(QrSection.isValidUrl('undefined'), isFalse);
      expect(QrSection.isValidUrl('javascript:alert(1)'), isFalse);
      expect(QrSection.isValidUrl('tapfolio'), isFalse);
      expect(QrSection.isValidUrl('not_a_url'), isFalse);
    });

    test('QrValidator generates valid QR code with Error Correction Level H',
        () {
      const canonicalUrl = 'https://tapfolio.me/connect/nibras.in';

      final validationResult = QrValidator.validate(
        data: canonicalUrl,
        version: QrVersions.auto,
        errorCorrectionLevel: QrErrorCorrectLevel.H,
      );

      expect(validationResult.status, equals(QrValidationStatus.valid));
      expect(validationResult.qrCode, isNotNull);

      final qr = validationResult.qrCode!;
      expect(qr.errorCorrectLevel, equals(QrErrorCorrectLevel.H));
      expect(qr.moduleCount, greaterThan(20));
      expect(qr.typeNumber, greaterThanOrEqualTo(1));

      final image = QrImage(qr);
      expect(image.isDark(0, 0), isTrue);
      expect(image.isDark(0, qr.moduleCount - 1), isTrue);
      expect(image.isDark(qr.moduleCount - 1, 0), isTrue);
    });

    test('QrPainter exports high-resolution PNG with Level H error correction',
        () async {
      const canonicalUrl = 'https://tapfolio.me/connect/nibras.in';

      final painter = QrPainter(
        data: canonicalUrl,
        version: QrVersions.auto,
        errorCorrectionLevel: QrErrorCorrectLevel.H,
        gapless: true,
        eyeStyle: const QrEyeStyle(
          eyeShape: QrEyeShape.square,
          color: Color(0xFF000000),
        ),
        dataModuleStyle: const QrDataModuleStyle(
          dataModuleShape: QrDataModuleShape.square,
          color: Color(0xFF000000),
        ),
      );

      final byteData = await painter.toImageData(600.0,
          format: ui.ImageByteFormat.png);
      expect(byteData, isNotNull);

      final outDir = Directory('/tmp/tapfolio_test_exports');
      if (!outDir.existsSync()) outDir.createSync(recursive: true);

      final file = File('${outDir.path}/export_qr_painter.png');
      await file.writeAsBytes(byteData!.buffer.asUint8List());

      expect(file.existsSync(), isTrue);
      expect(file.lengthSync(), greaterThan(1000));
    });
  });
}

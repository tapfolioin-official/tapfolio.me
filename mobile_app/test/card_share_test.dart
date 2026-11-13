import 'package:flutter_test/flutter_test.dart';
import 'package:app/features/card_export/models/profile_share_data.dart';

void main() {
  group('ProfileShareData & URL Normalization Tests', () {
    test('normalizes bare username into canonical Tapfolio URL', () {
      final url = ProfileShareData.normalizeProfileUrl('nibras.in');
      expect(url, equals('https://www.tapfolio.me/connect/nibras.in'));
    });

    test('normalizes domain path without scheme', () {
      final url = ProfileShareData.normalizeProfileUrl('tapfolio.me/connect/nibras.in');
      expect(url, equals('https://www.tapfolio.me/connect/nibras.in'));
    });

    test('normalizes www domain path without scheme', () {
      final url = ProfileShareData.normalizeProfileUrl('www.tapfolio.me/connect/nibras.in');
      expect(url, equals('https://www.tapfolio.me/connect/nibras.in'));
    });

    test('upgrades http to https', () {
      final url = ProfileShareData.normalizeProfileUrl('http://www.tapfolio.me/connect/nibras.in');
      expect(url, equals('https://www.tapfolio.me/connect/nibras.in'));
    });

    test('preserves already valid https URL', () {
      final url = ProfileShareData.normalizeProfileUrl('https://www.tapfolio.me/connect/nibras.in');
      expect(url, equals('https://www.tapfolio.me/connect/nibras.in'));
    });

    test('handles trailing slashes and whitespace', () {
      final url = ProfileShareData.normalizeProfileUrl('  https://www.tapfolio.me/connect/nibras.in/  ');
      expect(url, equals('https://www.tapfolio.me/connect/nibras.in'));
    });

    test('handles relative connect path', () {
      final url = ProfileShareData.normalizeProfileUrl('/connect/nibras.in');
      expect(url, equals('https://www.tapfolio.me/connect/nibras.in'));
    });

    test('validates valid and invalid URLs', () {
      expect(ProfileShareData.isValidUrl('https://www.tapfolio.me/connect/nibras.in'), isTrue);
      expect(ProfileShareData.isValidUrl('http://www.tapfolio.me/connect/nibras.in'), isTrue);
      expect(ProfileShareData.isValidUrl(''), isFalse);
      expect(ProfileShareData.isValidUrl(null), isFalse);
      expect(ProfileShareData.isValidUrl('javascript:alert(1)'), isFalse);
      expect(ProfileShareData.isValidUrl('null'), isFalse);
    });

    test('generates complete share text', () {
      const data = ProfileShareData(
        name: 'Mohammed Nibrasul Haqq',
        tagline: 'Founder & Full-Stack Developer',
        profileUrl: 'nibras.in',
        baseUrl: 'https://www.tapfolio.me',
        isPremium: true,
      );

      expect(data.canonicalUrl, equals('https://www.tapfolio.me/connect/nibras.in'));
      expect(data.shareText, contains('https://www.tapfolio.me/connect/nibras.in'));
      expect(data.shareText, contains('Scan to connect with me on Tapfolio!'));
    });
  });
}

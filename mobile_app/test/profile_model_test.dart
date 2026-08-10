import 'dart:convert';
import 'package:flutter_test/flutter_test.dart';
import 'package:app/models/profile.dart';
import 'package:app/screens/theme_studio/models/theme_models.dart';
import 'package:app/screens/theme_studio/services/theme_serializer.dart';

void main() {
  group('Profile Model & Theme Parsing Resilience', () {
    test('Correctly parses full profile with Map theme', () {
      final json = {
        'id': 1,
        'userId': 42,
        'name': 'Mohammed Nibrasul Haqq',
        'username': 'nibrasulhaqq',
        'tagline': 'Founder & Tech Lead',
        'avatar': 'https://example.com/avatar.jpg',
        'isOnline': true,
        'bio': 'Passionate about mobile and web ecosystems.',
        'phone': '+919876543210',
        'whatsapp': '+919876543210',
        'location': 'Kochi, Kerala',
        'diamonds': '150',
        'isPremium': true,
        'tapCount': 25,
        'tags': [
          {'id': 1, 'text': 'Founder', 'type': 'role'},
          {'id': 2, 'text': 'Flutter', 'type': 'skill'},
        ],
        'socials': [
          {'id': 1, 'platform': 'Instagram', 'handle': 'nibrasulhaqq', 'url': 'https://instagram.com/nibrasulhaqq'},
          {'id': 2, 'platform': 'LinkedIn', 'handle': 'nibrasulhaqq', 'url': 'https://linkedin.com/in/nibrasulhaqq'},
        ],
        'theme': {
          'colors': {'primary': '#6366F1', 'background': '#0F172A'},
          'background': {'type': 'aurora'},
          'avatar': {'shape': 'circle', 'glow': 'glow'},
        },
      };

      final profile = Profile.fromJson(json);

      expect(profile.id, 1);
      expect(profile.userId, 42);
      expect(profile.name, 'Mohammed Nibrasul Haqq');
      expect(profile.username, 'nibrasulhaqq');
      expect(profile.diamonds, '150');
      expect(profile.isPremium, true);
      expect(profile.tapCount, 25);
      expect(profile.tags.length, 2);
      expect(profile.socials.length, 2);
      expect(profile.theme, isNotNull);

      final themeSettings = ThemeSerializer.deserialize(profile.theme);
      expect(themeSettings.background.type, 'aurora');
      expect(themeSettings.avatar.shape, 'circle');
    });

    test('Safely parses JSON string theme', () {
      final themeJsonString = jsonEncode({
        'colors': {'primary': '#10B981', 'background': '#1E293B'},
        'background': {'type': 'particles'},
        'avatar': {'shape': 'rounded', 'glow': 'none'},
      });

      final json = {
        'id': 2,
        'userId': 99,
        'name': 'Abhinand',
        'username': 'abhinand',
        'diamonds': 500, // integer instead of string
        'tapCount': '12', // string instead of int
        'theme': themeJsonString,
      };

      final profile = Profile.fromJson(json);

      expect(profile.name, 'Abhinand');
      expect(profile.diamonds, '500');
      expect(profile.tapCount, 12);
      expect(profile.theme, isA<Map<String, dynamic>>());

      final themeSettings = ThemeSerializer.deserialize(profile.theme);
      expect(themeSettings.background.type, 'particles');
      expect(themeSettings.avatar.shape, 'rounded');
    });

    test('Tolerates null and missing optional fields without crashing', () {
      final json = <String, dynamic>{
        'name': 'Guest User',
        'username': 'guest',
      };

      final profile = Profile.fromJson(json);

      expect(profile.id, 0);
      expect(profile.userId, 0);
      expect(profile.name, 'Guest User');
      expect(profile.username, 'guest');
      expect(profile.phone, isNull);
      expect(profile.whatsapp, isNull);
      expect(profile.location, isNull);
      expect(profile.tags, isEmpty);
      expect(profile.socials, isEmpty);
      expect(profile.theme, isNull);

      final themeSettings = ThemeSerializer.deserialize(profile.theme);
      expect(themeSettings, isA<ThemeSettings>());
      expect(themeSettings.colors.primary, isNotEmpty);
    });

    test('Safely parses theme with string-encoded numbers and booleans from web/database', () {
      final json = {
        'id': 3,
        'userId': 100,
        'name': 'Mohammed Nibrasul Haqq',
        'username': 'nibrasulhaqq',
        'theme': {
          'colors': {'primary': '#6366F1', 'background': '#0F172A'},
          'background': {
            'type': 'solid',
            'value': '#0F172A',
            'brightness': '0.8',
            'blur': '0',
            'overlayOpacity': '0.3',
          },
          'typography': {
            'headingFont': 'Outfit',
            'bodyFont': 'Inter',
            'weight': '700',
            'letterSpacing': '0',
            'lineHeight': '1.5',
            'headingSize': '28',
            'bodySize': '15',
            'uppercase': 'false',
            'shadow': 'false',
          },
          'cards': {
            'borderRadius': '16px',
            'opacity': '0.9',
            'blur': '10',
            'elevation': '4',
          },
          'avatar': {
            'shape': 'circle',
            'size': '96',
            'gradientBorder': 'true',
          },
          'effects': {
            'glass': 'true',
            'blur': '12',
            'intensity': '0.7',
            'speed': '1.5',
            'opacity': '0.8',
          }
        },
      };

      final profile = Profile.fromJson(json);
      final themeSettings = ThemeSerializer.deserialize(profile.theme);

      expect(themeSettings.background.brightness, 0.8);
      expect(themeSettings.background.blur, 0.0);
      expect(themeSettings.background.overlayOpacity, 0.3);
      expect(themeSettings.typography.letterSpacing, 0.0);
      expect(themeSettings.typography.lineHeight, 1.5);
      expect(themeSettings.typography.headingSize, 28.0);
      expect(themeSettings.typography.bodySize, 15.0);
      expect(themeSettings.typography.uppercase, false);
      expect(themeSettings.cards.opacity, 0.9);
      expect(themeSettings.cards.blur, 10.0);
      expect(themeSettings.cards.elevation, 4.0);
      expect(themeSettings.avatar.size, 96.0);
      expect(themeSettings.avatar.gradientBorder, true);
      expect(themeSettings.effects.glass, true);
      expect(themeSettings.effects.blur, 12.0);
      expect(themeSettings.effects.intensity, 0.7);
    });
  });
}

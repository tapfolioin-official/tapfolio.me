import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:app/core/storage/local_storage.dart';
import 'package:app/models/profile.dart';
import 'package:app/screens/profile_view_screen.dart';

void main() {
  setUp(() async {
    SharedPreferences.setMockInitialValues({});
    await LocalStorage().init();
  });

  group('ProfileViewScreen Widget Tests', () {
    testWidgets('Renders full profile with initialProfile instantly', (tester) async {
      final testProfile = Profile(
        id: 1,
        userId: 42,
        name: 'Mohammed Nibrasul Haqq',
        username: 'nibrasulhaqq',
        tagline: 'Tech Lead',
        avatar: '',
        isOnline: true,
        bio: 'Building next-gen applications.',
        diamonds: '250',
        isPremium: true,
        tapCount: 50,
        tags: [],
        socials: [],
        theme: {
          'colors': {'primary': '#6366F1', 'background': '#0F172A'},
          'avatar': {'shape': 'circle', 'glow': 'glow'},
        },
      );

      await tester.pumpWidget(
        MaterialApp(
          home: ProfileViewScreen(
            userId: 42,
            username: 'nibrasulhaqq',
            initialProfile: testProfile,
          ),
        ),
      );

      // Verify name and tagline render
      expect(find.text('Mohammed Nibrasul Haqq'), findsOneWidget);
      expect(find.text('Tech Lead'), findsOneWidget);
      expect(find.byType(SingleChildScrollView), findsOneWidget);
    });

    testWidgets('Renders rounded avatar without assertion errors', (tester) async {
      final testProfile = Profile(
        id: 2,
        userId: 10,
        name: 'Abhinand',
        username: 'abhinand',
        tagline: 'Creator & Editor',
        avatar: '',
        isOnline: true,
        bio: 'Creating videos & designs.',
        diamonds: '100',
        isPremium: true,
        tapCount: 10,
        tags: [],
        socials: [],
        theme: {
          'colors': {'primary': '#10B981', 'background': '#0F172A'},
          'avatar': {'shape': 'rounded', 'glow': 'none'},
        },
      );

      await tester.pumpWidget(
        MaterialApp(
          home: ProfileViewScreen(
            userId: 10,
            username: 'abhinand',
            initialProfile: testProfile,
          ),
        ),
      );

      expect(find.text('Abhinand'), findsOneWidget);
      expect(find.text('Creator & Editor'), findsOneWidget);
    });
  });
}

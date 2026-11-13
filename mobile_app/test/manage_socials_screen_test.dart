import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:app/screens/manage_socials_screen.dart';
import 'package:app/models/profile.dart';
import 'package:app/models/social_link.dart';

void main() {
  group('ManageSocialsScreen Widget Tests', () {
    final mockProfile = Profile(
      id: 1,
      userId: 1,
      name: 'Nibras',
      username: 'nibras',
      tagline: 'Flutter Developer',
      avatar: '',
      isOnline: true,
      bio: 'Building apps',
      socials: [
        SocialLink(
          platform: 'Instagram',
          handle: '@nibras',
          url: 'https://instagram.com/nibras',
          icon: 'instagram',
          color: '#E1306C',
        ),
        SocialLink(
          platform: 'LinkedIn',
          handle: 'nibras',
          url: 'https://linkedin.com/in/nibras',
          icon: 'linkedin',
          color: '#0A66C2',
        ),
        SocialLink(
          platform: 'Facebook',
          handle: 'nibras',
          url: 'https://facebook.com/nibras',
          icon: 'facebook',
          color: '#1877F2',
        ),
        SocialLink(
          platform: 'GitHub',
          handle: 'nibras',
          url: 'https://github.com/nibras',
          icon: 'github',
          color: '#24292E',
        ),
        SocialLink(
          platform: 'Google Pay',
          handle: 'nibraz@okaxis',
          url: 'upi://pay?pa=nibraz@okaxis',
          icon: 'googlepay',
          color: '#1A73E8',
        ),
        SocialLink(
          platform: 'X (Twitter)',
          handle: '@nibras_dev',
          url: 'https://x.com/nibras_dev',
          icon: 'twitter',
          color: '#000000',
        ),
      ],
      tags: [],
      theme: {},
      isPremium: true,
      diamonds: '100',
      tapCount: 50,
    );

    testWidgets('renders all cards, header, and connected links accurately', (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: ManageSocialsScreen(initialProfile: mockProfile),
        ),
      );

      // Header
      expect(find.text('Manage Social Links'), findsOneWidget);
      expect(find.text('Add and manage your social profiles in one place.'), findsOneWidget);

      // Add Card
      expect(find.text('Add New Social Link'), findsOneWidget);
      expect(find.text('GitHub'), findsWidgets);

      // Connected Links Card
      expect(find.text('Your Connected Links'), findsOneWidget);
      expect(find.text('6 Links'), findsOneWidget);

      // Platform list items
      expect(find.text('Instagram'), findsOneWidget);
      expect(find.text('LinkedIn'), findsOneWidget);
      expect(find.text('Facebook'), findsOneWidget);
      expect(find.text('Google Pay'), findsOneWidget);
      expect(find.text('X (Twitter)'), findsOneWidget);

      // Active status pills
      expect(find.text('Active'), findsNWidgets(6));

      // Tip Card
      expect(find.text('Tip'), findsOneWidget);
    });

    testWidgets('auto-generates URL when handle is typed', (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: ManageSocialsScreen(initialProfile: mockProfile),
        ),
      );

      // Enter handle in first textfield
      final textFields = find.byType(TextField);
      await tester.enterText(textFields.first, 'nibrasulhaqq');
      await tester.pumpAndSettle();

      // Check that second textfield (URL) updated with prefix
      expect(find.text('https://github.com/nibrasulhaqq'), findsOneWidget);
    });

    testWidgets('opens Platform Picker modal when platform button is tapped', (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: ManageSocialsScreen(initialProfile: mockProfile),
        ),
      );

      await tester.tap(find.text('GitHub').first);
      await tester.pumpAndSettle();

      expect(find.text('Choose Platform'), findsOneWidget);
      expect(find.text('Instagram'), findsWidgets);
    });

    testWidgets('opens Help modal when tapping Help button', (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: ManageSocialsScreen(initialProfile: mockProfile),
        ),
      );

      await tester.tap(find.byIcon(Icons.help_outline_rounded));
      await tester.pumpAndSettle();

      expect(find.text('Social Links Help'), findsOneWidget);
      expect(find.text('Instant Auto-Link'), findsOneWidget);
    });
  });
}

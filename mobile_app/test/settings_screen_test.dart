import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:app/screens/edit_profile_screen.dart';

void main() {
  group('Settings Screen Widget Tests', () {
    testWidgets('renders top bar, search bar, and all 3 settings sections', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: EditProfileScreen(),
        ),
      );

      // Verify top header
      expect(find.text('Settings'), findsOneWidget);
      expect(find.text('✨ Pro'), findsOneWidget);

      // Verify search bar
      expect(find.byType(TextField), findsOneWidget);

      // Verify section headers
      expect(find.text('Account'), findsOneWidget);
      expect(find.text('App Settings'), findsOneWidget);
      expect(find.text('Support & Others'), findsOneWidget);

      // Verify Account section items
      expect(find.text('User Profile'), findsOneWidget);
      expect(find.text('My Cards'), findsOneWidget);
      expect(find.text('My Products'), findsOneWidget);
      expect(find.text('Team & Members'), findsOneWidget);
      expect(find.text('Analytics'), findsOneWidget);

      // Verify App Settings items
      expect(find.text('Theme Studio'), findsOneWidget);
      expect(find.text('Notifications'), findsOneWidget);
      expect(find.text('Privacy & Security'), findsOneWidget);
      expect(find.text('Language'), findsOneWidget);
      expect(find.text('Storage'), findsOneWidget);

      // Verify Support & Others items
      expect(find.text('Help Center'), findsOneWidget);
      expect(find.text('Contact Support'), findsOneWidget);
      expect(find.text('Share Tapfolio'), findsOneWidget);
      expect(find.text('About Tapfolio'), findsOneWidget);

      // Verify Log Out button
      expect(find.text('Log Out'), findsOneWidget);
    });

    testWidgets('filters settings items in real-time when searching', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: EditProfileScreen(),
        ),
      );

      // Search for 'Theme'
      await tester.enterText(find.byType(TextField), 'Theme');
      await tester.pumpAndSettle();

      expect(find.text('Theme Studio'), findsOneWidget);
      expect(find.text('User Profile'), findsNothing);

      // Clear search
      await tester.tap(find.byIcon(Icons.close_rounded));
      await tester.pumpAndSettle();

      expect(find.text('User Profile'), findsOneWidget);
      expect(find.text('Theme Studio'), findsOneWidget);
    });

    testWidgets('opens Pro perks modal when tapping Pro badge', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: EditProfileScreen(),
        ),
      );

      await tester.tap(find.text('✨ Pro'));
      await tester.pumpAndSettle();

      expect(find.text('Tapfolio Pro Benefits'), findsOneWidget);
    });

    testWidgets('shows confirmation dialog when tapping Log Out', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: EditProfileScreen(),
        ),
      );

      await tester.ensureVisible(find.text('Log Out'));
      await tester.pumpAndSettle();

      await tester.tap(find.text('Log Out'));
      await tester.pumpAndSettle();

      expect(find.text('Are you sure you want to log out of your Tapfolio account?'), findsOneWidget);
    });
  });
}

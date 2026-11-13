import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:app/screens/leaderboard_screen.dart';

void main() {
  group('LeaderboardScreen Widget Tests', () {
    testWidgets('renders leaderboard header and search bar correctly', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: LeaderboardScreen(),
        ),
      );

      // Verify header elements
      expect(find.text('Tapfolio Leaderboard'), findsOneWidget);
      expect(
        find.text('Discover elite creators and professionals. All premium accounts are ranked by diamonds.'),
        findsOneWidget,
      );

      // Verify search and filter elements
      expect(find.byType(TextField), findsOneWidget);
      expect(find.text('Filters'), findsOneWidget);
      expect(find.text('All'), findsOneWidget);
      expect(find.text('Creators'), findsOneWidget);
      expect(find.text('Professionals'), findsOneWidget);
      expect(find.text('Brands'), findsOneWidget);
    });

    testWidgets('opens info bottom sheet when info button is tapped', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: LeaderboardScreen(),
        ),
      );

      await tester.tap(find.byIcon(Icons.info_outline_rounded));
      await tester.pumpAndSettle();

      expect(find.text('About Leaderboard'), findsOneWidget);
      expect(find.text('Diamond Points'), findsOneWidget);
      expect(find.text('Card Taps'), findsOneWidget);
      expect(find.text('Premium Status'), findsOneWidget);
    });

    testWidgets('opens filters bottom sheet when filters button is tapped', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: LeaderboardScreen(),
        ),
      );

      await tester.tap(find.text('Filters'));
      await tester.pumpAndSettle();

      expect(find.text('Filter Leaderboard'), findsOneWidget);
      expect(find.text('Apply Filters'), findsOneWidget);
      expect(find.text('Reset'), findsOneWidget);
    });

    testWidgets('allows typing in search bar and clearing search', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: LeaderboardScreen(),
        ),
      );

      await tester.enterText(find.byType(TextField), 'Nibras');
      await tester.pumpAndSettle();

      expect(find.byIcon(Icons.close_rounded), findsOneWidget);

      await tester.tap(find.byIcon(Icons.close_rounded));
      await tester.pumpAndSettle();

      expect(find.text('Nibras'), findsNothing);
    });
  });
}

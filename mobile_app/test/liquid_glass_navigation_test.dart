import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:app/core/widgets/liquid_glass_navigation.dart';

void main() {
  group('LiquidGlassNavigation Widget Tests', () {
    testWidgets('renders all 5 navigation destinations correctly', (tester) async {
      int selectedIndex = 0;

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: const Center(child: Text('Content')),
            bottomNavigationBar: LiquidGlassNavigation(
              currentIndex: selectedIndex,
              onItemSelected: (index) => selectedIndex = index,
            ),
          ),
        ),
      );

      // Verify labels exist
      expect(find.text('Home'), findsOneWidget);
      expect(find.text('Connections'), findsOneWidget);
      expect(find.text('Leaderboard'), findsOneWidget);
      expect(find.text('Profile'), findsOneWidget);

      // Verify icons
      expect(find.byIcon(Icons.home_rounded), findsOneWidget); // active
      expect(find.byIcon(Icons.people_outline_rounded), findsOneWidget);
      expect(find.byIcon(Icons.add_rounded), findsOneWidget); // center create
      expect(find.byIcon(Icons.emoji_events_outlined), findsOneWidget);
      expect(find.byIcon(Icons.person_outline_rounded), findsOneWidget);
    });

    testWidgets('triggers onItemSelected when navigation item tapped', (tester) async {
      int tappedIndex = -1;

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            bottomNavigationBar: LiquidGlassNavigation(
              currentIndex: 0,
              onItemSelected: (index) => tappedIndex = index,
            ),
          ),
        ),
      );

      // Tap Connections (index 1)
      await tester.tap(find.text('Connections'));
      await tester.pumpAndSettle();
      expect(tappedIndex, equals(1));

      // Tap Leaderboard (index 3)
      await tester.tap(find.text('Leaderboard'));
      await tester.pumpAndSettle();
      expect(tappedIndex, equals(3));

      // Tap Profile (index 4)
      await tester.tap(find.text('Profile'));
      await tester.pumpAndSettle();
      expect(tappedIndex, equals(4));

      // Tap Home (index 0)
      await tester.tap(find.text('Home'));
      await tester.pumpAndSettle();
      expect(tappedIndex, equals(0));
    });

    testWidgets('center create (+) button triggers callback', (tester) async {
      int tappedIndex = -1;
      bool customAddPressed = false;

      // Default callback
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            bottomNavigationBar: LiquidGlassNavigation(
              currentIndex: 0,
              onItemSelected: (index) => tappedIndex = index,
            ),
          ),
        ),
      );

      await tester.tap(find.byIcon(Icons.add_rounded));
      await tester.pumpAndSettle();
      expect(tappedIndex, equals(2));

      // Custom callback
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            bottomNavigationBar: LiquidGlassNavigation(
              currentIndex: 0,
              onItemSelected: (index) => tappedIndex = index,
              onAddPressed: () => customAddPressed = true,
            ),
          ),
        ),
      );

      await tester.tap(find.byIcon(Icons.add_rounded));
      await tester.pumpAndSettle();
      expect(customAddPressed, isTrue);
    });

    testWidgets('renders badge on Connections when pendingCount > 0', (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            bottomNavigationBar: LiquidGlassNavigation(
              currentIndex: 0,
              pendingCount: 5,
              onItemSelected: (_) {},
            ),
          ),
        ),
      );

      expect(find.text('5'), findsOneWidget);

      // Verify > 99 formats as 99+
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            bottomNavigationBar: LiquidGlassNavigation(
              currentIndex: 0,
              pendingCount: 150,
              onItemSelected: (_) {},
            ),
          ),
        ),
      );

      expect(find.text('99+'), findsOneWidget);

      // Verify no badge when 0
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            bottomNavigationBar: LiquidGlassNavigation(
              currentIndex: 0,
              pendingCount: 0,
              onItemSelected: (_) {},
            ),
          ),
        ),
      );

      expect(find.text('0'), findsNothing);
      expect(find.text('99+'), findsNothing);
    });

    testWidgets('supports both Light and Dark themes smoothly', (tester) async {
      // Light Mode
      await tester.pumpWidget(
        MaterialApp(
          theme: ThemeData.light(),
          home: Scaffold(
            bottomNavigationBar: LiquidGlassNavigation(
              currentIndex: 3, // Leaderboard active
              onItemSelected: (_) {},
            ),
          ),
        ),
      );
      await tester.pumpAndSettle();
      expect(find.byIcon(Icons.emoji_events_rounded), findsOneWidget);

      // Dark Mode
      await tester.pumpWidget(
        MaterialApp(
          theme: ThemeData.dark(),
          home: Scaffold(
            bottomNavigationBar: LiquidGlassNavigation(
              currentIndex: 3,
              onItemSelected: (_) {},
            ),
          ),
        ),
      );
      await tester.pumpAndSettle();
      expect(find.byIcon(Icons.emoji_events_rounded), findsOneWidget);
    });

    testWidgets('has semantic labels for all destinations', (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            bottomNavigationBar: LiquidGlassNavigation(
              currentIndex: 0,
              onItemSelected: (_) {},
            ),
          ),
        ),
      );

      expect(
        find.byWidgetPredicate((w) => w is Semantics && w.properties.label == 'Home'),
        findsOneWidget,
      );
      expect(
        find.byWidgetPredicate((w) => w is Semantics && w.properties.label == 'Connections'),
        findsOneWidget,
      );
      expect(
        find.byWidgetPredicate((w) => w is Semantics && w.properties.label == 'Create'),
        findsOneWidget,
      );
      expect(
        find.byWidgetPredicate((w) => w is Semantics && w.properties.label == 'Leaderboard'),
        findsOneWidget,
      );
      expect(
        find.byWidgetPredicate((w) => w is Semantics && w.properties.label == 'Profile'),
        findsOneWidget,
      );
    });
  });
}

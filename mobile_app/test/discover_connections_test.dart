import 'dart:async';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:app/screens/dashboard/widgets/discover_connections_row.dart';

// ── Mock HTTP classes for NetworkImage ──────────────────────────────────
class _TestHttpOverrides extends HttpOverrides {
  @override
  HttpClient createHttpClient(SecurityContext? context) {
    return _MockHttpClient();
  }
}

class _MockHttpClient implements HttpClient {
  @override
  dynamic noSuchMethod(Invocation invocation) => _MockHttpClientRequest();
}

class _MockHttpClientRequest implements HttpClientRequest {
  @override
  dynamic noSuchMethod(Invocation invocation) => _MockHttpClientResponse();
}

class _MockHttpClientResponse implements HttpClientResponse {
  static final List<int> _kTransparentImage = <int>[
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00,
    0x0D, 0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00,
    0x00, 0x01, 0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4, 0x89,
    0x00, 0x00, 0x00, 0x0A, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9C, 0x63,
    0x00, 0x01, 0x00, 0x00, 0x05, 0x00, 0x01, 0x0D, 0x0A, 0x2D, 0xB4,
    0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60,
    0x82,
  ];

  @override
  int get statusCode => 200;

  @override
  int get contentLength => _kTransparentImage.length;

  @override
  HttpClientResponseCompressionState get compressionState =>
      HttpClientResponseCompressionState.notCompressed;

  @override
  StreamSubscription<List<int>> listen(
    void Function(List<int> event)? onData, {
    Function? onError,
    void Function()? onDone,
    bool? cancelOnError,
  }) {
    return Stream<List<int>>.fromIterable([_kTransparentImage]).listen(
      onData,
      onError: onError,
      onDone: onDone,
      cancelOnError: cancelOnError,
    );
  }

  @override
  dynamic noSuchMethod(Invocation invocation) => null;
}

/// Helper that sets up HTTP overrides for the duration of [body].
Future<T> mockNetworkImagesFor<T>(Future<T> Function() body) async {
  final previousOverrides = HttpOverrides.current;
  HttpOverrides.global = _TestHttpOverrides();
  try {
    return await body();
  } finally {
    HttpOverrides.global = previousOverrides;
  }
}

// ── Tests ──────────────────────────────────────────────────────────────
void main() {
  setUpAll(() {
    HttpOverrides.global = _TestHttpOverrides();
  });

  group('Discover Connections Widget Tests', () {
    const user1 = DiscoverUserItem(
      userId: 101,
      username: 'antony_alex',
      name: 'Antony Alex',
      avatar: 'https://dummy.com/avatar1.png',
      tagline: "Let's connect!",
    );

    const user2 = DiscoverUserItem(
      userId: 102,
      username: 'nibras_test',
      name: 'Nibras-Test',
      avatar: 'https://dummy.com/avatar2.png',
      tagline: "Let's connect!",
    );

    const user3 = DiscoverUserItem(
      userId: 103,
      username: 'abhinand',
      name: 'Abhinand',
      avatar: 'https://dummy.com/avatar3.png',
      tagline: "Let's connect!",
    );

    testWidgets(
        'renders blue + badge for unconnected user and green ✓ for connected user',
        (tester) async {
      await mockNetworkImagesFor(() async {
        await tester.pumpWidget(
          MaterialApp(
            home: Scaffold(
              body: DiscoverConnectionsRow(
                discoverUsers: const [user1, user2, user3],
                connectedUserIds: const {102},
                baseUrl: 'https://www.tapfolio.me',
                onViewAllTap: () {},
                onUserTap: (_) {},
                onConnectTap: (_) {},
              ),
            ),
          ),
        );
      });

      expect(find.text('Discover Connections'), findsOneWidget);
      expect(find.text('View all'), findsOneWidget);
      expect(find.text('Antony Alex'), findsOneWidget);
      expect(find.text('Nibras-Test'), findsOneWidget);
      expect(find.text('Abhinand'), findsOneWidget);
      expect(find.byIcon(Icons.check_rounded), findsOneWidget);
      expect(find.byIcon(Icons.add_rounded), findsNWidgets(2));
    });

    testWidgets('tapping blue + triggers onConnectTap callback',
        (tester) async {
      DiscoverUserItem? connectedUser;
      await mockNetworkImagesFor(() async {
        await tester.pumpWidget(
          MaterialApp(
            home: Scaffold(
              body: DiscoverConnectionsRow(
                discoverUsers: const [user1],
                connectedUserIds: const {},
                baseUrl: 'https://www.tapfolio.me',
                onViewAllTap: () {},
                onUserTap: (_) {},
                onConnectTap: (user) {
                  connectedUser = user;
                },
              ),
            ),
          ),
        );
      });

      await tester.tap(find.byIcon(Icons.add_rounded));
      await tester.pumpAndSettle();

      expect(connectedUser, isNotNull);
      expect(connectedUser!.name, 'Antony Alex');
    });

    testWidgets('shows loading skeletons when isLoading is true',
        (tester) async {
      await mockNetworkImagesFor(() async {
        await tester.pumpWidget(
          MaterialApp(
            home: Scaffold(
              body: DiscoverConnectionsRow(
                discoverUsers: const [],
                connectedUserIds: const {},
                baseUrl: 'https://www.tapfolio.me',
                isLoading: true,
                onViewAllTap: () {},
                onUserTap: (_) {},
                onConnectTap: (_) {},
              ),
            ),
          ),
        );
      });

      expect(find.text('Discover Connections'), findsOneWidget);
      expect(find.text('Antony Alex'), findsNothing);
    });

    testWidgets('shows empty state message when no users are discoverable',
        (tester) async {
      await mockNetworkImagesFor(() async {
        await tester.pumpWidget(
          MaterialApp(
            home: Scaffold(
              body: DiscoverConnectionsRow(
                discoverUsers: const [],
                connectedUserIds: const {},
                baseUrl: 'https://www.tapfolio.me',
                isLoading: false,
                onViewAllTap: () {},
                onUserTap: (_) {},
                onConnectTap: (_) {},
              ),
            ),
          ),
        );
      });

      expect(find.text('No new connections yet'), findsOneWidget);
    });
  });
}

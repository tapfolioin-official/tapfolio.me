import 'dart:async';
import 'package:flutter/material.dart';
import 'package:app_links/app_links.dart';
import 'package:home_widget/home_widget.dart';
import '../core/widget/widget_deep_link_handler.dart';

/// Singleton service that listens for incoming deep links and routes them.
///
/// Handles:
///   tapfolio://profile                    — Widget / Quick action profile
///   tapfolio://connections                — Widget / Quick action connections
///   tapfolio://analytics                  — Widget / Quick action analytics
///   tapfolio://home                       — Widget home
///   tapfolio://qr                         — Quick action QR share
///   https://tapfolio.me/USERNAME          — NFC card direct slug
///   https://tapfolio.me/connect/USERNAME  — legacy connect path
///   tapfolio://USERNAME                   — custom scheme
class DeepLinkService {
  static final DeepLinkService _instance = DeepLinkService._internal();
  factory DeepLinkService() => _instance;
  DeepLinkService._internal();

  final AppLinks _appLinks = AppLinks();
  StreamSubscription<Uri>? _subscription;
  StreamSubscription<Uri?>? _widgetSubscription;
  GlobalKey<NavigatorState>? _navigatorKey;

  /// Username that arrived during cold start, before the navigator was ready.
  String? _pendingUsername;

  /// Prevent navigating to the same profile twice in a row.
  String? _lastNavigatedUsername;

  // ── Paths that are NOT usernames ────────────────────────────────────────
  static const _reservedPaths = {
    '',
    'login',
    'register',
    'dashboard',
    'connect',
    'leaderboard',
    'connections',
    'history',
    'profile',
    'analytics',
    'home',
    'qr',
    'api',
    'auth',
  };

  /// Call once from main.dart after the navigator is ready.
  void init(GlobalKey<NavigatorState> navigatorKey) {
    _navigatorKey = navigatorKey;
    WidgetDeepLinkHandler().init(navigatorKey);

    // Cold-start: if there was already a pending username, navigate now.
    if (_pendingUsername != null) {
      final username = _pendingUsername!;
      _pendingUsername = null;
      WidgetsBinding.instance.addPostFrameCallback(
        (_) => _navigateToProfile(username),
      );
    }

    // Check if launched from iOS Home Screen Widget
    HomeWidget.initiallyLaunchedFromHomeWidget().then((Uri? uri) {
      if (uri != null) {
        debugPrint('[DeepLink] App launched from Home Screen Widget: $uri');
        _handleUri(uri);
      }
    }).catchError((e) {
      debugPrint('[DeepLink] initiallyLaunchedFromHomeWidget error: $e');
    });

    // Listen for widget clicks while app is in background/foreground
    _widgetSubscription = HomeWidget.widgetClicked.listen((Uri? uri) {
      if (uri != null) {
        debugPrint('[DeepLink] Widget clicked stream event: $uri');
        _handleUri(uri);
      }
    });

    // Hot links while the app is running
    _subscription = _appLinks.uriLinkStream.listen(_handleUri);
  }

  /// Must be called before [init] so cold-start links are captured.
  Future<void> captureInitialLink() async {
    try {
      final uri = await _appLinks.getInitialLink();
      if (uri != null) {
        _handleUri(uri, isPrecapture: true);
      }
    } catch (e) {
      debugPrint('[DeepLink] captureInitialLink error: $e');
    }
  }

  void _handleUri(Uri uri, {bool isPrecapture = false}) {
    debugPrint('[DeepLink] Received URI: $uri');

    // 1. Process Widget & Quick Action routes through unified handler
    if (WidgetDeepLinkHandler().handleUri(uri)) {
      return;
    }

    // 2. Process Public Profile / NFC card URLs
    final username = _extractUsername(uri);
    if (username == null) return;

    if (isPrecapture || _navigatorKey?.currentContext == null) {
      // App hasn't fully initialised yet — save for later
      _pendingUsername = username;
    } else {
      _navigateToProfile(username);
    }
  }

  /// Parse a username out of any recognised link format.
  /// Returns null when the URI is not a profile link.
  String? _extractUsername(Uri uri) {
    final segments = uri.pathSegments;

    // tapfolio://connect/USERNAME  or  https://tapfolio.me/connect/USERNAME
    if (segments.length >= 2 && segments[0] == 'connect') {
      final u = segments[1].toLowerCase().trim();
      return u.isNotEmpty ? u : null;
    }

    // https://tapfolio.me/USERNAME  (direct NFC slug)
    if (segments.length == 1) {
      final u = segments[0].toLowerCase().trim();
      if (u.isNotEmpty && !_reservedPaths.contains(u)) {
        return u;
      }
    }

    // tapfolio://USERNAME  (custom scheme with host as username)
    if (uri.scheme == 'tapfolio' && segments.isEmpty) {
      final u = uri.host.toLowerCase().trim();
      if (u.isNotEmpty && !_reservedPaths.contains(u)) {
        return u;
      }
    }

    return null;
  }

  void _navigateToProfile(String username) {
    // Duplicate guard — don't push the same profile twice
    if (username == _lastNavigatedUsername) return;
    _lastNavigatedUsername = username;

    final context = _navigatorKey?.currentContext;
    if (context == null) {
      _pendingUsername = username;
      return;
    }

    Navigator.of(context, rootNavigator: true).pushNamed(
      '/public-profile',
      arguments: username,
    );
  }

  void dispose() {
    _subscription?.cancel();
    _widgetSubscription?.cancel();
  }
}

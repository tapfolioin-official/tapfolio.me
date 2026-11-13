import 'package:flutter/material.dart';
import '../../services/api_service.dart';

/// Abstract interface that the main navigation shell implements
/// to allow the deep link handler to switch tabs and open modals.
abstract class NavigationShellController {
  void switchToTab(int index);
  void triggerShareDialog();
  void refreshAllData();
}

/// Unified deep-link handler that processes routes triggered by:
/// 1. Widget taps (systemSmall, systemMedium, systemLarge)
/// 2. App Icon Quick Actions (3D Touch / Haptic Touch long-press)
/// 3. Standard deep links (tapfolio://...)
class WidgetDeepLinkHandler {
  static final WidgetDeepLinkHandler _instance =
      WidgetDeepLinkHandler._internal();
  factory WidgetDeepLinkHandler() => _instance;
  WidgetDeepLinkHandler._internal();

  NavigationShellController? _shellController;
  GlobalKey<NavigatorState>? _navigatorKey;

  /// Cached URI received before the navigation shell was fully mounted (e.g. cold start).
  Uri? _pendingUri;

  void init(GlobalKey<NavigatorState> navigatorKey) {
    _navigatorKey = navigatorKey;
  }

  void registerShellController(NavigationShellController controller) {
    _shellController = controller;
    debugPrint('[WidgetDeepLinkHandler] NavigationShellController registered.');

    // If there was a pending deep link from cold start, execute it now
    if (_pendingUri != null) {
      final uri = _pendingUri!;
      _pendingUri = null;
      WidgetsBinding.instance.addPostFrameCallback((_) {
        handleUri(uri);
      });
    }
  }

  void unregisterShellController() {
    _shellController = null;
  }

  /// Processes incoming URI. Returns true if handled by widget/quick-action rules.
  bool handleUri(Uri uri) {
    debugPrint('[WidgetDeepLinkHandler] Processing URI: $uri');

    // Extract path/host
    final scheme = uri.scheme.toLowerCase();
    if (scheme != 'tapfolio') {
      return false;
    }

    final host = uri.host.toLowerCase().trim();
    final path = uri.path.replaceAll(RegExp(r'^/+'), '').toLowerCase().trim();
    final route = host.isNotEmpty ? host : path;

    // Verify if user is authenticated
    final isAuthenticated = ApiService().isAuthenticated;

    // Check if shell controller is ready
    if (_shellController == null) {
      debugPrint('[WidgetDeepLinkHandler] Shell not ready — saving pending URI: $uri');
      _pendingUri = uri;
      return true;
    }

    if (!isAuthenticated && route != 'login' && route != 'home') {
      debugPrint('[WidgetDeepLinkHandler] User not authenticated for $route — saving pending URI');
      _pendingUri = uri;
      // Navigate to login if needed
      final context = _navigatorKey?.currentContext;
      if (context != null) {
        Navigator.of(context).pushNamed('/login');
      }
      return true;
    }

    switch (route) {
      case 'profile':
        // Tab 4: Profile
        _shellController?.switchToTab(4);
        return true;

      case 'connections':
        // Tab 1: Connections
        _shellController?.switchToTab(1);
        return true;

      case 'analytics':
      case 'dashboard':
      case 'home':
        // Tab 0: Home / Analytics Dashboard
        _shellController?.switchToTab(0);
        return true;

      case 'qr':
        // Tab 0 and open share dialog
        _shellController?.switchToTab(0);
        _shellController?.triggerShareDialog();
        return true;

      case 'login':
        if (!isAuthenticated) {
          final context = _navigatorKey?.currentContext;
          if (context != null) {
            Navigator.of(context).pushNamed('/login');
          }
        }
        return true;

      default:
        return false;
    }
  }

  /// Called after successful login to resume any pending navigation.
  void resumePendingRoute() {
    if (_pendingUri != null) {
      final uri = _pendingUri!;
      _pendingUri = null;
      WidgetsBinding.instance.addPostFrameCallback((_) {
        handleUri(uri);
      });
    }
  }
}

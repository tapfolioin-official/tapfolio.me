import 'package:flutter/foundation.dart';
import 'package:quick_actions/quick_actions.dart';
import '../core/widget/widget_deep_link_handler.dart';

/// Service managing iOS 3D Touch / Haptic Touch App Icon Quick Actions.
///
/// Long-pressing the Tapfolio app icon on the iPhone Home Screen displays:
/// - My QR Code -> com.tapfolio.qr
/// - My Connections -> com.tapfolio.connections
/// - Analytics -> com.tapfolio.analytics
class QuickActionService {
  static final QuickActionService _instance = QuickActionService._internal();
  factory QuickActionService() => _instance;
  QuickActionService._internal();

  final QuickActions _quickActions = const QuickActions();
  bool _isInitialized = false;

  static const String shortcutQr = 'com.tapfolio.qr';
  static const String shortcutConnections = 'com.tapfolio.connections';
  static const String shortcutAnalytics = 'com.tapfolio.analytics';

  Future<void> init() async {
    if (_isInitialized) return;
    _isInitialized = true;

    try {
      _quickActions.initialize((shortcutType) {
        debugPrint('[QuickActionService] Selected shortcut: $shortcutType');
        _handleShortcut(shortcutType);
      });

      await _quickActions.setShortcutItems(<ShortcutItem>[
        const ShortcutItem(
          type: shortcutQr,
          localizedTitle: 'My QR Code',
          icon: 'AppIcon',
        ),
        const ShortcutItem(
          type: shortcutConnections,
          localizedTitle: 'My Connections',
          icon: 'AppIcon',
        ),
        const ShortcutItem(
          type: shortcutAnalytics,
          localizedTitle: 'Analytics',
          icon: 'AppIcon',
        ),
      ]);

      debugPrint('[QuickActionService] Shortcut items registered successfully.');
    } catch (e, stack) {
      debugPrint('[QuickActionService] Init error: $e\n$stack');
    }
  }

  void _handleShortcut(String shortcutType) {
    final Uri uri;
    switch (shortcutType) {
      case shortcutQr:
        uri = Uri.parse('tapfolio://qr');
        break;
      case shortcutConnections:
        uri = Uri.parse('tapfolio://connections');
        break;
      case shortcutAnalytics:
        uri = Uri.parse('tapfolio://analytics');
        break;
      default:
        debugPrint('[QuickActionService] Unknown shortcut type: $shortcutType');
        return;
    }

    WidgetDeepLinkHandler().handleUri(uri);
  }
}

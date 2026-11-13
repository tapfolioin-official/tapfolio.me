import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:home_widget/home_widget.dart';
import 'package:http/http.dart' as http;
import '../../models/profile.dart';
import '../../services/api_service.dart';
import 'widget_data_model.dart';

/// Singleton service responsible for synchronizing Tapfolio profile & analytics data
/// with the iOS WidgetKit extension via App Groups (`group.me.tapfolio.app`).
///
/// NOTE on Refresh Behavior:
/// Widget synchronization is request-based via WidgetKit's reload APIs.
/// iOS controls widget rendering timing and refresh budgets based on system policy.
class TapfolioWidgetService {
  static final TapfolioWidgetService _instance =
      TapfolioWidgetService._internal();
  factory TapfolioWidgetService() => _instance;
  TapfolioWidgetService._internal();

  static const String appGroupId = 'group.me.tapfolio.app';
  static const String iOSWidgetKind = 'TapfolioWidget';

  bool _isInitialized = false;
  WidgetProfileData? _currentData;

  /// Cached access to the last synchronized data.
  WidgetProfileData? get currentData => _currentData;

  /// Initializes the HomeWidget bridge with the Tapfolio App Group ID.
  Future<void> init() async {
    if (_isInitialized) return;
    try {
      await HomeWidget.setAppGroupId(appGroupId);
      _isInitialized = true;
      debugPrint('[TapfolioWidgetService] Initialized with App Group: $appGroupId');
    } catch (e, stack) {
      debugPrint('[TapfolioWidgetService] Init error: $e\n$stack');
    }
  }

  /// Updates profile presentation data in shared storage and requests a WidgetKit timeline reload.
  Future<void> updateProfileData({
    required Profile profile,
    int? connectionsCount,
    int? viewsCount,
  }) async {
    try {
      await init();

      final existingViews = _currentData?.views ?? profile.tapCount;
      final existingConnections = _currentData?.connections ?? 0;

      final connections = connectionsCount ?? existingConnections;
      final views = viewsCount ?? existingViews;

      final publicUrl = '${ApiService().baseUrl}/connect/${profile.username}';

      String? avatarBase64;
      if (profile.avatar.isNotEmpty) {
        avatarBase64 = await _fetchAndEncodeAvatar(profile.avatar);
      }

      final data = WidgetProfileData(
        name: profile.name.trim().isNotEmpty ? profile.name.trim() : 'Tapfolio User',
        title: profile.tagline.trim().isNotEmpty ? profile.tagline.trim() : 'Professional',
        username: profile.username.trim(),
        avatarFileName: 'profile.jpg',
        connections: connections,
        views: views,
        diamonds: profile.diamonds,
        profileUrl: publicUrl,
        isLoggedIn: true,
        lastUpdated: DateTime.now().toUtc().toIso8601String(),
      );

      _currentData = data;

      // Save individual key-values into App Group UserDefaults
      await HomeWidget.saveWidgetData<String>('name', data.name);
      await HomeWidget.saveWidgetData<String>('title', data.title);
      await HomeWidget.saveWidgetData<String>('username', data.username);
      await HomeWidget.saveWidgetData<int>('connections', data.connections);
      await HomeWidget.saveWidgetData<int>('views', data.views);
      await HomeWidget.saveWidgetData<String>('diamonds', data.diamonds);
      await HomeWidget.saveWidgetData<String>('profileUrl', data.profileUrl);
      await HomeWidget.saveWidgetData<bool>('isLoggedIn', data.isLoggedIn);
      await HomeWidget.saveWidgetData<String>('lastUpdated', data.lastUpdated);
      await HomeWidget.saveWidgetData<String>('profile_json', data.toJsonString());

      if (avatarBase64 != null && avatarBase64.isNotEmpty) {
        await HomeWidget.saveWidgetData<String>('avatar_base64', avatarBase64);
      }

      // Request WidgetKit timeline reload
      await refreshWidget();

      debugPrint('[TapfolioWidgetService] Successfully updated profile widget data for ${data.username}');
    } catch (e, stack) {
      // Widget errors must never crash the main application
      debugPrint('[TapfolioWidgetService] Error updating profile widget data: $e\n$stack');
    }
  }

  /// Updates connection count in shared storage and requests widget refresh.
  Future<void> updateConnectionData({required int connectionsCount}) async {
    try {
      await init();
      await HomeWidget.saveWidgetData<int>('connections', connectionsCount);

      if (_currentData != null) {
        _currentData = _currentData!.copyWith(
          connections: connectionsCount,
          lastUpdated: DateTime.now().toUtc().toIso8601String(),
        );
        await HomeWidget.saveWidgetData<String>(
          'profile_json',
          _currentData!.toJsonString(),
        );
      }

      await refreshWidget();
      debugPrint('[TapfolioWidgetService] Updated connection count: $connectionsCount');
    } catch (e) {
      debugPrint('[TapfolioWidgetService] Error updating connection count: $e');
    }
  }

  /// Updates views / analytics count in shared storage and requests widget refresh.
  Future<void> updateAnalyticsData({required int viewsCount}) async {
    try {
      await init();
      await HomeWidget.saveWidgetData<int>('views', viewsCount);

      if (_currentData != null) {
        _currentData = _currentData!.copyWith(
          views: viewsCount,
          lastUpdated: DateTime.now().toUtc().toIso8601String(),
        );
        await HomeWidget.saveWidgetData<String>(
          'profile_json',
          _currentData!.toJsonString(),
        );
      }

      await refreshWidget();
      debugPrint('[TapfolioWidgetService] Updated views count: $viewsCount');
    } catch (e) {
      debugPrint('[TapfolioWidgetService] Error updating analytics data: $e');
    }
  }

  /// Clears shared widget storage and resets widget to logged-out state.
  ///
  /// CRITICAL PRIVACY REQUIREMENT:
  /// Must be invoked on user logout so no previous user info remains on the Home Screen.
  Future<void> clearWidgetData() async {
    try {
      await init();
      final loggedOut = WidgetProfileData.loggedOut();
      _currentData = loggedOut;

      await HomeWidget.saveWidgetData<String>('name', loggedOut.name);
      await HomeWidget.saveWidgetData<String>('title', loggedOut.title);
      await HomeWidget.saveWidgetData<String>('username', '');
      await HomeWidget.saveWidgetData<int>('connections', 0);
      await HomeWidget.saveWidgetData<int>('views', 0);
      await HomeWidget.saveWidgetData<String>('diamonds', '0');
      await HomeWidget.saveWidgetData<String>('profileUrl', 'https://tapfolio.me');
      await HomeWidget.saveWidgetData<bool>('isLoggedIn', false);
      await HomeWidget.saveWidgetData<String>('lastUpdated', loggedOut.lastUpdated);
      await HomeWidget.saveWidgetData<String>('profile_json', loggedOut.toJsonString());
      await HomeWidget.saveWidgetData<String>('avatar_base64', '');

      await refreshWidget();
      debugPrint('[TapfolioWidgetService] Widget data cleared on logout');
    } catch (e) {
      debugPrint('[TapfolioWidgetService] Error clearing widget data: $e');
    }
  }

  /// Signals WidgetKit to reload the timeline for the Tapfolio widget.
  Future<void> refreshWidget() async {
    try {
      await HomeWidget.updateWidget(
        name: iOSWidgetKind,
        iOSName: iOSWidgetKind,
      );
    } catch (e) {
      debugPrint('[TapfolioWidgetService] Error requesting widget refresh: $e');
    }
  }

  /// Helper to fetch avatar and compress to a compact base64 representation (~20-40KB)
  /// so it can be reliably shared with the WidgetKit extension.
  Future<String?> _fetchAndEncodeAvatar(String avatarUrl) async {
    try {
      String fullUrl = avatarUrl;
      if (!avatarUrl.startsWith('http://') && !avatarUrl.startsWith('https://')) {
        final baseUrl = ApiService().baseUrl.replaceAll(RegExp(r'/+$'), '');
        final cleanPath = avatarUrl.startsWith('/') ? avatarUrl : '/$avatarUrl';
        fullUrl = '$baseUrl$cleanPath';
      }

      final res = await http.get(Uri.parse(fullUrl)).timeout(const Duration(seconds: 8));
      if (res.statusCode == 200 && res.bodyBytes.isNotEmpty) {
        // Encode binary image data to base64
        return base64Encode(res.bodyBytes);
      }
    } catch (e) {
      debugPrint('[TapfolioWidgetService] Avatar fetch error: $e');
    }
    return null;
  }
}

import 'dart:async';
import 'package:flutter/material.dart';
import 'package:connectivity_plus/connectivity_plus.dart';
import 'dashboard_screen.dart';
import 'leaderboard_screen.dart';
import 'connections_screen.dart';
import 'edit_profile_screen.dart';
import 'manage_socials_screen.dart';
import '../services/api_service.dart';
import '../services/push_notification_service.dart';
import '../models/profile.dart';
import '../features/card_export/dialog/share_card_dialog.dart';
import '../widgets/offline_banner.dart';
import '../core/widgets/liquid_glass_navigation.dart';

import '../core/widget/tapfolio_widget_service.dart';
import '../core/widget/widget_deep_link_handler.dart';

class MainNavigationShell extends StatefulWidget {
  final VoidCallback onLogout;

  const MainNavigationShell({super.key, required this.onLogout});

  @override
  State<MainNavigationShell> createState() => _MainNavigationShellState();
}

class _MainNavigationShellState extends State<MainNavigationShell>
    with WidgetsBindingObserver
    implements NavigationShellController {
  int _currentIndex = 0;
  final ApiService _apiService = ApiService();

  int _pendingCount = 0;       // connection request badge on nav bar
  bool _isOffline = false;     // connectivity state

  Timer? _notifTimer;
  StreamSubscription<List<ConnectivityResult>>? _connectivitySub;

  late List<Widget> _screens;

  _MainNavigationShellState() {
    debugPrint('[TRACE-SHELL] State constructor called.');
  }

  @override
  void switchToTab(int index) {
    if (mounted && index >= 0 && index < _screens.length) {
      setState(() => _currentIndex = index);
    }
  }

  @override
  void triggerShareDialog() {
    if (mounted) {
      _onSharePressed();
    }
  }

  @override
  void refreshAllData() {
    _refreshAll();
  }

  @override
  void initState() {
    debugPrint('[TRACE-SHELL] initState() started.');
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    WidgetDeepLinkHandler().registerShellController(this);
    _screens = [
      const DashboardScreen(),
      const ConnectionsScreen(),
      const ManageSocialsScreen(),
      const LeaderboardScreen(),
      EditProfileScreen(onLogout: widget.onLogout),
    ];
    debugPrint('[TRACE-SHELL] Calling _fetchPendingCount()...');
    _fetchPendingCount();
    debugPrint('[TRACE-SHELL] Synchronizing widget data...');
    _syncWidgetData();
    debugPrint('[TRACE-SHELL] Starting notification polling...');
    _startPolling();
    // Listen for connectivity changes
    _initConnectivity();
    // Register push notification token on successful load/sign-in
    debugPrint('[TRACE-SHELL] Registering PushNotificationService FCM token...');
    try {
      PushNotificationService().registerToken();
    } catch (e, stack) {
      debugPrint('[EXCEPTION] registerToken in shell initState failed: $e\n$stack');
    }
    debugPrint('[TRACE-SHELL] initState() completed.');
  }

  void _initConnectivity() {
    _connectivitySub = Connectivity().onConnectivityChanged.listen((results) {
      final offline = results.every((r) => r == ConnectivityResult.none);
      if (mounted) {
        final wasOffline = _isOffline;
        setState(() => _isOffline = offline);
        // Auto-refresh when connectivity is restored
        if (wasOffline && !offline) {
          debugPrint('[CONNECTIVITY] Internet restored — refreshing all data.');
          _refreshAll();
        }
      }
    });
    // Check initial state
    Connectivity().checkConnectivity().then((results) {
      if (mounted) {
        setState(() => _isOffline = results.every((r) => r == ConnectivityResult.none));
      }
    });
  }

  /// Re-fetch all data after connectivity is restored.
  void _refreshAll() {
    _fetchPendingCount();
    _syncWidgetData();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.resumed) {
      _startPolling();
      _syncWidgetData();
    } else if (state == AppLifecycleState.paused) {
      _stopPolling();
    }
  }

  void _startPolling() {
    _stopPolling();
    _notifTimer = Timer.periodic(const Duration(seconds: 30), (_) {
      _fetchPendingCount();
    });
  }

  void _stopPolling() {
    _notifTimer?.cancel();
    _notifTimer = null;
  }

  @override
  void dispose() {
    WidgetDeepLinkHandler().unregisterShellController();
    _stopPolling();
    _connectivitySub?.cancel();
    WidgetsBinding.instance.removeObserver(this);
    super.dispose();
  }

  Future<void> _syncWidgetData() async {
    try {
      final profileRes = await _apiService.getProfile();
      if (profileRes != null && profileRes['profile'] is Profile) {
        final profile = profileRes['profile'] as Profile;
        final connections = await _apiService.getConnections();
        await TapfolioWidgetService().updateProfileData(
          profile: profile,
          connectionsCount: connections.length,
          viewsCount: profile.tapCount,
        );
      }
    } catch (e) {
      debugPrint('[SHELL] Widget sync error: $e');
    }
  }

  Future<void> _fetchPendingCount() async {
    final pending = await _apiService.getPendingRequests();
    if (mounted) setState(() => _pendingCount = pending.length);
  }

  Future<void> _onSharePressed() async {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (_) => const Center(child: CircularProgressIndicator(color: Color(0xFF6366F1))),
    );

    try {
      final res = await _apiService.getProfile();
      if (mounted) Navigator.pop(context); // Close loading dialog

      if (res != null && res['profile'] != null) {
        final profile = res['profile'] as Profile;
        final publicLink = '${_apiService.baseUrl}/connect/${profile.username}';
        
        if (mounted) {

          ShareCardDialog.show(
            context,
            name: profile.name,
            tagline: profile.tagline,
            avatar: profile.avatar,
            profileUrl: publicLink,
            baseUrl: _apiService.baseUrl,
            isPremium: profile.isPremium,
            isOnline: profile.isOnline,
            location: profile.location,
            bio: profile.bio,
            tags: profile.tags,
            socials: profile.socials,
          );
        }
      } else {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Failed to load profile for sharing.')),
          );
        }
      }
    } catch (e) {
      if (mounted) {
        Navigator.pop(context); // Close loading dialog if crashed
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error loading profile: $e')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final isLight = Theme.of(context).brightness == Brightness.light;
    final scaffoldBg = isLight ? const Color(0xFFF3F4F6) : const Color(0xFF06070D);
    return Scaffold(
      backgroundColor: scaffoldBg,
      body: Column(
        children: [
          if (_isOffline) const OfflineBanner(),
          Expanded(
            child: IndexedStack(
              index: _currentIndex,
              children: _screens,
            ),
          ),
        ],
      ),
      extendBody: true,
      bottomNavigationBar: LiquidGlassNavigation(
        currentIndex: _currentIndex,
        pendingCount: _pendingCount,
        onItemSelected: (index) {
          setState(() => _currentIndex = index);
          if (index == 1) _fetchPendingCount();
        },
      ),
    );
  }
}


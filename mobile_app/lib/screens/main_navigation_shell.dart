import 'dart:async';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:connectivity_plus/connectivity_plus.dart';
import 'dashboard_screen.dart';
import 'leaderboard_screen.dart';
import 'connections_screen.dart';
import 'notification_screen.dart';
import 'edit_profile_screen.dart';
import 'manage_socials_screen.dart';
import '../services/api_service.dart';
import '../services/push_notification_service.dart';
import '../models/profile.dart';
import '../features/card_export/dialog/share_card_dialog.dart';
import '../widgets/offline_banner.dart';

class MainNavigationShell extends StatefulWidget {
  final VoidCallback onLogout;

  const MainNavigationShell({super.key, required this.onLogout});

  @override
  State<MainNavigationShell> createState() => _MainNavigationShellState();
}

class _MainNavigationShellState extends State<MainNavigationShell>
    with WidgetsBindingObserver {
  int _currentIndex = 0;
  final ApiService _apiService = ApiService();

  int _pendingCount = 0;       // connection request badge on nav bar
  int _unreadNotifCount = 0;   // notification bell badge
  int _score = 0;              // user profile score
  bool _isOffline = false;     // connectivity state

  Timer? _notifTimer;
  StreamSubscription<List<ConnectivityResult>>? _connectivitySub;

  late List<Widget> _screens;

  _MainNavigationShellState() {
    debugPrint('[TRACE-SHELL] State constructor called.');
  }

  @override
  void initState() {
    debugPrint('[TRACE-SHELL] initState() started.');
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    _screens = [
      const DashboardScreen(),
      const ConnectionsScreen(),
      const ManageSocialsScreen(),
      const LeaderboardScreen(),
      EditProfileScreen(onLogout: widget.onLogout),
    ];
    debugPrint('[TRACE-SHELL] Calling _fetchPendingCount()...');
    _fetchPendingCount();
    debugPrint('[TRACE-SHELL] Calling _fetchUnreadCount()...');
    _fetchUnreadCount();
    debugPrint('[TRACE-SHELL] Calling _fetchScore()...');
    _fetchScore();
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
    _fetchUnreadCount();
    _fetchScore();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.resumed) {
      _startPolling();
      _fetchUnreadCount();
      _fetchScore();
    } else if (state == AppLifecycleState.paused) {
      _stopPolling();
    }
  }

  void _startPolling() {
    _stopPolling();
    // Poll unread count and score every 15 seconds while active
    _notifTimer = Timer.periodic(const Duration(seconds: 15), (_) {
      _fetchUnreadCount();
      _fetchScore();
    });
  }

  void _stopPolling() {
    _notifTimer?.cancel();
    _notifTimer = null;
  }

  @override
  void dispose() {
    _stopPolling();
    _connectivitySub?.cancel();
    WidgetsBinding.instance.removeObserver(this);
    super.dispose();
  }

  Future<void> _fetchPendingCount() async {
    final pending = await _apiService.getPendingRequests();
    if (mounted) setState(() => _pendingCount = pending.length);
  }

  Future<void> _fetchUnreadCount() async {
    final count = await _apiService.getUnreadNotificationCount();
    if (mounted) setState(() => _unreadNotifCount = count);
  }

  Future<void> _fetchScore() async {
    try {
      final res = await _apiService.getProfile();
      if (res != null && res['score'] != null) {
        if (mounted) setState(() => _score = res['score'] as int? ?? 0);
      }
    } catch (e) {
      debugPrint('[SHELL] Error fetching score: $e');
    }
  }

  void _openNotifications() {
    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (_) => NotificationScreen(
          onUnreadCountChanged: (count) {
            if (mounted) setState(() => _unreadNotifCount = count);
          },
        ),
      ),
    ).then((_) {
      // Refresh counts when returning from notification screen
      _fetchUnreadCount();
      _fetchPendingCount();
    });
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
    final appBarBg = isLight ? Colors.white : const Color(0xFF0F1122);
    final iconColor = isLight ? const Color(0xFF374151) : Colors.white70;

    return Scaffold(
      backgroundColor: scaffoldBg,
      appBar: AppBar(
        backgroundColor: appBarBg,
        elevation: 0.5,
        title: Row(
          children: [
            Container(
              width: 30,
              height: 30,
              decoration: BoxDecoration(
                color: const Color(0xFF0052FF),
                borderRadius: BorderRadius.circular(8),
              ),
              alignment: Alignment.center,
              child: Text(
                'T',
                style: GoogleFonts.outfit(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                  fontSize: 18,
                ),
              ),
            ),
            const SizedBox(width: 8),
            Text(
              'tapfolio',
              style: GoogleFonts.outfit(
                fontWeight: FontWeight.bold,
                fontSize: 20,
                color: const Color(0xFF0052FF),
              ),
            ),
          ],
        ),
        actions: [
          // ── Notification bell with animated badge ──
          GestureDetector(
            onTap: _openNotifications,
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 2),
              child: Stack(
                clipBehavior: Clip.none,
                children: [
                  IconButton(
                    icon: Icon(Icons.notifications_outlined,
                        color: iconColor),
                    onPressed: _openNotifications,
                  ),
                  if (_unreadNotifCount > 0)
                    Positioned(
                      top: 6,
                      right: 6,
                      child: _AnimatedBadge(count: _unreadNotifCount),
                    ),
                ],
              ),
            ),
          ),
          // ── Share button ──
          IconButton(
            icon: Icon(Icons.share_rounded, color: iconColor),
            onPressed: _onSharePressed,
          ),
        ],
      ),
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
      extendBody: false,
      bottomNavigationBar: Container(
        decoration: const BoxDecoration(
          color: Colors.white,
          border: Border(
            top: BorderSide(color: Colors.black12, width: 0.5),
          ),
        ),
        child: BottomNavigationBar(
          currentIndex: _currentIndex,
          onTap: (index) {
            setState(() => _currentIndex = index);
            if (index == 1) _fetchPendingCount();
          },
          backgroundColor: Colors.white,
          selectedItemColor: const Color(0xFF0052FF),
          unselectedItemColor: const Color(0xFF94A3B8),
          showUnselectedLabels: true,
          type: BottomNavigationBarType.fixed,
          selectedLabelStyle:
              GoogleFonts.outfit(fontSize: 11, fontWeight: FontWeight.w600),
          unselectedLabelStyle: GoogleFonts.outfit(fontSize: 11),
          items: [
            const BottomNavigationBarItem(
              icon: Icon(Icons.home_outlined),
              activeIcon: Icon(Icons.home),
              label: 'Home',
            ),
            BottomNavigationBarItem(
              icon: _pendingCount > 0
                  ? Badge.count(
                      count: _pendingCount,
                      child: const Icon(Icons.people_outline),
                    )
                  : const Icon(Icons.people_outline),
              activeIcon: _pendingCount > 0
                  ? Badge.count(
                      count: _pendingCount,
                      child: const Icon(Icons.people),
                    )
                  : const Icon(Icons.people),
              label: 'Connections',
            ),
            BottomNavigationBarItem(
              icon: Container(
                width: 44,
                height: 44,
                decoration: const BoxDecoration(
                  color: Color(0xFF0052FF),
                  shape: BoxShape.circle,
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black12,
                      blurRadius: 4,
                      offset: Offset(0, 2),
                    ),
                  ],
                ),
                child: const Icon(Icons.add, color: Colors.white, size: 24),
              ),
              label: '',
            ),
            const BottomNavigationBarItem(
              icon: Icon(Icons.emoji_events_outlined),
              activeIcon: Icon(Icons.emoji_events),
              label: 'Leader Board',
            ),
            const BottomNavigationBarItem(
              icon: Icon(Icons.person_outline),
              activeIcon: Icon(Icons.person),
              label: 'Profile',
            ),
          ],
        ),
      ),
    );
  }
}

/// Animated badge widget with a pop-in scale animation.
class _AnimatedBadge extends StatefulWidget {
  final int count;
  const _AnimatedBadge({required this.count});

  @override
  State<_AnimatedBadge> createState() => _AnimatedBadgeState();
}

class _AnimatedBadgeState extends State<_AnimatedBadge>
    with SingleTickerProviderStateMixin {
  late AnimationController _ctrl;
  late Animation<double> _scale;

  @override
  void initState() {
    super.initState();
    _ctrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 350),
    );
    _scale = CurvedAnimation(parent: _ctrl, curve: Curves.elasticOut);
    _ctrl.forward();
  }

  @override
  void didUpdateWidget(_AnimatedBadge old) {
    super.didUpdateWidget(old);
    if (old.count != widget.count) {
      _ctrl.reset();
      _ctrl.forward();
    }
  }

  @override
  void dispose() {
    _ctrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final label = widget.count > 99 ? '99+' : widget.count.toString();
    return ScaleTransition(
      scale: _scale,
      child: Container(
        constraints: const BoxConstraints(minWidth: 16, minHeight: 16),
        padding: const EdgeInsets.symmetric(horizontal: 4),
        decoration: BoxDecoration(
          color: Colors.redAccent,
          borderRadius: BorderRadius.circular(10),
          border: Border.all(
            color: Theme.of(context).brightness == Brightness.light ? Colors.white : const Color(0xFF0F1122),
            width: 1.5,
          ),
        ),
        child: Text(
          label,
          textAlign: TextAlign.center,
          style: GoogleFonts.outfit(
            color: Colors.white,
            fontSize: 10,
            fontWeight: FontWeight.bold,
            height: 1.4,
          ),
        ),
      ),
    );
  }
}

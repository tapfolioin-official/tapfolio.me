import 'dart:async';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'dashboard_screen.dart';
import 'leaderboard_screen.dart';
import 'history_screen.dart';
import 'profile_view_screen.dart';
import 'connections_screen.dart';
import 'delete_account_screen.dart';
import 'notification_screen.dart';
import '../services/api_service.dart';
import '../services/push_notification_service.dart';
import '../models/profile.dart';
import '../features/card_export/dialog/share_card_dialog.dart';

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

  Timer? _notifTimer;

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
      const LeaderboardScreen(),
      const HistoryScreen(),
      const ConnectionsScreen(),
      const ProfileViewScreen(),
    ];
    debugPrint('[TRACE-SHELL] Calling _fetchPendingCount()...');
    _fetchPendingCount();
    debugPrint('[TRACE-SHELL] Calling _fetchUnreadCount()...');
    _fetchUnreadCount();
    debugPrint('[TRACE-SHELL] Starting notification polling...');
    _startPolling();
    // Register push notification token on successful load/sign-in
    debugPrint('[TRACE-SHELL] Registering PushNotificationService FCM token...');
    try {
      PushNotificationService().registerToken();
    } catch (e, stack) {
      debugPrint('[EXCEPTION] registerToken in shell initState failed: $e\n$stack');
    }
    debugPrint('[TRACE-SHELL] initState() completed.');
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.resumed) {
      _startPolling();
      _fetchUnreadCount();
    } else if (state == AppLifecycleState.paused) {
      _stopPolling();
    }
  }

  void _startPolling() {
    _stopPolling();
    // Poll unread count every 15 seconds while app is active
    _notifTimer = Timer.periodic(const Duration(seconds: 15), (_) {
      _fetchUnreadCount();
    });
  }

  void _stopPolling() {
    _notifTimer?.cancel();
    _notifTimer = null;
  }

  @override
  void dispose() {
    _stopPolling();
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
    final logoTextColor = isLight ? const Color(0xFF111827) : Colors.white;
    final iconColor = isLight ? const Color(0xFF374151) : Colors.white70;

    return Scaffold(
      backgroundColor: scaffoldBg,
      appBar: AppBar(
        backgroundColor: appBarBg,
        elevation: 0,
        title: Row(
          children: [
            Text(
              'Tap',
              style: GoogleFonts.outfit(
                fontWeight: FontWeight.bold,
                fontSize: 22,
                color: logoTextColor,
              ),
            ),
            Text(
              'folio',
              style: GoogleFonts.outfit(
                fontWeight: FontWeight.w400,
                fontSize: 22,
                color: const Color(0xFF6366F1),
              ),
            ),
          ],
        ),
        actions: [
          // ── Notification bell with animated badge ──
          GestureDetector(
            onTap: _openNotifications,
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 4),
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
          // ── More menu ──
          PopupMenuButton<String>(
            icon: Icon(Icons.more_vert, color: iconColor),
            color: isLight ? Colors.white : const Color(0xFF1A1A2E),
            onSelected: (value) async {
              if (value == 'logout') {
                _stopPolling();
                await _apiService.logout();
                widget.onLogout();
              } else if (value == 'diagnostics') {
                Navigator.of(context).pushNamed('/diagnostics');
              } else if (value == 'delete_account') {
                Navigator.of(context).push(
                  MaterialPageRoute(
                    builder: (_) => DeleteAccountScreen(
                      onAccountDeleted: () {
                        Navigator.of(context).popUntil((r) => r.isFirst);
                        widget.onLogout();
                      },
                    ),
                  ),
                );
              }
            },
            itemBuilder: (context) {
              final popupTextColor = isLight ? const Color(0xFF1F2937) : Colors.white;
              final popupIconColor = isLight ? const Color(0xFF4B5563) : Colors.white70;
              return [
                PopupMenuItem(
                  value: 'diagnostics',
                  child: Row(
                    children: [
                      Icon(Icons.analytics_outlined, color: popupIconColor, size: 20),
                      const SizedBox(width: 12),
                      Text('Diagnostics', style: GoogleFonts.outfit(color: popupTextColor)),
                    ],
                  ),
                ),
                PopupMenuItem(
                  value: 'logout',
                  child: Row(
                    children: [
                      Icon(Icons.logout, color: popupIconColor, size: 20),
                      const SizedBox(width: 12),
                      Text('Sign Out', style: GoogleFonts.outfit(color: popupTextColor)),
                    ],
                  ),
                ),
                PopupMenuItem(
                  value: 'delete_account',
                  child: Row(
                    children: [
                      Icon(Icons.delete_forever, color: Colors.red.shade400, size: 20),
                      const SizedBox(width: 12),
                      Text('Delete Account',
                          style: GoogleFonts.outfit(color: Colors.red.shade400)),
                    ],
                  ),
                ),
              ];
            },
          ),
        ],
      ),
      body: IndexedStack(
        index: _currentIndex,
        children: _screens,
      ),
      extendBody: true,
      bottomNavigationBar: Container(
        margin: const EdgeInsets.only(left: 16, right: 16, bottom: 20),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(24),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.4),
              blurRadius: 20,
              offset: const Offset(0, 8),
            ),
          ],
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(24),
          child: BottomNavigationBar(
            currentIndex: _currentIndex,
            onTap: (index) {
              setState(() => _currentIndex = index);
              if (index == 3) _fetchPendingCount();
            },
            backgroundColor: isLight ? Colors.white.withValues(alpha: 0.95) : const Color(0xFF0F1122).withValues(alpha: 0.95),
            selectedItemColor: const Color(0xFF6366F1),
            unselectedItemColor: isLight ? Colors.black38 : Colors.white38,
            showUnselectedLabels: true,
            type: BottomNavigationBarType.fixed,
            selectedLabelStyle:
                GoogleFonts.outfit(fontSize: 11, fontWeight: FontWeight.w600),
            unselectedLabelStyle: GoogleFonts.outfit(fontSize: 11),
            items: [
              const BottomNavigationBarItem(
                icon: Icon(Icons.dashboard_outlined),
                activeIcon: Icon(Icons.dashboard),
                label: 'Dashboard',
              ),
              const BottomNavigationBarItem(
                icon: Icon(Icons.emoji_events_outlined),
                activeIcon: Icon(Icons.emoji_events),
                label: 'Leaderboard',
              ),
              const BottomNavigationBarItem(
                icon: Icon(Icons.history_outlined),
                activeIcon: Icon(Icons.history),
                label: 'Logs',
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
              const BottomNavigationBarItem(
                icon: Icon(Icons.nfc_outlined),
                activeIcon: Icon(Icons.nfc),
                label: 'Tap Profile',
              ),
            ],
          ),
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

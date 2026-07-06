import 'dart:async';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../models/notification.dart';
import '../services/api_service.dart';
import 'public_profile_screen.dart';
import 'connections_screen.dart';

class NotificationScreen extends StatefulWidget {
  /// Called when the unread count changes so the parent can update its badge.
  final ValueChanged<int>? onUnreadCountChanged;

  const NotificationScreen({super.key, this.onUnreadCountChanged});

  @override
  State<NotificationScreen> createState() => _NotificationScreenState();
}

class _NotificationScreenState extends State<NotificationScreen> {
  final ApiService _api = ApiService();
  List<AppNotification> _notifications = [];
  bool _loading = true;

  // Track which notifications are being actioned (accept/reject) to show per-card loading
  final Set<int> _processingIds = {};

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    if (!mounted) return;
    setState(() => _loading = true);
    final notifs = await _api.getNotifications();
    if (!mounted) return;
    setState(() {
      _notifications = notifs;
      _loading = false;
    });
    // Report new unread count to parent
    final unread = notifs.where((n) => !n.isRead).length;
    widget.onUnreadCountChanged?.call(unread);
  }

  Future<void> _markAllRead() async {
    await _api.markAllNotificationsRead();
    if (!mounted) return;
    setState(() {
      _notifications = _notifications.map((n) => AppNotification(
        id: n.id,
        type: n.type,
        title: n.title,
        message: n.message,
        data: n.data,
        isRead: true,
        createdAt: n.createdAt,
        sender: n.sender,
      )).toList();
    });
    widget.onUnreadCountChanged?.call(0);
  }

  Future<void> _markRead(AppNotification notif) async {
    if (notif.isRead) return;
    await _api.markNotificationRead(notif.id);
    if (!mounted) return;
    setState(() {
      _notifications = _notifications.map((n) {
        if (n.id == notif.id) {
          return AppNotification(
            id: n.id, type: n.type, title: n.title, message: n.message,
            data: n.data, isRead: true, createdAt: n.createdAt, sender: n.sender,
          );
        }
        return n;
      }).toList();
    });
    final unread = _notifications.where((n) => !n.isRead).length;
    widget.onUnreadCountChanged?.call(unread);
  }

  Future<void> _delete(AppNotification notif) async {
    await _api.deleteNotification(notif.id);
    if (!mounted) return;
    setState(() => _notifications.removeWhere((n) => n.id == notif.id));
    final unread = _notifications.where((n) => !n.isRead).length;
    widget.onUnreadCountChanged?.call(unread);
  }

  Future<void> _acceptRequest(AppNotification notif) async {
    final connId = notif.connectionId;
    if (connId == null) return;
    setState(() => _processingIds.add(notif.id));
    final res = await _api.acceptRequest(connId);
    if (!mounted) return;
    setState(() => _processingIds.remove(notif.id));
    if (res['success'] == true) {
      // Remove the notification and refresh
      await _delete(notif);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Connected with ${notif.sender?.name ?? "user"}! 🎉'),
          backgroundColor: const Color(0xFF10B981),
        ),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(res['error'] ?? 'Failed to accept'),
          backgroundColor: Colors.redAccent,
        ),
      );
    }
  }

  Future<void> _rejectRequest(AppNotification notif) async {
    final connId = notif.connectionId;
    if (connId == null) return;
    setState(() => _processingIds.add(notif.id));
    final res = await _api.rejectRequest(connId);
    if (!mounted) return;
    setState(() => _processingIds.remove(notif.id));
    if (res['success'] == true) {
      await _delete(notif);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Request declined.'),
          backgroundColor: Color(0xFF374151),
        ),
      );
    }
  }

  void _navigateFromNotification(AppNotification notif) {
    _markRead(notif);
    final username = notif.targetUsername;
    if (username != null && username.isNotEmpty) {
      Navigator.of(context).push(
        MaterialPageRoute(
          builder: (_) => PublicProfileScreen(username: username),
        ),
      );
    } else if (notif.type == 'connection_accepted' || notif.type == 'connection_request') {
      Navigator.of(context).push(
        MaterialPageRoute(builder: (_) => const ConnectionsScreen()),
      );
    }
  }

  String _timeAgo(DateTime dt) {
    final diff = DateTime.now().difference(dt);
    if (diff.inSeconds < 60) return 'Just now';
    if (diff.inMinutes < 60) return '${diff.inMinutes}m ago';
    if (diff.inHours < 24) return '${diff.inHours}h ago';
    if (diff.inDays < 7) return '${diff.inDays}d ago';
    return '${(diff.inDays / 7).floor()}w ago';
  }

  Widget _notifIcon(AppNotification n) {
    final size = 40.0;
    if (n.sender?.avatar != null &&
        n.sender!.avatar.isNotEmpty &&
        n.sender!.avatar.startsWith('http')) {
      return CircleAvatar(
        radius: size / 2,
        backgroundImage: NetworkImage(n.sender!.avatar),
      );
    }
    IconData icon;
    Color color;
    switch (n.type) {
      case 'connection_request':
        icon = Icons.person_add_rounded;
        color = const Color(0xFF6366F1);
        break;
      case 'connection_accepted':
        icon = Icons.check_circle_rounded;
        color = const Color(0xFF10B981);
        break;
      case 'profile_view':
        icon = Icons.visibility_rounded;
        color = const Color(0xFFF59E0B);
        break;
      case 'nfc_tap':
        icon = Icons.nfc_rounded;
        color = const Color(0xFF8B5CF6);
        break;
      case 'security':
        icon = Icons.security_rounded;
        color = Colors.redAccent;
        break;
      case 'announcement':
        icon = Icons.campaign_rounded;
        color = const Color(0xFF3B82F6);
        break;
      default:
        icon = Icons.notifications_rounded;
        color = Colors.white38;
    }
    return CircleAvatar(
      radius: size / 2,
      backgroundColor: color.withValues(alpha: 0.15),
      child: Icon(icon, color: color, size: 20),
    );
  }

  @override
  Widget build(BuildContext context) {
    final hasUnread = _notifications.any((n) => !n.isRead);

    return Scaffold(
      backgroundColor: const Color(0xFF0F0F16),
      appBar: AppBar(
        backgroundColor: const Color(0xFF141420),
        elevation: 0,
        leading: BackButton(color: Colors.white70),
        title: Text(
          'Notifications',
          style: GoogleFonts.outfit(
            color: Colors.white,
            fontWeight: FontWeight.w600,
            fontSize: 18,
          ),
        ),
        actions: [
          if (hasUnread)
            TextButton(
              onPressed: _markAllRead,
              child: Text(
                'Mark all read',
                style: GoogleFonts.outfit(
                  color: Colors.indigoAccent,
                  fontSize: 13,
                ),
              ),
            ),
          IconButton(
            icon: const Icon(Icons.refresh_rounded, color: Colors.white70),
            onPressed: _load,
          ),
        ],
      ),
      body: _loading
          ? const Center(
              child: CircularProgressIndicator(color: Colors.indigoAccent),
            )
          : _notifications.isEmpty
              ? _buildEmptyState()
              : RefreshIndicator(
                  color: Colors.indigoAccent,
                  backgroundColor: const Color(0xFF161824),
                  onRefresh: _load,
                  child: ListView.builder(
                    itemCount: _notifications.length,
                    padding: const EdgeInsets.symmetric(vertical: 8),
                    itemBuilder: (ctx, i) => _buildCard(_notifications[i]),
                  ),
                ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            width: 80,
            height: 80,
            decoration: BoxDecoration(
              color: Colors.indigoAccent.withValues(alpha: 0.1),
              shape: BoxShape.circle,
            ),
            child: const Icon(
              Icons.notifications_outlined,
              size: 40,
              color: Colors.indigoAccent,
            ),
          ),
          const SizedBox(height: 20),
          Text(
            'No notifications yet',
            style: GoogleFonts.outfit(
              color: Colors.white,
              fontSize: 18,
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            "We'll notify you whenever someone\nconnects with you.",
            textAlign: TextAlign.center,
            style: GoogleFonts.outfit(
              color: Colors.white38,
              fontSize: 14,
              height: 1.5,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCard(AppNotification notif) {
    final isProcessing = _processingIds.contains(notif.id);

    return Dismissible(
      key: Key('notif_${notif.id}'),
      direction: DismissDirection.endToStart,
      background: Container(
        alignment: Alignment.centerRight,
        color: Colors.redAccent.withValues(alpha: 0.8),
        padding: const EdgeInsets.only(right: 20),
        child: const Icon(Icons.delete_outline, color: Colors.white),
      ),
      onDismissed: (_) => _delete(notif),
      child: InkWell(
        onTap: () => _navigateFromNotification(notif),
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 300),
          margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
          decoration: BoxDecoration(
            color: notif.isRead
                ? const Color(0xFF141420)
                : const Color(0xFF1A1A2E),
            borderRadius: BorderRadius.circular(14),
            border: Border.all(
              color: notif.isRead
                  ? Colors.white.withValues(alpha: 0.05)
                  : Colors.indigoAccent.withValues(alpha: 0.3),
              width: 1,
            ),
          ),
          child: Padding(
            padding: const EdgeInsets.all(14),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Avatar / icon
                Stack(
                  children: [
                    _notifIcon(notif),
                    if (!notif.isRead)
                      Positioned(
                        top: 0,
                        right: 0,
                        child: Container(
                          width: 10,
                          height: 10,
                          decoration: const BoxDecoration(
                            color: Colors.indigoAccent,
                            shape: BoxShape.circle,
                          ),
                        ),
                      ),
                  ],
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Title row
                      Row(
                        children: [
                          Expanded(
                            child: Text(
                              notif.title,
                              style: GoogleFonts.outfit(
                                color: Colors.white,
                                fontWeight: notif.isRead
                                    ? FontWeight.w400
                                    : FontWeight.w600,
                                fontSize: 14,
                              ),
                            ),
                          ),
                          Text(
                            _timeAgo(notif.createdAt),
                            style: GoogleFonts.outfit(
                              color: Colors.white38,
                              fontSize: 11,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 3),
                      // Message
                      Text(
                        notif.message,
                        style: GoogleFonts.outfit(
                          color: Colors.white60,
                          fontSize: 13,
                          height: 1.4,
                        ),
                      ),
                      // Action buttons for connection requests
                      if (notif.isConnectionRequest) ...[
                        const SizedBox(height: 12),
                        if (isProcessing)
                          const Center(
                            child: SizedBox(
                              height: 24,
                              width: 24,
                              child: CircularProgressIndicator(
                                strokeWidth: 2.5,
                                color: Colors.indigoAccent,
                              ),
                            ),
                          )
                        else
                          Row(
                            children: [
                              Expanded(
                                child: OutlinedButton(
                                  onPressed: () => _rejectRequest(notif),
                                  style: OutlinedButton.styleFrom(
                                    foregroundColor: Colors.white54,
                                    side: const BorderSide(
                                        color: Colors.white24),
                                    padding: const EdgeInsets.symmetric(
                                        vertical: 8),
                                    shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(8),
                                    ),
                                  ),
                                  child: Text(
                                    'Decline',
                                    style: GoogleFonts.outfit(fontSize: 13),
                                  ),
                                ),
                              ),
                              const SizedBox(width: 10),
                              Expanded(
                                child: ElevatedButton(
                                  onPressed: () => _acceptRequest(notif),
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: Colors.indigoAccent,
                                    foregroundColor: Colors.white,
                                    padding: const EdgeInsets.symmetric(
                                        vertical: 8),
                                    elevation: 0,
                                    shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(8),
                                    ),
                                  ),
                                  child: Text(
                                    'Accept',
                                    style: GoogleFonts.outfit(
                                      fontSize: 13,
                                      fontWeight: FontWeight.w600,
                                    ),
                                  ),
                                ),
                              ),
                            ],
                          ),
                      ],
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

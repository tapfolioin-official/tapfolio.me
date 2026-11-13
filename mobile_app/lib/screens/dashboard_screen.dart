import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:url_launcher/url_launcher.dart';
import '../models/profile.dart';
import '../models/card_item.dart';
import '../services/api_service.dart';
import '../core/widget/tapfolio_widget_service.dart';
import '../features/card_export/dialog/share_card_dialog.dart';
import '../features/card_export/models/profile_share_data.dart';
import '../features/card_export/widgets/share_via_qr_modal.dart';
import 'notification_screen.dart';
import 'profile_view_screen.dart';
import 'connections_screen.dart';
import 'manage_socials_screen.dart';
import 'analytics_screen.dart';
import 'manage_cards_screen.dart';

import 'dashboard/widgets/dashboard_top_bar.dart';
import 'dashboard/widgets/hero_identity_qr_card.dart';
import 'dashboard/widgets/my_card_preview_card.dart';
import 'dashboard/widgets/primary_action_grid.dart';
import 'dashboard/widgets/discover_connections_row.dart';
import 'dashboard/widgets/instant_share_banner.dart';
import '../core/widgets/discover_connections_controller.dart';
import 'discover_connections_screen.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  final ApiService _apiService = ApiService();

  Profile? _profile;
  CardItem? _activeCard;
  int _unreadNotifications = 0;
  bool _loading = true;
  bool _leadCaptureEnabled = true;

  // Discover Connections Controller
  late final DiscoverConnectionsController _discoverCtrl;

  bool get _isLight => Theme.of(context).brightness == Brightness.light;
  Color get _textColor => _isLight ? const Color(0xFF0F172A) : Colors.white;
  Color get _subtitleColor =>
      _isLight ? const Color(0xFF64748B) : Colors.white60;

  @override
  void initState() {
    super.initState();
    _discoverCtrl = DiscoverConnectionsController(apiService: _apiService);
    _discoverCtrl.addListener(() {
      if (mounted) setState(() {});
    });
    _loadDashboardData();
  }

  Future<void> _loadDashboardData() async {
    setState(() => _loading = true);
    await Future.wait([
      _fetchProfile(),
      _fetchActiveCard(),
      _fetchConnections(),
      _fetchUnreadNotifications(),
    ]);
    // Initialize discover controller after profile is fetched
    if (_profile != null) {
      _discoverCtrl.setProfile(_profile!);
    }
    if (mounted) {
      setState(() => _loading = false);
    }
  }

  Future<void> _fetchProfile() async {
    try {
      final res = await _apiService.getProfile();
      if (res != null && res['profile'] != null) {
        if (mounted) {
          setState(() {
            _profile = res['profile'] as Profile;
          });
          // Update the home screen widget cache
          TapfolioWidgetService().updateProfileData(
            profile: _profile!,
          );
        }
      }
    } catch (e) {
      debugPrint('[DASHBOARD] _fetchProfile error: $e');
    }
  }

  Future<void> _fetchActiveCard() async {
    try {
      final cardRes = await _apiService.getCards();
      if (cardRes != null && cardRes['activeCard'] != null) {
        if (mounted) {
          setState(() {
            _activeCard = cardRes['activeCard'] as CardItem;
            _leadCaptureEnabled = _activeCard?.collectLeads ?? true;
          });
        }
      }
    } catch (e) {
      debugPrint('[DASHBOARD] _fetchActiveCard error: $e');
    }
  }

  Future<void> _fetchConnections() async {
    try {
      final list = await _apiService.getConnections();
      final ids = list.map((c) => c.other.userId).toSet();
      _discoverCtrl.updateConnectedUserIds(ids);
    } catch (e) {
      debugPrint('[DASHBOARD] _fetchConnections error: $e');
    }
  }

  Future<void> _fetchUnreadNotifications() async {
    try {
      final list = await _apiService.getNotifications();
      final unread = list.where((n) => n.isRead != true).length;
      if (mounted) {
        setState(() => _unreadNotifications = unread);
      }
    } catch (e) {
      debugPrint('[DASHBOARD] _fetchUnreadNotifications error: $e');
    }
  }

  void _openShareDialog() {
    if (_profile == null) return;

    ProfileShareData shareData;
    if (_activeCard != null) {
      shareData = ProfileShareData.fromCardAndProfile(
        card: _activeCard!,
        profile: _profile!,
        baseUrl: _apiService.baseUrl,
      );
    } else {
      final publicLink = '${_apiService.baseUrl}/connect/${_profile!.username}';
      shareData = ProfileShareData(
        name: _profile!.name,
        tagline: _profile!.tagline,
        avatar: _profile!.avatar,
        profileUrl: publicLink,
        baseUrl: _apiService.baseUrl,
        isPremium: _profile!.isPremium,
        isOnline: _profile!.isOnline,
        location: _profile!.location,
        bio: _profile!.bio,
        tags: _profile!.tags,
        socials: _profile!.socials,
      );
    }

    ShareCardDialog.show(
      context,
      name: shareData.name,
      tagline: shareData.tagline,
      avatar: shareData.avatar,
      profileUrl: shareData.profileUrl,
      baseUrl: shareData.baseUrl,
      isPremium: shareData.isPremium,
      isOnline: shareData.isOnline,
      location: shareData.location,
      bio: shareData.bio,
      tags: shareData.tags,
      socials: shareData.socials,
    );
  }

  /// Directly opens the verified high-res QR code with active card URL link modal.
  void _openDirectQrDialog() {
    if (_profile == null) return;

    ProfileShareData shareData;
    if (_activeCard != null) {
      shareData = ProfileShareData.fromCardAndProfile(
        card: _activeCard!,
        profile: _profile!,
        baseUrl: _apiService.baseUrl,
      );
    } else {
      final publicLink = '${_apiService.baseUrl}/connect/${_profile!.username}';
      shareData = ProfileShareData(
        name: _profile!.name,
        tagline: _profile!.tagline,
        avatar: _profile!.avatar,
        profileUrl: publicLink,
        baseUrl: _apiService.baseUrl,
        isPremium: _profile!.isPremium,
        isOnline: _profile!.isOnline,
        location: _profile!.location,
        bio: _profile!.bio,
        tags: _profile!.tags,
        socials: _profile!.socials,
      );
    }

    ShareViaQrModal.show(context, shareData);
  }

  void _openNotifications() {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => NotificationScreen(
          onUnreadCountChanged: (cnt) {
            if (mounted) setState(() => _unreadNotifications = cnt);
          },
        ),
      ),
    ).then((_) => _fetchUnreadNotifications());
  }

  Future<void> _openProfilePreview() async {
    if (_profile == null) return;
    final publicLink = _activeCard != null
        ? _activeCard!.shareUrl(_apiService.baseUrl, _profile!.username)
        : '${_apiService.baseUrl}/connect/${_profile!.username}';
    final uri = Uri.parse(publicLink);
    try {
      if (await canLaunchUrl(uri)) {
        await launchUrl(uri, mode: LaunchMode.inAppBrowserView);
      } else {
        await launchUrl(uri, mode: LaunchMode.externalApplication);
      }
    } catch (e) {
      debugPrint('[PREVIEW] Error opening profile web view: $e');
    }
  }

  void _openAnalytics() {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => AnalyticsScreen(initialProfile: _profile),
      ),
    ).then((_) => _fetchProfile());
  }

  void _openManageCards() {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => ManageCardsScreen(initialProfile: _profile),
      ),
    ).then((res) {
      if (res is CardItem) {
        if (mounted) {
          setState(() {
            _activeCard = res;
            _leadCaptureEnabled = res.collectLeads;
          });
        }
      }
      _fetchActiveCard();
      _fetchProfile();
    });
  }

  void _openConnectionsScreen() {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => const ConnectionsScreen(),
      ),
    ).then((_) => _fetchConnections());
  }

  void _openManageSocials() {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => const ManageSocialsScreen(),
      ),
    ).then((_) => _fetchProfile());
  }

  void _onDiscoverUserSelected(DiscoverUserItem user) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => ProfileViewScreen(
          userId: user.userId,
          username: user.username,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) {
      return Scaffold(
        backgroundColor:
            _isLight ? const Color(0xFFF8FAFC) : const Color(0xFF0A0A0F),
        body: const Center(
          child: CircularProgressIndicator(color: Color(0xFF0052FF)),
        ),
      );
    }

    if (_profile == null) {
      return Scaffold(
        backgroundColor:
            _isLight ? const Color(0xFFF8FAFC) : const Color(0xFF0A0A0F),
        body: SafeArea(
          child: Center(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 28),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(
                    Icons.cloud_off_rounded,
                    color: Color(0xFF64748B),
                    size: 56,
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'Unable to load your profile',
                    style: GoogleFonts.outfit(
                      color: _textColor,
                      fontWeight: FontWeight.bold,
                      fontSize: 18,
                    ),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    'Please check your connection and pull down to refresh.',
                    textAlign: TextAlign.center,
                    style: GoogleFonts.outfit(
                      color: _subtitleColor,
                      fontSize: 13,
                    ),
                  ),
                  const SizedBox(height: 20),
                  ElevatedButton.icon(
                    onPressed: _loadDashboardData,
                    icon: const Icon(Icons.refresh_rounded, size: 18),
                    label: Text(
                      'Retry',
                      style: GoogleFonts.outfit(fontWeight: FontWeight.w600),
                    ),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF0052FF),
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(
                        horizontal: 24,
                        vertical: 12,
                      ),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(14),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      );
    }

    final p = _profile!;
    final publicLink = _activeCard != null
        ? _activeCard!.shareUrl(_apiService.baseUrl, p.username)
        : '${_apiService.baseUrl}/connect/${p.username}';

    return Scaffold(
      backgroundColor:
          _isLight ? const Color(0xFFF8FAFC) : const Color(0xFF0A0A0F),
      body: SafeArea(
        bottom: false,
        child: RefreshIndicator(
          onRefresh: _loadDashboardData,
          color: const Color(0xFF0052FF),
          child: SingleChildScrollView(
            physics: const AlwaysScrollableScrollPhysics(
              parent: BouncingScrollPhysics(),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // ── 1. App Header (Tapfolio + Notification Bell) ────────────
                DashboardTopBar(
                  unreadNotifications: _unreadNotifications,
                  onNotificationTap: _openNotifications,
                ),

                const SizedBox(height: 4),

                // ── 2. Hero Identity & Live Interactive Mini QR ─────────────
                HeroIdentityQrCard(
                  name: p.name.isNotEmpty
                      ? p.name
                      : ((_activeCard?.name.isNotEmpty == true &&
                              _activeCard!.name.toLowerCase() != 'my card')
                          ? _activeCard!.name
                          : 'Tapfolio User'),
                  avatar: _activeCard?.avatar ?? p.avatar,
                  baseUrl: _apiService.baseUrl,
                  publicUrl: publicLink,
                  isOnline: p.isOnline,
                  onProfileTap: _openProfilePreview,
                  onQrTap: _openDirectQrDialog,
                ),

                // ── 3. My Card Preview Container (Dual-Tone Card) ───────────
                MyCardPreviewCard(
                  profile: p,
                  card: _activeCard,
                  isLeadCaptureEnabled: _leadCaptureEnabled,
                  onToggleLeadCapture: (val) {
                    setState(() => _leadCaptureEnabled = val);
                    if (_activeCard != null) {
                      _apiService.toggleCardLeadCapture(_activeCard!.id, val);
                    }
                  },
                  onPreviewTap: _openProfilePreview,
                  onOptionsTap: _openManageCards,
                  onAddSocialTap: _openManageSocials,
                ),

                // ── 4. Primary Actions Grid (Share, Analytics, Preview, Cards) ─
                PrimaryActionGrid(
                  onShareTap: _openShareDialog,
                  onAnalyticsTap: _openAnalytics,
                  onPreviewTap: _openProfilePreview,
                  onManageCardsTap: _openManageCards,
                ),

                // ── 5. Discover Connections Section ─────────────────────────
                DiscoverConnectionsRow(
                  discoverUsers: _discoverCtrl.discoverUsers,
                  connectedUserIds: _discoverCtrl.connectedUserIds,
                  connectingUserIds: _discoverCtrl.connectingUserIds,
                  baseUrl: _apiService.baseUrl,
                  isLoading: _loading && _discoverCtrl.discoverUsers.isEmpty,
                  onViewAllTap: _openDiscoverConnectionsScreen,
                  onUserTap: _onDiscoverUserSelected,
                  onConnectTap: (user) => _discoverCtrl.connectUser(user, context),
                ),

                // ── 6. Instant Share Promo Banner (Direct QR & URL Link) ────
                InstantShareBanner(
                  onShareNowTap: _openDirectQrDialog,
                ),

                const SizedBox(height: 36),
              ],
            ),
          ),
        ),
      ),
    );
  }

  // Open full-screen Discover Connections
  void _openDiscoverConnectionsScreen() {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => DiscoverConnectionsScreen(controller: _discoverCtrl),
      ),
    );
  }
}

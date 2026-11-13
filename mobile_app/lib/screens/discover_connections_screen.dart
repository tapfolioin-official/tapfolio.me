import 'dart:math';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:share_plus/share_plus.dart';

import '../core/widgets/discover_connections_controller.dart';
import 'dashboard/widgets/discover_connections_row.dart';
import '../core/utils/image_helper.dart';
import 'profile_view_screen.dart';

class DiscoverConnectionsScreen extends StatefulWidget {
  final DiscoverConnectionsController controller;

  const DiscoverConnectionsScreen({
    super.key,
    required this.controller,
  });

  @override
  State<DiscoverConnectionsScreen> createState() =>
      _DiscoverConnectionsScreenState();
}

class _DiscoverConnectionsScreenState
    extends State<DiscoverConnectionsScreen> {
  final TextEditingController _searchCtrl = TextEditingController();
  String _activeFilter = 'All';

  bool get _isLight => Theme.of(context).brightness == Brightness.light;
  Color get _titleColor =>
      _isLight ? const Color(0xFF0F172A) : Colors.white;
  Color get _subColor => _isLight
      ? const Color(0xFF64748B)
      : Colors.white.withValues(alpha: 0.50);
  Color get _borderColor => _isLight
      ? const Color(0xFFE2E8F0)
      : Colors.white.withValues(alpha: 0.08);
  Color get _bgColor =>
      _isLight ? const Color(0xFFF8FAFC) : const Color(0xFF0A0A0F);

  @override
  void initState() {
    super.initState();
    widget.controller.addListener(_onControllerChanged);
  }

  @override
  void dispose() {
    widget.controller.removeListener(_onControllerChanged);
    _searchCtrl.dispose();
    super.dispose();
  }

  void _onControllerChanged() {
    if (mounted) setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    final users = widget.controller.filteredUsers;

    return Scaffold(
      backgroundColor: _bgColor,
      body: SafeArea(
        bottom: false,
        child: RefreshIndicator(
          onRefresh: widget.controller.refresh,
          color: const Color(0xFF5B4CFF),
          child: CustomScrollView(
            physics: const AlwaysScrollableScrollPhysics(
                parent: BouncingScrollPhysics()),
            slivers: [
              // ── Header ────────────────────────────────────────────────
              SliverToBoxAdapter(child: _buildHeader()),

              // ── Search bar ────────────────────────────────────────────
              SliverToBoxAdapter(child: _buildSearchBar()),

              // ── Filter chips ──────────────────────────────────────────
              SliverToBoxAdapter(child: _buildFilterChips()),

              // ── Grow Your Network Stats Card ──────────────────────────
              SliverToBoxAdapter(child: _buildStatsCard(users)),

              // ── Top Picks for You Header ──────────────────────────────
              SliverToBoxAdapter(child: _buildTopPicksHeader()),

              // ── Empty state ───────────────────────────────────────────
              if (users.isEmpty)
                SliverFillRemaining(
                  hasScrollBody: false,
                  child: _buildEmptyState(),
                )
              else
                // ── User cards list ─────────────────────────────────────
                SliverPadding(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 16, vertical: 0),
                  sliver: SliverList(
                    delegate: SliverChildBuilderDelegate(
                      (context, index) {
                        final user = users[index];
                        final isConnected = widget
                            .controller.connectedUserIds
                            .contains(user.userId);
                        final isConnecting = widget
                            .controller.connectingUserIds
                            .contains(user.userId);
                        return _DiscoverUserCard(
                          user: user,
                          isConnected: isConnected,
                          isConnecting: isConnecting,
                          baseUrl: widget.controller.apiService.baseUrl,
                          isLight: _isLight,
                          onProfileTap: () {
                            HapticFeedback.lightImpact();
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (_) => ProfileViewScreen(
                                  userId: user.userId,
                                  username: user.username,
                                ),
                              ),
                            );
                          },
                          onConnectTap: () {
                            HapticFeedback.lightImpact();
                            widget.controller.connectUser(user, context);
                          },
                        );
                      },
                      childCount: users.length,
                    ),
                  ),
                ),

              // ── Invite Banner ─────────────────────────────────────────
              SliverToBoxAdapter(child: _buildInviteBanner()),

              // Bottom padding for nav bar
              const SliverToBoxAdapter(child: SizedBox(height: 100)),
            ],
          ),
        ),
      ),
    );
  }

  // ── Header ──────────────────────────────────────────────────────────────
  Widget _buildHeader() {
    return Padding(
      padding: const EdgeInsets.fromLTRB(6, 8, 16, 0),
      child: Row(
        children: [
          IconButton(
            icon: Icon(Icons.arrow_back_ios_rounded,
                color: _titleColor, size: 20),
            onPressed: () => Navigator.of(context).pop(),
          ),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Text(
                      'Discover Connections ',
                      style: GoogleFonts.outfit(
                        color: _titleColor,
                        fontSize: 22,
                        fontWeight: FontWeight.w800,
                        letterSpacing: -0.3,
                      ),
                    ),
                    const Text('✨', style: TextStyle(fontSize: 20)),
                  ],
                ),
                const SizedBox(height: 2),
                Text(
                  'Find amazing people and grow your network',
                  style: GoogleFonts.outfit(
                    color: _subColor,
                    fontSize: 13,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ),
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: _isLight
                  ? const Color(0xFFF0EDFF)
                  : Colors.white.withValues(alpha: 0.06),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(
                color: const Color(0xFF5B4CFF).withValues(alpha: 0.20),
              ),
            ),
            child: IconButton(
              icon: Icon(
                Icons.tune_rounded,
                color: const Color(0xFF5B4CFF),
                size: 20,
              ),
              padding: EdgeInsets.zero,
              onPressed: () {
                HapticFeedback.lightImpact();
                // Filter options sheet
              },
            ),
          ),
        ],
      ),
    );
  }

  // ── Search bar ──────────────────────────────────────────────────────────
  Widget _buildSearchBar() {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
      child: Container(
        decoration: BoxDecoration(
          color: _isLight ? Colors.white : const Color(0xFF13131F),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: _borderColor),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: _isLight ? 0.04 : 0.15),
              blurRadius: 10,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: TextField(
          controller: _searchCtrl,
          style: GoogleFonts.outfit(color: _titleColor, fontSize: 14),
          decoration: InputDecoration(
            hintText: 'Search by name, username, skill or company...',
            hintStyle: GoogleFonts.outfit(color: _subColor, fontSize: 13.5),
            prefixIcon: Icon(Icons.search_rounded,
                color: _subColor, size: 20),
            suffixIcon: _searchCtrl.text.isNotEmpty
                ? IconButton(
                    icon: Icon(Icons.close_rounded,
                        color: _subColor, size: 18),
                    onPressed: () {
                      _searchCtrl.clear();
                      widget.controller.filter('');
                      setState(() {});
                    },
                  )
                : null,
            border: InputBorder.none,
            contentPadding:
                const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
          ),
          onChanged: (value) {
            widget.controller.filter(value);
            setState(() {});
          },
        ),
      ),
    );
  }

  // ── Filter chips ────────────────────────────────────────────────────────
  Widget _buildFilterChips() {
    final filters = ['All', 'Category', 'Location', 'Skills'];

    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 8, 0, 8),
      child: SizedBox(
        height: 40,
        child: ListView(
          scrollDirection: Axis.horizontal,
          physics: const BouncingScrollPhysics(),
          children: [
            ...filters.map((f) => Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: _FilterChip(
                    label: f,
                    isActive: _activeFilter == f,
                    hasDropdown: f != 'All',
                    isLight: _isLight,
                    onTap: () {
                      HapticFeedback.selectionClick();
                      setState(() => _activeFilter = f);
                    },
                  ),
                )),
            // Sort chip
            Padding(
              padding: const EdgeInsets.only(right: 16),
              child: _FilterChip(
                label: 'Sort\nRecommended',
                isActive: false,
                hasDropdown: true,
                isSortChip: true,
                isLight: _isLight,
                onTap: () {
                  HapticFeedback.selectionClick();
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ── Stats card ──────────────────────────────────────────────────────────
  Widget _buildStatsCard(List<DiscoverUserItem> users) {
    final discoveredCount = users.length;
    final mutualTotal = users.fold<int>(0, (sum, u) => sum + u.mutualCount);

    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 8, 16, 12),
      child: Container(
        padding: const EdgeInsets.all(18),
        decoration: BoxDecoration(
          gradient: const LinearGradient(
            colors: [Color(0xFF6C5CE7), Color(0xFF8B7CF7)],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
          borderRadius: BorderRadius.circular(20),
          boxShadow: [
            BoxShadow(
              color: const Color(0xFF6C5CE7).withValues(alpha: 0.35),
              blurRadius: 20,
              offset: const Offset(0, 8),
            ),
          ],
        ),
        child: Row(
          children: [
            // Left icon
            Container(
              width: 48,
              height: 48,
              decoration: BoxDecoration(
                color: Colors.white.withValues(alpha: 0.18),
                borderRadius: BorderRadius.circular(14),
              ),
              child: const Icon(Icons.people_alt_rounded,
                  color: Colors.white, size: 26),
            ),
            const SizedBox(width: 16),

            // Stats columns
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Grow Your Network',
                    style: GoogleFonts.outfit(
                      color: Colors.white,
                      fontSize: 14,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                  const SizedBox(height: 10),
                  Row(
                    children: [
                      _StatColumn(
                          value: '$discoveredCount',
                          label: 'People\ndiscovered'),
                      const SizedBox(width: 20),
                      _StatColumn(
                          value: '${min(discoveredCount, 36)}',
                          label: 'New this\nweek'),
                      const SizedBox(width: 20),
                      _StatColumn(
                          value: '$mutualTotal',
                          label: 'Mutual\nconnections'),
                    ],
                  ),
                ],
              ),
            ),

            // See Insights button
            Container(
              padding:
                  const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    'See Insights',
                    style: GoogleFonts.outfit(
                      color: const Color(0xFF6C5CE7),
                      fontSize: 11,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                  const SizedBox(width: 4),
                  const Icon(Icons.arrow_forward_ios_rounded,
                      color: Color(0xFF6C5CE7), size: 10),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ── Top Picks for You Header ────────────────────────────────────────────
  Widget _buildTopPicksHeader() {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 4, 16, 4),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  const Text('🔥', style: TextStyle(fontSize: 18)),
                  const SizedBox(width: 6),
                  Text(
                    'Top Picks for You',
                    style: GoogleFonts.outfit(
                      color: _titleColor,
                      fontSize: 17,
                      fontWeight: FontWeight.w800,
                      letterSpacing: -0.2,
                    ),
                  ),
                ],
              ),
              Row(
                children: [
                  Text(
                    'View All',
                    style: GoogleFonts.outfit(
                      color: const Color(0xFF5B4CFF),
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  const SizedBox(width: 2),
                  const Icon(Icons.chevron_right_rounded,
                      color: Color(0xFF5B4CFF), size: 18),
                ],
              ),
            ],
          ),
          const SizedBox(height: 2),
          Text(
            'People you may know and want to connect with',
            style: GoogleFonts.outfit(
              color: _subColor,
              fontSize: 12,
              fontWeight: FontWeight.w500,
            ),
          ),
          const SizedBox(height: 12),
        ],
      ),
    );
  }

  // ── Empty state ─────────────────────────────────────────────────────────
  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(Icons.person_search_rounded,
              color: _subColor, size: 56),
          const SizedBox(height: 12),
          Text(
            _searchCtrl.text.isNotEmpty
                ? 'No users found for "${_searchCtrl.text}"'
                : 'No connections to discover',
            style: GoogleFonts.outfit(
              color: _subColor,
              fontSize: 14,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }

  // ── Invite Banner ───────────────────────────────────────────────────────
  Widget _buildInviteBanner() {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 8, 16, 0),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        decoration: BoxDecoration(
          gradient: const LinearGradient(
            colors: [Color(0xFF5B4CFF), Color(0xFF7C6FFF)],
            begin: Alignment.centerLeft,
            end: Alignment.centerRight,
          ),
          borderRadius: BorderRadius.circular(18),
          boxShadow: [
            BoxShadow(
              color: const Color(0xFF5B4CFF).withValues(alpha: 0.30),
              blurRadius: 16,
              offset: const Offset(0, 6),
            ),
          ],
        ),
        child: Row(
          children: [
            Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                color: Colors.white.withValues(alpha: 0.18),
                borderRadius: BorderRadius.circular(12),
              ),
              child: const Icon(Icons.person_add_alt_1_rounded,
                  color: Colors.white, size: 22),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Invite your friends',
                    style: GoogleFonts.outfit(
                      color: Colors.white,
                      fontSize: 14,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                  Text(
                    'Grow your network faster',
                    style: GoogleFonts.outfit(
                      color: Colors.white.withValues(alpha: 0.75),
                      fontSize: 11.5,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
              ),
            ),
            GestureDetector(
              onTap: () {
                HapticFeedback.lightImpact();
                Share.share(
                  'Join me on Tapfolio! Create your digital card: ${widget.controller.apiService.baseUrl}',
                  subject: 'Join Tapfolio',
                );
              },
              child: Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      'Invite Now',
                      style: GoogleFonts.outfit(
                        color: const Color(0xFF5B4CFF),
                        fontSize: 12.5,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                    const SizedBox(width: 4),
                    const Icon(Icons.send_rounded,
                        color: Color(0xFF5B4CFF), size: 14),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ── Stat column for the stats card ──────────────────────────────────────
class _StatColumn extends StatelessWidget {
  final String value;
  final String label;

  const _StatColumn({required this.value, required this.label});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          value,
          style: GoogleFonts.outfit(
            color: Colors.white,
            fontSize: 20,
            fontWeight: FontWeight.w800,
          ),
        ),
        Text(
          label,
          style: GoogleFonts.outfit(
            color: Colors.white.withValues(alpha: 0.70),
            fontSize: 9.5,
            fontWeight: FontWeight.w500,
            height: 1.3,
          ),
        ),
      ],
    );
  }
}

// ── Filter chip ─────────────────────────────────────────────────────────
class _FilterChip extends StatelessWidget {
  final String label;
  final bool isActive;
  final bool hasDropdown;
  final bool isSortChip;
  final bool isLight;
  final VoidCallback onTap;

  const _FilterChip({
    required this.label,
    required this.isActive,
    this.hasDropdown = false,
    this.isSortChip = false,
    required this.isLight,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final activeColor = const Color(0xFF5B4CFF);

    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: EdgeInsets.symmetric(
            horizontal: isSortChip ? 12 : 14, vertical: 6),
        decoration: BoxDecoration(
          color: isActive
              ? activeColor
              : (isLight ? Colors.white : const Color(0xFF13131F)),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: isActive
                ? activeColor
                : (isLight
                    ? const Color(0xFFE2E8F0)
                    : Colors.white.withValues(alpha: 0.10)),
          ),
          boxShadow: isActive
              ? [
                  BoxShadow(
                    color: activeColor.withValues(alpha: 0.25),
                    blurRadius: 8,
                    offset: const Offset(0, 2),
                  )
                ]
              : null,
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              isSortChip ? 'Sort' : label,
              style: GoogleFonts.outfit(
                color: isActive
                    ? Colors.white
                    : (isLight
                        ? const Color(0xFF374151)
                        : Colors.white.withValues(alpha: 0.70)),
                fontSize: 12.5,
                fontWeight: isActive ? FontWeight.w700 : FontWeight.w600,
              ),
            ),
            if (hasDropdown && !isSortChip) ...[
              const SizedBox(width: 4),
              Icon(
                Icons.keyboard_arrow_down_rounded,
                color: isActive
                    ? Colors.white
                    : (isLight
                        ? const Color(0xFF64748B)
                        : Colors.white.withValues(alpha: 0.50)),
                size: 16,
              ),
            ],
            if (isSortChip) ...[
              const SizedBox(width: 2),
              Text(
                '\nRecommended',
                style: GoogleFonts.outfit(
                  color: isLight
                      ? const Color(0xFF64748B)
                      : Colors.white.withValues(alpha: 0.50),
                  fontSize: 9,
                  fontWeight: FontWeight.w500,
                  height: 1.1,
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}

// ── Full‑width user card matching reference design ──────────────────────
class _DiscoverUserCard extends StatelessWidget {
  final DiscoverUserItem user;
  final bool isConnected;
  final bool isConnecting;
  final String baseUrl;
  final bool isLight;
  final VoidCallback onProfileTap;
  final VoidCallback onConnectTap;

  const _DiscoverUserCard({
    required this.user,
    required this.isConnected,
    required this.isConnecting,
    required this.baseUrl,
    required this.isLight,
    required this.onProfileTap,
    required this.onConnectTap,
  });

  Color get _titleColor =>
      isLight ? const Color(0xFF0F172A) : Colors.white;
  Color get _subColor => isLight
      ? const Color(0xFF64748B)
      : Colors.white.withValues(alpha: 0.55);
  Color get _cardBg =>
      isLight ? Colors.white : const Color(0xFF13131F);
  Color get _borderColor => isLight
      ? const Color(0xFFE2E8F0)
      : Colors.white.withValues(alpha: 0.08);

  @override
  Widget build(BuildContext context) {
    final avatarProvider = getAvatarImage(user.avatar, baseUrl);
    final displayTags = user.tags.take(3).toList();
    final extraTagCount =
        user.tags.length > 3 ? user.tags.length - 3 : 0;

    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: InkWell(
        onTap: onProfileTap,
        borderRadius: BorderRadius.circular(20),
        child: Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: _cardBg,
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: _borderColor, width: 1),
            boxShadow: [
              BoxShadow(
                color: Colors.black
                    .withValues(alpha: isLight ? 0.04 : 0.20),
                blurRadius: 14,
                offset: const Offset(0, 3),
              ),
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // ── Top row: Avatar + Info + Connect + Menu ────────────
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Avatar with online dot
                  Stack(
                    clipBehavior: Clip.none,
                    children: [
                      CircleAvatar(
                        radius: 28,
                        backgroundColor: isLight
                            ? const Color(0xFFE2E8F0)
                            : const Color(0xFF1E293B),
                        backgroundImage: avatarProvider,
                      ),
                      Positioned(
                        bottom: 1,
                        right: 1,
                        child: Container(
                          width: 12,
                          height: 12,
                          decoration: BoxDecoration(
                            color: const Color(0xFF10B981),
                            shape: BoxShape.circle,
                            border: Border.all(
                              color: _cardBg,
                              width: 2,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(width: 12),

                  // Name + role + location
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Name + Premium badge
                        Row(
                          children: [
                            Flexible(
                              child: Text(
                                user.name,
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: GoogleFonts.outfit(
                                  color: _titleColor,
                                  fontSize: 15.5,
                                  fontWeight: FontWeight.w700,
                                ),
                              ),
                            ),
                            if (user.isPremium) ...[
                              const SizedBox(width: 6),
                              Container(
                                padding: const EdgeInsets.symmetric(
                                    horizontal: 8, vertical: 2.5),
                                decoration: BoxDecoration(
                                  gradient: const LinearGradient(
                                    colors: [
                                      Color(0xFF5B4CFF),
                                      Color(0xFF7C6FFF)
                                    ],
                                  ),
                                  borderRadius:
                                      BorderRadius.circular(8),
                                ),
                                child: Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    const Icon(
                                        Icons.verified_rounded,
                                        color: Colors.white,
                                        size: 10),
                                    const SizedBox(width: 3),
                                    Text(
                                      'Premium',
                                      style: GoogleFonts.outfit(
                                        color: Colors.white,
                                        fontSize: 9.5,
                                        fontWeight: FontWeight.w700,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ],
                        ),
                        const SizedBox(height: 3),

                        // Tagline / role
                        Text(
                          user.tagline,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: GoogleFonts.outfit(
                            color: _subColor,
                            fontSize: 12.5,
                            fontWeight: FontWeight.w500,
                          ),
                        ),

                        // Location
                        if (user.location != null &&
                            user.location!.isNotEmpty) ...[
                          const SizedBox(height: 3),
                          Row(
                            children: [
                              Icon(Icons.location_on_outlined,
                                  color: _subColor, size: 13),
                              const SizedBox(width: 3),
                              Flexible(
                                child: Text(
                                  user.location!,
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                  style: GoogleFonts.outfit(
                                    color: _subColor,
                                    fontSize: 11.5,
                                    fontWeight: FontWeight.w500,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ],
                    ),
                  ),

                  const SizedBox(width: 8),

                  // Connect button + menu
                  Column(
                    children: [
                      // Connect / Connected button
                      GestureDetector(
                        onTap: isConnected || isConnecting
                            ? null
                            : onConnectTap,
                        child: AnimatedContainer(
                          duration: const Duration(milliseconds: 250),
                          width: 38,
                          height: 38,
                          decoration: BoxDecoration(
                            color: isConnected
                                ? Colors.transparent
                                : Colors.transparent,
                            shape: BoxShape.circle,
                            border: Border.all(
                              color: isConnected
                                  ? const Color(0xFF10B981)
                                  : const Color(0xFF5B4CFF),
                              width: 2,
                            ),
                          ),
                          alignment: Alignment.center,
                          child: isConnecting
                              ? SizedBox(
                                  width: 16,
                                  height: 16,
                                  child: CircularProgressIndicator(
                                    strokeWidth: 2,
                                    color: const Color(0xFF5B4CFF),
                                  ),
                                )
                              : Icon(
                                  isConnected
                                      ? Icons.check_rounded
                                      : Icons.add_rounded,
                                  color: isConnected
                                      ? const Color(0xFF10B981)
                                      : const Color(0xFF5B4CFF),
                                  size: 20,
                                ),
                        ),
                      ),
                      const SizedBox(height: 6),
                      // Three-dot menu
                      Icon(Icons.more_vert_rounded,
                          color: _subColor, size: 20),
                    ],
                  ),
                ],
              ),

              // ── Tags row ──────────────────────────────────────────
              if (displayTags.isNotEmpty) ...[
                const SizedBox(height: 10),
                Wrap(
                  spacing: 6,
                  runSpacing: 6,
                  children: [
                    ...displayTags.map((tag) => Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: isLight
                                ? const Color(0xFFF0EDFF)
                                : const Color(0xFF5B4CFF)
                                    .withValues(alpha: 0.12),
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(
                              color: const Color(0xFF5B4CFF)
                                  .withValues(alpha: 0.15),
                            ),
                          ),
                          child: Text(
                            tag,
                            style: GoogleFonts.outfit(
                              color: const Color(0xFF5B4CFF),
                              fontSize: 11,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        )),
                    if (extraTagCount > 0)
                      Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: isLight
                              ? const Color(0xFFE2E8F0)
                              : Colors.white.withValues(alpha: 0.06),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          '+$extraTagCount',
                          style: GoogleFonts.outfit(
                            color: _subColor,
                            fontSize: 11,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
                  ],
                ),
              ],

              // ── Mutual connections row ─────────────────────────────
              if (user.mutualCount > 0) ...[
                const SizedBox(height: 10),
                Row(
                  children: [
                    // Stacked avatars
                    SizedBox(
                      width: 44,
                      height: 20,
                      child: Stack(
                        children: List.generate(
                          min(3, user.mutualCount),
                          (i) => Positioned(
                            left: i * 14.0,
                            child: Container(
                              width: 20,
                              height: 20,
                              decoration: BoxDecoration(
                                color: [
                                  const Color(0xFF6C5CE7),
                                  const Color(0xFF00B894),
                                  const Color(0xFFFDAA31),
                                ][i % 3],
                                shape: BoxShape.circle,
                                border: Border.all(
                                    color: _cardBg, width: 1.5),
                              ),
                              child: Center(
                                child: Icon(
                                    Icons.person_rounded,
                                    color: Colors.white,
                                    size: 10),
                              ),
                            ),
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Text(
                      '${user.mutualCount} mutual connections',
                      style: GoogleFonts.outfit(
                        color: _subColor,
                        fontSize: 11.5,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ],
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}

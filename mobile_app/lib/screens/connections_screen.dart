import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:url_launcher/url_launcher.dart';
import '../models/connection.dart';
import '../models/pending_request.dart';
import '../services/api_service.dart';
import '../widgets/connection_permission_sheet.dart';
import '../core/utils/color_parser.dart';
import '../core/utils/image_helper.dart';
import '../widgets/connection_visibility_sheet.dart';
import 'analytics_screen.dart';

class ConnectionsScreen extends StatefulWidget {
  const ConnectionsScreen({super.key});

  @override
  State<ConnectionsScreen> createState() => _ConnectionsScreenState();
}

class _ConnectionsScreenState extends State<ConnectionsScreen>
    with SingleTickerProviderStateMixin {
  final ApiService _api = ApiService();
  late TabController _tabController;

  final TextEditingController _searchController = TextEditingController();
  String _searchQuery = '';
  String _activeFilter = 'All';

  List<PendingRequest> _pending = [];
  List<Connection> _connections = [];
  bool _loadingPending = true;
  bool _loadingConnections = true;

  bool get _isLight => Theme.of(context).brightness == Brightness.light;
  Color get _textColor => _isLight ? const Color(0xFF1F2937) : Colors.white;
  Color get _subtitleColor => _isLight ? const Color(0xFF4B5563) : Colors.white60;
  Color get _cardBg => _isLight ? Colors.white : Colors.white.withValues(alpha: 0.03);
  Color get _cardBorder => _isLight ? Colors.black12 : Colors.white.withValues(alpha: 0.06);

  Timer? _refreshTimer;

  _ConnectionsScreenState() {
    debugPrint('[TRACE-CONNECTIONS] State constructor called.');
  }

  @override
  void initState() {
    debugPrint('[TRACE-CONNECTIONS] initState() started.');
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    _refresh();

    // Start background sync polling every 15 seconds for real-time request status
    _refreshTimer = Timer.periodic(const Duration(seconds: 15), (_) {
      _silentRefresh();
    });
    debugPrint('[TRACE-CONNECTIONS] initState() completed.');
  }

  @override
  void dispose() {
    _refreshTimer?.cancel();
    _tabController.dispose();
    _searchController.dispose();
    _requestPageCtrl.dispose();
    super.dispose();
  }

  Future<void> _silentRefresh() async {
    final results = await Future.wait([
      _api.getPendingRequests(),
      _api.getConnections(),
    ]);
    if (!mounted) return;
    setState(() {
      _pending = results[0] as List<PendingRequest>;
      _connections = results[1] as List<Connection>;
    });
  }

  Future<void> _refresh() async {
    setState(() { _loadingPending = true; _loadingConnections = true; });
    final results = await Future.wait([
      _api.getPendingRequests(),
      _api.getConnections(),
    ]);
    if (!mounted) return;
    setState(() {
      _pending = results[0] as List<PendingRequest>;
      _connections = results[1] as List<Connection>;
      _loadingPending = false;
      _loadingConnections = false;
    });
  }

  Future<void> _accept(PendingRequest req) async {
    final result = await _api.acceptRequest(req.id);
    if (!mounted) return;
    if (result['success'] == true) {
      _refresh();
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Connection accepted!'), backgroundColor: Color(0xFF10b981)),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(result['error'] ?? 'Failed to accept request.'), backgroundColor: Colors.redAccent),
      );
    }
  }

  Future<void> _reject(PendingRequest req) async {
    final result = await _api.rejectRequest(req.id);
    if (!mounted) return;
    if (result['success'] == true) {
      _refresh();
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Request rejected.'), backgroundColor: Color(0xFF374151)),
      );
    }
  }

  void _showGlobalSharingSettings() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => const ConnectionPermissionSheet(),
    );
  }

  @override
  Widget build(BuildContext context) {
    debugPrint('[TRACE-CONNECTIONS] build() called.');
    return Scaffold(
      backgroundColor: _isLight ? const Color(0xFFF3F4F6) : const Color(0xFF06070D),
      appBar: AppBar(
        backgroundColor: _isLight ? Colors.white : const Color(0xFF0F1122),
        elevation: 0,
        automaticallyImplyLeading: false,
        title: Text(
          'Connections',
          style: GoogleFonts.outfit(
            fontSize: 22,
            fontWeight: FontWeight.w800,
            color: _textColor,
          ),
        ),
        actions: [
          IconButton(
            icon: Icon(Icons.settings_outlined, color: _isLight ? const Color(0xFF374151) : Colors.white70),
            onPressed: _showGlobalSharingSettings,
          ),
          IconButton(
            icon: Icon(Icons.refresh_rounded, color: _isLight ? const Color(0xFF374151) : Colors.white70),
            onPressed: _refresh,
          ),
        ],
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(56),
          child: Padding(
            padding: const EdgeInsets.only(left: 16, right: 16, bottom: 12),
            child: Container(
              height: 44,
              decoration: BoxDecoration(
                color: _isLight ? const Color(0xFFF3F4F6) : const Color(0xFF1E293B),
                borderRadius: BorderRadius.circular(12),
              ),
              child: TabBar(
                controller: _tabController,
                indicator: BoxDecoration(
                  borderRadius: BorderRadius.circular(10),
                  color: const Color(0xFF0052FF),
                  boxShadow: [
                    BoxShadow(
                      color: const Color(0xFF0052FF).withValues(alpha: 0.25),
                      blurRadius: 8,
                      offset: const Offset(0, 2),
                    )
                  ],
                ),
                indicatorSize: TabBarIndicatorSize.tab,
                labelColor: Colors.white,
                unselectedLabelColor: _isLight ? const Color(0xFF6B7280) : const Color(0xFF9CA3AF),
                labelStyle: GoogleFonts.outfit(fontWeight: FontWeight.bold, fontSize: 14),
                unselectedLabelStyle: GoogleFonts.outfit(fontWeight: FontWeight.w500, fontSize: 14),
                dividerColor: Colors.transparent,
                tabs: [
                  const Tab(text: 'My Connections'),
                  Tab(
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Text('Requests'),
                        if (_pending.isNotEmpty) ...[
                          const SizedBox(width: 6),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                            decoration: BoxDecoration(
                              color: Colors.redAccent,
                              borderRadius: BorderRadius.circular(10),
                            ),
                            child: Text(
                              '${_pending.length}',
                              style: GoogleFonts.outfit(
                                color: Colors.white,
                                fontSize: 10,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
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
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildConnectionsTab(),
          _buildPendingTab(),
        ],
      ),
    );
  }

  // ─── Pending Requests Tab ─────────────────────────────────────────────────

  int _currentRequestIndex = 0;
  late final PageController _requestPageCtrl = PageController();

  Widget _buildPendingTab() {
    if (_loadingPending) {
      return const Center(child: CircularProgressIndicator(color: Color(0xFF0052FF)));
    }
    if (_pending.isEmpty) {
      return _emptyState(Icons.inbox_outlined, 'No pending requests', 'When someone wants to connect, it\'ll show up here.');
    }
    return RefreshIndicator(
      color: const Color(0xFF0052FF),
      onRefresh: _refresh,
      child: SingleChildScrollView(
        physics: const AlwaysScrollableScrollPhysics(parent: BouncingScrollPhysics()),
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // ── "Connection Request" header with counter & arrows ──────
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Connection Request',
                  style: GoogleFonts.outfit(
                    color: _textColor,
                    fontSize: 17,
                    fontWeight: FontWeight.w800,
                    letterSpacing: -0.2,
                  ),
                ),
                Row(
                  children: [
                    Text(
                      '${_currentRequestIndex + 1} of ${_pending.length}',
                      style: GoogleFonts.outfit(
                        color: _subtitleColor,
                        fontSize: 13,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    const SizedBox(width: 8),
                    _navArrow(Icons.chevron_left_rounded, () {
                      if (_currentRequestIndex > 0) {
                        _requestPageCtrl.previousPage(
                          duration: const Duration(milliseconds: 300),
                          curve: Curves.easeInOut,
                        );
                      }
                    }),
                    const SizedBox(width: 4),
                    _navArrow(Icons.chevron_right_rounded, () {
                      if (_currentRequestIndex < _pending.length - 1) {
                        _requestPageCtrl.nextPage(
                          duration: const Duration(milliseconds: 300),
                          curve: Curves.easeInOut,
                        );
                      }
                    }),
                  ],
                ),
              ],
            ),
            const SizedBox(height: 14),

            // ── Swipeable request cards ────────────────────────────────
            SizedBox(
              height: _calculateCardHeight(_pending[_currentRequestIndex]),
              child: PageView.builder(
                controller: _requestPageCtrl,
                itemCount: _pending.length,
                onPageChanged: (i) => setState(() => _currentRequestIndex = i),
                itemBuilder: (_, i) => _buildRequestCard(_pending[i]),
              ),
            ),
          ],
        ),
      ),
    );
  }

  double _calculateCardHeight(PendingRequest req) {
    final visibleTags = req.requesterTags.where((t) => t.text.trim().isNotEmpty).toList();
    final roleTags = visibleTags.where((t) => t.type != 'location').toList();
    final locTags = visibleTags.where((t) => t.type == 'location').toList();
    double h = 480; // base height
    if (req.requesterTagline.isNotEmpty) h += 40; // about section
    if (roleTags.length > 4) h += 34; // extra tag row
    if (locTags.isNotEmpty) h += 10;
    return h;
  }

  Widget _navArrow(IconData icon, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 30,
        height: 30,
        decoration: BoxDecoration(
          color: _isLight ? const Color(0xFFF3F4F6) : Colors.white.withValues(alpha: 0.06),
          borderRadius: BorderRadius.circular(8),
          border: Border.all(color: _cardBorder),
        ),
        child: Icon(icon, color: _subtitleColor, size: 20),
      ),
    );
  }

  Widget _buildRequestCard(PendingRequest req) {
    final visibleTags = req.requesterTags.where((t) => t.text.trim().isNotEmpty).toList();
    final roleTags = visibleTags.where((t) => t.type != 'location').toList();
    final locTags = visibleTags.where((t) => t.type == 'location').toList();
    final locationText = locTags.isNotEmpty ? locTags.first.text : null;

    // Extract role from tagline (e.g. "Full-Stack Developer")
    final roleText = req.requesterTagline.isNotEmpty
        ? req.requesterTagline.split('•').first.trim().split('|').first.trim()
        : (roleTags.isNotEmpty ? roleTags.first.text : null);

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
      decoration: BoxDecoration(
        color: _cardBg,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: _cardBorder),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: _isLight ? 0.04 : 0.18),
            blurRadius: 20,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Column(
        children: [
          // ── Avatar ──────────────────────────────────────────────────
          CircleAvatar(
            radius: 44,
            backgroundImage: getAvatarImage(req.requesterAvatar, _api.baseUrl),
            backgroundColor: _cardBorder,
          ),
          const SizedBox(height: 14),

          // ── Name ────────────────────────────────────────────────────
          Text(
            req.requesterName,
            textAlign: TextAlign.center,
            style: GoogleFonts.outfit(
              color: _textColor,
              fontWeight: FontWeight.w800,
              fontSize: 20,
              letterSpacing: -0.3,
            ),
          ),
          if (req.requesterTagline.isNotEmpty) ...[
            const SizedBox(height: 3),
            Text(
              req.requesterTagline,
              textAlign: TextAlign.center,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: GoogleFonts.outfit(
                color: _subtitleColor,
                fontSize: 13.5,
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
          const SizedBox(height: 16),

          // ── Stats row (Score / Mutual / Taps) ───────────────────────
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              _buildStatPill(
                icon: Icons.diamond_outlined,
                value: req.requesterDiamonds,
                label: 'Score',
                color: const Color(0xFFFF6B6B),
              ),
              const SizedBox(width: 10),
              _buildStatPill(
                icon: Icons.people_alt_rounded,
                value: '${req.requesterConnectionCount}',
                label: 'Mutual',
                color: const Color(0xFF5B4CFF),
              ),
              const SizedBox(width: 10),
              _buildStatPill(
                icon: Icons.bolt_rounded,
                value: '${req.requesterTapCount}',
                label: 'Taps',
                color: const Color(0xFF10B981),
              ),
            ],
          ),
          const SizedBox(height: 16),

          // ── Role + Location pills ───────────────────────────────────
          if (roleText != null || locationText != null)
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
              decoration: BoxDecoration(
                color: _isLight
                    ? const Color(0xFFF8FAFC)
                    : Colors.white.withValues(alpha: 0.03),
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: _cardBorder),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  if (roleText != null) ...[
                    Icon(Icons.work_outline_rounded,
                        size: 14, color: _subtitleColor),
                    const SizedBox(width: 6),
                    Flexible(
                      child: Text(
                        roleText,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: GoogleFonts.outfit(
                          color: _textColor,
                          fontSize: 12.5,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  ],
                  if (roleText != null && locationText != null) ...[
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 10),
                      child: Container(
                        width: 1,
                        height: 16,
                        color: _cardBorder,
                      ),
                    ),
                  ],
                  if (locationText != null) ...[
                    Icon(Icons.location_on_outlined,
                        size: 14, color: _subtitleColor),
                    const SizedBox(width: 4),
                    Flexible(
                      child: Text(
                        locationText,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: GoogleFonts.outfit(
                          color: _textColor,
                          fontSize: 12.5,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  ],
                ],
              ),
            ),

          // ── About section ───────────────────────────────────────────
          if (req.requesterTagline.isNotEmpty) ...[
            const SizedBox(height: 16),
            Align(
              alignment: Alignment.centerLeft,
              child: Text(
                'About',
                style: GoogleFonts.outfit(
                  color: _textColor,
                  fontSize: 15,
                  fontWeight: FontWeight.w800,
                ),
              ),
            ),
            const SizedBox(height: 6),
            Align(
              alignment: Alignment.centerLeft,
              child: Text(
                req.requesterTagline,
                maxLines: 3,
                overflow: TextOverflow.ellipsis,
                style: GoogleFonts.outfit(
                  color: _subtitleColor,
                  fontSize: 13,
                  height: 1.5,
                ),
              ),
            ),
          ],

          // ── Skills & Interests ──────────────────────────────────────
          if (roleTags.isNotEmpty) ...[
            const SizedBox(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Skills & Interests',
                  style: GoogleFonts.outfit(
                    color: _textColor,
                    fontSize: 15,
                    fontWeight: FontWeight.w800,
                  ),
                ),
                if (roleTags.length > 6)
                  Text(
                    'View all',
                    style: GoogleFonts.outfit(
                      color: const Color(0xFF5B4CFF),
                      fontSize: 12.5,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
              ],
            ),
            const SizedBox(height: 10),
            Wrap(
              spacing: 6,
              runSpacing: 6,
              children: roleTags.take(7).map((t) {
                final cleanText = t.text.isNotEmpty
                    ? t.text[0].toUpperCase() + t.text.substring(1)
                    : '';
                return Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                  decoration: BoxDecoration(
                    color: _isLight
                        ? const Color(0xFFF0EDFF)
                        : const Color(0xFF5B4CFF).withValues(alpha: 0.10),
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(
                      color: const Color(0xFF5B4CFF).withValues(alpha: 0.15),
                    ),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(Icons.description_outlined,
                          size: 12, color: const Color(0xFF5B4CFF)),
                      const SizedBox(width: 5),
                      Text(
                        cleanText,
                        style: GoogleFonts.outfit(
                          fontSize: 11.5,
                          color: const Color(0xFF5B4CFF),
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ),
                );
              }).toList(),
            ),
          ],

          // ── Mutual Connections ───────────────────────────────────────
          if (req.requesterConnectionCount > 0) ...[
            const SizedBox(height: 16),
            Row(
              children: [
                Text(
                  'Mutual Connections (${req.requesterConnectionCount})',
                  style: GoogleFonts.outfit(
                    color: _textColor,
                    fontSize: 14,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                const Spacer(),
                // Stacked avatar circles
                SizedBox(
                  width: 16.0 * 4 + 22,
                  height: 28,
                  child: Stack(
                    children: [
                      for (int i = 0; i < (req.requesterConnectionCount > 4 ? 4 : req.requesterConnectionCount); i++)
                        Positioned(
                          left: i * 16.0,
                          child: Container(
                            width: 28,
                            height: 28,
                            decoration: BoxDecoration(
                              color: [
                                const Color(0xFF6C5CE7),
                                const Color(0xFF00B894),
                                const Color(0xFFFDAA31),
                                const Color(0xFFE17055),
                              ][i % 4],
                              shape: BoxShape.circle,
                              border: Border.all(color: _cardBg, width: 2),
                            ),
                            child: const Center(
                              child: Icon(Icons.person_rounded,
                                  color: Colors.white, size: 14),
                            ),
                          ),
                        ),
                      if (req.requesterConnectionCount > 4)
                        Positioned(
                          left: 4 * 16.0,
                          child: Container(
                            width: 28,
                            height: 28,
                            decoration: BoxDecoration(
                              color: _isLight
                                  ? const Color(0xFFE2E8F0)
                                  : Colors.white.withValues(alpha: 0.10),
                              shape: BoxShape.circle,
                              border: Border.all(color: _cardBg, width: 2),
                            ),
                            child: Center(
                              child: Text(
                                '+${req.requesterConnectionCount - 4}',
                                style: GoogleFonts.outfit(
                                  color: _subtitleColor,
                                  fontSize: 9,
                                  fontWeight: FontWeight.w700,
                                ),
                              ),
                            ),
                          ),
                        ),
                    ],
                  ),
                ),
              ],
            ),
          ],

          const SizedBox(height: 20),

          // ── Reject / Accept buttons ─────────────────────────────────
          Row(
            children: [
              // Reject button (outlined red)
              Expanded(
                child: SizedBox(
                  height: 48,
                  child: OutlinedButton.icon(
                    onPressed: () => _reject(req),
                    icon: Icon(Icons.close_rounded,
                        size: 18,
                        color: const Color(0xFFEF4444)),
                    label: Text(
                      'Reject',
                      style: GoogleFonts.outfit(
                        fontWeight: FontWeight.w700,
                        fontSize: 14,
                        color: const Color(0xFFEF4444),
                      ),
                    ),
                    style: OutlinedButton.styleFrom(
                      side: BorderSide(
                        color: const Color(0xFFEF4444).withValues(alpha: 0.30),
                        width: 1.5,
                      ),
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(16)),
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              // Accept button (filled blue gradient)
              Expanded(
                flex: 2,
                child: Container(
                  height: 48,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(16),
                    gradient: const LinearGradient(
                      colors: [Color(0xFF5B4CFF), Color(0xFF7C6FFF)],
                      begin: Alignment.centerLeft,
                      end: Alignment.centerRight,
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: const Color(0xFF5B4CFF).withValues(alpha: 0.30),
                        blurRadius: 12,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: ElevatedButton.icon(
                    onPressed: () => _accept(req),
                    icon: const Icon(Icons.check_rounded,
                        size: 20, color: Colors.white),
                    label: Text(
                      'Accept',
                      style: GoogleFonts.outfit(
                        fontWeight: FontWeight.w700,
                        fontSize: 14,
                        color: Colors.white,
                      ),
                    ),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.transparent,
                      foregroundColor: Colors.white,
                      shadowColor: Colors.transparent,
                      elevation: 0,
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(16)),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildStatPill({
    required IconData icon,
    required String value,
    required String label,
    required Color color,
  }) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        color: _isLight
            ? const Color(0xFFF8FAFC)
            : Colors.white.withValues(alpha: 0.04),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: _cardBorder),
      ),
      child: Column(
        children: [
          Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(icon, size: 14, color: color),
              const SizedBox(width: 5),
              Text(
                value,
                style: GoogleFonts.outfit(
                  color: color,
                  fontSize: 15,
                  fontWeight: FontWeight.w800,
                ),
              ),
            ],
          ),
          const SizedBox(height: 2),
          Text(
            label,
            style: GoogleFonts.outfit(
              color: _subtitleColor,
              fontSize: 10.5,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }

  // ─── My Connections Tab ───────────────────────────────────────────────────

  // ─── My Connections Tab (Search, Filter, Stats & Insights) ───────────────

  Widget _buildConnectionsTab() {
    if (_loadingConnections) {
      return const Center(child: CircularProgressIndicator(color: Color(0xFF0052FF)));
    }
    if (_connections.isEmpty) {
      return _emptyState(Icons.people_outline, 'No connections yet', 'Start connecting by sharing your Tapfolio link or NFC card.');
    }

    final totalCount = _connections.length;
    final withContactCount = _connections
        .where((c) =>
            (c.other.phone != null && c.other.phone!.isNotEmpty) ||
            (c.other.whatsapp != null && c.other.whatsapp!.isNotEmpty) ||
            (c.other.email != null && c.other.email!.isNotEmpty))
        .length;
    final withLinksCount =
        _connections.where((c) => c.other.socials.isNotEmpty).length;

    // Filter connections
    final query = _searchQuery.trim().toLowerCase();
    final filtered = _connections.where((c) {
      final name = (c.other.name ?? '').toLowerCase();
      final tagline = c.other.tagline.toLowerCase();
      final location = (c.other.location ?? '').toLowerCase();
      final email = (c.other.email ?? '').toLowerCase();
      final tags = c.other.tags.map((t) => t.text.toLowerCase()).join(' ');

      final matchesQuery = query.isEmpty ||
          name.contains(query) ||
          tagline.contains(query) ||
          location.contains(query) ||
          email.contains(query) ||
          tags.contains(query);

      if (!matchesQuery) return false;

      switch (_activeFilter) {
        case 'Contacts':
          return (c.other.phone != null && c.other.phone!.isNotEmpty) ||
              (c.other.whatsapp != null && c.other.whatsapp!.isNotEmpty) ||
              (c.other.email != null && c.other.email!.isNotEmpty);
        case 'Links':
          return c.other.socials.isNotEmpty;
        case 'Recent':
          return DateTime.now().difference(c.connectedAt).inDays <= 30;
        default:
          return true;
      }
    }).toList();

    return RefreshIndicator(
      color: const Color(0xFF0052FF),
      onRefresh: _refresh,
      child: ListView(
        physics: const AlwaysScrollableScrollPhysics(
          parent: BouncingScrollPhysics(),
        ),
        padding: const EdgeInsets.only(bottom: 24),
        children: [
          // ── 1. Total Connections & View Insights Banner ──────────────────
          Container(
            margin: const EdgeInsets.fromLTRB(16, 14, 16, 10),
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [
                  Color(0xFF1E3A8A),
                  Color(0xFF0052FF),
                  Color(0xFF2563EB),
                ],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(22),
              boxShadow: [
                BoxShadow(
                  color: const Color(0xFF0052FF).withValues(alpha: 0.30),
                  blurRadius: 16,
                  offset: const Offset(0, 5),
                ),
              ],
            ),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: Colors.white.withValues(alpha: 0.16),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(
                    Icons.people_alt_rounded,
                    color: Colors.white,
                    size: 22,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        '$totalCount Total Connections',
                        style: GoogleFonts.outfit(
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        '$withContactCount contacts • Verified network',
                        style: GoogleFonts.outfit(
                          color: Colors.white70,
                          fontSize: 11.5,
                        ),
                      ),
                    ],
                  ),
                ),
                InkWell(
                  onTap: () {
                    HapticFeedback.lightImpact();
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => const AnalyticsScreen(),
                      ),
                    );
                  },
                  borderRadius: BorderRadius.circular(16),
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 12, vertical: 7),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withValues(alpha: 0.08),
                          blurRadius: 6,
                          offset: const Offset(0, 2),
                        ),
                      ],
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Text(
                          'View Insights',
                          style: GoogleFonts.outfit(
                            color: const Color(0xFF0052FF),
                            fontWeight: FontWeight.bold,
                            fontSize: 11.5,
                          ),
                        ),
                        const SizedBox(width: 4),
                        const Icon(
                          Icons.arrow_forward_rounded,
                          color: Color(0xFF0052FF),
                          size: 13,
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),

          // ── 2. Search Bar ────────────────────────────────────────────────
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
            child: Container(
              decoration: BoxDecoration(
                color: _isLight
                    ? Colors.white
                    : Colors.white.withValues(alpha: 0.05),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: _cardBorder),
                boxShadow: [
                  BoxShadow(
                    color:
                        Colors.black.withValues(alpha: _isLight ? 0.02 : 0.15),
                    blurRadius: 10,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: TextField(
                controller: _searchController,
                onChanged: (val) => setState(() => _searchQuery = val),
                style: GoogleFonts.outfit(color: _textColor, fontSize: 14),
                decoration: InputDecoration(
                  hintText: 'Search connections by name, role, skill...',
                  hintStyle: GoogleFonts.outfit(
                      color: _subtitleColor, fontSize: 13),
                  prefixIcon: const Icon(
                    Icons.search_rounded,
                    color: Color(0xFF0052FF),
                    size: 20,
                  ),
                  suffixIcon: _searchQuery.isNotEmpty
                      ? IconButton(
                          icon: const Icon(Icons.close_rounded, size: 18),
                          onPressed: () {
                            _searchController.clear();
                            setState(() => _searchQuery = '');
                          },
                        )
                      : null,
                  border: InputBorder.none,
                  contentPadding:
                      const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                ),
              ),
            ),
          ),

          // ── 3. Filter Search Chips ───────────────────────────────────────
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              physics: const BouncingScrollPhysics(),
              child: Row(
                children: [
                  _buildFilterChip('All', 'All ($totalCount)'),
                  const SizedBox(width: 8),
                  _buildFilterChip('Contacts', '📞 Contacts ($withContactCount)'),
                  const SizedBox(width: 8),
                  _buildFilterChip('Links', '🔗 With Links ($withLinksCount)'),
                  const SizedBox(width: 8),
                  _buildFilterChip('Recent', '⚡ Recent'),
                ],
              ),
            ),
          ),

          const SizedBox(height: 4),

          // ── 4. Connection Cards List ─────────────────────────────────────
          if (filtered.isEmpty)
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 36),
              child: Center(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(
                      Icons.search_off_rounded,
                      size: 48,
                      color: _subtitleColor.withValues(alpha: 0.5),
                    ),
                    const SizedBox(height: 12),
                    Text(
                      'No matching connections found',
                      style: GoogleFonts.outfit(
                        color: _textColor,
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'Try searching for another name, role or reset filters.',
                      style: GoogleFonts.outfit(
                        color: _subtitleColor,
                        fontSize: 13,
                      ),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 14),
                    TextButton.icon(
                      onPressed: () {
                        _searchController.clear();
                        setState(() {
                          _searchQuery = '';
                          _activeFilter = 'All';
                        });
                      },
                      icon: const Icon(Icons.refresh_rounded, size: 16),
                      label: const Text('Reset Search & Filters'),
                      style: TextButton.styleFrom(
                        foregroundColor: const Color(0xFF0052FF),
                      ),
                    ),
                  ],
                ),
              ),
            )
          else
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Column(
                children: [
                  for (final conn in filtered) ...[
                    _buildConnectionCard(conn),
                    const SizedBox(height: 12),
                  ],
                ],
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildFilterChip(String filterKey, String label) {
    final active = _activeFilter == filterKey;
    return GestureDetector(
      onTap: () {
        if (_activeFilter != filterKey) {
          HapticFeedback.selectionClick();
          setState(() => _activeFilter = filterKey);
        }
      },
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 180),
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 7),
        decoration: BoxDecoration(
          color: active
              ? const Color(0xFF0052FF)
              : (_isLight ? Colors.white : Colors.white.withValues(alpha: 0.06)),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: active
                ? const Color(0xFF0052FF)
                : _cardBorder,
          ),
          boxShadow: [
            if (active)
              BoxShadow(
                color: const Color(0xFF0052FF).withValues(alpha: 0.25),
                blurRadius: 8,
                offset: const Offset(0, 2),
              ),
          ],
        ),
        child: Text(
          label,
          style: GoogleFonts.outfit(
            color: active
                ? Colors.white
                : (_isLight ? const Color(0xFF374151) : Colors.white70),
            fontSize: 12,
            fontWeight: active ? FontWeight.bold : FontWeight.w500,
          ),
        ),
      ),
    );
  }

  Widget _buildConnectionCard(Connection conn) {
    final other = conn.other;

    return GestureDetector(
      onTap: () => _showConnectionDetail(conn),
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: _cardBg,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: _cardBorder),
          boxShadow: _isLight
              ? [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.015),
                    blurRadius: 10,
                    offset: const Offset(0, 4),
                  ),
                ]
              : null,
        ),
        child: Row(
          children: [
            Stack(
              children: [
                Container(
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    border: Border.all(
                      color: const Color(0xFF0052FF).withValues(alpha: 0.15),
                      width: 1.5,
                    ),
                  ),
                  child: Padding(
                    padding: const EdgeInsets.all(2.0),
                    child: CircleAvatar(
                      radius: 26,
                      backgroundImage: getAvatarImage(other.avatar, _api.baseUrl),
                      backgroundColor: _cardBorder,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    other.name ?? 'Anonymous',
                    style: GoogleFonts.outfit(
                      color: _textColor,
                      fontWeight: FontWeight.bold,
                      fontSize: 15,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    other.tagline.isNotEmpty ? other.tagline : 'No tagline',
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: GoogleFonts.outfit(
                      color: _subtitleColor,
                      fontSize: 12,
                    ),
                  ),
                  if (other.tags.isNotEmpty) ...[
                    const SizedBox(height: 6),
                    SingleChildScrollView(
                      scrollDirection: Axis.horizontal,
                      child: Row(
                        children: other.tags.take(2).map((t) {
                          final isLoc = t.type == 'location';
                          return Container(
                            margin: const EdgeInsets.only(right: 6),
                            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                            decoration: BoxDecoration(
                              color: isLoc
                                  ? const Color(0xFF10b981).withValues(alpha: 0.06)
                                  : const Color(0xFF0052FF).withValues(alpha: 0.06),
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: Text(
                              t.text,
                              style: GoogleFonts.outfit(
                                fontSize: 9,
                                fontWeight: FontWeight.bold,
                                color: isLoc ? const Color(0xFF10b981) : const Color(0xFF0052FF),
                              ),
                            ),
                          );
                        }).toList(),
                      ),
                    ),
                  ],
                ],
              ),
            ),
            const SizedBox(width: 8),
            Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                if (conn.via == 'nfc')
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 4),
                    decoration: BoxDecoration(
                      color: const Color(0xFF0052FF).withValues(alpha: 0.06),
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: const Icon(Icons.nfc, size: 14, color: Color(0xFF0052FF)),
                  ),
                const SizedBox(width: 8),
                Icon(
                  Icons.arrow_forward_ios_rounded,
                  size: 14,
                  color: _subtitleColor.withValues(alpha: 0.3),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  void _showConnectionDetail(Connection conn) {
    final other = conn.other;
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => Container(
        decoration: BoxDecoration(
          color: _isLight ? Colors.white : const Color(0xFF0F1122),
          borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
        ),
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(width: 40, height: 4,
              decoration: BoxDecoration(color: _subtitleColor.withValues(alpha: 0.35), borderRadius: BorderRadius.circular(2))),
            const SizedBox(height: 20),
            CircleAvatar(
              radius: 40,
              backgroundImage: getAvatarImage(other.avatar, _api.baseUrl),
              backgroundColor: _cardBorder,
            ),
            const SizedBox(height: 14),
            Text(other.name ?? 'Anonymous',
              style: GoogleFonts.outfit(fontSize: 20, fontWeight: FontWeight.bold, color: _textColor)),
            if (other.tagline.isNotEmpty)
              Text(other.tagline,
                style: GoogleFonts.outfit(color: _subtitleColor, fontSize: 13)),
            const SizedBox(height: 20),
            Divider(color: _cardBorder),
            if (other.email != null && other.email!.isNotEmpty) _detailRow(Icons.email_outlined, other.email!),
            if (other.phone != null && other.phone!.isNotEmpty) _detailRow(Icons.phone_outlined, other.phone!),
            if (other.whatsapp != null && other.whatsapp!.isNotEmpty)
              _detailRow(Icons.chat_outlined, other.whatsapp!, isLink: true),
            if (other.location != null && other.location!.isNotEmpty)
              _detailRow(Icons.location_on_outlined, other.location!),
            if (other.socials.isNotEmpty) ...[
              Divider(color: _cardBorder),
              const SizedBox(height: 10),
              Align(
                alignment: Alignment.centerLeft,
                child: Text('Shared Links', style: GoogleFonts.outfit(color: _textColor, fontSize: 14, fontWeight: FontWeight.bold)),
              ),
              const SizedBox(height: 10),
              Wrap(
                spacing: 8,
                runSpacing: 8,
                alignment: WrapAlignment.start,
                children: other.socials.map((link) {
                  final cardColor = parseHexColor(link.color);
                  return InkWell(
                    onTap: () => launchUrl(Uri.parse(link.url), mode: LaunchMode.externalApplication),
                    borderRadius: BorderRadius.circular(12),
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                      decoration: BoxDecoration(
                        color: _isLight ? const Color(0xFFF9FAFB) : Colors.white.withValues(alpha: 0.02),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: cardColor.withValues(alpha: 0.3)),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(Icons.link, color: cardColor, size: 16),
                          const SizedBox(width: 6),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Text(link.platform, style: GoogleFonts.outfit(color: _textColor, fontSize: 12, fontWeight: FontWeight.bold)),
                              Text(link.handle, style: GoogleFonts.outfit(color: _subtitleColor, fontSize: 10)),
                            ],
                          ),
                        ],
                      ),
                    ),
                  );
                }).toList(),
              ),
            ],
            const SizedBox(height: 16),
            Divider(color: _cardBorder),
            const SizedBox(height: 8),
            // Manage Sharing button
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                icon: const Icon(Icons.share, size: 16),
                label: const Text('Manage Sharing with User'),
                onPressed: () {
                  Navigator.pop(context);
                  _showVisibilitySettings(conn);
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: _isLight ? const Color(0xFFF3F4F6) : Colors.white.withValues(alpha: 0.05),
                  foregroundColor: _subtitleColor,
                  side: BorderSide(color: _cardBorder),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  padding: const EdgeInsets.symmetric(vertical: 12),
                  elevation: 0,
                ),
              ),
            ),
            const SizedBox(height: 10),
            // Remove Connection button
            SizedBox(
              width: double.infinity,
              child: OutlinedButton.icon(
                icon: const Icon(Icons.person_remove_alt_1_rounded, size: 16),
                label: Text(
                  'Remove Connection',
                  style: GoogleFonts.outfit(fontWeight: FontWeight.w600, fontSize: 14),
                ),
                onPressed: () {
                  Navigator.pop(context);
                  _confirmRemoveConnection(conn);
                },
                style: OutlinedButton.styleFrom(
                  foregroundColor: const Color(0xFFEF4444),
                  side: BorderSide(
                    color: const Color(0xFFEF4444).withValues(alpha: 0.30),
                    width: 1.5,
                  ),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  padding: const EdgeInsets.symmetric(vertical: 12),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _confirmRemoveConnection(Connection conn) {
    final otherName = conn.other.name ?? 'this user';
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: _isLight ? Colors.white : const Color(0xFF13131F),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: Row(
          children: [
            Icon(Icons.warning_amber_rounded,
                color: const Color(0xFFEF4444), size: 24),
            const SizedBox(width: 10),
            Flexible(
              child: Text(
                'Remove Connection',
                style: GoogleFonts.outfit(
                  color: _textColor,
                  fontWeight: FontWeight.w800,
                  fontSize: 18,
                ),
              ),
            ),
          ],
        ),
        content: Text(
          'Are you sure you want to remove $otherName from your connections? This action cannot be undone.',
          style: GoogleFonts.outfit(
            color: _subtitleColor,
            fontSize: 14,
            height: 1.5,
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: Text(
              'Cancel',
              style: GoogleFonts.outfit(
                color: _subtitleColor,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
          ElevatedButton.icon(
            onPressed: () {
              Navigator.pop(ctx);
              _removeConnection(conn);
            },
            icon: const Icon(Icons.person_remove_alt_1_rounded,
                size: 16, color: Colors.white),
            label: Text(
              'Remove',
              style: GoogleFonts.outfit(
                fontWeight: FontWeight.w700,
                color: Colors.white,
              ),
            ),
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFFEF4444),
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12)),
              elevation: 0,
            ),
          ),
        ],
      ),
    );
  }

  Future<void> _removeConnection(Connection conn) async {
    final otherName = conn.other.name ?? 'User';
    final result = await _api.removeConnection(connectionId: conn.id);
    if (!mounted) return;
    if (result['success'] == true) {
      _refresh();
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('$otherName has been removed from your connections.'),
          backgroundColor: const Color(0xFF374151),
        ),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(result['error'] ?? 'Failed to remove connection.'),
          backgroundColor: Colors.redAccent,
        ),
      );
    }
  }

  void _showVisibilitySettings(Connection conn) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => ConnectionVisibilitySheet(
        connection: conn,
        onSaved: () {
          _refresh();
        },
      ),
    );
  }

  Widget _detailRow(IconData icon, String value, {bool isLink = false}) {
    return InkWell(
      onTap: isLink
          ? () => launchUrl(Uri.parse(value), mode: LaunchMode.externalApplication)
          : null,
      borderRadius: BorderRadius.circular(10),
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 8),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: const Color(0xFF0052FF).withValues(alpha: 0.08),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Icon(icon, color: const Color(0xFF0052FF), size: 18),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Text(
                value,
                style: GoogleFonts.outfit(
                  color: _textColor,
                  fontSize: 14,
                  fontWeight: FontWeight.w500,
                  decoration: isLink ? TextDecoration.underline : null,
                ),
              ),
            ),
            if (isLink)
              Icon(
                Icons.open_in_new_rounded,
                size: 14,
                color: _subtitleColor.withValues(alpha: 0.4),
              ),
          ],
        ),
      ),
    );
  }

  // ─── Helper ───────────────────────────────────────────────────────────────

  Widget _emptyState(IconData icon, String title, String subtitle) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, size: 64, color: _subtitleColor.withValues(alpha: 0.25)),
            const SizedBox(height: 16),
            Text(title, style: GoogleFonts.outfit(color: _textColor, fontSize: 18, fontWeight: FontWeight.w600)),
            const SizedBox(height: 8),
            Text(subtitle, textAlign: TextAlign.center,
              style: GoogleFonts.outfit(color: _subtitleColor.withValues(alpha: 0.5), fontSize: 13)),
          ],
        ),
      ),
    );
  }
}

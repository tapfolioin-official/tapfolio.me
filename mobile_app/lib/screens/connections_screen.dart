import 'dart:async';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:url_launcher/url_launcher.dart';
import '../models/connection.dart';
import '../models/pending_request.dart';
import '../services/api_service.dart';
import '../widgets/connection_permission_sheet.dart';
import '../core/utils/color_parser.dart';
import '../core/utils/image_helper.dart';
import '../widgets/connection_visibility_sheet.dart';

class ConnectionsScreen extends StatefulWidget {
  const ConnectionsScreen({super.key});

  @override
  State<ConnectionsScreen> createState() => _ConnectionsScreenState();
}

class _ConnectionsScreenState extends State<ConnectionsScreen>
    with SingleTickerProviderStateMixin {
  final ApiService _api = ApiService();
  late TabController _tabController;

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
      child: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: _pending.length,
        separatorBuilder: (_, _) => const SizedBox(height: 12),
        itemBuilder: (_, i) => _buildRequestCard(_pending[i]),
      ),
    );
  }

  Widget _buildRequestCard(PendingRequest req) {
    // Filter out empty or whitespace-only tags to prevent empty tag boxes
    final visibleTags = req.requesterTags.where((t) => t.text.trim().isNotEmpty).toList();

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: _cardBg,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: _cardBorder),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: _isLight ? 0.03 : 0.15),
            blurRadius: 16,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                padding: const EdgeInsets.all(2.5),
                decoration: const BoxDecoration(
                  shape: BoxShape.circle,
                  gradient: LinearGradient(
                    colors: [
                      Color(0xFF0052FF),
                      Color(0xFF00C6FF),
                    ],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                ),
                child: CircleAvatar(
                  radius: 28,
                  backgroundImage: getAvatarImage(req.requesterAvatar, _api.baseUrl),
                  backgroundColor: _cardBorder,
                ),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      req.requesterName,
                      style: GoogleFonts.outfit(
                        color: _textColor, 
                        fontWeight: FontWeight.bold, 
                        fontSize: 18,
                      ),
                    ),
                    if (req.requesterTagline.isNotEmpty) ...[
                      const SizedBox(height: 3),
                      Text(
                        req.requesterTagline,
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                        style: GoogleFonts.outfit(
                          color: _subtitleColor, 
                          fontSize: 13,
                          height: 1.2,
                        ),
                      ),
                    ],
                  ],
                ),
              ),
              if (req.via == 'nfc')
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                  decoration: BoxDecoration(
                    color: const Color(0xFF0052FF).withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(
                      color: const Color(0xFF0052FF).withValues(alpha: 0.2),
                      width: 1,
                    ),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(Icons.nfc, size: 13, color: Color(0xFF0052FF)),
                      const SizedBox(width: 4),
                      Text(
                        'NFC',
                        style: GoogleFonts.outfit(
                          color: const Color(0xFF0052FF),
                          fontSize: 10,
                          fontWeight: FontWeight.w800,
                          letterSpacing: 0.5,
                        ),
                      ),
                    ],
                  ),
                ),
            ],
          ),
          const SizedBox(height: 16),
          // Stats row - utilizing clean Material icons instead of emojis
          Row(
            children: [
              _buildRequestStat(Icons.diamond_outlined, req.requesterDiamonds, const Color(0xFFFFB300)),
              const SizedBox(width: 8),
              _buildRequestStat(Icons.people_alt_outlined, '${req.requesterConnectionCount}', const Color(0xFF0D9488)),
              const SizedBox(width: 8),
              _buildRequestStat(Icons.bolt_rounded, '${req.requesterTapCount}', const Color(0xFF9333EA)),
            ],
          ),
          if (visibleTags.isNotEmpty) ...[
            const SizedBox(height: 14),
            Wrap(
              spacing: 6,
              runSpacing: 6,
              children: visibleTags.map((t) {
                final isLoc = t.type == 'location';
                
                // Capitalize the first letter dynamically (e.g. "freealncer" -> "Freealncer")
                final cleanText = t.text.isNotEmpty 
                  ? t.text[0].toUpperCase() + t.text.substring(1)
                  : '';

                return Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                  decoration: BoxDecoration(
                    color: isLoc
                        ? const Color(0xFF10B981).withValues(alpha: 0.05)
                        : (_isLight ? const Color(0xFFF3F4F6) : Colors.white.withValues(alpha: 0.04)),
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(
                      color: isLoc
                          ? const Color(0xFF10B981).withValues(alpha: 0.12)
                          : _cardBorder,
                      width: 1,
                    ),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(
                        isLoc ? Icons.location_on_outlined : Icons.label_outline_rounded,
                        size: 12,
                        color: isLoc ? const Color(0xFF10B981) : _subtitleColor,
                      ),
                      const SizedBox(width: 4),
                      Text(
                        cleanText,
                        style: GoogleFonts.outfit(
                          fontSize: 11, 
                          color: isLoc ? const Color(0xFF0F766E) : _textColor.withValues(alpha: 0.8),
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ],
                  ),
                );
              }).toList(),
            ),
          ],
          const SizedBox(height: 20),
          Row(
            children: [
              Expanded(
                child: SizedBox(
                  height: 44,
                  child: OutlinedButton(
                    onPressed: () => _reject(req),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: _isLight ? const Color(0xFF6B7280) : Colors.white70,
                      side: BorderSide(color: _cardBorder),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                      textStyle: GoogleFonts.outfit(fontWeight: FontWeight.bold, fontSize: 14),
                    ),
                    child: const Text('Reject'),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Container(
                  height: 44,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(14),
                    gradient: const LinearGradient(
                      colors: [
                        Color(0xFF0052FF),
                        Color(0xFF00C6FF),
                      ],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: const Color(0xFF0052FF).withValues(alpha: 0.25),
                        blurRadius: 8,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: ElevatedButton(
                    onPressed: () => _accept(req),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.transparent,
                      foregroundColor: Colors.white,
                      shadowColor: Colors.transparent,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                      elevation: 0,
                      textStyle: GoogleFonts.outfit(fontWeight: FontWeight.bold, fontSize: 14),
                    ),
                    child: const Text('Accept'),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildRequestStat(IconData icon, String value, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.08),
        borderRadius: BorderRadius.circular(10),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 14, color: color),
          const SizedBox(width: 6),
          Text(
            value,
            style: GoogleFonts.outfit(
              color: color,
              fontSize: 12,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }

  // ─── My Connections Tab ───────────────────────────────────────────────────

  Widget _buildConnectionsTab() {
    if (_loadingConnections) {
      return const Center(child: CircularProgressIndicator(color: Color(0xFF0052FF)));
    }
    if (_connections.isEmpty) {
      return _emptyState(Icons.people_outline, 'No connections yet', 'Start connecting by sharing your Tapfolio link or NFC card.');
    }
    return RefreshIndicator(
      color: const Color(0xFF0052FF),
      onRefresh: _refresh,
      child: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: _connections.length,
        separatorBuilder: (_, _) => const SizedBox(height: 12),
        itemBuilder: (_, i) => _buildConnectionCard(_connections[i]),
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
          ],
        ),
      ),
    );
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

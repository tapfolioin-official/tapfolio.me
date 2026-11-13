import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import '../models/profile.dart';
import '../models/connection.dart';
import '../models/card_item.dart';
import '../services/api_service.dart';

class AnalyticsScreen extends StatefulWidget {
  final Profile? initialProfile;

  const AnalyticsScreen({super.key, this.initialProfile});

  @override
  State<AnalyticsScreen> createState() => _AnalyticsScreenState();
}

class _AnalyticsScreenState extends State<AnalyticsScreen> {
  final ApiService _apiService = ApiService();

  Profile? _profile;
  List<Connection> _connections = [];
  List<CardItem> _cards = [];
  bool _loading = true;
  String _selectedRange = '30D'; // '7D', '30D', 'All'

  bool get _isLight => Theme.of(context).brightness == Brightness.light;
  Color get _textColor => _isLight ? const Color(0xFF0F172A) : Colors.white;
  Color get _subtitleColor =>
      _isLight ? const Color(0xFF64748B) : Colors.white60;
  Color get _cardBg => _isLight ? Colors.white : const Color(0xFF13131F);
  Color get _borderColor => isLight
      ? const Color(0xFFE2E8F0)
      : Colors.white.withValues(alpha: 0.08);
  bool get isLight => _isLight;

  @override
  void initState() {
    super.initState();
    _profile = widget.initialProfile;
    _fetchData();
  }

  Future<void> _fetchData() async {
    try {
      final results = await Future.wait([
        _apiService.getProfile(),
        _apiService.getConnections(),
        _apiService.getCards(),
      ]);

      if (mounted) {
        final profileRes = results[0] as Map<String, dynamic>?;
        final connectionsRes = results[1] as List<Connection>?;
        final cardsRes = results[2] as Map<String, dynamic>?;

        setState(() {
          if (profileRes != null && profileRes['profile'] != null) {
            _profile = profileRes['profile'] as Profile;
          }
          if (connectionsRes != null) {
            _connections = connectionsRes;
          }
          if (cardsRes != null && cardsRes['cards'] != null) {
            _cards = cardsRes['cards'] as List<CardItem>;
          }
          _loading = false;
        });
      }
    } catch (e) {
      debugPrint('[ANALYTICS] Fetch error: $e');
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_loading && _profile == null) {
      return Scaffold(
        backgroundColor:
            _isLight ? const Color(0xFFF8FAFC) : const Color(0xFF0A0A0F),
        body: const Center(
          child: CircularProgressIndicator(color: Color(0xFF0052FF)),
        ),
      );
    }

    final taps = _profile?.tapCount ?? 0;
    final diamonds = _profile?.diamonds ?? '0';
    final connectionsCount = _connections.length;
    final totalLinks = _profile?.socials.length ?? 0;
    final estimatedClicks = (taps * 1.8).round();

    return Scaffold(
      backgroundColor:
          _isLight ? const Color(0xFFF8FAFC) : const Color(0xFF0A0A0F),
      body: SafeArea(
        child: Column(
          children: [
            // ── Top Header Navigation Bar ───────────────────────────────────
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  // Back button
                  InkWell(
                    onTap: () {
                      HapticFeedback.lightImpact();
                      Navigator.of(context).pop();
                    },
                    borderRadius: BorderRadius.circular(20),
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 12, vertical: 7),
                      decoration: BoxDecoration(
                        color: isLight
                            ? Colors.white
                            : Colors.white.withValues(alpha: 0.08),
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: _borderColor),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black
                                .withValues(alpha: isLight ? 0.03 : 0.20),
                            blurRadius: 10,
                            offset: const Offset(0, 2),
                          ),
                        ],
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(
                            Icons.arrow_back_ios_new_rounded,
                            color: _textColor,
                            size: 14,
                          ),
                          const SizedBox(width: 5),
                          Text(
                            'Back',
                            style: GoogleFonts.outfit(
                              color: _textColor,
                              fontSize: 13.5,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),

                  // Title
                  Text(
                    'Analytics & Insights',
                    style: GoogleFonts.outfit(
                      color: _textColor,
                      fontSize: 17,
                      fontWeight: FontWeight.bold,
                    ),
                  ),

                  // Time Range Filter Selector
                  Container(
                    padding: const EdgeInsets.all(3),
                    decoration: BoxDecoration(
                      color: isLight
                          ? const Color(0xFFE2E8F0)
                          : Colors.white.withValues(alpha: 0.08),
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Row(
                      children: ['7D', '30D', 'All'].map((range) {
                        final active = _selectedRange == range;
                        return GestureDetector(
                          onTap: () {
                            if (_selectedRange != range) {
                              HapticFeedback.selectionClick();
                              setState(() => _selectedRange = range);
                            }
                          },
                          child: AnimatedContainer(
                            duration: const Duration(milliseconds: 180),
                            padding: const EdgeInsets.symmetric(
                                horizontal: 9, vertical: 4),
                            decoration: BoxDecoration(
                              color: active
                                  ? const Color(0xFF0052FF)
                                  : Colors.transparent,
                              borderRadius: BorderRadius.circular(13),
                            ),
                            child: Text(
                              range,
                              style: GoogleFonts.outfit(
                                color: active ? Colors.white : _subtitleColor,
                                fontSize: 11,
                                fontWeight: active
                                    ? FontWeight.bold
                                    : FontWeight.w500,
                              ),
                            ),
                          ),
                        );
                      }).toList(),
                    ),
                  ),
                ],
              ),
            ),

            // ── Scrollable Analytics Body ───────────────────────────────────
            Expanded(
              child: RefreshIndicator(
                onRefresh: _fetchData,
                color: const Color(0xFF0052FF),
                child: SingleChildScrollView(
                  physics: const AlwaysScrollableScrollPhysics(
                    parent: BouncingScrollPhysics(),
                  ),
                  padding:
                      const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // ── 1. Hero Views Card with Activity Chart ────────────
                      _buildHeroViewsCard(taps),

                      const SizedBox(height: 16),

                      // ── 2. Metric Grid (4 Cards) ──────────────────────────
                      Row(
                        children: [
                          Expanded(
                            child: _buildMetricCard(
                              title: 'Total Scans',
                              value: '$taps',
                              subtext: 'NFC & QR Taps',
                              icon: Icons.qr_code_scanner_rounded,
                              iconColor: const Color(0xFF0052FF),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: _buildMetricCard(
                              title: 'Link Clicks',
                              value: '$estimatedClicks',
                              subtext: '$totalLinks active links',
                              icon: Icons.touch_app_rounded,
                              iconColor: const Color(0xFF10B981),
                            ),
                          ),
                        ],
                      ),

                      const SizedBox(height: 12),

                      Row(
                        children: [
                          Expanded(
                            child: _buildMetricCard(
                              title: 'Connections',
                              value: '$connectionsCount',
                              subtext: 'Saved profiles',
                              icon: Icons.people_alt_rounded,
                              iconColor: const Color(0xFF8B5CF6),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: _buildMetricCard(
                              title: 'Diamonds',
                              value: diamonds,
                              subtext: 'Rank score',
                              icon: Icons.diamond_rounded,
                              iconColor: const Color(0xFFF59E0B),
                            ),
                          ),
                        ],
                      ),

                      const SizedBox(height: 20),

                      // ── 3. Traffic Channel Distribution ───────────────────
                      _buildTrafficSourceCard(),

                      if (_cards.isNotEmpty) ...[
                        const SizedBox(height: 20),

                        // ── 4. Card-Specific Performance Breakdown ──────────
                        _buildCardBreakdownSection(),
                      ],

                      const SizedBox(height: 20),

                      // ── 5. Engagement Breakdown by Platform ───────────────
                      _buildSocialEngagementCard(),

                      const SizedBox(height: 32),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ── Hero Views Card with Interactive Bars ─────────────────────────────────

  Widget _buildHeroViewsCard(int taps) {
    // Generate relative mock bars for the selected period
    final days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    final heights = [0.45, 0.65, 0.35, 0.90, 0.70, 0.85, 0.55];

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: _cardBg,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: _borderColor),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: isLight ? 0.04 : 0.25),
            blurRadius: 20,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Profile Views',
                    style: GoogleFonts.outfit(
                      color: _subtitleColor,
                      fontSize: 13,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.baseline,
                    textBaseline: TextBaseline.alphabetic,
                    children: [
                      Text(
                        '$taps',
                        style: GoogleFonts.outfit(
                          color: _textColor,
                          fontSize: 34,
                          fontWeight: FontWeight.w900,
                          letterSpacing: -0.5,
                        ),
                      ),
                      const SizedBox(width: 8),
                      Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 7, vertical: 3),
                        decoration: BoxDecoration(
                          color: const Color(0xFF10B981)
                              .withValues(alpha: isLight ? 0.12 : 0.22),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            const Icon(
                              Icons.arrow_upward_rounded,
                              color: Color(0xFF10B981),
                              size: 12,
                            ),
                            const SizedBox(width: 2),
                            Text(
                              '+24.8%',
                              style: GoogleFonts.outfit(
                                color: const Color(0xFF10B981),
                                fontSize: 11,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ],
              ),
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: const Color(0xFF0052FF).withValues(alpha: 0.10),
                  borderRadius: BorderRadius.circular(14),
                ),
                child: const Icon(
                  Icons.trending_up_rounded,
                  color: Color(0xFF0052FF),
                  size: 24,
                ),
              ),
            ],
          ),

          const SizedBox(height: 24),

          // Weekly Activity Bar Chart
          SizedBox(
            height: 110,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              crossAxisAlignment: CrossAxisAlignment.end,
              children: List.generate(days.length, (i) {
                final heightFactor = heights[i];
                final isPeak = heightFactor >= 0.85;

                return Column(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    Container(
                      width: 28,
                      height: (80 * heightFactor).clamp(16.0, 80.0),
                      decoration: BoxDecoration(
                        color: isPeak
                            ? const Color(0xFF0052FF)
                            : (isLight
                                ? const Color(0xFFE2E8F0)
                                : Colors.white.withValues(alpha: 0.10)),
                        borderRadius: BorderRadius.circular(8),
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      days[i],
                      style: GoogleFonts.outfit(
                        color: isPeak ? _textColor : _subtitleColor,
                        fontSize: 10.5,
                        fontWeight:
                            isPeak ? FontWeight.bold : FontWeight.w500,
                      ),
                    ),
                  ],
                );
              }),
            ),
          ),
        ],
      ),
    );
  }

  // ── Metric Grid Card ──────────────────────────────────────────────────────

  Widget _buildMetricCard({
    required String title,
    required String value,
    required String subtext,
    required IconData icon,
    required Color iconColor,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: _cardBg,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: _borderColor),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: isLight ? 0.03 : 0.20),
            blurRadius: 14,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                title,
                style: GoogleFonts.outfit(
                  color: _subtitleColor,
                  fontSize: 12,
                  fontWeight: FontWeight.w500,
                ),
              ),
              Container(
                padding: const EdgeInsets.all(6),
                decoration: BoxDecoration(
                  color: iconColor.withValues(alpha: 0.12),
                  shape: BoxShape.circle,
                ),
                child: Icon(icon, color: iconColor, size: 16),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            value,
            style: GoogleFonts.outfit(
              color: _textColor,
              fontSize: 22,
              fontWeight: FontWeight.w800,
            ),
          ),
          const SizedBox(height: 2),
          Text(
            subtext,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: GoogleFonts.outfit(
              color: _subtitleColor,
              fontSize: 10,
              fontWeight: FontWeight.w400,
            ),
          ),
        ],
      ),
    );
  }

  // ── Traffic Channel Distribution ──────────────────────────────────────────

  Widget _buildTrafficSourceCard() {
    final channels = [
      {'name': 'NFC Smart Card', 'pct': 0.64, 'color': const Color(0xFF0052FF)},
      {'name': 'QR Code Scan', 'pct': 0.26, 'color': const Color(0xFF10B981)},
      {'name': 'Direct Web Link', 'pct': 0.10, 'color': const Color(0xFF8B5CF6)},
    ];

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: _cardBg,
        borderRadius: BorderRadius.circular(22),
        border: Border.all(color: _borderColor),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Connection Sources',
            style: GoogleFonts.outfit(
              color: _textColor,
              fontSize: 16,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 14),

          // Multi-color distribution bar
          ClipRRect(
            borderRadius: BorderRadius.circular(6),
            child: SizedBox(
              height: 12,
              child: Row(
                children: channels.map((c) {
                  return Expanded(
                    flex: ((c['pct'] as double) * 100).round(),
                    child: Container(color: c['color'] as Color),
                  );
                }).toList(),
              ),
            ),
          ),

          const SizedBox(height: 14),

          // Legends
          Column(
            children: channels.map((c) {
              final pctInt = ((c['pct'] as double) * 100).round();
              return Padding(
                padding: const EdgeInsets.symmetric(vertical: 4),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        Container(
                          width: 10,
                          height: 10,
                          decoration: BoxDecoration(
                            color: c['color'] as Color,
                            shape: BoxShape.circle,
                          ),
                        ),
                        const SizedBox(width: 8),
                        Text(
                          c['name'] as String,
                          style: GoogleFonts.outfit(
                            color: _textColor,
                            fontSize: 12.5,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ],
                    ),
                    Text(
                      '$pctInt%',
                      style: GoogleFonts.outfit(
                        color: _textColor,
                        fontSize: 12.5,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
              );
            }).toList(),
          ),
        ],
      ),
    );
  }

  // ── Social / Links Engagement Breakdown ───────────────────────────────────

  Widget _buildSocialEngagementCard() {
    final socials = _profile?.socials ?? [];

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: _cardBg,
        borderRadius: BorderRadius.circular(22),
        border: Border.all(color: _borderColor),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Link Engagement',
            style: GoogleFonts.outfit(
              color: _textColor,
              fontSize: 16,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 12),
          if (socials.isEmpty)
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 12),
              child: Center(
                child: Text(
                  'No social links added yet.',
                  style: GoogleFonts.outfit(color: _subtitleColor, fontSize: 13),
                ),
              ),
            )
          else
            Column(
              children: socials.map((social) {
                final clickCount = ((_profile?.tapCount ?? 1) * 0.45).round();
                return Padding(
                  padding: const EdgeInsets.symmetric(vertical: 6),
                  child: Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(7),
                        decoration: BoxDecoration(
                          color: const Color(0xFF0052FF).withValues(alpha: 0.10),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: const Icon(
                          Icons.link_rounded,
                          color: Color(0xFF0052FF),
                          size: 16,
                        ),
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              social.platform,
                              style: GoogleFonts.outfit(
                                color: _textColor,
                                fontSize: 13,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                            Text(
                              social.handle.isNotEmpty
                                  ? social.handle
                                  : social.url,
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: GoogleFonts.outfit(
                                color: _subtitleColor,
                                fontSize: 10.5,
                              ),
                            ),
                          ],
                        ),
                      ),
                      Text(
                        '$clickCount clicks',
                        style: GoogleFonts.outfit(
                          color: const Color(0xFF0052FF),
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                );
              }).toList(),
            ),
        ],
      ),
    );
  }

  // ── Card-Specific Performance Breakdown ───────────────────────────────────

  Widget _buildCardBreakdownSection() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: _cardBg,
        borderRadius: BorderRadius.circular(22),
        border: Border.all(color: _borderColor),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Card Performance',
                style: GoogleFonts.outfit(
                  color: _textColor,
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
              Text(
                '${_cards.length} Cards',
                style: GoogleFonts.outfit(
                  color: _subtitleColor,
                  fontSize: 12,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),

          Column(
            children: _cards.map((card) {
              Color themeAccent;
              try {
                themeAccent = Color(int.parse(card.themeColor));
              } catch (_) {
                themeAccent = const Color(0xFF0052FF);
              }

              return Padding(
                padding: const EdgeInsets.symmetric(vertical: 7),
                child: Row(
                  children: [
                    Container(
                      width: 36,
                      height: 36,
                      decoration: BoxDecoration(
                        color: themeAccent.withValues(alpha: 0.12),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      alignment: Alignment.center,
                      child: Icon(
                        Icons.credit_card_rounded,
                        color: themeAccent,
                        size: 18,
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Flexible(
                                child: Text(
                                  card.title,
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                  style: GoogleFonts.outfit(
                                    color: _textColor,
                                    fontSize: 13.5,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                              ),
                              if (card.isActive) ...[
                                const SizedBox(width: 6),
                                Container(
                                  padding: const EdgeInsets.symmetric(
                                      horizontal: 6, vertical: 2),
                                  decoration: BoxDecoration(
                                    color: const Color(0xFF10B981)
                                        .withValues(alpha: 0.15),
                                    borderRadius: BorderRadius.circular(6),
                                  ),
                                  child: Text(
                                    'ACTIVE',
                                    style: GoogleFonts.outfit(
                                      color: const Color(0xFF10B981),
                                      fontSize: 8.5,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ),
                              ],
                            ],
                          ),
                          Text(
                            card.designation,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: GoogleFonts.outfit(
                              color: _subtitleColor,
                              fontSize: 11,
                            ),
                          ),
                        ],
                      ),
                    ),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        Text(
                          '${card.scans} scans',
                          style: GoogleFonts.outfit(
                            color: _textColor,
                            fontSize: 12.5,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        Text(
                          '${card.views} views',
                          style: GoogleFonts.outfit(
                            color: _subtitleColor,
                            fontSize: 10,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              );
            }).toList(),
          ),
        ],
      ),
    );
  }
}

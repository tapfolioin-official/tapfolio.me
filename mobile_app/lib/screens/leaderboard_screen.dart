import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../models/profile.dart';
import '../core/utils/image_helper.dart';
import '../services/api_service.dart';
import 'profile_view_screen.dart';

class LeaderboardScreen extends StatefulWidget {
  const LeaderboardScreen({super.key});

  @override
  State<LeaderboardScreen> createState() => _LeaderboardScreenState();
}

class _LeaderboardScreenState extends State<LeaderboardScreen> {
  final ApiService _apiService = ApiService();
  List<Profile> _leaderboard = [];
  bool _loading = true;
  String? _error;

  bool get _isLight => Theme.of(context).brightness == Brightness.light;
  Color get _textColor => _isLight ? const Color(0xFF1F2937) : Colors.white;
  Color get _subtitleColor => _isLight ? const Color(0xFF4B5563) : Colors.white60;
  Color get _cardBg => _isLight ? Colors.white : Colors.white.withValues(alpha: 0.03);
  Color get _cardBorder => _isLight ? Colors.black12 : Colors.white.withValues(alpha: 0.06);

  _LeaderboardScreenState() {
    debugPrint('[TRACE-LEADERBOARD] State constructor called.');
  }

  @override
  void initState() {
    debugPrint('[TRACE-LEADERBOARD] initState() started.');
    super.initState();
    _fetchLeaderboard();
    debugPrint('[TRACE-LEADERBOARD] initState() completed.');
  }

  Future<void> _fetchLeaderboard() async {
    setState(() {
      _loading = true;
      _error = null;
    });

    try {
      final res = await _apiService.getLeaderboard();
      setState(() {
        _leaderboard = res;
      });
    } catch (e) {
      setState(() {
        _error = 'Failed to load leaderboard';
      });
    } finally {
      setState(() {
        _loading = false;
      });
    }
  }

  Widget _getRankBadge(int rank) {
    Color badgeColor;
    String badgeText = rank.toString();

    if (rank == 1) {
      badgeColor = const Color(0xFFF59E0B); // Gold
    } else if (rank == 2) {
      badgeColor = const Color(0xFF94A3B8); // Silver
    } else if (rank == 3) {
      badgeColor = const Color(0xFFB45309); // Bronze
    } else {
      badgeColor = Colors.white24;
    }

    return Container(
      width: 28,
      height: 28,
      decoration: BoxDecoration(
        color: badgeColor,
        shape: BoxShape.circle,
      ),
      alignment: Alignment.center,
      child: Text(
        badgeText,
        style: GoogleFonts.outfit(
          color: rank <= 3 ? Colors.black : Colors.white70,
          fontWeight: FontWeight.bold,
          fontSize: 14,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    debugPrint('[TRACE-LEADERBOARD] build() called.');
    return Scaffold(
      backgroundColor: _isLight ? const Color(0xFFF3F4F6) : const Color(0xFF06070D),
      body: RefreshIndicator(
        onRefresh: _fetchLeaderboard,
        color: const Color(0xFF6366F1),
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Tapfolio Leaderboard',
                style: GoogleFonts.outfit(
                  color: _textColor,
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                'Discover elite creators and professionals. All premium accounts are ranked by diamonds.',
                style: GoogleFonts.outfit(
                  color: _subtitleColor,
                  fontSize: 14,
                ),
              ),
              const SizedBox(height: 24),
              if (_loading)
                const Center(child: Padding(
                  padding: EdgeInsets.only(top: 40.0),
                  child: CircularProgressIndicator(color: Color(0xFF6366F1)),
                ))
              else if (_error != null)
                Center(
                  child: Padding(
                    padding: const EdgeInsets.only(top: 40.0),
                    child: Text(_error!, style: const TextStyle(color: Colors.redAccent)),
                  ),
                )
              else if (_leaderboard.isEmpty)
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    color: _cardBg,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: _cardBorder),
                  ),
                  child: Column(
                    children: [
                      const Icon(Icons.emoji_events_outlined, size: 60, color: Color(0xFF6366F1)),
                      const SizedBox(height: 16),
                      Text(
                        'No Premium Profiles Yet',
                        style: GoogleFonts.outfit(color: _textColor, fontSize: 18, fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 6),
                      Text(
                        'Premium accounts will appear here ranked by their diamond score.',
                        style: GoogleFonts.outfit(color: _subtitleColor, fontSize: 13),
                        textAlign: TextAlign.center,
                      ),
                    ],
                  ),
                )
              else
                ...List.generate(_leaderboard.length, (index) {
                  final profile = _leaderboard[index];
                  final rank = index + 1;

                  return Container(
                    margin: const EdgeInsets.only(bottom: 16),
                    decoration: BoxDecoration(
                      color: _cardBg,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(
                        color: rank == 1
                            ? const Color(0xFFF59E0B).withValues(alpha: 0.4)
                            : rank == 2
                                ? const Color(0xFF94A3B8).withValues(alpha: 0.4)
                                : rank == 3
                                    ? const Color(0xFFB45309).withValues(alpha: 0.4)
                                    : _cardBorder,
                      ),
                    ),
                    child: Material(
                      color: Colors.transparent,
                      child: InkWell(
                        borderRadius: BorderRadius.circular(16),
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => ProfileViewScreen(
                                userId: profile.userId,
                                username: profile.username,
                                initialProfile: profile,
                              ),
                            ),
                          );
                        },
                        child: Padding(
                          padding: const EdgeInsets.all(16),
                          child: Row(
                            children: [
                              // Rank Number
                              _getRankBadge(rank),
                              const SizedBox(width: 12),

                              // Avatar
                              CircleAvatar(
                                radius: 24,
                                backgroundColor: _cardBorder,
                                backgroundImage: getAvatarImage(profile.avatar, _apiService.baseUrl),
                              ),
                              const SizedBox(width: 12),

                              // Details
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Row(
                                      children: [
                                        Flexible(
                                          child: Text(
                                            profile.name,
                                            style: GoogleFonts.outfit(
                                              color: _textColor,
                                              fontWeight: FontWeight.bold,
                                              fontSize: 16,
                                            ),
                                            overflow: TextOverflow.ellipsis,
                                          ),
                                        ),
                                        const SizedBox(width: 6),
                                        Container(
                                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                          decoration: BoxDecoration(
                                            color: Colors.amber.withValues(alpha: 0.15),
                                            borderRadius: BorderRadius.circular(6),
                                          ),
                                          child: Text(
                                            '💎 Premium',
                                            style: GoogleFonts.outfit(color: Colors.amber, fontSize: 10, fontWeight: FontWeight.bold),
                                          ),
                                        ),
                                      ],
                                    ),
                                    const SizedBox(height: 2),
                                    Text(
                                      profile.tagline,
                                      style: GoogleFonts.outfit(color: _subtitleColor, fontSize: 12),
                                      maxLines: 1,
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                    const SizedBox(height: 6),
                                    // Score stats
                                    Row(
                                      children: [
                                        Icon(Icons.check_circle_outline, size: 14, color: const Color(0xFF6366F1)),
                                        const SizedBox(width: 4),
                                        Text(
                                          '${profile.diamonds} Pts',
                                          style: GoogleFonts.outfit(color: const Color(0xFF6366F1), fontSize: 12, fontWeight: FontWeight.bold),
                                        ),
                                        const SizedBox(width: 12),
                                        Icon(Icons.bolt, size: 14, color: _isLight ? const Color(0xFF0F766E) : Colors.tealAccent),
                                        const SizedBox(width: 4),
                                        Text(
                                          '${profile.tapCount} Taps',
                                          style: GoogleFonts.outfit(color: _isLight ? const Color(0xFF0F766E) : Colors.tealAccent, fontSize: 12, fontWeight: FontWeight.bold),
                                        ),
                                      ],
                                    ),
                                  ],
                                ),
                              ),

                              // Action button
                              Icon(Icons.arrow_forward_ios, color: _subtitleColor.withValues(alpha: 0.5), size: 16),
                            ],
                          ),
                        ),
                      ),
                    ),
                  );
                }),
            ],
          ),
        ),
      ),
    );
  }
}

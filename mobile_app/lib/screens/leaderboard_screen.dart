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
  final TextEditingController _searchController = TextEditingController();

  List<Profile> _allLeaderboard = [];
  bool _loading = true;
  String? _error;

  String _searchQuery = '';
  String _selectedCategory = 'All';
  String _sortBy = 'Rank'; // 'Rank', 'Points', 'Taps'
  bool _showAllRanks = false;
  static const int _initialListLimit = 10;

  bool get _isLight => Theme.of(context).brightness == Brightness.light;
  Color get _textColor => _isLight ? const Color(0xFF0F172A) : Colors.white;
  Color get _subtitleColor => _isLight ? const Color(0xFF64748B) : const Color(0xFF94A3B8);
  Color get _cardBg => _isLight ? Colors.white : const Color(0xFF131622);
  Color get _cardBorder => _isLight ? const Color(0xFFE2E8F0) : const Color(0xFF1E2235);
  Color get _searchBg => _isLight ? Colors.white : const Color(0xFF131622);
  Color get _badgeBg => _isLight ? const Color(0xFFFEF3C7) : const Color(0xFF78350F).withValues(alpha: 0.35);

  @override
  void initState() {
    super.initState();
    _fetchLeaderboard();
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  Future<void> _fetchLeaderboard() async {
    setState(() {
      _loading = true;
      _error = null;
    });

    try {
      final res = await _apiService.getLeaderboard();
      if (mounted) {
        setState(() {
          _allLeaderboard = res;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _error = 'Failed to load leaderboard';
        });
      }
    } finally {
      if (mounted) {
        setState(() {
          _loading = false;
        });
      }
    }
  }

  int _parsePoints(String diamonds) {
    return int.tryParse(diamonds) ?? 0;
  }

  List<Profile> get _filteredAndSortedList {
    List<Profile> list = List.from(_allLeaderboard);

    // Search query filter
    if (_searchQuery.trim().isNotEmpty) {
      final query = _searchQuery.trim().toLowerCase();
      list = list.where((p) {
        final nameMatch = p.name.toLowerCase().contains(query);
        final usernameMatch = p.username.toLowerCase().contains(query);
        final taglineMatch = p.tagline.toLowerCase().contains(query);
        final tagMatch = p.tags.any((t) => t.text.toLowerCase().contains(query));
        return nameMatch || usernameMatch || taglineMatch || tagMatch;
      }).toList();
    }

    // Category filter
    if (_selectedCategory != 'All') {
      list = list.where((p) {
        final categoryLower = _selectedCategory.toLowerCase();
        final tagMatch = p.tags.any((t) => t.text.toLowerCase().contains(categoryLower));
        final taglineMatch = p.tagline.toLowerCase().contains(categoryLower);
        final bioMatch = p.bio.toLowerCase().contains(categoryLower);
        return tagMatch || taglineMatch || bioMatch;
      }).toList();
    }

    // Sort
    if (_sortBy == 'Points') {
      list.sort((a, b) => _parsePoints(b.diamonds).compareTo(_parsePoints(a.diamonds)));
    } else if (_sortBy == 'Taps') {
      list.sort((a, b) => b.tapCount.compareTo(a.tapCount));
    }

    return list;
  }

  void _showLeaderboardInfo() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: _isLight ? Colors.white : const Color(0xFF131622),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) {
        return SafeArea(
          child: SingleChildScrollView(
            child: Padding(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'About Leaderboard',
                        style: GoogleFonts.outfit(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          color: _textColor,
                        ),
                      ),
                      IconButton(
                        icon: const Icon(Icons.close),
                        color: _subtitleColor,
                        onPressed: () => Navigator.pop(context),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Text(
                    'The Tapfolio Leaderboard ranks premium creators and verified professionals based on diamond points and profile interactions.',
                    style: GoogleFonts.outfit(
                      fontSize: 14,
                      color: _subtitleColor,
                      height: 1.5,
                    ),
                  ),
                  const SizedBox(height: 16),
                  _buildInfoRow(
                    Icons.diamond_outlined,
                    const Color(0xFF6366F1),
                    'Diamond Points',
                    'Earn points through verified profile interactions, card shares, and networking activity.',
                  ),
                  const SizedBox(height: 12),
                  _buildInfoRow(
                    Icons.bolt,
                    const Color(0xFF0F766E),
                    'Card Taps',
                    'Total number of times other professionals tapped or viewed your card.',
                  ),
                  const SizedBox(height: 12),
                  _buildInfoRow(
                    Icons.verified,
                    const Color(0xFF0052FF),
                    'Premium Status',
                    'Exclusive rank visibility reserved for active Tapfolio Premium members.',
                  ),
                  const SizedBox(height: 16),
                ],
              ),
            ),
          ),
        );
      },
    );
  }

  Widget _buildInfoRow(IconData icon, Color iconColor, String title, String description) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: iconColor.withValues(alpha: 0.12),
            shape: BoxShape.circle,
          ),
          child: Icon(icon, color: iconColor, size: 20),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: GoogleFonts.outfit(
                  fontSize: 14,
                  fontWeight: FontWeight.bold,
                  color: _textColor,
                ),
              ),
              const SizedBox(height: 2),
              Text(
                description,
                style: GoogleFonts.outfit(
                  fontSize: 12,
                  color: _subtitleColor,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  void _showFilterSheet() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: _isLight ? Colors.white : const Color(0xFF131622),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) {
        return SafeArea(
          child: StatefulBuilder(
            builder: (context, setModalState) {
              return SingleChildScrollView(
                child: Padding(
                  padding: const EdgeInsets.all(24.0),
                  child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          'Filter Leaderboard',
                          style: GoogleFonts.outfit(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                            color: _textColor,
                          ),
                        ),
                        TextButton(
                          onPressed: () {
                            setState(() {
                              _selectedCategory = 'All';
                              _sortBy = 'Rank';
                              _searchController.clear();
                              _searchQuery = '';
                            });
                            Navigator.pop(context);
                          },
                          child: Text(
                            'Reset',
                            style: GoogleFonts.outfit(
                              color: const Color(0xFF0052FF),
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    Text(
                      'Sort by',
                      style: GoogleFonts.outfit(
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                        color: _textColor,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Wrap(
                      spacing: 8,
                      children: ['Rank', 'Points', 'Taps'].map((sortOption) {
                        final isSelected = _sortBy == sortOption;
                        return ChoiceChip(
                          label: Text(sortOption),
                          selected: isSelected,
                          onSelected: (selected) {
                            if (selected) {
                              setModalState(() => _sortBy = sortOption);
                              setState(() => _sortBy = sortOption);
                            }
                          },
                          selectedColor: const Color(0xFF0052FF).withValues(alpha: 0.15),
                          labelStyle: GoogleFonts.outfit(
                            color: isSelected ? const Color(0xFF0052FF) : _textColor,
                            fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                          ),
                        );
                      }).toList(),
                    ),
                    const SizedBox(height: 16),
                    Text(
                      'Category',
                      style: GoogleFonts.outfit(
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                        color: _textColor,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Wrap(
                      spacing: 8,
                      children: ['All', 'Creators', 'Professionals', 'Brands'].map((cat) {
                        final isSelected = _selectedCategory == cat;
                        return ChoiceChip(
                          label: Text(cat),
                          selected: isSelected,
                          onSelected: (selected) {
                            if (selected) {
                              setModalState(() => _selectedCategory = cat);
                              setState(() => _selectedCategory = cat);
                            }
                          },
                          selectedColor: const Color(0xFF0052FF).withValues(alpha: 0.15),
                          labelStyle: GoogleFonts.outfit(
                            color: isSelected ? const Color(0xFF0052FF) : _textColor,
                            fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                          ),
                        );
                      }).toList(),
                    ),
                    const SizedBox(height: 24),
                    SizedBox(
                      width: double.infinity,
                      height: 48,
                      child: ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF0052FF),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(14),
                          ),
                          elevation: 0,
                        ),
                        onPressed: () => Navigator.pop(context),
                        child: Text(
                          'Apply Filters',
                          style: GoogleFonts.outfit(
                            color: Colors.white,
                            fontSize: 15,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            );
          },
        ),
      );
    },
  );
}

  void _navigateToProfile(Profile profile) {
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
  }

  @override
  Widget build(BuildContext context) {
    final filteredList = _filteredAndSortedList;
    final top3 = filteredList.take(3).toList();
    final remainingRanks = filteredList.skip(3).toList();
    final displayedRemaining = _showAllRanks
        ? remainingRanks
        : remainingRanks.take(_initialListLimit).toList();

    return Scaffold(
      backgroundColor: _isLight ? const Color(0xFFF8FAFC) : const Color(0xFF070913),
      body: SafeArea(
        bottom: false,
        child: RefreshIndicator(
          onRefresh: _fetchLeaderboard,
          color: const Color(0xFF0052FF),
          child: SingleChildScrollView(
            physics: const AlwaysScrollableScrollPhysics(
              parent: BouncingScrollPhysics(),
            ),
            padding: const EdgeInsets.symmetric(horizontal: 16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(height: 12),

                // ── 1. Top Header Row (Title + Info Icon) ───────────────────
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Tapfolio Leaderboard',
                            style: GoogleFonts.outfit(
                              color: _textColor,
                              fontSize: 26,
                              fontWeight: FontWeight.bold,
                              letterSpacing: -0.5,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            'Discover elite creators and professionals. All premium accounts are ranked by diamonds.',
                            style: GoogleFonts.outfit(
                              color: _subtitleColor,
                              fontSize: 13.5,
                              height: 1.35,
                            ),
                          ),
                        ],
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.info_outline_rounded, size: 22),
                      color: _subtitleColor,
                      splashRadius: 20,
                      onPressed: _showLeaderboardInfo,
                    ),
                  ],
                ),

                const SizedBox(height: 18),

                // ── 2. Search & Filters Bar ─────────────────────────────────
                Row(
                  children: [
                    // Search Bar
                    Expanded(
                      child: Container(
                        height: 46,
                        decoration: BoxDecoration(
                          color: _searchBg,
                          borderRadius: BorderRadius.circular(14),
                          border: Border.all(color: _cardBorder),
                        ),
                        child: TextField(
                          controller: _searchController,
                          onChanged: (val) => setState(() => _searchQuery = val),
                          style: GoogleFonts.outfit(fontSize: 13.5, color: _textColor),
                          decoration: InputDecoration(
                            hintText: 'Search by name, username or category',
                            hintStyle: GoogleFonts.outfit(
                              fontSize: 13,
                              color: _subtitleColor.withValues(alpha: 0.7),
                            ),
                            prefixIcon: Icon(
                              Icons.search_rounded,
                              size: 20,
                              color: _subtitleColor,
                            ),
                            suffixIcon: _searchQuery.isNotEmpty
                                ? GestureDetector(
                                    onTap: () {
                                      _searchController.clear();
                                      setState(() => _searchQuery = '');
                                    },
                                    child: Icon(Icons.close_rounded, size: 18, color: _subtitleColor),
                                  )
                                : null,
                            border: InputBorder.none,
                            contentPadding: const EdgeInsets.symmetric(vertical: 12),
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 10),

                    // Filter Button
                    GestureDetector(
                      onTap: _showFilterSheet,
                      child: Container(
                        height: 46,
                        padding: const EdgeInsets.symmetric(horizontal: 14),
                        decoration: BoxDecoration(
                          color: _searchBg,
                          borderRadius: BorderRadius.circular(14),
                          border: Border.all(color: _cardBorder),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Stack(
                              clipBehavior: Clip.none,
                              children: [
                                Icon(Icons.tune_rounded, size: 18, color: _textColor),
                                if (_selectedCategory != 'All' || _sortBy != 'Rank')
                                  Positioned(
                                    top: -2,
                                    right: -2,
                                    child: Container(
                                      width: 6,
                                      height: 6,
                                      decoration: const BoxDecoration(
                                        color: Color(0xFF0052FF),
                                        shape: BoxShape.circle,
                                      ),
                                    ),
                                  ),
                              ],
                            ),
                            const SizedBox(width: 8),
                            Text(
                              'Filters',
                              style: GoogleFonts.outfit(
                                fontSize: 13.5,
                                fontWeight: FontWeight.w600,
                                color: _textColor,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 14),

                // ── 3. Sort By & Category Chips ─────────────────────────────
                SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  physics: const BouncingScrollPhysics(),
                  child: Row(
                    children: [
                      // Sort by dropdown pill
                      PopupMenuButton<String>(
                        onSelected: (val) => setState(() => _sortBy = val),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                        color: _isLight ? Colors.white : const Color(0xFF131622),
                        itemBuilder: (context) => [
                          PopupMenuItem(
                            value: 'Rank',
                            child: Text('Rank', style: GoogleFonts.outfit(color: _textColor)),
                          ),
                          PopupMenuItem(
                            value: 'Points',
                            child: Text('Points', style: GoogleFonts.outfit(color: _textColor)),
                          ),
                          PopupMenuItem(
                            value: 'Taps',
                            child: Text('Taps', style: GoogleFonts.outfit(color: _textColor)),
                          ),
                        ],
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 7),
                          decoration: BoxDecoration(
                            color: _isLight ? Colors.white : const Color(0xFF131622),
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: _cardBorder),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Text(
                                'Sort by  ',
                                style: GoogleFonts.outfit(
                                  fontSize: 12.5,
                                  color: _subtitleColor,
                                ),
                              ),
                              Text(
                                _sortBy,
                                style: GoogleFonts.outfit(
                                  fontSize: 12.5,
                                  fontWeight: FontWeight.bold,
                                  color: _textColor,
                                ),
                              ),
                              const SizedBox(width: 4),
                              Icon(Icons.keyboard_arrow_down_rounded, size: 16, color: _subtitleColor),
                            ],
                          ),
                        ),
                      ),
                      const SizedBox(width: 10),

                      // Category Tabs
                      Container(
                        padding: const EdgeInsets.all(3),
                        decoration: BoxDecoration(
                          color: _isLight ? const Color(0xFFEEF2F6) : const Color(0xFF131622),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: _cardBorder),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: ['All', 'Creators', 'Professionals', 'Brands'].map((cat) {
                            final isSelected = _selectedCategory == cat;
                            return GestureDetector(
                              onTap: () => setState(() => _selectedCategory = cat),
                              child: Container(
                                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                                decoration: BoxDecoration(
                                  color: isSelected
                                      ? (_isLight ? Colors.white : const Color(0xFF1E2235))
                                      : Colors.transparent,
                                  borderRadius: BorderRadius.circular(9),
                                  boxShadow: isSelected
                                      ? [
                                          BoxShadow(
                                            color: Colors.black.withValues(alpha: 0.05),
                                            blurRadius: 4,
                                            offset: const Offset(0, 1),
                                          ),
                                        ]
                                      : null,
                                ),
                                child: Text(
                                  cat,
                                  style: GoogleFonts.outfit(
                                    fontSize: 12.5,
                                    fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                                    color: isSelected
                                        ? const Color(0xFF0052FF)
                                        : _subtitleColor,
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

                const SizedBox(height: 20),

                // ── 4. Main Body Content (Loading / Error / Empty / Podium) ──
                if (_loading)
                  const Center(
                    child: Padding(
                      padding: EdgeInsets.only(top: 60.0),
                      child: CircularProgressIndicator(color: Color(0xFF0052FF)),
                    ),
                  )
                else if (_error != null)
                  Center(
                    child: Padding(
                      padding: const EdgeInsets.only(top: 40.0),
                      child: Column(
                        children: [
                          const Icon(Icons.error_outline_rounded, size: 48, color: Colors.redAccent),
                          const SizedBox(height: 12),
                          Text(_error!, style: GoogleFonts.outfit(color: Colors.redAccent, fontSize: 14)),
                          const SizedBox(height: 8),
                          ElevatedButton(
                            style: ElevatedButton.styleFrom(
                              backgroundColor: const Color(0xFF0052FF),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                            ),
                            onPressed: _fetchLeaderboard,
                            child: Text('Retry', style: GoogleFonts.outfit(color: Colors.white)),
                          ),
                        ],
                      ),
                    ),
                  )
                else if (filteredList.isEmpty)
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(28),
                    decoration: BoxDecoration(
                      color: _cardBg,
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: _cardBorder),
                    ),
                    child: Column(
                      children: [
                        const Icon(Icons.emoji_events_outlined, size: 60, color: Color(0xFF0052FF)),
                        const SizedBox(height: 16),
                        Text(
                          'No Profiles Found',
                          style: GoogleFonts.outfit(
                            color: _textColor,
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 6),
                        Text(
                          _searchQuery.isNotEmpty
                              ? 'No creators match "$_searchQuery". Try another keyword.'
                              : 'No profiles found in this category.',
                          style: GoogleFonts.outfit(color: _subtitleColor, fontSize: 13),
                          textAlign: TextAlign.center,
                        ),
                      ],
                    ),
                  )
                else ...[
                  // ── Top 3 Podium (Rank 2, Rank 1, Rank 3) ─────────────────
                  if (top3.length >= 3)
                    _buildPodiumView(top3[0], top3[1], top3[2])
                  else if (top3.isNotEmpty)
                    _buildPodiumPartial(top3),

                  const SizedBox(height: 16),

                  // ── Ranks 4+ List Cards ───────────────────────────────────
                  ...List.generate(displayedRemaining.length, (index) {
                    final profile = displayedRemaining[index];
                    final rankNumber = 4 + index;
                    return _buildRankListCard(profile, rankNumber);
                  }),

                  // ── Load More Button ──────────────────────────────────────
                  if (remainingRanks.length > _initialListLimit)
                    Center(
                      child: Padding(
                        padding: const EdgeInsets.symmetric(vertical: 8),
                        child: TextButton(
                          onPressed: () {
                            setState(() {
                              _showAllRanks = !_showAllRanks;
                            });
                          },
                          style: TextButton.styleFrom(
                            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                            backgroundColor: _cardBg,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(14),
                              side: BorderSide(color: _cardBorder),
                            ),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Text(
                                _showAllRanks ? 'Show Less' : 'Load More',
                                style: GoogleFonts.outfit(
                                  color: const Color(0xFF0052FF),
                                  fontWeight: FontWeight.bold,
                                  fontSize: 13,
                                ),
                              ),
                              const SizedBox(width: 4),
                              Icon(
                                _showAllRanks
                                    ? Icons.keyboard_arrow_up_rounded
                                    : Icons.keyboard_arrow_down_rounded,
                                size: 18,
                                color: const Color(0xFF0052FF),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),

                  // Safe bottom padding for floating navigation
                  const SizedBox(height: 100),
                ],
              ],
            ),
          ),
        ),
      ),
    );
  }

  /// Top 3 Podium layout: Rank 2 (Left), Rank 1 (Center - Elevated), Rank 3 (Right)
  Widget _buildPodiumView(Profile rank1, Profile rank2, Profile rank3) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.end,
      children: [
        // Rank 2 (Left)
        Expanded(
          child: _buildPodiumCard(
            profile: rank2,
            rank: 2,
            badgeColor: const Color(0xFF94A3B8), // Silver
            borderColor: const Color(0xFFCBD5E1),
            isElevated: false,
          ),
        ),
        const SizedBox(width: 8),

        // Rank 1 (Center - Gold Accent)
        Expanded(
          child: _buildPodiumCard(
            profile: rank1,
            rank: 1,
            badgeColor: const Color(0xFFF59E0B), // Gold
            borderColor: const Color(0xFFF59E0B),
            isElevated: true,
          ),
        ),
        const SizedBox(width: 8),

        // Rank 3 (Right)
        Expanded(
          child: _buildPodiumCard(
            profile: rank3,
            rank: 3,
            badgeColor: const Color(0xFFD97706), // Bronze
            borderColor: const Color(0xFFFDBA74),
            isElevated: false,
          ),
        ),
      ],
    );
  }

  /// Partial podium for 1 or 2 items
  Widget _buildPodiumPartial(List<Profile> profiles) {
    return Row(
      children: profiles.asMap().entries.map((entry) {
        final rank = entry.key + 1;
        final profile = entry.value;
        final badgeColor = rank == 1 ? const Color(0xFFF59E0B) : const Color(0xFF94A3B8);
        return Expanded(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 4),
            child: _buildPodiumCard(
              profile: profile,
              rank: rank,
              badgeColor: badgeColor,
              borderColor: badgeColor,
              isElevated: rank == 1,
            ),
          ),
        );
      }).toList(),
    );
  }

  /// Single Podium Column Card with overlapping Rank Badge, Avatar, Handle, Premium Pill, and Stats
  Widget _buildPodiumCard({
    required Profile profile,
    required int rank,
    required Color badgeColor,
    required Color borderColor,
    required bool isElevated,
  }) {
    final cardBorderColor = isElevated
        ? borderColor.withValues(alpha: 0.6)
        : (_isLight ? borderColor.withValues(alpha: 0.4) : _cardBorder);

    return GestureDetector(
      onTap: () => _navigateToProfile(profile),
      child: Stack(
        clipBehavior: Clip.none,
        alignment: Alignment.topCenter,
        children: [
          // Card Container
          Container(
            width: double.infinity,
            margin: const EdgeInsets.only(top: 14),
            padding: EdgeInsets.only(
              top: 20,
              bottom: 14,
              left: 6,
              right: 6,
            ),
            decoration: BoxDecoration(
              color: _cardBg,
              borderRadius: BorderRadius.circular(18),
              border: Border.all(
                color: cardBorderColor,
                width: isElevated ? 1.5 : 1.0,
              ),
              boxShadow: isElevated
                  ? [
                      BoxShadow(
                        color: const Color(0xFFF59E0B).withValues(alpha: 0.08),
                        blurRadius: 16,
                        offset: const Offset(0, 6),
                      ),
                    ]
                  : [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.03),
                        blurRadius: 8,
                        offset: const Offset(0, 2),
                      ),
                    ],
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                // Avatar with colored ring + diamond badge
                Stack(
                  alignment: Alignment.bottomRight,
                  children: [
                    Container(
                      padding: const EdgeInsets.all(2.5),
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        border: Border.all(color: badgeColor, width: 1.8),
                      ),
                      child: CircleAvatar(
                        radius: isElevated ? 26 : 22,
                        backgroundColor: _cardBorder,
                        backgroundImage: getAvatarImage(profile.avatar, _apiService.baseUrl),
                      ),
                    ),
                    // Small diamond badge
                    Container(
                      padding: const EdgeInsets.all(2),
                      decoration: BoxDecoration(
                        color: _isLight ? Colors.white : const Color(0xFF131622),
                        shape: BoxShape.circle,
                      ),
                      child: Icon(
                        Icons.diamond,
                        size: 11,
                        color: badgeColor,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),

                // Name
                Text(
                  profile.name,
                  style: GoogleFonts.outfit(
                    fontSize: 13,
                    fontWeight: FontWeight.bold,
                    color: _textColor,
                  ),
                  textAlign: TextAlign.center,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 2),

                // Username handle
                Text(
                  '@${profile.username}',
                  style: GoogleFonts.outfit(
                    fontSize: 10.5,
                    color: _subtitleColor,
                  ),
                  textAlign: TextAlign.center,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 8),

                // Premium Pill Badge
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                  decoration: BoxDecoration(
                    color: _badgeBg,
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(Icons.diamond, size: 10, color: Color(0xFFD97706)),
                      const SizedBox(width: 3),
                      Text(
                        'Premium',
                        style: GoogleFonts.outfit(
                          color: const Color(0xFFD97706),
                          fontSize: 9.5,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 12),

                // Divider line
                Divider(
                  height: 1,
                  color: _cardBorder.withValues(alpha: 0.6),
                ),
                const SizedBox(height: 8),

                // Bottom Stats Row (Points & Taps)
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: [
                    // Points
                    Column(
                      children: [
                        Text(
                          profile.diamonds,
                          style: GoogleFonts.outfit(
                            fontSize: 13,
                            fontWeight: FontWeight.bold,
                            color: const Color(0xFF6366F1),
                          ),
                        ),
                        Text(
                          'Points',
                          style: GoogleFonts.outfit(
                            fontSize: 9.5,
                            color: _subtitleColor,
                          ),
                        ),
                      ],
                    ),

                    // Vertical subtle separator
                    Container(
                      height: 16,
                      width: 1,
                      color: _cardBorder,
                    ),

                    // Taps
                    Column(
                      children: [
                        Text(
                          '${profile.tapCount}',
                          style: GoogleFonts.outfit(
                            fontSize: 13,
                            fontWeight: FontWeight.bold,
                            color: _isLight ? const Color(0xFF0F766E) : Colors.tealAccent,
                          ),
                        ),
                        Text(
                          'Taps',
                          style: GoogleFonts.outfit(
                            fontSize: 9.5,
                            color: _subtitleColor,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ],
            ),
          ),

          // Overlapping Top Rank Number Badge
          Positioned(
            top: 0,
            child: Container(
              width: 28,
              height: 28,
              decoration: BoxDecoration(
                color: badgeColor,
                shape: BoxShape.circle,
                border: Border.all(
                  color: _isLight ? Colors.white : const Color(0xFF070913),
                  width: 2.5,
                ),
                boxShadow: [
                  BoxShadow(
                    color: badgeColor.withValues(alpha: 0.4),
                    blurRadius: 6,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              alignment: Alignment.center,
              child: Text(
                '$rank',
                style: GoogleFonts.outfit(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                  fontSize: 12.5,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  /// Rank 4+ Horizontal Leaderboard Card
  Widget _buildRankListCard(Profile profile, int rank) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      decoration: BoxDecoration(
        color: _cardBg,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: _cardBorder),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.02),
            blurRadius: 6,
            offset: const Offset(0, 1),
          ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(16),
          onTap: () => _navigateToProfile(profile),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
            child: Row(
              children: [
                // Rank Box
                Container(
                  width: 34,
                  height: 34,
                  decoration: BoxDecoration(
                    color: _isLight ? const Color(0xFFF1F5F9) : const Color(0xFF1B1E2E),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  alignment: Alignment.center,
                  child: Text(
                    '$rank',
                    style: GoogleFonts.outfit(
                      color: _textColor,
                      fontWeight: FontWeight.bold,
                      fontSize: 14,
                    ),
                  ),
                ),
                const SizedBox(width: 12),

                // Avatar
                CircleAvatar(
                  radius: 20,
                  backgroundColor: _cardBorder,
                  backgroundImage: getAvatarImage(profile.avatar, _apiService.baseUrl),
                ),
                const SizedBox(width: 12),

                // Name, Username & Badge
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
                                fontSize: 14.5,
                              ),
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                          const SizedBox(width: 4),
                          const Icon(
                            Icons.verified,
                            color: Color(0xFF0052FF),
                            size: 15,
                          ),
                        ],
                      ),
                      const SizedBox(height: 1),
                      Text(
                        '@${profile.username}',
                        style: GoogleFonts.outfit(
                          color: _subtitleColor,
                          fontSize: 12,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 4),
                      // Premium badge
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 1.5),
                        decoration: BoxDecoration(
                          color: _badgeBg,
                          borderRadius: BorderRadius.circular(5),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            const Icon(Icons.diamond, size: 9, color: Color(0xFFD97706)),
                            const SizedBox(width: 3),
                            Text(
                              'Premium',
                              style: GoogleFonts.outfit(
                                color: const Color(0xFFD97706),
                                fontSize: 9.5,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),

                // Stats: Points & Taps
                Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Row(
                      children: [
                        Text(
                          profile.diamonds,
                          style: GoogleFonts.outfit(
                            color: const Color(0xFF6366F1),
                            fontSize: 13,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(width: 3),
                        Text(
                          'Points',
                          style: GoogleFonts.outfit(
                            color: _subtitleColor,
                            fontSize: 11,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 2),
                    Row(
                      children: [
                        Text(
                          '${profile.tapCount}',
                          style: GoogleFonts.outfit(
                            color: _isLight ? const Color(0xFF0F766E) : Colors.tealAccent,
                            fontSize: 13,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(width: 3),
                        Text(
                          'Taps',
                          style: GoogleFonts.outfit(
                            color: _subtitleColor,
                            fontSize: 11,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
                const SizedBox(width: 8),

                // Chevron
                Icon(
                  Icons.arrow_forward_ios_rounded,
                  color: _subtitleColor.withValues(alpha: 0.5),
                  size: 14,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

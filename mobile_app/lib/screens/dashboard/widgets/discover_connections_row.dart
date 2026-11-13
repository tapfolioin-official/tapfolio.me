import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../models/connection.dart';
import '../../../models/profile.dart';
import '../../../core/utils/image_helper.dart';

class DiscoverUserItem {
  final int userId;
  final String username;
  final String name;
  final String avatar;
  final String tagline;
  final String? location;
  final List<String> tags;
  final bool isPremium;
  final int mutualCount;

  const DiscoverUserItem({
    required this.userId,
    required this.username,
    required this.name,
    required this.avatar,
    required this.tagline,
    this.location,
    this.tags = const [],
    this.isPremium = false,
    this.mutualCount = 0,
  });

  factory DiscoverUserItem.fromProfile(Profile p) => DiscoverUserItem(
        userId: p.userId,
        username: p.username,
        name: p.name.isNotEmpty ? p.name : p.username,
        avatar: p.avatar,
        tagline: p.tagline.isNotEmpty ? p.tagline : "Let's connect!",
        location: p.location,
        tags: p.tags.map((t) => t.text).where((t) => t.isNotEmpty).toList(),
        isPremium: p.isPremium,
        mutualCount: 0, // Will be populated later if available
      );

  factory DiscoverUserItem.fromConnection(Connection c) => DiscoverUserItem(
        userId: c.other.userId,
        username: c.other.name ?? 'user_${c.other.userId}',
        name: (c.other.name != null && c.other.name!.isNotEmpty)
            ? c.other.name!
            : 'User',
        avatar: c.other.avatar,
        tagline:
            c.other.tagline.isNotEmpty ? c.other.tagline : "Let's connect!",
      );
}

class DiscoverConnectionsRow extends StatelessWidget {
  final List<DiscoverUserItem> discoverUsers;
  final Set<int> connectedUserIds;
  final Set<int> connectingUserIds;
  final String baseUrl;
  final bool isLoading;
  final VoidCallback onViewAllTap;
  final Function(DiscoverUserItem) onUserTap;
  final Function(DiscoverUserItem) onConnectTap;

  const DiscoverConnectionsRow({
    super.key,
    required this.discoverUsers,
    required this.connectedUserIds,
    this.connectingUserIds = const {},
    required this.baseUrl,
    this.isLoading = false,
    required this.onViewAllTap,
    required this.onUserTap,
    required this.onConnectTap,
  });

  @override
  Widget build(BuildContext context) {
    final isLight = Theme.of(context).brightness == Brightness.light;
    final cardBg = isLight ? Colors.white : const Color(0xFF13131F);
    final borderColor = isLight
        ? const Color(0xFFE2E8F0)
        : Colors.white.withValues(alpha: 0.08);
    final titleColor = isLight ? const Color(0xFF0F172A) : Colors.white;
    final subColor =
        isLight ? const Color(0xFF64748B) : Colors.white.withValues(alpha: 0.50);

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
      child: Container(
        padding: const EdgeInsets.fromLTRB(16, 16, 16, 16),
        decoration: BoxDecoration(
          color: cardBg,
          borderRadius: BorderRadius.circular(22),
          border: Border.all(color: borderColor, width: 1),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: isLight ? 0.03 : 0.20),
              blurRadius: 16,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // ── Section Header ──────────────────────────────────────────────
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Discover Connections',
                  style: GoogleFonts.outfit(
                    color: titleColor,
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    letterSpacing: -0.2,
                  ),
                ),
                InkWell(
                  onTap: () {
                    HapticFeedback.lightImpact();
                    onViewAllTap();
                  },
                  borderRadius: BorderRadius.circular(12),
                  child: Padding(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Text(
                          'View all',
                          style: GoogleFonts.outfit(
                            color: const Color(0xFF0052FF),
                            fontSize: 13,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        const SizedBox(width: 4),
                        const Icon(
                          Icons.arrow_forward_rounded,
                          color: Color(0xFF0052FF),
                          size: 14,
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),

            const SizedBox(height: 14),

            // ── Horizontal Avatars Row / Skeletons / Empty State ────────────
            if (isLoading)
              _buildLoadingSkeletons(isLight, subColor)
            else if (discoverUsers.isEmpty)
              _buildEmptyState(subColor)
            else
              SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                physics: const BouncingScrollPhysics(),
                child: Row(
                  children: [
                    for (final user in discoverUsers) ...[
                      DiscoverConnectionAvatar(
                        user: user,
                        isConnected: connectedUserIds.contains(user.userId),
                        isConnecting: connectingUserIds.contains(user.userId),
                        baseUrl: baseUrl,
                        titleColor: titleColor,
                        subColor: subColor,
                        isLight: isLight,
                        onProfileTap: () => onUserTap(user),
                        onConnectTap: () => onConnectTap(user),
                      ),
                      const SizedBox(width: 14),
                    ],

                    // More Connections Button
                    _buildMoreButton(
                      titleColor: titleColor,
                      subColor: subColor,
                      isLight: isLight,
                      onTap: onViewAllTap,
                    ),
                  ],
                ),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildLoadingSkeletons(bool isLight, Color subColor) {
    final shimmerBg = isLight
        ? const Color(0xFFE2E8F0).withValues(alpha: 0.6)
        : Colors.white.withValues(alpha: 0.08);

    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      physics: const NeverScrollableScrollPhysics(),
      child: Row(
        children: List.generate(4, (index) {
          return Padding(
            padding: const EdgeInsets.only(right: 14.0),
            child: SizedBox(
              width: 76,
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Container(
                    width: 54,
                    height: 54,
                    decoration: BoxDecoration(
                      color: shimmerBg,
                      shape: BoxShape.circle,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Container(
                    width: 48,
                    height: 10,
                    decoration: BoxDecoration(
                      color: shimmerBg,
                      borderRadius: BorderRadius.circular(4),
                    ),
                  ),
                  const SizedBox(height: 4),
                  Container(
                    width: 36,
                    height: 8,
                    decoration: BoxDecoration(
                      color: shimmerBg,
                      borderRadius: BorderRadius.circular(4),
                    ),
                  ),
                ],
              ),
            ),
          );
        }),
      ),
    );
  }

  Widget _buildEmptyState(Color subColor) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 12.0),
      child: Center(
        child: Text(
          'No new connections yet',
          style: GoogleFonts.outfit(
            color: subColor,
            fontSize: 13,
            fontWeight: FontWeight.w500,
          ),
        ),
      ),
    );
  }

  Widget _buildMoreButton({
    required Color titleColor,
    required Color subColor,
    required bool isLight,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: () {
        HapticFeedback.lightImpact();
        onTap();
      },
      borderRadius: BorderRadius.circular(16),
      child: SizedBox(
        width: 76,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 54,
              height: 54,
              decoration: BoxDecoration(
                color: isLight
                    ? const Color(0xFFEFF6FF)
                    : Colors.white.withValues(alpha: 0.06),
                shape: BoxShape.circle,
                border: Border.all(
                  color: const Color(0xFF0052FF).withValues(alpha: 0.20),
                ),
              ),
              alignment: Alignment.center,
              child: const Icon(
                Icons.people_outline_rounded,
                color: Color(0xFF0052FF),
                size: 24,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'More',
              textAlign: TextAlign.center,
              style: GoogleFonts.outfit(
                color: titleColor,
                fontSize: 11.5,
                fontWeight: FontWeight.w700,
              ),
            ),
            const SizedBox(height: 2),
            Text(
              'Connections',
              textAlign: TextAlign.center,
              style: GoogleFonts.outfit(
                color: subColor,
                fontSize: 9.5,
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

/// Reusable Discover Connection Avatar Component
class DiscoverConnectionAvatar extends StatelessWidget {
  final DiscoverUserItem user;
  final bool isConnected;
  final bool isConnecting;
  final String baseUrl;
  final Color titleColor;
  final Color subColor;
  final bool isLight;
  final VoidCallback onProfileTap;
  final VoidCallback onConnectTap;

  const DiscoverConnectionAvatar({
    super.key,
    required this.user,
    required this.isConnected,
    this.isConnecting = false,
    required this.baseUrl,
    required this.titleColor,
    required this.subColor,
    required this.isLight,
    required this.onProfileTap,
    required this.onConnectTap,
  });

  @override
  Widget build(BuildContext context) {
    final avatarProvider = getAvatarImage(user.avatar, baseUrl);

    return InkWell(
      onTap: () {
        HapticFeedback.lightImpact();
        onProfileTap();
      },
      borderRadius: BorderRadius.circular(16),
      child: SizedBox(
        width: 76,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // ── Avatar with state-driven badge ─────────────────────────────
            Stack(
              clipBehavior: Clip.none,
              children: [
                CircleAvatar(
                  radius: 27,
                  backgroundColor: isLight ? const Color(0xFFE2E8F0) : const Color(0xFF1E293B),
                  backgroundImage: avatarProvider,
                ),

                // Badge: Green ✓ if connected, Blue + if not connected, Spinner if connecting
                Positioned(
                  right: -2,
                  bottom: -2,
                  child: GestureDetector(
                    onTap: () {
                      HapticFeedback.lightImpact();
                      if (!isConnected && !isConnecting) {
                        onConnectTap();
                      } else {
                        onProfileTap();
                      }
                    },
                    child: Container(
                      width: 20,
                      height: 20,
                      decoration: BoxDecoration(
                        color: isConnected
                            ? const Color(0xFF10B981) // Green for connected
                            : const Color(0xFF0052FF), // Blue for unconnected
                        shape: BoxShape.circle,
                        border: Border.all(
                          color: isLight
                              ? Colors.white
                              : const Color(0xFF13131F),
                          width: 1.8,
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: (isConnected
                                    ? const Color(0xFF10B981)
                                    : const Color(0xFF0052FF))
                                .withValues(alpha: 0.35),
                            blurRadius: 4,
                            offset: const Offset(0, 1),
                          ),
                        ],
                      ),
                      alignment: Alignment.center,
                      child: isConnecting
                          ? const SizedBox(
                              width: 10,
                              height: 10,
                              child: CircularProgressIndicator(
                                strokeWidth: 1.5,
                                color: Colors.white,
                              ),
                            )
                          : Icon(
                              isConnected
                                  ? Icons.check_rounded // Green ✓ tick
                                  : Icons.add_rounded,  // Blue + plus
                              color: Colors.white,
                              size: 13,
                            ),
                    ),
                  ),
                ),
              ],
            ),

            const SizedBox(height: 8),

            // Name
            Text(
              user.name,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              textAlign: TextAlign.center,
              style: GoogleFonts.outfit(
                color: titleColor,
                fontSize: 11.5,
                fontWeight: FontWeight.w700,
              ),
            ),

            const SizedBox(height: 2),

            // Role / Tagline
            Text(
              user.tagline,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              textAlign: TextAlign.center,
              style: GoogleFonts.outfit(
                color: subColor,
                fontSize: 9.5,
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

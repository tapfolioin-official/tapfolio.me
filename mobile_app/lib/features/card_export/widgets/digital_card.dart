import 'package:flutter/material.dart';

import '../../../models/social_link.dart';
import '../../../models/tag.dart';
import '../models/card_theme.dart';
import 'card_background.dart';
import 'profile_header.dart';
import 'qr_section.dart';
import 'social_icons_row.dart';
import 'branding_footer.dart';

/// Apple-Event-style digital share card with responsive multi-format adaptation.
///
/// Supports:
///  • Story (9:16 portrait)
///  • Post (4:5 portrait)
///  • Card (landscape business card / wallet)
class DigitalCard extends StatelessWidget {
  final String name;
  final String tagline;
  final String? avatar;
  final String profileUrl;
  final String baseUrl;
  final bool removeBranding;
  final bool isPremium;
  final bool isOnline;
  final CardThemeType theme;
  final double aspectRatio;

  // Social links for the icon row
  final List<SocialLink> socials;

  // Kept for backward compatibility — NOT displayed on the card
  final String? location;
  final String? bio;
  final List<Tag> tags;

  const DigitalCard({
    super.key,
    required this.name,
    required this.tagline,
    this.avatar,
    required this.profileUrl,
    required this.baseUrl,
    required this.removeBranding,
    this.isPremium = false,
    this.isOnline = true,
    this.theme = CardThemeType.light,
    this.aspectRatio = 9 / 16,
    this.socials = const [],
    this.location,
    this.bio,
    this.tags = const [],
  });

  @override
  Widget build(BuildContext context) {
    final themeData = CardExportThemeData.fromType(theme);

    return LayoutBuilder(
      builder: (context, box) {
        final w = box.maxWidth;
        final h = box.maxHeight;
        final isLandscape = w > h;

        return CardBackground(
          theme: theme,
          child: isLandscape
              ? _buildLandscapeLayout(w, h, themeData)
              : _buildPortraitLayout(w, h, themeData),
        );
      },
    );
  }

  /// ── Portrait Layout (Story 9:16 & Post 4:5) ──────────────────────────────
  Widget _buildPortraitLayout(
      double w, double h, CardExportThemeData themeData) {
    final isCompact = (w / h) > 0.65; // e.g. Post 4:5 (0.80) vs Story 9:16 (0.56)

    final avatarRadius = isCompact
        ? (w * 0.13).clamp(26.0, 75.0)
        : (w * 0.155).clamp(30.0, 90.0);

    // Calculated QR area ensuring high resolution and solid quiet zone
    final qrSize = isCompact
        ? (h * 0.22).clamp(90.0, 240.0)
        : (h * 0.185).clamp(85.0, 300.0);

    final socialIconSz = (w * 0.090).clamp(18.0, 44.0);
    final footerScale = (w / 380.0).clamp(0.55, 1.15);

    final hPad = w * 0.055;
    final vPadTop = h * (isCompact ? 0.025 : 0.030);
    final vPadBottom = h * (isCompact ? 0.020 : 0.024);
    final gapQrSocial = h * 0.016;
    final gapSocialFooter = h * 0.014;

    return Padding(
      padding: EdgeInsets.fromLTRB(hPad, vPadTop, hPad, vPadBottom),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          // ── 1. Profile Header ─────────────────────────────────────────────
          Expanded(
            flex: isCompact ? 42 : 46,
            child: Center(
              child: ProfileHeader(
                name: name,
                tagline: tagline.trim().isNotEmpty ? tagline : null,
                avatar: avatar,
                baseUrl: baseUrl,
                isOnline: isOnline,
                isPremium: isPremium,
                avatarRadius: avatarRadius,
                theme: themeData,
              ),
            ),
          ),

          // ── 2. QR Section ─────────────────────────────────────────────────
          Expanded(
            flex: isCompact ? 42 : 40,
            child: Center(
              child: QrSection(
                url: profileUrl,
                qrSize: qrSize,
                theme: themeData,
              ),
            ),
          ),

          // ── 3. Social Icons Row ───────────────────────────────────────────
          if (socials.isNotEmpty) ...[
            SizedBox(height: gapQrSocial),
            SocialIconsRow(
              socials: socials,
              iconSize: socialIconSz,
              theme: themeData,
            ),
          ],

          // ── 4. Branding Footer ────────────────────────────────────────────
          SizedBox(height: gapSocialFooter),
          BrandingFooter(
            removeBranding: removeBranding,
            profileUrl: profileUrl,
            scale: footerScale,
            theme: themeData,
          ),
        ],
      ),
    );
  }

  /// ── Landscape Layout (Business Card / Wallet) ────────────────────────────
  Widget _buildLandscapeLayout(
      double w, double h, CardExportThemeData themeData) {
    final avatarRadius = (h * 0.22).clamp(24.0, 60.0);
    final qrSize = (h * 0.52).clamp(80.0, 260.0);
    final socialIconSz = (h * 0.12).clamp(16.0, 36.0);
    final footerScale = (h / 240.0).clamp(0.55, 1.0);

    final hPad = w * 0.055;
    final vPad = h * 0.06;

    return Padding(
      padding: EdgeInsets.symmetric(horizontal: hPad, vertical: vPad),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          // Left column: Profile info + Socials + Footer
          Expanded(
            flex: 58,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                ProfileHeader(
                  name: name,
                  tagline: tagline.trim().isNotEmpty ? tagline : null,
                  avatar: avatar,
                  baseUrl: baseUrl,
                  isOnline: isOnline,
                  isPremium: isPremium,
                  avatarRadius: avatarRadius,
                  theme: themeData,
                ),
                if (socials.isNotEmpty)
                  SocialIconsRow(
                    socials: socials,
                    iconSize: socialIconSz,
                    theme: themeData,
                  ),
                BrandingFooter(
                  removeBranding: removeBranding,
                  profileUrl: profileUrl,
                  scale: footerScale,
                  theme: themeData,
                ),
              ],
            ),
          ),

          const SizedBox(width: 12),

          // Right column: QR Code
          Expanded(
            flex: 42,
            child: Center(
              child: QrSection(
                url: profileUrl,
                qrSize: qrSize,
                theme: themeData,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

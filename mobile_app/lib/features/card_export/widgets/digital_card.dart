import 'package:flutter/material.dart';

import '../../../models/social_link.dart';
import '../../../models/tag.dart';
import '../models/card_theme.dart';
import 'card_background.dart';
import 'profile_header.dart';
import 'qr_section.dart';
import 'social_icons_row.dart';
import 'branding_footer.dart';

/// Apple-Event-style digital share card.
///
/// Layout (Instagram Story template):
/// ┌────────────────────────┐
/// │     Tapfolio ●         │  ← Brand
/// │     [Large Avatar]     │  ← Bigger avatar + gradient ring
/// │   Name ✓               │  ← Name + verified glow
/// │   Tagline              │  ← One-liner
/// │   ✨ Let's Connect     │  ← Sparkle divider
/// │   ┌──────────────┐     │
/// │   │   QR CODE    │     │  ← Glass QR card
/// │   └──────────────┘     │
/// │   Tap or Scan          │
/// │   ○ ○ ○ ○              │  ← Social icons
/// │   Create yours →       │
/// │   tapfolio.me          │  ← CTA footer
/// └────────────────────────┘
///
/// No description box. No bio. No tags card. Just pure branding.
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
    this.theme = CardThemeType.aurora,
    this.socials = const [],
    this.location,
    this.bio,
    this.tags = const [],
  });

  @override
  Widget build(BuildContext context) {
    return AspectRatio(
      aspectRatio: 9 / 16,
      child: LayoutBuilder(
        builder: (context, box) {
          final w = box.maxWidth;
          final h = box.maxHeight;

          // ── Proportional sizes ───────────────────────────────────
          final avatarRadius = (w * 0.155).clamp(30.0, 90.0);
          final qrSize = (h * 0.175).clamp(70.0, 300.0);
          final socialIconSz = (w * 0.095).clamp(20.0, 48.0);
          final footerScale = (w / 400.0).clamp(0.55, 1.20);

          final hPad = w * 0.058;
          final vPadTop = h * 0.030;
          final vPadBottom = h * 0.024;
          final gapQrSocial = h * 0.020;
          final gapSocialFooter = h * 0.016;
          final themeData = CardExportThemeData.fromType(theme);

          return CardBackground(
            theme: theme,
            child: Padding(
              padding: EdgeInsets.fromLTRB(hPad, vPadTop, hPad, vPadBottom),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  // ── 1. Profile Header ──────────────────────────────
                  // Logo + avatar + name (with verified glow) + tagline
                  // + ✨ Let's Connect sparkle divider
                  Expanded(
                    flex: 48,
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

                  // ── 2. QR Section ──────────────────────────────────
                  Expanded(
                    flex: 38,
                    child: Center(
                      child: QrSection(url: profileUrl, qrSize: qrSize, theme: themeData),
                    ),
                  ),

                  // ── 3. Social Icons Row ────────────────────────────
                  if (socials.isNotEmpty) ...[
                    SizedBox(height: gapQrSocial),
                    SocialIconsRow(socials: socials, iconSize: socialIconSz, theme: themeData),
                  ],
                  // ── 4. Footer ──────────────────────────────────────
                  SizedBox(height: gapSocialFooter),
                  BrandingFooter(
                    removeBranding: removeBranding,
                    profileUrl: profileUrl,
                    scale: footerScale,
                    theme: themeData,
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}

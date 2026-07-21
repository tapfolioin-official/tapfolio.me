import 'package:flutter/material.dart';

import '../../../models/tag.dart';
import 'card_background.dart';
import 'profile_header.dart';
import 'profile_info_card.dart';
import 'qr_section.dart';
import 'branding_footer.dart';

class DigitalCard extends StatelessWidget {
  final String name;
  final String tagline;
  final String? avatar;
  final String profileUrl;
  final String baseUrl;
  final bool removeBranding;
  final bool isPremium;
  final bool isOnline;

  // Profile detail fields (shown in ProfileInfoCard)
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
    this.location,
    this.bio,
    this.tags = const [],
  });

  bool get _hasInfo =>
      (location != null && location!.isNotEmpty) ||
      (bio != null && bio!.isNotEmpty) ||
      tags.isNotEmpty;

  @override
  Widget build(BuildContext context) {
    return AspectRatio(
      aspectRatio: 9 / 16,
      child: LayoutBuilder(
        builder: (context, box) {
          final w = box.maxWidth;
          final h = box.maxHeight;

          // ── Proportional sizes ───────────────────────────────────
          final avatarRadius = (w * 0.143).clamp(28.0, 85.0);
          final qrSize       = (h * 0.190).clamp(72.0, 320.0);
          // Scale factor for ProfileInfoCard (relative to a 400px wide card)
          final infoScale    = (w / 400.0).clamp(0.55, 1.20);

          final hPad       = w * 0.058;
          final vPadTop    = h * 0.034;
          final vPadBottom = h * 0.026;
          final gapSm      = h * 0.014;
          final gapFooter  = h * 0.010;

          return CardBackground(
            child: Padding(
              padding: EdgeInsets.fromLTRB(
                hPad, vPadTop, hPad, vPadBottom,
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  // ── 1. Profile Header ─────────────────────────────
                  // logo + avatar + name (with blue tick) + tagline
                  Expanded(
                    flex: 46,
                    child: Center(
                      child: ProfileHeader(
                        name: name,
                        tagline: tagline.trim().isNotEmpty ? tagline : null,
                        avatar: avatar,
                        baseUrl: baseUrl,
                        isOnline: isOnline,
                        isPremium: isPremium,
                        avatarRadius: avatarRadius,
                      ),
                    ),
                  ),

                  // ── 2. Profile Info Card (location / bio / tags) ──
                  if (_hasInfo) ...[
                    SizedBox(height: gapSm),
                    ProfileInfoCard(
                      location: location,
                      bio: bio,
                      tags: tags,
                      scale: infoScale,
                    ),
                  ],

                  SizedBox(height: gapSm),

                  // ── 3. QR Section ─────────────────────────────────
                  Expanded(
                    flex: 42,
                    child: Center(
                      child: QrSection(url: profileUrl, qrSize: qrSize),
                    ),
                  ),

                  // ── 4. Footer ─────────────────────────────────────
                  SizedBox(height: gapFooter),
                  BrandingFooter(
                    removeBranding: removeBranding,
                    profileUrl: profileUrl,
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

import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../models/card_theme.dart';

/// Bottom branding footer — theme-aware.
///
/// Shows the profile URL and a frosted-pill CTA: "Create yours → tapfolio.me".
class BrandingFooter extends StatelessWidget {
  final bool removeBranding;
  final String profileUrl;
  final double scale;
  final CardExportThemeData theme;

  const BrandingFooter({
    super.key,
    required this.removeBranding,
    required this.profileUrl,
    this.scale = 1.0,
    required this.theme,
  });

  @override
  Widget build(BuildContext context) {
    final t = theme;
    final cleanUrl = profileUrl.replaceFirst(RegExp(r'^https?://'), '');
    final urlFs = (11.0 * scale).clamp(8.0, 15.0);
    final ctaFs = (9.5 * scale).clamp(7.0, 13.0);
    final padH  = (12.0 * scale).clamp(8.0, 16.0);
    final padV  = (5.0 * scale).clamp(3.0, 8.0);
    final radius = (20.0 * scale).clamp(12.0, 24.0);
    final gap   = (6.0 * scale).clamp(3.0, 10.0);

    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Text(
          cleanUrl,
          style: GoogleFonts.outfit(
            color: t.footerUrlColor,
            fontSize: urlFs,
            fontWeight: FontWeight.w500,
            letterSpacing: 0.2,
          ),
        ),
        if (!removeBranding) ...[
          SizedBox(height: gap),
          Container(
            padding: EdgeInsets.symmetric(horizontal: padH, vertical: padV),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(radius),
              color: t.footerPillBg,
              border: Border.all(color: t.footerPillBorder, width: 0.7),
            ),
            child: Text(
              'Create yours →  tapfolio.me',
              style: GoogleFonts.outfit(
                color: t.footerPillText,
                fontSize: ctaFs,
                fontWeight: FontWeight.w600,
                letterSpacing: 0.6,
              ),
            ),
          ),
        ],
      ],
    );
  }
}

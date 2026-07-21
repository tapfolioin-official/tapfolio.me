import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class BrandingFooter extends StatelessWidget {
  final bool removeBranding;
  final String profileUrl;

  const BrandingFooter({
    super.key,
    required this.removeBranding,
    required this.profileUrl,
  });

  @override
  Widget build(BuildContext context) {
    final cleanUrl = profileUrl.replaceFirst(RegExp(r'^https?://'), '');

    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        // URL
        Text(
          cleanUrl,
          style: GoogleFonts.outfit(
            color: Colors.white38,
            fontSize: 11,
            fontWeight: FontWeight.w500,
            letterSpacing: 0.2,
          ),
        ),

        if (!removeBranding) ...[
          const SizedBox(height: 3),
          Text(
            'One Tap. Endless Connections.',
            style: GoogleFonts.outfit(
              color: Colors.white.withValues(alpha: 0.20),
              fontSize: 9,
              fontWeight: FontWeight.w600,
              letterSpacing: 0.8,
            ),
          ),
        ],
      ],
    );
  }
}

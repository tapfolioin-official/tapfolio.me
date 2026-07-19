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
        Text(
          cleanUrl,
          style: GoogleFonts.outfit(
            color: Colors.white38,
            fontSize: 12,
            fontWeight: FontWeight.w500,
          ),
        ),
        if (!removeBranding) ...[
          const SizedBox(height: 8),
          Text(
            'Powered by Tapfolio',
            style: GoogleFonts.outfit(
              color: Colors.white24,
              fontSize: 10,
              fontWeight: FontWeight.bold,
              letterSpacing: 1.0,
            ),
          ),
        ],
      ],
    );
  }
}

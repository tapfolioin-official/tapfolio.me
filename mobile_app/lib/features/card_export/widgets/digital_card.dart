import 'package:flutter/material.dart';
import 'card_background.dart';
import 'profile_header.dart';
import 'qr_section.dart';
import 'branding_footer.dart';

class DigitalCard extends StatelessWidget {
  final String name;
  final String tagline;
  final String? avatar;
  final String profileUrl;
  final String baseUrl;
  final bool removeBranding;

  const DigitalCard({
    super.key,
    required this.name,
    required this.tagline,
    this.avatar,
    required this.profileUrl,
    required this.baseUrl,
    required this.removeBranding,
  });

  @override
  Widget build(BuildContext context) {
    return AspectRatio(
      aspectRatio: 9 / 16,
      child: CardBackground(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 32),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              // Branding / Top Accent indicator
              const SizedBox(height: 10),

              // Profile Header
              ProfileHeader(
                name: name,
                tagline: tagline,
                avatar: avatar,
                baseUrl: baseUrl,
              ),

              // Local vector QR code Section
              QrSection(url: profileUrl),

              // Footer Url and Branding label
              BrandingFooter(
                removeBranding: removeBranding,
                profileUrl: profileUrl,
              ),
            ],
          ),
        ),
      ),
    );
  }
}

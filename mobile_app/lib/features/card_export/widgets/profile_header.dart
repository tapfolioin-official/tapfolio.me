import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class ProfileHeader extends StatelessWidget {
  final String name;
  final String tagline;
  final String? avatar;
  final String baseUrl;

  const ProfileHeader({
    super.key,
    required this.name,
    required this.tagline,
    this.avatar,
    required this.baseUrl,
  });

  @override
  Widget build(BuildContext context) {
    final avatarUrl = avatar != null && avatar!.isNotEmpty && avatar != '/profile_avatar.png'
        ? (avatar!.startsWith('http') ? avatar! : '$baseUrl$avatar')
        : null;

    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        // Avatar with soft glow border
        Container(
          width: 80,
          height: 80,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            border: Border.all(color: const Color(0xFF6366F1), width: 3),
            boxShadow: [
              BoxShadow(
                color: const Color(0xFF6366F1).withValues(alpha: 0.25),
                blurRadius: 16,
                spreadRadius: 2,
              ),
            ],
          ),
          child: ClipOval(
            child: avatarUrl != null
                ? Image.network(
                    avatarUrl,
                    fit: BoxFit.cover,
                    errorBuilder: (_, _, _) => _buildPlaceholder(),
                  )
                : _buildPlaceholder(),
          ),
        ),
        const SizedBox(height: 16),

        // Name
        Text(
          name,
          textAlign: TextAlign.center,
          style: GoogleFonts.outfit(
            color: Colors.white,
            fontSize: 22,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 6),

        // Tagline
        if (tagline.isNotEmpty)
          Text(
            tagline,
            textAlign: TextAlign.center,
            style: GoogleFonts.outfit(
              color: Colors.white60,
              fontSize: 13,
              fontStyle: FontStyle.italic,
            ),
          ),
      ],
    );
  }

  Widget _buildPlaceholder() {
    return Container(
      color: const Color(0xFF1F2937),
      child: const Icon(Icons.person, color: Colors.white54, size: 40),
    );
  }
}

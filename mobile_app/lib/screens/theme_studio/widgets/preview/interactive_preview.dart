import 'package:flutter/material.dart' hide CardTheme, ButtonTheme;
import 'package:google_fonts/google_fonts.dart';
import '../../models/theme_models.dart';
import '../../../../models/profile.dart';
import '../../../../services/api_service.dart';
import '../../../../core/utils/image_helper.dart';

class InteractivePreview extends StatefulWidget {
  final ThemeSettings settings;
  final Profile? profile;
  const InteractivePreview({super.key, required this.settings, this.profile});

  @override
  State<InteractivePreview> createState() => _InteractivePreviewState();
}

class _InteractivePreviewState extends State<InteractivePreview> {
  bool _isDark = true;

  @override
  Widget build(BuildContext context) {
    final colors = widget.settings.colors;
    final bg = widget.settings.background;
    final typo = widget.settings.typography;
    final cards = widget.settings.cards;
    final btn = widget.settings.buttons;
    final avatar = widget.settings.avatar;

    // Parse Solid background
    Color bgColor = const Color(0xFFF9FAFB);
    try {
      final val = colors.background.replaceAll('#', '');
      bgColor = Color(int.parse('FF$val', radix: 16));
    } catch (_) {}

    if (bg.type == 'aurora') {
      bgColor = const Color(0xFF0C1020);
    } else if (bg.type == 'animated_gradient') {
      bgColor = const Color(0xFF1E1B4B);
    } else if (bg.type == 'particles') {
      bgColor = const Color(0xFF020617);
    }

    final bool isBackgroundDark = bgColor.computeLuminance() < 0.5;

    // Styles for Card
    double cardRadius = 16.0;
    try {
      final numVal = int.parse(cards.borderRadius.replaceAll(RegExp(r'[^0-9]'), ''));
      cardRadius = numVal.toDouble();
    } catch (_) {}

    Color cardBg = isBackgroundDark ? Colors.white.withOpacity(0.06) : Colors.black.withOpacity(0.04);
    try {
      final val = colors.card.replaceAll('#', '');
      cardBg = Color(int.parse('FF$val', radix: 16)).withOpacity(cards.opacity);
    } catch (_) {}

    Color textColor = isBackgroundDark ? Colors.white : const Color(0xFF111827);
    try {
      final val = colors.text.replaceAll('#', '');
      textColor = Color(int.parse('FF$val', radix: 16));
    } catch (_) {}

    Color subtextColor = isBackgroundDark ? Colors.white70 : const Color(0xFF4B5563);
    try {
      final val = colors.subtext.replaceAll('#', '');
      subtextColor = Color(int.parse('FF$val', radix: 16));
    } catch (_) {}

    // Styles for Typography
    TextStyle headingStyle = GoogleFonts.getFont(
      typo.headingFont,
      color: textColor,
      fontSize: typo.headingSize,
      fontWeight: typo.weight == '800' ? FontWeight.w800 : typo.weight == '500' ? FontWeight.w500 : FontWeight.bold,
      letterSpacing: typo.letterSpacing,
    );

    TextStyle bodyStyle = GoogleFonts.getFont(
      typo.bodyFont,
      color: subtextColor,
      fontSize: typo.bodySize,
      height: typo.lineHeight,
    );

    // Styles for Button
    double btnRadius = 8.0;
    if (btn.radius == '100px' || btn.style == 'pill') {
      btnRadius = 30.0;
    } else {
      try {
        final numVal = int.parse(btn.radius.replaceAll(RegExp(r'[^0-9]'), ''));
        btnRadius = numVal.toDouble();
      } catch (_) {}
    }

    Color btnColor = const Color(0xFF6366F1);
    try {
      final val = colors.primary.replaceAll('#', '');
      btnColor = Color(int.parse('FF$val', radix: 16));
    } catch (_) {}

    return Stack(
      children: [
        // Dynamic Background
        Positioned.fill(
          child: Container(
            color: bgColor,
          ),
        ),

        if (bg.type == 'aurora')
          Positioned.fill(
            child: Opacity(
              opacity: bg.overlayOpacity,
              child: Container(
                decoration: const BoxDecoration(
                  gradient: RadialGradient(
                    colors: [Color(0xFF14B8A6), Colors.transparent],
                    center: Alignment(-0.6, -0.6),
                    radius: 1.0,
                  ),
                ),
              ),
            ),
          ),

        // Main View
        Column(
          children: [
            // Profile Body (WYSIWYG Layout)
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.fromLTRB(16, 120, 16, 16),
                child: Column(
                  children: [
                    // 1. HERO CARD CONTAINER
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(22),
                      decoration: BoxDecoration(
                        color: cardBg,
                        borderRadius: BorderRadius.circular(cardRadius),
                        border: Border.all(color: textColor.withOpacity(0.08)),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.04),
                            blurRadius: 16,
                            offset: const Offset(0, 4),
                          ),
                        ],
                      ),
                      child: Column(
                        children: [
                          // Circular Avatar
                          Container(
                            width: 80,
                            height: 80,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              border: Border.all(
                                color: textColor.withOpacity(0.2),
                                width: 3,
                              ),
                              image: widget.profile != null
                                  ? DecorationImage(
                                      image: getAvatarImage(widget.profile!.avatar, ApiService().baseUrl),
                                      fit: BoxFit.cover,
                                    )
                                  : null,
                            ),
                            child: widget.profile == null
                                ? const Icon(Icons.person, color: Colors.white, size: 36)
                                : null,
                          ),
                          const SizedBox(height: 16),

                          // Name and Verified Badge
                          Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Flexible(
                                child: Text(
                                  typo.uppercase
                                      ? (widget.profile?.name ?? 'ALEX RIVERA').toUpperCase()
                                      : (widget.profile?.name ?? 'Alex Rivera'),
                                  style: headingStyle.copyWith(fontSize: 18),
                                  textAlign: TextAlign.center,
                                ),
                              ),
                              const SizedBox(width: 6),
                              const Icon(Icons.verified_rounded, color: Color(0xFF1D9BF0), size: 16),
                            ],
                          ),
                          const SizedBox(height: 6),

                          // Tagline / Subtitle
                          Text(
                            widget.profile?.tagline ?? 'Design Lead & Creative Producer',
                            style: bodyStyle.copyWith(fontSize: 12),
                            textAlign: TextAlign.center,
                          ),
                          
                          if (widget.profile?.location != null && widget.profile!.location!.isNotEmpty) ...[
                            const SizedBox(height: 8),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Icon(Icons.location_on_rounded, size: 13, color: subtextColor),
                                const SizedBox(width: 4),
                                Text(
                                  widget.profile!.location!,
                                  style: bodyStyle.copyWith(fontSize: 12),
                                ),
                              ],
                            ),
                          ],

                          const SizedBox(height: 18),

                          // Action Button: "Save Contact" or "Connect with me"
                          Container(
                            width: double.infinity,
                            height: 44,
                            alignment: Alignment.center,
                            decoration: BoxDecoration(
                              color: btnColor,
                              borderRadius: BorderRadius.circular(btnRadius),
                            ),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                const Icon(Icons.bookmark_outline, color: Colors.white, size: 16),
                                const SizedBox(width: 8),
                                Text(
                                  'Save Contact',
                                  style: GoogleFonts.outfit(
                                    color: Colors.white,
                                    fontWeight: FontWeight.bold,
                                    fontSize: 14,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 16),

                    // 2. ACCORDION ROWS & SOCIAL GRID
                    ...widget.settings.sections.order.map((secName) {
                      final isVisible = widget.settings.sections.visibility[secName] ?? true;
                      if (!isVisible) return const SizedBox.shrink();

                      // If socials section, render as a 3-column Grid directly
                      if (secName == 'socials') {
                        final socials = widget.profile?.socials ?? [];
                        return Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const SizedBox(height: 12),
                            GridView.builder(
                              shrinkWrap: true,
                              physics: const NeverScrollableScrollPhysics(),
                              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                                crossAxisCount: 3,
                                crossAxisSpacing: 10,
                                mainAxisSpacing: 10,
                                childAspectRatio: 1.15,
                              ),
                              itemCount: socials.isEmpty ? 3 : socials.length,
                              itemBuilder: (context, index) {
                                if (socials.isEmpty) {
                                  // Mock social cards
                                  final mockPlatforms = ['Instagram', 'LinkedIn', 'GitHub'];
                                  final mockIcons = [Icons.camera_alt, Icons.work, Icons.code];
                                  final mockColors = [const Color(0xFFE1306C), const Color(0xFF0077B5), const Color(0xFF333333)];
                                  return _buildCreativeSocialCard(
                                    mockPlatforms[index],
                                    mockIcons[index],
                                    mockColors[index],
                                    cardBg,
                                    textColor,
                                  );
                                }
                                final s = socials[index];
                                return _buildCreativeSocialCard(
                                  s.platform,
                                  _getSocialIconData(s.icon),
                                  _parseHexColor(s.color),
                                  cardBg,
                                  textColor,
                                );
                              },
                            ),
                            const SizedBox(height: 12),
                          ],
                        );
                      }

                      // For Portfolio & Projects, render as neat accordion rows
                      String title = '';
                      if (secName == 'about') title = 'About Me';
                      else if (secName == 'contact') title = 'Contact';
                      else if (secName == 'portfolio') title = 'Portfolio';
                      else if (secName == 'projects') title = 'Featured Projects';
                      else return const SizedBox.shrink();

                      return Container(
                        width: double.infinity,
                        margin: const EdgeInsets.only(bottom: 12),
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 18),
                        decoration: BoxDecoration(
                          color: cardBg,
                          borderRadius: BorderRadius.circular(cardRadius),
                          border: Border.all(color: textColor.withOpacity(0.08)),
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              title,
                              style: headingStyle.copyWith(fontSize: 15),
                            ),
                            Icon(Icons.arrow_forward_ios, color: subtextColor, size: 14),
                          ],
                        ),
                      );
                    }),
                  ],
                ),
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _mockSocialIcon(IconData icon) {
    return Container(
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.08),
        shape: BoxShape.circle,
      ),
      child: Icon(icon, color: Colors.white, size: 16),
    );
  }

  Widget _buildContactCircleButton(IconData icon, VoidCallback onTap, Color cardBg, Color iconColor) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 48,
        height: 48,
        decoration: BoxDecoration(
          color: cardBg,
          shape: BoxShape.circle,
          border: Border.all(
            color: iconColor.withOpacity(0.15),
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.02),
              blurRadius: 4,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Icon(icon, color: iconColor, size: 20),
      ),
    );
  }

  Widget _buildCreativeSocialCard(String platform, IconData icon, Color color, Color cardBg, Color txtColor) {
    return Container(
      decoration: BoxDecoration(
        color: cardBg,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: txtColor.withOpacity(0.15),
        ),
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(icon, size: 28, color: color),
          const SizedBox(height: 8),
          Text(
            platform,
            style: GoogleFonts.outfit(
              fontSize: 12,
              fontWeight: FontWeight.bold,
              color: txtColor,
            ),
          ),
        ],
      ),
    );
  }

  IconData _getSocialIconData(String name) {
    switch (name.toLowerCase()) {
      case 'instagram': return Icons.camera_alt;
      case 'linkedin': return Icons.work;
      case 'github': return Icons.code;
      case 'twitter': return Icons.alternate_email;
      default: return Icons.link;
    }
  }

  Color _parseHexColor(String hex) {
    try {
      final val = hex.replaceAll('#', '');
      return Color(int.parse('FF$val', radix: 16));
    } catch (_) {
      return const Color(0xFF0052FF);
    }
  }
}

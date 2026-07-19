import 'package:flutter/material.dart' hide CardTheme, ButtonTheme;
import 'package:google_fonts/google_fonts.dart';
import '../../models/theme_models.dart';

class InteractivePreview extends StatefulWidget {
  final ThemeSettings settings;
  const InteractivePreview({super.key, required this.settings});

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
    Color bgColor = _isDark ? const Color(0xFF0F0F1A) : const Color(0xFFF9FAFB);
    if (bg.type == 'solid') {
      try {
        final val = bg.value.replaceAll('#', '');
        bgColor = Color(int.parse('FF$val', radix: 16));
      } catch (_) {}
    } else if (bg.type == 'aurora') {
      bgColor = const Color(0xFF0C1020);
    } else if (bg.type == 'animated_gradient') {
      bgColor = const Color(0xFF1E1B4B);
    } else if (bg.type == 'particles') {
      bgColor = const Color(0xFF020617);
    }

    // Styles for Card
    double cardRadius = 16.0;
    try {
      final numVal = int.parse(cards.borderRadius.replaceAll(RegExp(r'[^0-9]'), ''));
      cardRadius = numVal.toDouble();
    } catch (_) {}

    Color cardBg = _isDark ? Colors.white.withValues(alpha: 0.05) : Colors.black.withValues(alpha: 0.03);
    try {
      final val = colors.card.replaceAll('#', '');
      cardBg = Color(int.parse('FF$val', radix: 16)).withOpacity(cards.opacity);
    } catch (_) {}

    // Styles for Typography
    TextStyle headingStyle = GoogleFonts.getFont(
      typo.headingFont,
      color: _isDark ? Colors.white : Colors.black,
      fontSize: typo.headingSize,
      fontWeight: typo.weight == '800' ? FontWeight.w800 : typo.weight == '500' ? FontWeight.w500 : FontWeight.bold,
      letterSpacing: typo.letterSpacing,
    );

    TextStyle bodyStyle = GoogleFonts.getFont(
      typo.bodyFont,
      color: _isDark ? Colors.white70 : Colors.black87,
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

    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFF09090F),
        borderRadius: BorderRadius.circular(36),
        border: Border.all(color: Colors.white12, width: 3),
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(33),
        child: Stack(
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
            SafeArea(
              child: Column(
                children: [
                  // App Bar / Top Frame Controls
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          'tapfolio',
                          style: GoogleFonts.outfit(
                            color: _isDark ? Colors.white : Colors.black,
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        Row(
                          children: [
                            GestureDetector(
                              onTap: () => setState(() => _isDark = !_isDark),
                              child: Container(
                                padding: const EdgeInsets.all(6),
                                decoration: BoxDecoration(
                                  color: Colors.white10,
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: Icon(
                                  _isDark ? Icons.light_mode : Icons.dark_mode,
                                  color: _isDark ? Colors.white : Colors.black,
                                  size: 16,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),

                  // Profile Body (WYSIWYG Layout)
                  Expanded(
                    child: SingleChildScrollView(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        children: [
                          // Avatar
                          Center(
                            child: Container(
                              width: avatar.size,
                              height: avatar.size,
                              decoration: BoxDecoration(
                                shape: avatar.shape == 'circle'
                                    ? BoxShape.circle
                                    : BoxShape.rectangle,
                                borderRadius: avatar.shape == 'rounded'
                                    ? BorderRadius.circular(16)
                                    : avatar.shape == 'square'
                                        ? BorderRadius.circular(0)
                                        : null,
                                border: Border.all(
                                  color: _isDark ? Colors.white : Colors.black26,
                                  width: 2,
                                ),
                                color: Colors.blueAccent,
                              ),
                              child: const Icon(Icons.person, color: Colors.white, size: 36),
                            ),
                          ),
                          const SizedBox(height: 16),

                          // Name and Title
                          Text(
                            typo.uppercase ? 'ALEX RIVERA' : 'Alex Rivera',
                            style: headingStyle,
                          ),
                          const SizedBox(height: 4),
                          Text(
                            'Design Lead & Creative Producer',
                            style: bodyStyle.copyWith(color: _isDark ? Colors.white60 : Colors.black54),
                          ),
                          const SizedBox(height: 20),

                          // Profile Main Card Details
                          Container(
                            padding: const EdgeInsets.all(16),
                            decoration: BoxDecoration(
                              color: cardBg,
                              borderRadius: BorderRadius.circular(cardRadius),
                              border: Border.all(color: Colors.white.withValues(alpha: 0.05)),
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'About Me',
                                  style: headingStyle.copyWith(fontSize: 16),
                                ),
                                const SizedBox(height: 8),
                                Text(
                                  'Building premium digital portfolios and interactive mobile layouts for builders globally.',
                                  style: bodyStyle.copyWith(fontSize: 13),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(height: 16),

                          // Save Action Button preview
                          GestureDetector(
                            onTap: () {},
                            child: Container(
                              width: double.infinity,
                              height: double.parse(btn.height.replaceAll('px', '')),
                              alignment: Alignment.center,
                              decoration: BoxDecoration(
                                color: btn.style == 'solid' || btn.style == 'pill' ? btnColor : Colors.transparent,
                                border: btn.style == 'outlined'
                                    ? Border.all(color: btnColor, width: 2)
                                    : null,
                                borderRadius: BorderRadius.circular(btnRadius),
                                gradient: btn.style == 'gradient'
                                    ? const LinearGradient(colors: [Colors.indigo, Colors.blue])
                                    : null,
                              ),
                              child: Text(
                                'Save Contact',
                                style: GoogleFonts.outfit(
                                  color: btn.style == 'outlined' ? btnColor : Colors.white,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

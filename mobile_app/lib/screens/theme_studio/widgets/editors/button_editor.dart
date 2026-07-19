import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../controller/theme_studio_controller.dart';

class ButtonEditor extends StatelessWidget {
  final ThemeStudioController controller;
  const ButtonEditor({super.key, required this.controller});

  @override
  Widget build(BuildContext context) {
    final btn = controller.settings.buttons;
    const styles = ['solid', 'outlined', 'ghost', 'gradient', 'pill'];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Button Styling',
          style: GoogleFonts.outfit(color: Colors.white70, fontSize: 13, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 8),
        Wrap(
          spacing: 8,
          children: styles.map((s) {
            final active = btn.style == s;
            return ChoiceChip(
              label: Text(s.toUpperCase()),
              selected: active,
              onSelected: (val) {
                if (val) {
                  controller.updateButtons(btn.copyWith(style: s));
                }
              },
              backgroundColor: Colors.white.withValues(alpha: 0.05),
              selectedColor: const Color(0xFF6366F1),
              labelStyle: GoogleFonts.outfit(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold),
            );
          }).toList(),
        ),
        const SizedBox(height: 16),

        Text(
          'Height Offset',
          style: GoogleFonts.outfit(color: Colors.white70, fontSize: 13, fontWeight: FontWeight.bold),
        ),
        Slider(
          value: double.tryParse(btn.height.replaceAll('px', '')) ?? 44.0,
          min: 36.0,
          max: 56.0,
          onChanged: (val) {
            controller.updateButtons(btn.copyWith(height: '${val.round()}px'));
          },
          activeColor: const Color(0xFF6366F1),
        ),
      ],
    );
  }
}

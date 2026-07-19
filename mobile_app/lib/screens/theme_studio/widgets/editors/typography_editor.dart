import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../controller/theme_studio_controller.dart';

class TypographyEditor extends StatelessWidget {
  final ThemeStudioController controller;
  const TypographyEditor({super.key, required this.controller});

  @override
  Widget build(BuildContext context) {
    final typo = controller.settings.typography;
    const fonts = ['Outfit', 'Inter', 'Poppins', 'Roboto', 'Manrope'];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Heading font
        Text(
          'Heading Font Family',
          style: GoogleFonts.outfit(color: Colors.white70, fontSize: 13, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 8),
        Wrap(
          spacing: 8,
          children: fonts.map((f) {
            final active = typo.headingFont == f;
            return ChoiceChip(
              label: Text(f),
              selected: active,
              onSelected: (val) {
                if (val) {
                  controller.updateTypography(typo.copyWith(headingFont: f));
                }
              },
              backgroundColor: Colors.white.withValues(alpha: 0.05),
              selectedColor: const Color(0xFF6366F1),
              labelStyle: GoogleFonts.outfit(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold),
            );
          }).toList(),
        ),
        const SizedBox(height: 16),

        // Body font
        Text(
          'Body Font Family',
          style: GoogleFonts.outfit(color: Colors.white70, fontSize: 13, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 8),
        Wrap(
          spacing: 8,
          children: fonts.map((f) {
            final active = typo.bodyFont == f;
            return ChoiceChip(
              label: Text(f),
              selected: active,
              onSelected: (val) {
                if (val) {
                  controller.updateTypography(typo.copyWith(bodyFont: f));
                }
              },
              backgroundColor: Colors.white.withValues(alpha: 0.05),
              selectedColor: const Color(0xFF6366F1),
              labelStyle: GoogleFonts.outfit(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold),
            );
          }).toList(),
        ),
        const SizedBox(height: 16),

        // Font sizes
        Text(
          'Heading Font Size (${typo.headingSize.round()}px)',
          style: GoogleFonts.outfit(color: Colors.white70, fontSize: 13, fontWeight: FontWeight.bold),
        ),
        Slider(
          value: typo.headingSize,
          min: 18.0,
          max: 36.0,
          onChanged: (val) {
            controller.updateTypography(typo.copyWith(headingSize: val));
          },
          activeColor: const Color(0xFF6366F1),
        ),
        const SizedBox(height: 12),

        // Uppercase toggle
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              'Force Uppercase Headings',
              style: GoogleFonts.outfit(color: Colors.white70, fontSize: 13, fontWeight: FontWeight.bold),
            ),
            Switch(
              value: typo.uppercase,
              onChanged: (val) {
                controller.updateTypography(typo.copyWith(uppercase: val));
              },
              activeColor: const Color(0xFF6366F1),
            ),
          ],
        ),
      ],
    );
  }
}

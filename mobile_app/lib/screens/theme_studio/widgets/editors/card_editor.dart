import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../controller/theme_studio_controller.dart';

class CardEditor extends StatelessWidget {
  final ThemeStudioController controller;
  const CardEditor({super.key, required this.controller});

  @override
  Widget build(BuildContext context) {
    final cards = controller.settings.cards;
    double currentRadius = 16.0;
    try {
      currentRadius = double.parse(cards.borderRadius.replaceAll(RegExp(r'[^0-9]'), ''));
    } catch (_) {}

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Card Corner Radius (${currentRadius.round()}px)',
          style: GoogleFonts.outfit(color: Colors.white70, fontSize: 13, fontWeight: FontWeight.bold),
        ),
        Slider(
          value: currentRadius,
          min: 0.0,
          max: 32.0,
          onChanged: (val) {
            controller.updateCards(cards.copyWith(borderRadius: '${val.round()}px'));
          },
          activeColor: const Color(0xFF6366F1),
        ),
        const SizedBox(height: 16),

        Text(
          'Card Opacity / Transparency (${(cards.opacity * 100).round()}%)',
          style: GoogleFonts.outfit(color: Colors.white70, fontSize: 13, fontWeight: FontWeight.bold),
        ),
        Slider(
          value: cards.opacity,
          min: 0.1,
          max: 1.0,
          onChanged: (val) {
            controller.updateCards(cards.copyWith(opacity: val));
          },
          activeColor: const Color(0xFF6366F1),
        ),
      ],
    );
  }
}

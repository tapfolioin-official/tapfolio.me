import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../controller/theme_studio_controller.dart';

class BackgroundEditor extends StatelessWidget {
  final ThemeStudioController controller;
  const BackgroundEditor({super.key, required this.controller});

  @override
  Widget build(BuildContext context) {
    final bg = controller.settings.background;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Background Type',
          style: GoogleFonts.outfit(color: Colors.white70, fontSize: 13, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 8),
        Wrap(
          spacing: 8,
          children: ['solid', 'aurora', 'animated_gradient', 'particles'].map((t) {
            final active = bg.type == t;
            return ChoiceChip(
              label: Text(t.replaceAll('_', ' ').toUpperCase()),
              selected: active,
              onSelected: (val) {
                if (val) {
                  controller.updateBackground(bg.copyWith(type: t));
                }
              },
              backgroundColor: Colors.white.withValues(alpha: 0.05),
              selectedColor: const Color(0xFF6366F1),
              labelStyle: GoogleFonts.outfit(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold),
            );
          }).toList(),
        ),
        const SizedBox(height: 16),

        if (bg.type == 'solid') ...[
          Text(
            'Preset Colors',
            style: GoogleFonts.outfit(color: Colors.white70, fontSize: 13, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 8),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: ['#f0f2f8', '#0f172a', '#1e1b4b', '#064e3b', '#1a0a00', '#0a0a0f', '#ffffff'].map((c) {
              final active = bg.value == c;
              Color color = Colors.grey;
              try {
                final val = c.replaceAll('#', '');
                color = Color(int.parse('FF$val', radix: 16));
              } catch (_) {}

              return GestureDetector(
                onTap: () => controller.updateBackground(bg.copyWith(value: c)),
                child: Container(
                  width: 36,
                  height: 36,
                  decoration: BoxDecoration(
                    color: color,
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(
                      color: active ? const Color(0xFF6366F1) : Colors.white24,
                      width: active ? 3 : 1,
                    ),
                  ),
                ),
              );
            }).toList(),
          ),
        ],

        if (bg.type != 'solid') ...[
          Text(
            'Overlay Opacity',
            style: GoogleFonts.outfit(color: Colors.white70, fontSize: 13, fontWeight: FontWeight.bold),
          ),
          Slider(
            value: bg.overlayOpacity,
            onChanged: (val) {
              controller.updateBackground(bg.copyWith(overlayOpacity: val));
            },
            activeColor: const Color(0xFF6366F1),
          ),
        ],
      ],
    );
  }
}

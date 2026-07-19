import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../controller/theme_studio_controller.dart';

class ColorEditor extends StatelessWidget {
  final ThemeStudioController controller;
  const ColorEditor({super.key, required this.controller});

  @override
  Widget build(BuildContext context) {
    final colors = controller.settings.colors;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildColorTile(
          context,
          'Primary Brand Color',
          colors.primary,
          (val) => controller.updateColors(colors.copyWith(primary: val)),
        ),
        _buildColorTile(
          context,
          'Secondary Brand Color',
          colors.secondary,
          (val) => controller.updateColors(colors.copyWith(secondary: val)),
        ),
        _buildColorTile(
          context,
          'Accent Details Color',
          colors.accent,
          (val) => controller.updateColors(colors.copyWith(accent: val)),
        ),
        _buildColorTile(
          context,
          'Main Text Color',
          colors.text,
          (val) => controller.updateColors(colors.copyWith(text: val)),
        ),
        _buildColorTile(
          context,
          'Subtext Description Color',
          colors.subtext,
          (val) => controller.updateColors(colors.copyWith(subtext: val)),
        ),
      ],
    );
  }

  Widget _buildColorTile(
    BuildContext context,
    String label,
    String hexVal,
    ValueChanged<String> onChange,
  ) {
    Color color = Colors.grey;
    try {
      final val = hexVal.replaceAll('#', '');
      color = Color(int.parse('FF$val', radix: 16));
    } catch (_) {}

    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(label, style: GoogleFonts.outfit(color: Colors.white, fontSize: 13, fontWeight: FontWeight.bold)),
              const SizedBox(height: 2),
              Text(hexVal, style: GoogleFonts.outfit(color: Colors.white54, fontSize: 11)),
            ],
          ),
          GestureDetector(
            onTap: () {
              _showColorPickerDialog(context, hexVal, onChange);
            },
            child: Container(
              width: 32,
              height: 32,
              decoration: BoxDecoration(
                color: color,
                shape: BoxShape.circle,
                border: Border.all(color: Colors.white24, width: 2),
              ),
            ),
          ),
        ],
      ),
    );
  }

  void _showColorPickerDialog(
    BuildContext context,
    String currentHex,
    ValueChanged<String> onSelected,
  ) {
    final colors = [
      '#6366F1', '#4F46E5', '#10B981', '#F59E0B', '#EF4444',
      '#EC4899', '#3B82F6', '#8B5CF6', '#111827', '#FFFFFF'
    ];
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        backgroundColor: const Color(0xFF1a1a2e),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: Text('Select Color', style: GoogleFonts.outfit(color: Colors.white, fontWeight: FontWeight.bold)),
        content: SizedBox(
          width: 250,
          child: GridView.builder(
            shrinkWrap: true,
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 5,
              crossAxisSpacing: 8,
              mainAxisSpacing: 8,
            ),
            itemCount: colors.length,
            itemBuilder: (context, idx) {
              final c = colors[idx];
              Color color = Colors.grey;
              try {
                final val = c.replaceAll('#', '');
                color = Color(int.parse('FF$val', radix: 16));
              } catch (_) {}

              return GestureDetector(
                onTap: () {
                  onSelected(c);
                  Navigator.pop(context);
                },
                child: Container(
                  decoration: BoxDecoration(
                    color: color,
                    shape: BoxShape.circle,
                    border: Border.all(color: c == currentHex ? Colors.white : Colors.transparent, width: 2),
                  ),
                ),
              );
            },
          ),
        ),
      ),
    );
  }
}

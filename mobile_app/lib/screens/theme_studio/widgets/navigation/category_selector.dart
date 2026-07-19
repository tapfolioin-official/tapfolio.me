import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class CategorySelector extends StatelessWidget {
  final String activeCategory;
  final ValueChanged<String> onSelected;

  const CategorySelector({
    super.key,
    required this.activeCategory,
    required this.onSelected,
  });

  @override
  Widget build(BuildContext context) {
    const categories = ['Appearance', 'Layout', 'Content', 'Advanced'];
    return Container(
      height: 48,
      padding: const EdgeInsets.symmetric(horizontal: 12),
      decoration: const BoxDecoration(
        color: Color(0xFF0F0F1A),
        border: Border(bottom: BorderSide(color: Colors.white10)),
      ),
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        itemCount: categories.length,
        itemBuilder: (context, idx) {
          final cat = categories[idx];
          final active = cat == activeCategory;
          return GestureDetector(
            onTap: () => onSelected(cat),
            child: Container(
              margin: const EdgeInsets.symmetric(horizontal: 12),
              alignment: Alignment.center,
              decoration: BoxDecoration(
                border: active
                    ? const Border(bottom: BorderSide(color: Color(0xFF6366F1), width: 3))
                    : null,
              ),
              child: Text(
                cat,
                style: GoogleFonts.outfit(
                  color: active ? const Color(0xFF6366F1) : Colors.white60,
                  fontWeight: FontWeight.bold,
                  fontSize: 14,
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}

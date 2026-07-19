import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../controller/theme_studio_controller.dart';

class SectionEditor extends StatelessWidget {
  final ThemeStudioController controller;
  const SectionEditor({super.key, required this.controller});

  @override
  Widget build(BuildContext context) {
    final sections = controller.settings.sections;
    final order = List<String>.from(sections.order);
    final visibility = Map<String, bool>.from(sections.visibility);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Drag to Reorder Sections',
          style: GoogleFonts.outfit(color: Colors.white70, fontSize: 13, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 8),
        SizedBox(
          height: 300,
          child: ReorderableListView.builder(
            buildDefaultDragHandles: true,
            itemCount: order.length,
            onReorder: (oldIdx, newIdx) {
              if (newIdx > oldIdx) {
                newIdx -= 1;
              }
              final item = order.removeAt(oldIdx);
              order.insert(newIdx, item);
              controller.updateSections(
                sections.copyWith(order: order),
              );
            },
            itemBuilder: (context, idx) {
              final key = order[idx];
              final isVisible = visibility[key] ?? true;

              return ListTile(
                key: ValueKey(key),
                leading: const Icon(Icons.drag_indicator, color: Colors.white38),
                title: Text(
                  key.toUpperCase(),
                  style: GoogleFonts.outfit(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                    fontSize: 13,
                  ),
                ),
                trailing: Switch(
                  value: isVisible,
                  onChanged: (val) {
                    visibility[key] = val;
                    controller.updateSections(
                      sections.copyWith(visibility: visibility),
                    );
                  },
                  activeColor: const Color(0xFF6366F1),
                ),
              );
            },
          ),
        ),
      ],
    );
  }
}

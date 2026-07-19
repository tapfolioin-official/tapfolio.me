import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../controller/autosave_manager.dart';

class AutosaveIndicator extends StatelessWidget {
  final AutosaveState state;
  const AutosaveIndicator({super.key, required this.state});

  @override
  Widget build(BuildContext context) {
    String label = 'Saved';
    Color color = const Color(0xFF10B981);
    IconData icon = Icons.check_circle_outline;

    if (state == AutosaveState.saving) {
      label = 'Saving...';
      color = const Color(0xFFF59E0B);
      icon = Icons.sync;
    } else if (state == AutosaveState.unsavedChanges) {
      label = 'Unsaved Changes';
      color = const Color(0xFFEF4444);
      icon = Icons.error_outline;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.12),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color.withValues(alpha: 0.25)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, color: color, size: 12),
          const SizedBox(width: 4),
          Text(
            label,
            style: GoogleFonts.outfit(
              color: color,
              fontSize: 11,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }
}

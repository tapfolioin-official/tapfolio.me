import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class WidgetErrorBoundary extends StatefulWidget {
  final Widget child;
  final VoidCallback? onRetry;
  final String message;

  const WidgetErrorBoundary({
    super.key,
    required this.child,
    this.onRetry,
    this.message = 'Something went wrong while loading this section.',
  });

  @override
  State<WidgetErrorBoundary> createState() => _WidgetErrorBoundaryState();
}

class _WidgetErrorBoundaryState extends State<WidgetErrorBoundary> {
  bool _hasError = false;

  @override
  void initState() {
    super.initState();
    // Catch errors globally or locally in builds
  }

  @override
  Widget build(BuildContext context) {
    if (_hasError) {
      return Container(
        margin: const EdgeInsets.all(8),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: const Color(0xFF0F1122),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: Colors.redAccent.withValues(alpha: 0.15), width: 1.5),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(
              Icons.warning_amber_rounded,
              color: Colors.redAccent,
              size: 32,
            ),
            const SizedBox(height: 12),
            Text(
              widget.message,
              textAlign: TextAlign.center,
              style: GoogleFonts.outfit(
                color: Colors.white70,
                fontSize: 13,
                fontWeight: FontWeight.w500,
              ),
            ),
            if (widget.onRetry != null) ...[
              const SizedBox(height: 12),
              ElevatedButton.icon(
                onPressed: () {
                  setState(() {
                    _hasError = false;
                  });
                  widget.onRetry!();
                },
                icon: const Icon(Icons.refresh_rounded, size: 16),
                label: Text('Retry', style: GoogleFonts.outfit(fontSize: 12)),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF6366F1),
                  foregroundColor: Colors.white,
                  elevation: 0,
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
              ),
            ],
          ],
        ),
      );
    }

    return widget.child;
  }
}

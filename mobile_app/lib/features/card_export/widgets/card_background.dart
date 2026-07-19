import 'package:flutter/material.dart';

class CardBackground extends StatelessWidget {
  final Widget child;
  const CardBackground({super.key, required this.child});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          colors: [Color(0xFF0F0F1A), Color(0xFF1E1B4B)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
      ),
      child: Stack(
        children: [
          // Premium Mesh aurora mesh effect overlay
          Positioned.fill(
            child: Opacity(
              opacity: 0.25,
              child: Container(
                decoration: const BoxDecoration(
                  gradient: RadialGradient(
                    colors: [Color(0xFF6366F1), Colors.transparent],
                    center: Alignment(-0.6, -0.6),
                    radius: 1.2,
                  ),
                ),
              ),
            ),
          ),
          Positioned.fill(
            child: Opacity(
              opacity: 0.15,
              child: Container(
                decoration: const BoxDecoration(
                  gradient: RadialGradient(
                    colors: [Color(0xFF14B8A6), Colors.transparent],
                    center: Alignment(0.6, 0.6),
                    radius: 1.2,
                  ),
                ),
              ),
            ),
          ),
          child,
        ],
      ),
    );
  }
}

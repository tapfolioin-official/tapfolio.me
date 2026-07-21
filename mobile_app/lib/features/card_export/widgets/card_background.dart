import 'dart:ui';

import 'package:flutter/material.dart';

class CardBackground extends StatelessWidget {
  final Widget child;

  const CardBackground({super.key, required this.child});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            Color(0xff050816),
            Color(0xff0F172A),
            Color(0xff111827),
            Color(0xff1A1040),
          ],
          stops: [0.0, 0.30, 0.68, 1.0],
        ),
      ),
      child: Stack(
        children: [
          // ── Strong purple top-left aurora ──────────────────
          Positioned(
            top: -120,
            left: -90,
            child: _blurOrb(
              size: 340,
              color: const Color(0xff7C3AED).withOpacity(0.45),
            ),
          ),

          // ── Softer purple mid-right ─────────────────────────
          Positioned(
            top: 130,
            right: -110,
            child: _blurOrb(
              size: 220,
              color: const Color(0xff8B5CF6).withOpacity(0.22),
            ),
          ),

          // ── Blue bottom-right aurora ────────────────────────
          Positioned(
            bottom: -100,
            right: -80,
            child: _blurOrb(
              size: 300,
              color: const Color(0xff2563EB).withOpacity(0.32),
            ),
          ),

          // ── Teal bottom-left glow ───────────────────────────
          Positioned(
            bottom: -60,
            left: -60,
            child: _blurOrb(
              size: 200,
              color: const Color(0xff06B6D4).withOpacity(0.20),
            ),
          ),

          // ── Indigo spotlight at top-centre ──────────────────
          Positioned(
            top: -40,
            left: 0,
            right: 0,
            child: Center(
              child: _blurOrb(
                size: 180,
                color: const Color(0xff4338CA).withOpacity(0.28),
              ),
            ),
          ),

          // ── Radial centre top glow overlay ─────────────────
          Positioned.fill(
            child: IgnorePointer(
              child: DecoratedBox(
                decoration: BoxDecoration(
                  gradient: RadialGradient(
                    center: const Alignment(0, -0.60),
                    radius: 0.90,
                    colors: [
                      Colors.white.withOpacity(0.055),
                      Colors.transparent,
                    ],
                  ),
                ),
              ),
            ),
          ),

          // ── Subtle glass blur overlay ───────────────────────
          Positioned.fill(
            child: BackdropFilter(
              filter: ImageFilter.blur(sigmaX: 1.2, sigmaY: 1.2),
              child: Container(
                color: Colors.white.withOpacity(0.012),
              ),
            ),
          ),

          // ── Premium inner border ────────────────────────────
          Positioned.fill(
            child: IgnorePointer(
              child: Container(
                decoration: BoxDecoration(
                  border: Border.all(
                    color: Colors.white.withOpacity(0.08),
                    width: 1,
                  ),
                  borderRadius: BorderRadius.circular(36),
                ),
              ),
            ),
          ),

          // ── Top-centre inner highlight ──────────────────────
          Positioned.fill(
            child: IgnorePointer(
              child: Container(
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(36),
                  gradient: LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.center,
                    colors: [
                      Colors.white.withOpacity(0.06),
                      Colors.transparent,
                    ],
                  ),
                ),
              ),
            ),
          ),

          // ── Content ─────────────────────────────────────────
          Positioned.fill(child: child),
        ],
      ),
    );
  }

  Widget _blurOrb({required double size, required Color color}) {
    return IgnorePointer(
      child: ImageFiltered(
        imageFilter: ImageFilter.blur(sigmaX: 72, sigmaY: 72),
        child: Container(
          width: size,
          height: size,
          decoration: BoxDecoration(
            color: color,
            shape: BoxShape.circle,
          ),
        ),
      ),
    );
  }
}

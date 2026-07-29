import 'dart:math';
import 'dart:ui';

import 'package:flutter/material.dart';
import '../models/card_theme.dart';

/// Theme-aware background with mesh gradients, floating glass shapes,
/// radial spotlights, and noise-grain overlay.
///
/// Each [CardThemeType] renders a fundamentally different background:
///  • Aurora  – Purple/blue mesh gradient with aurora orbs
///  • Midnight – Pure dark with subtle noise, no colored orbs
///  • Ember   – Warm gold/amber gradient with warm-toned orbs
class CardBackground extends StatelessWidget {
  final Widget child;
  final CardThemeType theme;

  const CardBackground({
    super.key,
    required this.child,
    this.theme = CardThemeType.aurora,
  });

  @override
  Widget build(BuildContext context) {
    switch (theme) {
      case CardThemeType.aurora:
        return _buildAurora();
      case CardThemeType.midnight:
        return _buildMidnight();
      case CardThemeType.ember:
        return _buildEmber();
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Aurora — Purple/Blue mesh gradient
  // ═══════════════════════════════════════════════════════════════════════════

  Widget _buildAurora() {
    return Container(
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            Color(0xff030712),
            Color(0xff0A0E1F),
            Color(0xff0F172A),
            Color(0xff110D2E),
            Color(0xff1A0F3A),
          ],
          stops: [0.0, 0.20, 0.45, 0.72, 1.0],
        ),
      ),
      child: Stack(
        children: [
          // Orbs
          Positioned(top: -140, left: -100, child: _blurOrb(380, const Color(0xff7C3AED).withValues(alpha: 0.50))),
          Positioned(top: 80, left: -60, child: _blurOrb(200, const Color(0xff6D28D9).withValues(alpha: 0.25))),
          Positioned(top: 160, right: -120, child: _blurOrb(260, const Color(0xff8B5CF6).withValues(alpha: 0.28))),
          Positioned(top: -50, left: 0, right: 0, child: Center(child: _blurOrb(220, const Color(0xff4338CA).withValues(alpha: 0.35)))),
          Positioned(bottom: -120, right: -90, child: _blurOrb(340, const Color(0xff2563EB).withValues(alpha: 0.35))),
          Positioned(bottom: -80, left: -70, child: _blurOrb(240, const Color(0xff06B6D4).withValues(alpha: 0.22))),
          Positioned(top: 300, left: 40, child: _blurOrb(160, const Color(0xffEC4899).withValues(alpha: 0.12))),

          // Glass shapes
          Positioned(top: 60, right: 30, child: _glassCircle(70, 0.04)),
          Positioned(top: 280, left: 20, child: _glassCircle(45, 0.035)),
          Positioned(bottom: 180, right: 50, child: _glassCircle(55, 0.03)),
          Positioned(bottom: 80, left: 40, child: _glassCircle(35, 0.04)),
          Positioned(top: 140, left: -20, child: Transform.rotate(angle: -0.35, child: _glassRect(90, 50, 16, 0.03))),
          Positioned(bottom: 240, right: -15, child: Transform.rotate(angle: 0.25, child: _glassRect(70, 40, 12, 0.025))),

          // Overlays
          _radialGlow(const Alignment(0, -0.55), 0.85, Colors.white.withValues(alpha: 0.065)),
          _radialGlow(const Alignment(0, 0.70), 0.65, const Color(0xff6366F1).withValues(alpha: 0.04)),
          _blurOverlay(1.5, Colors.white.withValues(alpha: 0.010)),
          _noise(0.028),
          _innerBorder(Colors.white.withValues(alpha: 0.07)),
          _topHighlight(Colors.white.withValues(alpha: 0.055)),

          Positioned.fill(child: child),
        ],
      ),
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Midnight — Pure dark, clean, monochrome
  // ═══════════════════════════════════════════════════════════════════════════

  Widget _buildMidnight() {
    return Container(
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [
            Color(0xff000000),
            Color(0xff050505),
            Color(0xff0A0A0A),
            Color(0xff080808),
            Color(0xff000000),
          ],
          stops: [0.0, 0.25, 0.50, 0.75, 1.0],
        ),
      ),
      child: Stack(
        children: [
          // Very subtle white radial at top
          _radialGlow(const Alignment(0, -0.40), 0.70, Colors.white.withValues(alpha: 0.035)),

          // Subtle noise
          _noise(0.018),

          // Clean inner border
          _innerBorder(Colors.white.withValues(alpha: 0.08)),

          // Very subtle top highlight
          _topHighlight(Colors.white.withValues(alpha: 0.030)),

          Positioned.fill(child: child),
        ],
      ),
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Ember — Warm gold/amber
  // ═══════════════════════════════════════════════════════════════════════════

  Widget _buildEmber() {
    return Container(
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            Color(0xff0D0800),
            Color(0xff1A0E00),
            Color(0xff241500),
            Color(0xff1F1000),
            Color(0xff2D1B00),
          ],
          stops: [0.0, 0.22, 0.48, 0.74, 1.0],
        ),
      ),
      child: Stack(
        children: [
          // Warm orbs
          Positioned(top: -130, left: -80, child: _blurOrb(340, const Color(0xffD4A44C).withValues(alpha: 0.35))),
          Positioned(top: 100, right: -100, child: _blurOrb(220, const Color(0xffDAA520).withValues(alpha: 0.22))),
          Positioned(bottom: -100, right: -70, child: _blurOrb(300, const Color(0xffB8860B).withValues(alpha: 0.28))),
          Positioned(bottom: -70, left: -50, child: _blurOrb(200, const Color(0xffA0522D).withValues(alpha: 0.20))),
          Positioned(top: -40, left: 0, right: 0, child: Center(child: _blurOrb(180, const Color(0xffD4A44C).withValues(alpha: 0.25)))),
          Positioned(top: 280, left: 30, child: _blurOrb(140, const Color(0xffCD853F).withValues(alpha: 0.15))),

          // Glass shapes (warm tint)
          Positioned(top: 70, right: 25, child: _glassCircle(60, 0.035, tint: const Color(0xFFFFF8F0))),
          Positioned(top: 260, left: 15, child: _glassCircle(40, 0.03, tint: const Color(0xFFFFF8F0))),
          Positioned(bottom: 160, right: 45, child: _glassCircle(50, 0.025, tint: const Color(0xFFFFF8F0))),

          // Overlays
          _radialGlow(const Alignment(0, -0.50), 0.80, const Color(0xffD4A44C).withValues(alpha: 0.05)),
          _radialGlow(const Alignment(0, 0.65), 0.60, const Color(0xffB8860B).withValues(alpha: 0.035)),
          _blurOverlay(1.2, const Color(0xFFFFF8F0).withValues(alpha: 0.008)),
          _noise(0.022),
          _innerBorder(const Color(0xFFFFF8F0).withValues(alpha: 0.06)),
          _topHighlight(const Color(0xFFFFF8F0).withValues(alpha: 0.045)),

          Positioned.fill(child: child),
        ],
      ),
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Shared helpers
  // ═══════════════════════════════════════════════════════════════════════════

  Widget _blurOrb(double size, Color color) {
    return IgnorePointer(
      child: ImageFiltered(
        imageFilter: ImageFilter.blur(sigmaX: 80, sigmaY: 80),
        child: Container(
          width: size, height: size,
          decoration: BoxDecoration(color: color, shape: BoxShape.circle),
        ),
      ),
    );
  }

  Widget _glassCircle(double size, double opacity, {Color tint = Colors.white}) {
    return IgnorePointer(
      child: Container(
        width: size, height: size,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          color: tint.withValues(alpha: opacity),
          border: Border.all(color: tint.withValues(alpha: opacity * 2.5), width: 0.8),
        ),
      ),
    );
  }

  Widget _glassRect(double w, double h, double r, double opacity) {
    return IgnorePointer(
      child: Container(
        width: w, height: h,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(r),
          color: Colors.white.withValues(alpha: opacity),
          border: Border.all(color: Colors.white.withValues(alpha: opacity * 2.5), width: 0.6),
        ),
      ),
    );
  }

  Widget _radialGlow(Alignment center, double radius, Color color) {
    return Positioned.fill(
      child: IgnorePointer(
        child: DecoratedBox(
          decoration: BoxDecoration(
            gradient: RadialGradient(center: center, radius: radius, colors: [color, Colors.transparent]),
          ),
        ),
      ),
    );
  }

  Widget _blurOverlay(double sigma, Color color) {
    return Positioned.fill(
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: sigma, sigmaY: sigma),
        child: Container(color: color),
      ),
    );
  }

  Widget _noise(double opacity) {
    return Positioned.fill(
      child: IgnorePointer(child: CustomPaint(painter: _NoisePainter(opacity: opacity))),
    );
  }

  Widget _innerBorder(Color color) {
    return Positioned.fill(
      child: IgnorePointer(
        child: Container(
          decoration: BoxDecoration(
            border: Border.all(color: color, width: 1),
            borderRadius: BorderRadius.circular(36),
          ),
        ),
      ),
    );
  }

  Widget _topHighlight(Color color) {
    return Positioned.fill(
      child: IgnorePointer(
        child: Container(
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(36),
            gradient: LinearGradient(
              begin: Alignment.topCenter,
              end: Alignment.center,
              colors: [color, Colors.transparent],
            ),
          ),
        ),
      ),
    );
  }
}

/// Deterministic noise painter for stable export captures.
class _NoisePainter extends CustomPainter {
  final double opacity;
  _NoisePainter({required this.opacity});

  @override
  void paint(Canvas canvas, Size size) {
    final rng = Random(42);
    final paint = Paint();
    const step = 4.0;
    for (double y = 0; y < size.height; y += step) {
      for (double x = 0; x < size.width; x += step) {
        paint.color = Colors.white.withValues(alpha: rng.nextDouble() * opacity);
        canvas.drawRect(Rect.fromLTWH(x, y, step, step), paint);
      }
    }
  }

  @override
  bool shouldRepaint(_NoisePainter old) => old.opacity != opacity;
}

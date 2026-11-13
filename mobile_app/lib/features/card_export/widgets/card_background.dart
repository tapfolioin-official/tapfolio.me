import 'dart:math';
import 'dart:ui';

import 'package:flutter/material.dart';
import '../models/card_theme.dart';

/// Theme-aware background with mesh gradients, floating glass shapes,
/// radial spotlights, and noise-grain overlay.
///
/// Each [CardThemeType] renders a fundamentally different background:
///  • Light   – Clean white/soft blue ambient gradient with subtle glow
///  • Aurora  – Purple/blue mesh gradient with aurora orbs
///  • Midnight – Pure dark with subtle noise, no colored orbs
///  • Ember   – Warm gold/amber gradient with warm-toned orbs
class CardBackground extends StatelessWidget {
  final Widget child;
  final CardThemeType theme;

  const CardBackground({
    super.key,
    required this.child,
    this.theme = CardThemeType.light,
  });

  @override
  Widget build(BuildContext context) {
    switch (theme) {
      case CardThemeType.light:
        return _buildLight();
      case CardThemeType.aurora:
        return _buildAurora();
      case CardThemeType.midnight:
        return _buildMidnight();
      case CardThemeType.ember:
        return _buildEmber();
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Light — Clean white/soft blue ambient gradient
  // ═══════════════════════════════════════════════════════════════════════════

  Widget _buildLight() {
    return Container(
      decoration: const BoxDecoration(
        color: Colors.white,
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            Color(0xFFFFFFFF),
            Color(0xFFF8FAFC),
            Color(0xFFF1F5F9),
            Color(0xFFEFF6FF),
          ],
          stops: [0.0, 0.35, 0.70, 1.0],
        ),
      ),
      child: Stack(
        children: [
          Positioned(
            top: -40,
            right: -30,
            child: _blurOrb(260, const Color(0xFF3B82F6).withValues(alpha: 0.08)),
          ),
          Positioned(
            bottom: -50,
            left: -40,
            child: _blurOrb(280, const Color(0xFF60A5FA).withValues(alpha: 0.10)),
          ),
          Positioned(
            top: 200,
            left: -20,
            child: _blurOrb(180, const Color(0xFF818CF8).withValues(alpha: 0.07)),
          ),
          _innerBorder(const Color(0xFFE2E8F0)),
          Positioned.fill(child: child),
        ],
      ),
    );
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
            Color(0xff080808),
            Color(0xff111111),
            Color(0xff0A0A0A),
          ],
          stops: [0.0, 0.35, 0.70, 1.0],
        ),
      ),
      child: Stack(
        children: [
          Positioned(top: -100, left: -60, child: _blurOrb(300, Colors.white.withValues(alpha: 0.04))),
          Positioned(bottom: -80, right: -60, child: _blurOrb(260, Colors.white.withValues(alpha: 0.03))),
          _radialGlow(const Alignment(0, -0.6), 0.9, Colors.white.withValues(alpha: 0.04)),
          _noise(0.035),
          _innerBorder(Colors.white.withValues(alpha: 0.08)),
          _topHighlight(Colors.white.withValues(alpha: 0.06)),
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
            Color(0xff0D0905),
            Color(0xff1A1208),
            Color(0xff24180A),
            Color(0xff1C1306),
            Color(0xff120C04),
          ],
          stops: [0.0, 0.25, 0.50, 0.75, 1.0],
        ),
      ),
      child: Stack(
        children: [
          Positioned(top: -120, left: -80, child: _blurOrb(360, const Color(0xffD4A44C).withValues(alpha: 0.40))),
          Positioned(top: 100, right: -80, child: _blurOrb(240, const Color(0xffB8860B).withValues(alpha: 0.25))),
          Positioned(bottom: -100, right: -60, child: _blurOrb(300, const Color(0xffCD853F).withValues(alpha: 0.30))),
          Positioned(bottom: -60, left: -40, child: _blurOrb(200, const Color(0xffDAA520).withValues(alpha: 0.20))),
          Positioned(top: 80, right: 30, child: _glassCircle(65, 0.04)),
          Positioned(bottom: 120, left: 30, child: _glassCircle(45, 0.035)),
          _radialGlow(const Alignment(0, -0.5), 0.85, const Color(0xffD4A44C).withValues(alpha: 0.06)),
          _radialGlow(const Alignment(0, 0.7), 0.65, const Color(0xffB8860B).withValues(alpha: 0.04)),
          _noise(0.028),
          _innerBorder(const Color(0xffD4A44C).withValues(alpha: 0.10)),
          _topHighlight(const Color(0xffD4A44C).withValues(alpha: 0.08)),
          Positioned.fill(child: child),
        ],
      ),
    );
  }

  // ── Primitives ────────────────────────────────────────────────────────────

  Widget _blurOrb(double size, Color color) {
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        color: color,
      ),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 45, sigmaY: 45),
        child: const SizedBox.expand(),
      ),
    );
  }

  Widget _glassCircle(double size, double opacity) {
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        color: Colors.white.withValues(alpha: opacity),
        border: Border.all(color: Colors.white.withValues(alpha: opacity * 1.5)),
      ),
    );
  }

  Widget _glassRect(double width, double height, double radius, double opacity) {
    return Container(
      width: width,
      height: height,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(radius),
        color: Colors.white.withValues(alpha: opacity),
        border: Border.all(color: Colors.white.withValues(alpha: opacity * 1.5)),
      ),
    );
  }

  Widget _radialGlow(Alignment alignment, double radius, Color color) {
    return Positioned.fill(
      child: DecoratedBox(
        decoration: BoxDecoration(
          gradient: RadialGradient(
            center: alignment,
            radius: radius,
            colors: [color, Colors.transparent],
          ),
        ),
      ),
    );
  }

  Widget _blurOverlay(double sigma, Color tint) {
    return Positioned.fill(
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: sigma, sigmaY: sigma),
        child: ColoredBox(color: tint),
      ),
    );
  }

  Widget _noise(double opacity) {
    return Positioned.fill(
      child: CustomPaint(
        painter: _NoisePainter(opacity: opacity),
      ),
    );
  }

  Widget _innerBorder(Color color) {
    return Positioned.fill(
      child: DecoratedBox(
        decoration: BoxDecoration(
          border: Border.all(color: color, width: 1),
        ),
      ),
    );
  }

  Widget _topHighlight(Color color) {
    return Positioned(
      top: 0,
      left: 0,
      right: 0,
      height: 1.5,
      child: DecoratedBox(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [
              Colors.transparent,
              color,
              Colors.transparent,
            ],
          ),
        ),
      ),
    );
  }
}

class _NoisePainter extends CustomPainter {
  final double opacity;
  _NoisePainter({required this.opacity});

  @override
  void paint(Canvas canvas, Size size) {
    final rng = Random(42);
    final paint = Paint()
      ..color = Colors.white.withValues(alpha: opacity)
      ..strokeWidth = 1;

    final count = (size.width * size.height * 0.0008).toInt().clamp(50, 400);
    for (var i = 0; i < count; i++) {
      final dx = rng.nextDouble() * size.width;
      final dy = rng.nextDouble() * size.height;
      canvas.drawPoints(PointMode.points, [Offset(dx, dy)], paint);
    }
  }

  @override
  bool shouldRepaint(covariant _NoisePainter old) => old.opacity != opacity;
}

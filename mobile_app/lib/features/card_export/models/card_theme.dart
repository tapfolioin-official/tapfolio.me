import 'package:flutter/material.dart';

/// Supported card themes — each provides a fundamentally different visual style.
///
/// Inspired by Spotify / YouTube Music share-card theme pickers:
///  • Aurora  – Purple/blue mesh gradient (default)
///  • Midnight – Pure dark, clean, monochrome
///  • Ember   – Warm gold/amber aesthetic
enum CardThemeType { aurora, midnight, ember }

/// All color/style tokens for a single card theme.
///
/// Every widget in the card_export feature reads from this to stay in sync.
class CardExportThemeData {
  final CardThemeType type;
  final String label;

  // ── Selector dot (shown in the bottom sheet) ────────────────────
  final Color selectorColor;
  final Color? selectorBorder; // null = no border

  // ── Text ────────────────────────────────────────────────────────
  final Color textPrimary;
  final Color textSecondary;
  final Color textMuted;
  final Color brandAccent; // "folio" in Tapfolio

  // ── Avatar ring gradient ────────────────────────────────────────
  final List<Color> avatarRingColors;
  final Color avatarRingGlow;

  // ── QR section ──────────────────────────────────────────────────
  final List<Color> qrBorderGradient;
  final Color qrBackground;
  final Color qrDotColor;
  final Color qrIconColor;
  final Color qrGlowColor;

  // ── Verified badge ──────────────────────────────────────────────
  final Color verifiedColor;
  final Color verifiedGlow;

  // ── Online dot ──────────────────────────────────────────────────
  final Color onlineDotColor;
  final Color onlineDotGlow;

  // ── Tag pills ───────────────────────────────────────────────────
  final List<Color> tagRoleGradient;
  final Color tagSkillBg;
  final Color tagSkillBorder;
  final Color tagTextColor;

  // ── Details section ─────────────────────────────────────────────
  final Color detailIconColor;
  final Color dividerColor;

  // ── Social icons ────────────────────────────────────────────────
  final Color socialIconColor;
  final Color socialBg;
  final Color socialBorder;

  // ── Branding footer ─────────────────────────────────────────────
  final Color footerUrlColor;
  final Color footerPillBg;
  final Color footerPillBorder;
  final Color footerPillText;

  const CardExportThemeData({
    required this.type,
    required this.label,
    required this.selectorColor,
    this.selectorBorder,
    required this.textPrimary,
    required this.textSecondary,
    required this.textMuted,
    required this.brandAccent,
    required this.avatarRingColors,
    required this.avatarRingGlow,
    required this.qrBorderGradient,
    required this.qrBackground,
    required this.qrDotColor,
    required this.qrIconColor,
    required this.qrGlowColor,
    required this.verifiedColor,
    required this.verifiedGlow,
    required this.onlineDotColor,
    required this.onlineDotGlow,
    required this.tagRoleGradient,
    required this.tagSkillBg,
    required this.tagSkillBorder,
    required this.tagTextColor,
    required this.detailIconColor,
    required this.dividerColor,
    required this.socialIconColor,
    required this.socialBg,
    required this.socialBorder,
    required this.footerUrlColor,
    required this.footerPillBg,
    required this.footerPillBorder,
    required this.footerPillText,
  });

  /// Factory: get the theme data for a given theme type.
  static CardExportThemeData fromType(CardThemeType type) {
    switch (type) {
      case CardThemeType.aurora:
        return _aurora;
      case CardThemeType.midnight:
        return _midnight;
      case CardThemeType.ember:
        return _ember;
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Aurora — Purple/Blue mesh gradient (default)
  // ═══════════════════════════════════════════════════════════════════════════

  static const _aurora = CardExportThemeData(
    type: CardThemeType.aurora,
    label: 'Aurora',
    selectorColor: Color(0xFF7C3AED),
    textPrimary: Colors.white,
    textSecondary: Color(0x8AFFFFFF), // white54
    textMuted: Color(0x61FFFFFF),     // white38
    brandAccent: Color(0xFF818CF8),
    avatarRingColors: [Color(0xFF8B5CF6), Color(0xFF3B82F6), Color(0xFF06B6D4)],
    avatarRingGlow: Color(0xFF8B5CF6),
    qrBorderGradient: [Color(0xFF8B5CF6), Color(0xFF6366F1), Color(0xFF3B82F6), Color(0xFF06B6D4)],
    qrBackground: Color(0xFFFFFFFF),
    qrDotColor: Color(0xFF1A1A2E),
    qrIconColor: Color(0xFF6366F1),
    qrGlowColor: Color(0xFF6366F1),
    verifiedColor: Color(0xFF3B82F6),
    verifiedGlow: Color(0xFF3B82F6),
    onlineDotColor: Color(0xFF4ADE80),
    onlineDotGlow: Color(0xFF4ADE80),
    tagRoleGradient: [Color(0xFF4F46E5), Color(0xFF7C3AED)],
    tagSkillBg: Color(0x1AFFFFFF),     // white10
    tagSkillBorder: Color(0x26FFFFFF), // white15
    tagTextColor: Colors.white,
    detailIconColor: Color(0xFF818CF8),
    dividerColor: Color(0x1AFFFFFF),
    socialIconColor: Color(0x99FFFFFF), // white60
    socialBg: Color(0x14FFFFFF),        // white8
    socialBorder: Color(0x26FFFFFF),
    footerUrlColor: Color(0x59FFFFFF),
    footerPillBg: Color(0x0FFFFFFF),
    footerPillBorder: Color(0x1AFFFFFF),
    footerPillText: Color(0x66FFFFFF),
  );

  // ═══════════════════════════════════════════════════════════════════════════
  // Midnight — Pure dark, clean, monochrome
  // ═══════════════════════════════════════════════════════════════════════════

  static const _midnight = CardExportThemeData(
    type: CardThemeType.midnight,
    label: 'Midnight',
    selectorColor: Color(0xFF1A1A1A),
    selectorBorder: Color(0xFFFFFFFF),
    textPrimary: Colors.white,
    textSecondary: Color(0x99FFFFFF), // white60
    textMuted: Color(0x4DFFFFFF),     // white30
    brandAccent: Color(0x99FFFFFF),    // white60
    avatarRingColors: [Color(0xFFFFFFFF), Color(0xFFB0B0B0), Color(0xFF808080)],
    avatarRingGlow: Color(0xFF666666),
    qrBorderGradient: [Color(0xFFFFFFFF), Color(0xFFCCCCCC), Color(0xFF999999), Color(0xFF666666)],
    qrBackground: Color(0xFFF5F5F5),
    qrDotColor: Color(0xFF000000),
    qrIconColor: Color(0xFF333333),
    qrGlowColor: Color(0xFF666666),
    verifiedColor: Colors.white,
    verifiedGlow: Color(0x80FFFFFF),
    onlineDotColor: Color(0xFF4ADE80),
    onlineDotGlow: Color(0xFF4ADE80),
    tagRoleGradient: [Color(0xFFFFFFFF), Color(0xFFCCCCCC)],
    tagSkillBg: Color(0x14FFFFFF),
    tagSkillBorder: Color(0x26FFFFFF),
    tagTextColor: Colors.white,
    detailIconColor: Color(0x99FFFFFF),
    dividerColor: Color(0x14FFFFFF),
    socialIconColor: Color(0x80FFFFFF),
    socialBg: Color(0x0AFFFFFF),
    socialBorder: Color(0x1AFFFFFF),
    footerUrlColor: Color(0x4DFFFFFF),
    footerPillBg: Color(0x0AFFFFFF),
    footerPillBorder: Color(0x14FFFFFF),
    footerPillText: Color(0x59FFFFFF),
  );

  // ═══════════════════════════════════════════════════════════════════════════
  // Ember — Warm gold/amber
  // ═══════════════════════════════════════════════════════════════════════════

  static const _ember = CardExportThemeData(
    type: CardThemeType.ember,
    label: 'Ember',
    selectorColor: Color(0xFFD4A44C),
    textPrimary: Color(0xFFFFF8F0),
    textSecondary: Color(0xBBFFF8F0),   // warm white 73%
    textMuted: Color(0x80FFF8F0),       // warm white 50%
    brandAccent: Color(0xFFD4A44C),
    avatarRingColors: [Color(0xFFD4A44C), Color(0xFFB8860B), Color(0xFFA0522D)],
    avatarRingGlow: Color(0xFFD4A44C),
    qrBorderGradient: [Color(0xFFD4A44C), Color(0xFFDAA520), Color(0xFFB8860B), Color(0xFFA0522D)],
    qrBackground: Color(0xFFFFF8F0),
    qrDotColor: Color(0xFF2D1B00),
    qrIconColor: Color(0xFFD4A44C),
    qrGlowColor: Color(0xFFD4A44C),
    verifiedColor: Color(0xFFD4A44C),
    verifiedGlow: Color(0xFFD4A44C),
    onlineDotColor: Color(0xFF4ADE80),
    onlineDotGlow: Color(0xFF4ADE80),
    tagRoleGradient: [Color(0xFFD4A44C), Color(0xFFB8860B)],
    tagSkillBg: Color(0x1AFFF8F0),
    tagSkillBorder: Color(0x26FFF8F0),
    tagTextColor: Color(0xFFFFF8F0),
    detailIconColor: Color(0xFFD4A44C),
    dividerColor: Color(0x1AFFF8F0),
    socialIconColor: Color(0x99FFF8F0),
    socialBg: Color(0x14FFF8F0),
    socialBorder: Color(0x26FFF8F0),
    footerUrlColor: Color(0x59FFF8F0),
    footerPillBg: Color(0x0FFFF8F0),
    footerPillBorder: Color(0x1AFFF8F0),
    footerPillText: Color(0x66FFF8F0),
  );
}

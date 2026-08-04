import 'package:flutter/material.dart';
import '../core/utils/color_parser.dart';

class ProfileThemeSettings {
  final Color primaryColor;
  final Color accentColor;
  final Color bgColor;
  final Color surfaceColor;
  final Color textColor;
  final Color mutedTextColor;
  final Color borderColor;

  final String bgType;
  final String bgValue;
  final double bgBrightness;
  final double bgBlur;
  final double bgOverlayOpacity;

  final String cardStyle;
  final double cardBorderRadius;
  final double cardOpacity;

  final String avatarShape;
  final bool avatarGlow;

  final String layoutAlignment;
  final List<String> sectionsOrder;
  final Map<String, bool> sectionsVisibility;

  ProfileThemeSettings({
    required this.primaryColor,
    required this.accentColor,
    required this.bgColor,
    required this.surfaceColor,
    required this.textColor,
    required this.mutedTextColor,
    required this.borderColor,
    required this.bgType,
    required this.bgValue,
    required this.bgBrightness,
    required this.bgBlur,
    required this.bgOverlayOpacity,
    required this.cardStyle,
    required this.cardBorderRadius,
    required this.cardOpacity,
    required this.avatarShape,
    required this.avatarGlow,
    required this.layoutAlignment,
    required this.sectionsOrder,
    required this.sectionsVisibility,
  });

  factory ProfileThemeSettings.fromJson(Map<String, dynamic>? json) {
    final colors = json?['colors'] as Map<String, dynamic>?;
    final bg = json?['background'] as Map<String, dynamic>?;
    final cards = json?['cards'] as Map<String, dynamic>?;
    final avatar = json?['avatar'] as Map<String, dynamic>?;
    final layout = json?['layout'] as Map<String, dynamic>?;
    final sections = json?['sections'] as Map<String, dynamic>?;

    final order = (sections?['order'] as List?)?.map((e) => e.toString()).toList() ??
        ['about', 'contact', 'socials', 'portfolio', 'projects'];
    final visibilityMap = sections?['visibility'] as Map<String, dynamic>?;
    final visibility = <String, bool>{
      'about': visibilityMap?['about'] != false,
      'contact': visibilityMap?['contact'] != false,
      'socials': visibilityMap?['socials'] != false,
      'portfolio': visibilityMap?['portfolio'] != false,
      'projects': visibilityMap?['projects'] != false,
    };

    return ProfileThemeSettings(
      primaryColor: _parseColor(colors?['primary'], const Color(0xFF6366F1)),
      accentColor: _parseColor(colors?['accent'], const Color(0xFF8B5CF6)),
      bgColor: _parseColor(colors?['background'], const Color(0xFF07080F)),
      surfaceColor: _parseColor(colors?['surface'], const Color(0xFFFFFFFF)),
      textColor: _parseColor(colors?['text'], const Color(0xFF111827)),
      mutedTextColor: _parseColor(colors?['mutedText'], const Color(0xFF6B7280)),
      borderColor: _parseColor(colors?['border'], const Color(0xFFE5E7EB)),

      bgType: bg?['type'] as String? ?? 'solid',
      bgValue: bg?['value'] as String? ?? '',
      bgBrightness: _toDouble(bg?['brightness']) ?? 0.8,
      bgBlur: _toDouble(bg?['blur']) ?? 0.0,
      bgOverlayOpacity: _toDouble(bg?['overlayOpacity']) ?? 0.3,

      cardStyle: cards?['style'] as String? ?? 'rounded',
      cardBorderRadius: _parseRadius(cards?['borderRadius']) ?? 16.0,
      cardOpacity: _toDouble(cards?['opacity']) ?? 1.0,

      avatarShape: avatar?['shape'] as String? ?? 'circle',
      avatarGlow: avatar?['glow'] == 'glow',

      layoutAlignment: layout?['alignment'] as String? ?? 'center',
      sectionsOrder: order,
      sectionsVisibility: visibility,
    );
  }

  static Color _parseColor(dynamic val, Color fallback) {
    if (val == null) return fallback;
    final str = val.toString().trim();
    if (str.startsWith('rgba')) {
      try {
        final match = RegExp(r'rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d.]+)\s*\)').firstMatch(str);
        if (match != null) {
          final r = int.parse(match.group(1)!);
          final g = int.parse(match.group(2)!);
          final b = int.parse(match.group(3)!);
          final a = double.parse(match.group(4)!);
          return Color.fromARGB((a * 255).round(), r, g, b);
        }
      } catch (_) {}
    } else if (str.startsWith('rgb')) {
      try {
        final match = RegExp(r'rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)').firstMatch(str);
        if (match != null) {
          final r = int.parse(match.group(1)!);
          final g = int.parse(match.group(2)!);
          final b = int.parse(match.group(3)!);
          return Color.fromARGB(255, r, g, b);
        }
      } catch (_) {}
    }
    return parseHexColor(str, fallback: fallback);
  }

  static double? _toDouble(dynamic val) {
    if (val == null) return null;
    if (val is num) return val.toDouble();
    if (val is String) return double.tryParse(val);
    return null;
  }

  static double? _parseRadius(dynamic val) {
    if (val == null) return null;
    if (val is num) return val.toDouble();
    if (val is String) {
      final clean = val.replaceAll(RegExp(r'[a-zA-Z%]'), '');
      final parsed = double.tryParse(clean);
      if (parsed != null) {
        if (val.endsWith('rem')) return parsed * 16.0;
        return parsed;
      }
    }
    return null;
  }
}

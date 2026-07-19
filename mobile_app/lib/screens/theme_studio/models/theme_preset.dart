import 'package:flutter/material.dart';
import 'theme_models.dart';

class ThemePreset {
  final String id;
  final String label;
  final String category;
  final List<Color> colors;
  final bool premium;
  final ThemeSettings settings;

  ThemePreset({
    required this.id,
    required this.label,
    required this.category,
    required this.colors,
    required this.premium,
    required this.settings,
  });
}

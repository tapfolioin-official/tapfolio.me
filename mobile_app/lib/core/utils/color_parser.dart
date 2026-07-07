import 'package:flutter/material.dart';

Color parseHexColor(String? hexColor, {Color fallback = const Color(0xFF6366F1)}) {
  if (hexColor == null || hexColor.isEmpty) return fallback;
  try {
    final cleanHex = hexColor.trim().replaceFirst('#', '');
    if (cleanHex.isEmpty) return fallback;
    
    if (cleanHex.length == 6) {
      return Color(int.parse('0xFF$cleanHex'));
    } else if (cleanHex.length == 8) {
      return Color(int.parse('0x$cleanHex'));
    }
  } catch (_) {}
  return fallback;
}

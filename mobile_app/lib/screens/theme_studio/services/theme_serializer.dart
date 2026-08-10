import 'dart:convert';
import '../models/theme_models.dart';

class ThemeSerializer {
  static ThemeSettings deserialize(dynamic rawData) {
    if (rawData == null) return ThemeSettings.defaultValue();
    if (rawData is String) {
      try {
        final decoded = jsonDecode(rawData);
        return ThemeSettings.fromJson(decoded);
      } catch (_) {
        return ThemeSettings.defaultValue();
      }
    }
    if (rawData is Map) {
      try {
        return ThemeSettings.fromJson(Map<String, dynamic>.from(rawData));
      } catch (_) {
        return ThemeSettings.defaultValue();
      }
    }
    return ThemeSettings.defaultValue();
  }

  static String serialize(ThemeSettings settings) {
    return jsonEncode(settings.toJson());
  }
}

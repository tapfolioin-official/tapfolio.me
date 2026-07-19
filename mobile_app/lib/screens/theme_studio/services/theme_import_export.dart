import 'dart:convert';
import '../models/theme_models.dart';

class ThemeImportExport {
  static ThemeSettings? importTheme(String jsonString) {
    try {
      final map = jsonDecode(jsonString);
      if (map is Map<String, dynamic>) {
        return ThemeSettings.fromJson(map);
      }
    } catch (_) {}
    return null;
  }

  static String exportTheme(ThemeSettings settings) {
    return jsonEncode(settings.toJson());
  }
}

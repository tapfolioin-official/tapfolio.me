class ThemeValidators {
  static bool isValidHexColor(String hex) {
    final regExp = RegExp(r'^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3}|[A-Fa-f0-9]{8})$');
    return regExp.hasMatch(hex);
  }
}

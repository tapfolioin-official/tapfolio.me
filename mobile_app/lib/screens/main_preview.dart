import 'package:flutter/material.dart';
import 'theme_studio/theme_studio_screen.dart';

void main() {
  runApp(
    const MaterialApp(
      debugShowCheckedModeBanner: false,
      home: ThemeStudioScreen(isPremium: true),
    ),
  );
}

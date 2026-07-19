import 'package:flutter/material.dart';
import 'theme_customizer_screen.dart';

void main() {
  runApp(
    const MaterialApp(
      debugShowCheckedModeBanner: false,
      home: ThemeCustomizerScreen(isPremium: true),
    ),
  );
}

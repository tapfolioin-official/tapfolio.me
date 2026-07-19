import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:gal/gal.dart';

class CardDownloadService {
  static Future<bool> saveToGallery(File file) async {
    try {
      final hasAccess = await Gal.hasAccess();
      if (!hasAccess) {
        final granted = await Gal.requestAccess();
        if (!granted) return false;
      }
      await Gal.putImage(file.path);
      return true;
    } catch (e) {
      debugPrint('[EXCEPTION] CardDownloadService error: $e');
      return false;
    }
  }
}

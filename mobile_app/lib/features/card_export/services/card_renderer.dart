import 'dart:io';
import 'dart:ui' as ui;
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'card_storage_service.dart';

class CardRenderer {
  static Future<File?> captureToPng(GlobalKey key, {double pixelRatio = 4.0}) async {
    try {
      final boundary = key.currentContext?.findRenderObject() as RenderRepaintBoundary?;
      if (boundary == null) return null;

      final image = await boundary.toImage(pixelRatio: pixelRatio);
      final byteData = await image.toByteData(format: ui.ImageByteFormat.png);
      if (byteData == null) return null;

      final pngBytes = byteData.buffer.asUint8List();
      final file = await CardStorageService.getTempFile('tapfolio_card_${DateTime.now().millisecondsSinceEpoch}.png');
      await file.writeAsBytes(pngBytes);
      return file;
    } catch (e) {
      debugPrint('[EXCEPTION] CardRenderer error: $e');
      return null;
    }
  }
}

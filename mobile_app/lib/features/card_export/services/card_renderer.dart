import 'dart:io';
import 'dart:ui' as ui;
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'card_storage_service.dart';

class CardRenderer {
  /// Pre-warms a network image into Flutter's image cache so it is
  /// available synchronously when [captureToPng] renders the boundary.
  static Future<void> prewarmImage(String url, BuildContext context) async {
    try {
      final provider = NetworkImage(url);
      await precacheImage(provider, context);
    } catch (e) {
      debugPrint('[WARN] CardRenderer.prewarmImage failed: $e');
    }
  }

  /// Captures the [RepaintBoundary] identified by [key] to a PNG file.
  ///
  /// Strategy:
  ///  1. Wait 5 frames so that any pending setState / frameBuilder updates
  ///     caused by image codec callbacks have fully painted.
  ///  2. Add a short real-time delay (150 ms) as an extra backstop for async
  ///     image decoders (MemoryImage codec runs on the Dart isolate and its
  ///     completion triggers a frameBuilder → setState → repaint cycle that
  ///     may not be visible to endOfFrame alone).
  static Future<File?> captureToPng(GlobalKey key, {double pixelRatio = 4.0}) async {
    try {
      // Phase 1: let the frame pipeline settle.
      await _waitForFrames(5);

      // Phase 2: extra backstop for async image decoders.
      await Future<void>.delayed(const Duration(milliseconds: 150));

      // Phase 3: one final frame to pick up any repaints from the delay.
      await _waitForFrames(1);

      final boundary = key.currentContext?.findRenderObject() as RenderRepaintBoundary?;
      if (boundary == null) return null;

      final image = await boundary.toImage(pixelRatio: pixelRatio);
      final byteData = await image.toByteData(format: ui.ImageByteFormat.png);
      if (byteData == null) return null;

      final pngBytes = byteData.buffer.asUint8List();
      final file = await CardStorageService.getTempFile(
        'tapfolio_card_${DateTime.now().millisecondsSinceEpoch}.png',
      );
      await file.writeAsBytes(pngBytes);
      return file;
    } catch (e) {
      debugPrint('[EXCEPTION] CardRenderer error: $e');
      return null;
    }
  }

  static Future<void> _waitForFrames(int count) async {
    for (var i = 0; i < count; i++) {
      // Allow microtasks (setState, image stream callbacks) to run first.
      await Future<void>.delayed(Duration.zero);
      // ignore: deprecated_member_use
      await WidgetsBinding.instance.endOfFrame;
    }
  }
}

import 'dart:io';
import 'package:path_provider/path_provider.dart';

class CardStorageService {
  static Future<File> getTempFile(String name) async {
    final tempDir = await getTemporaryDirectory();
    final file = File('${tempDir.path}/$name');
    if (await file.exists()) {
      await file.delete();
    }
    return await file.create();
  }

  static Future<void> cleanTempFiles() async {
    try {
      final tempDir = await getTemporaryDirectory();
      final dir = Directory(tempDir.path);
      if (await dir.exists()) {
        final list = dir.listSync();
        for (var file in list) {
          if (file is File && file.path.contains('tapfolio_card')) {
            await file.delete();
          }
        }
      }
    } catch (_) {}
  }
}

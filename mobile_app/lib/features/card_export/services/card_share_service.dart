import 'dart:io';
import 'package:share_plus/share_plus.dart';

class CardShareService {
  static Future<void> sharePng(File file, {String? text}) async {
    await Share.shareXFiles(
      [XFile(file.path)],
      text: text ?? 'Connect with me on Tapfolio!',
      subject: 'My Tapfolio Digital Card',
    );
  }

  static Future<void> shareUrl(String url) async {
    await Share.share(
      'Connect with me on Tapfolio: $url',
      subject: 'My Tapfolio Profile',
    );
  }
}

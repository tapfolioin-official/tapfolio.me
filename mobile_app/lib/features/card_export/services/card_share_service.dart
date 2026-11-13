import 'dart:io';
import 'package:flutter/material.dart';
import 'package:share_plus/share_plus.dart';

/// Centralized sharing service for the entire card export and QR sharing pipeline.
///
/// Ensures uniform behavior across iOS, iPad, Android, and web.
class CardShareService {
  /// Shares a PNG image file along with optional text via the native OS share sheet.
  static Future<bool> shareImage(
    File file, {
    String? text,
    String? subject,
    Rect? sharePositionOrigin,
  }) async {
    try {
      final xFile = XFile(file.path, mimeType: 'image/png');
      final result = await Share.shareXFiles(
        [xFile],
        text: text ?? 'Connect with me on Tapfolio!',
        subject: subject ?? 'My Tapfolio Digital Card',
        sharePositionOrigin: sharePositionOrigin,
      );
      // User dismissed or shared: both are successful invocations
      debugPrint('[CardShareService] Share result: ${result.status}');
      return true;
    } catch (e) {
      debugPrint('[CardShareService] Error sharing image file: $e');
      // Fallback: try sharing text link if file share failed
      if (text != null) {
        try {
          await Share.share(
            text,
            subject: subject ?? 'My Tapfolio Digital Card',
            sharePositionOrigin: sharePositionOrigin,
          );
          return true;
        } catch (_) {}
      }
      return false;
    }
  }

  /// Shares a profile URL link via the native OS share sheet.
  static Future<bool> shareProfileLink(
    String url, {
    Rect? sharePositionOrigin,
  }) async {
    try {
      await Share.share(
        'Connect with me on Tapfolio: $url',
        subject: 'My Tapfolio Profile',
        sharePositionOrigin: sharePositionOrigin,
      );
      return true;
    } catch (e) {
      debugPrint('[CardShareService] Error sharing profile link: $e');
      return false;
    }
  }

  /// Convenience wrapper for sharing a digital card.
  static Future<bool> shareCard({
    required File file,
    required String profileUrl,
    required String formatLabel,
    Rect? sharePositionOrigin,
  }) async {
    return shareImage(
      file,
      text: 'Scan to connect with me on Tapfolio! $profileUrl',
      subject: 'My Tapfolio Digital Card ($formatLabel)',
      sharePositionOrigin: sharePositionOrigin,
    );
  }

  /// Convenience wrapper for sharing a standalone QR Code.
  static Future<bool> shareQr({
    required File file,
    required String profileUrl,
    Rect? sharePositionOrigin,
  }) async {
    return shareImage(
      file,
      text: 'Scan this QR code to connect with me on Tapfolio! $profileUrl',
      subject: 'My Tapfolio QR Code',
      sharePositionOrigin: sharePositionOrigin,
    );
  }
}

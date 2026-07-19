import 'package:flutter/material.dart';

class ImageUtils {
  static ImageProvider getAvatarProvider(String? avatar, String baseUrl) {
    if (avatar == null || avatar.isEmpty || avatar == '/profile_avatar.png') {
      return const AssetImage('assets/default_avatar.png'); // Fallback local resource if any
    }
    final fullUrl = avatar.startsWith('http') ? avatar : '$baseUrl$avatar';
    return NetworkImage(fullUrl);
  }
}

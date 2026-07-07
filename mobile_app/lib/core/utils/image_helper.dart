import 'dart:convert';
import 'package:flutter/material.dart';

ImageProvider getAvatarImage(String avatar, String baseUrl) {
  try {
    if (avatar.startsWith('data:')) {
      final parts = avatar.split(',');
      if (parts.length > 1) {
        return MemoryImage(base64Decode(parts[1]));
      }
    } else {
      return NetworkImage('$baseUrl$avatar');
    }
  } catch (_) {}
  return NetworkImage('$baseUrl/profile_avatar.png');
}

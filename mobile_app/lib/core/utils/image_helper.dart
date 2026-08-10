import 'dart:convert';
import 'package:flutter/material.dart';

ImageProvider getAvatarImage(String? avatar, String baseUrl) {
  try {
    if (avatar != null && avatar.isNotEmpty) {
      if (avatar.startsWith('data:')) {
        final parts = avatar.split(',');
        if (parts.length > 1) {
          return MemoryImage(base64Decode(parts[1]));
        }
      } else if (avatar.startsWith('http://') || avatar.startsWith('https://')) {
        return NetworkImage(avatar);
      } else {
        final cleanBase = baseUrl.endsWith('/') ? baseUrl.substring(0, baseUrl.length - 1) : baseUrl;
        final cleanPath = avatar.startsWith('/') ? avatar : '/$avatar';
        return NetworkImage('$cleanBase$cleanPath');
      }
    }
  } catch (_) {}
  
  final cleanBase = baseUrl.endsWith('/') ? baseUrl.substring(0, baseUrl.length - 1) : baseUrl;
  return NetworkImage('$cleanBase/profile_avatar.png');
}

import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'tag.dart';
import 'social_link.dart';

class Profile {
  final int id;
  final int userId;
  final String name;
  final String username;
  final String tagline;
  final String avatar;
  final bool isOnline;
  final String bio;
  final String? phone;
  final String? whatsapp;
  final String? location;
  final String diamonds;
  final bool isPremium;
  final int tapCount;
  final List<Tag> tags;
  final List<SocialLink> socials;
  final Map<String, dynamic>? theme;

  Profile({
    required this.id,
    required this.userId,
    required this.name,
    required this.username,
    required this.tagline,
    required this.avatar,
    required this.isOnline,
    required this.bio,
    this.phone,
    this.whatsapp,
    this.location,
    required this.diamonds,
    required this.isPremium,
    required this.tapCount,
    required this.tags,
    required this.socials,
    this.theme,
  }) {
    debugPrint('[PROFILE-CONSTRUCTOR-BODY] Successfully entered constructor body!');
  }

  factory Profile.fromJson(Map<String, dynamic>? json) {
    if (json == null) {
      return Profile(
        id: 0,
        userId: 0,
        name: '',
        username: '',
        tagline: "Let's connect!",
        avatar: '/profile_avatar.png',
        isOnline: true,
        bio: 'I design meaningful experiences.',
        diamonds: '0',
        isPremium: false,
        tapCount: 0,
        tags: const [],
        socials: const [],
        theme: null,
      );
    }

    final tagsList = json['tags'] as List? ?? [];
    final socialsList = json['socials'] as List? ?? [];

    final rawIsOnline = json['isOnline'];
    final rawIsPremium = json['isPremium'];

    Map<String, dynamic>? parsedTheme;
    if (json['theme'] is Map) {
      parsedTheme = Map<String, dynamic>.from(json['theme'] as Map);
    } else if (json['theme'] is String && (json['theme'] as String).isNotEmpty) {
      try {
        final decoded = jsonDecode(json['theme'] as String);
        if (decoded is Map) {
          parsedTheme = Map<String, dynamic>.from(decoded);
        }
      } catch (_) {}
    }

    final rawTapCount = json['tapCount'];
    final int tapCountVal = rawTapCount is int 
        ? rawTapCount 
        : int.tryParse(rawTapCount?.toString() ?? '') ?? 0;

    return Profile(
      id: json['id'] as int? ?? 0,
      userId: json['userId'] as int? ?? 0,
      name: json['name'] as String? ?? '',
      username: json['username'] as String? ?? '',
      tagline: json['tagline'] as String? ?? "Let's connect!",
      avatar: json['avatar'] as String? ?? '/profile_avatar.png',
      isOnline: (rawIsOnline is bool) ? rawIsOnline : true,
      bio: json['bio'] as String? ?? 'I design meaningful experiences.',
      phone: json['phone'] as String?,
      whatsapp: json['whatsapp'] as String?,
      location: json['location'] as String?,
      diamonds: json['diamonds']?.toString() ?? '0',
      isPremium: (rawIsPremium is bool) ? rawIsPremium : false,
      tapCount: tapCountVal,
      tags: tagsList.map((i) => Tag.fromJson(i as Map<String, dynamic>?)).toList(),
      socials: socialsList.map((i) => SocialLink.fromJson(i as Map<String, dynamic>?)).toList(),
      theme: parsedTheme,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'userId': userId,
      'name': name,
      'username': username,
      'tagline': tagline,
      'avatar': avatar,
      'isOnline': isOnline,
      'bio': bio,
      'phone': phone,
      'whatsapp': whatsapp,
      'location': location,
      'diamonds': diamonds,
      'isPremium': isPremium,
      'tapCount': tapCount,
      'tags': tags.map((i) => i.toJson()).toList(),
      'socials': socials.map((i) => i.toJson()).toList(),
      if (theme != null) 'theme': theme,
    };
  }
}

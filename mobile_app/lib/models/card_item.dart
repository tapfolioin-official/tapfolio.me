import 'package:flutter/foundation.dart';

@immutable
class CardItem {
  final String id;
  final int userId;
  final String publicToken;
  final String name;
  final String title;
  final String designation;
  final String tagline;
  final String bio;
  final String? avatar;
  final String themeColor;
  final List<String> skills;
  final bool collectLeads;
  final bool isDefault;
  final bool isActive;
  final int views;
  final int scans;
  final DateTime updatedAt;

  const CardItem({
    required this.id,
    required this.userId,
    required this.publicToken,
    required this.name,
    required this.title,
    this.designation = 'Professional',
    this.tagline = "Let's connect!",
    this.bio = '',
    this.avatar,
    this.themeColor = '0xFF0052FF',
    this.skills = const [],
    this.collectLeads = false,
    this.isDefault = false,
    this.isActive = false,
    this.views = 0,
    this.scans = 0,
    required this.updatedAt,
  });

  /// Computes the stable, permanent public link for this card.
  String shareUrl(String baseUrl, String username) {
    var cleanBase = baseUrl.trim();
    while (cleanBase.endsWith('/')) {
      cleanBase = cleanBase.substring(0, cleanBase.length - 1);
    }
    final cleanUsername = username.toLowerCase().trim();
    if (publicToken.isNotEmpty) {
      return '$cleanBase/connect/$cleanUsername?card=$publicToken';
    }
    return '$cleanBase/connect/$cleanUsername';
  }

  CardItem copyWith({
    String? id,
    int? userId,
    String? publicToken,
    String? name,
    String? title,
    String? designation,
    String? tagline,
    String? bio,
    String? avatar,
    String? themeColor,
    List<String>? skills,
    bool? collectLeads,
    bool? isDefault,
    bool? isActive,
    int? views,
    int? scans,
    DateTime? updatedAt,
  }) {
    return CardItem(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      publicToken: publicToken ?? this.publicToken,
      name: name ?? this.name,
      title: title ?? this.title,
      designation: designation ?? this.designation,
      tagline: tagline ?? this.tagline,
      bio: bio ?? this.bio,
      avatar: avatar ?? this.avatar,
      themeColor: themeColor ?? this.themeColor,
      skills: skills ?? this.skills,
      collectLeads: collectLeads ?? this.collectLeads,
      isDefault: isDefault ?? this.isDefault,
      isActive: isActive ?? this.isActive,
      views: views ?? this.views,
      scans: scans ?? this.scans,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'userId': userId,
        'publicToken': publicToken,
        'name': name,
        'title': title,
        'designation': designation,
        'tagline': tagline,
        'bio': bio,
        'avatar': avatar,
        'themeColor': themeColor,
        'skills': skills,
        'collectLeads': collectLeads,
        'isDefault': isDefault,
        'isActive': isActive,
        'views': views,
        'scans': scans,
        'updatedAt': updatedAt.toIso8601String(),
      };

  factory CardItem.fromJson(Map<String, dynamic> json) {
    return CardItem(
      id: json['id']?.toString() ?? 'card_1',
      userId: (json['userId'] as num?)?.toInt() ?? 0,
      publicToken: json['publicToken']?.toString() ??
          json['public_token']?.toString() ??
          '',
      name: json['name']?.toString() ?? 'My Card',
      title: json['title']?.toString() ?? 'Personal Card',
      designation: json['designation']?.toString() ?? 'Professional',
      tagline: json['tagline']?.toString() ?? "Let's connect!",
      bio: json['bio']?.toString() ?? '',
      avatar: json['avatar']?.toString(),
      themeColor: json['themeColor']?.toString() ??
          json['theme_color']?.toString() ??
          '0xFF0052FF',
      skills: (json['skills'] as List<dynamic>?)
              ?.map((e) => e.toString())
              .toList() ??
          const [],
      collectLeads: (json['collectLeads'] as bool?) ??
          (json['collect_leads'] as bool?) ??
          false,
      isDefault: (json['isDefault'] as bool?) ??
          (json['is_default'] as bool?) ??
          false,
      isActive: (json['isActive'] as bool?) ??
          (json['is_active'] as bool?) ??
          false,
      views: (json['views'] as num?)?.toInt() ?? 0,
      scans: (json['scans'] as num?)?.toInt() ?? 0,
      updatedAt: DateTime.tryParse(
              json['updatedAt']?.toString() ?? json['updated_at']?.toString() ?? '') ??
          DateTime.now(),
    );
  }

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is CardItem &&
          runtimeType == other.runtimeType &&
          id == other.id &&
          isActive == other.isActive &&
          isDefault == other.isDefault &&
          title == other.title &&
          designation == other.designation &&
          updatedAt == other.updatedAt;

  @override
  int get hashCode =>
      id.hashCode ^
      isActive.hashCode ^
      isDefault.hashCode ^
      title.hashCode ^
      designation.hashCode ^
      updatedAt.hashCode;
}

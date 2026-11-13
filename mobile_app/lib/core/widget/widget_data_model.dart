import 'dart:convert';

/// Presentation-safe data model for the Tapfolio iOS Widget.
///
/// CRITICAL SECURITY NOTE:
/// This model MUST NEVER contain authentication tokens, passwords, API secrets,
/// or sensitive private credentials. All fields here are strictly presentation data
/// intended to be rendered on the user's iOS Home Screen.
class WidgetProfileData {
  final String name;
  final String title;
  final String username;
  final String? avatarFileName;
  final int connections;
  final int views;
  final String diamonds;
  final String profileUrl;
  final bool isLoggedIn;
  final String lastUpdated;

  const WidgetProfileData({
    required this.name,
    required this.title,
    required this.username,
    this.avatarFileName,
    required this.connections,
    required this.views,
    required this.diamonds,
    required this.profileUrl,
    required this.isLoggedIn,
    required this.lastUpdated,
  });

  /// Default representation when the user is logged out or unauthenticated.
  factory WidgetProfileData.loggedOut() {
    return WidgetProfileData(
      name: 'Tapfolio Member',
      title: 'Digital Business Card',
      username: '',
      avatarFileName: null,
      connections: 0,
      views: 0,
      diamonds: '0',
      profileUrl: 'https://tapfolio.me',
      isLoggedIn: false,
      lastUpdated: DateTime.now().toUtc().toIso8601String(),
    );
  }

  /// Deserialization from JSON.
  factory WidgetProfileData.fromJson(Map<String, dynamic> json) {
    return WidgetProfileData(
      name: json['name'] as String? ?? 'Tapfolio Member',
      title: json['title'] as String? ?? 'Professional',
      username: json['username'] as String? ?? '',
      avatarFileName: json['avatarFileName'] as String?,
      connections: json['connections'] as int? ?? 0,
      views: json['views'] as int? ?? 0,
      diamonds: json['diamonds']?.toString() ?? '0',
      profileUrl: json['profileUrl'] as String? ?? 'https://tapfolio.me',
      isLoggedIn: json['isLoggedIn'] as bool? ?? false,
      lastUpdated: json['lastUpdated'] as String? ??
          DateTime.now().toUtc().toIso8601String(),
    );
  }

  /// Serialization to JSON for storage in App Group container.
  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'title': title,
      'username': username,
      'avatarFileName': avatarFileName,
      'connections': connections,
      'views': views,
      'diamonds': diamonds,
      'profileUrl': profileUrl,
      'isLoggedIn': isLoggedIn,
      'lastUpdated': lastUpdated,
    };
  }

  /// Serializes to a JSON string.
  String toJsonString() => jsonEncode(toJson());

  /// Creates a copy with optionally updated fields.
  WidgetProfileData copyWith({
    String? name,
    String? title,
    String? username,
    String? avatarFileName,
    int? connections,
    int? views,
    String? diamonds,
    String? profileUrl,
    bool? isLoggedIn,
    String? lastUpdated,
  }) {
    return WidgetProfileData(
      name: name ?? this.name,
      title: title ?? this.title,
      username: username ?? this.username,
      avatarFileName: avatarFileName ?? this.avatarFileName,
      connections: connections ?? this.connections,
      views: views ?? this.views,
      diamonds: diamonds ?? this.diamonds,
      profileUrl: profileUrl ?? this.profileUrl,
      isLoggedIn: isLoggedIn ?? this.isLoggedIn,
      lastUpdated: lastUpdated ?? this.lastUpdated,
    );
  }
}

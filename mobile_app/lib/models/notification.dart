import '../core/utils/safe_cast.dart';

class NotificationSender {
  final int id;
  final String name;
  final String avatar;
  final String username;

  NotificationSender({
    required this.id,
    required this.name,
    required this.avatar,
    required this.username,
  });

  factory NotificationSender.fromJson(Map<String, dynamic> json) {
    return NotificationSender(
      id: json['id'] ?? 0,
      name: json['name'] ?? '',
      avatar: json['avatar'] ?? '/profile_avatar.png',
      username: json['username'] ?? '',
    );
  }
}

class AppNotification {
  final int id;
  final String type;
  final String title;
  final String message;
  final Map<String, dynamic> data;
  final bool isRead;
  final DateTime createdAt;
  final NotificationSender? sender;

  AppNotification({
    required this.id,
    required this.type,
    required this.title,
    required this.message,
    required this.data,
    required this.isRead,
    required this.createdAt,
    this.sender,
  });

  factory AppNotification.fromJson(Map<String, dynamic> json) {
    return AppNotification(
      id: json['id'] ?? 0,
      type: json['type'] ?? 'system',
      title: json['title'] ?? '',
      message: json['message'] ?? '',
      data: asMap(json['data']) ?? {},
      isRead: json['isRead'] ?? false,
      createdAt: DateTime.tryParse(json['createdAt'] ?? '') ?? DateTime.now(),
      sender: json['sender'] != null
          ? NotificationSender.fromJson(asMap(json['sender']) ?? {})
          : null,
    );
  }

  /// Returns true if this is an actionable connection_request
  bool get isConnectionRequest => type == 'connection_request';

  /// Returns true if notification is a connection_accepted
  bool get isConnectionAccepted => type == 'connection_accepted';

  /// Parses the connectionId from the data payload (if present)
  int? get connectionId {
    final raw = data['connectionId'];
    if (raw == null) return null;
    if (raw is int) return raw;
    return int.tryParse(raw.toString());
  }

  /// Parses the username from the data payload (if present)
  String? get targetUsername => data['username'] as String?;
}

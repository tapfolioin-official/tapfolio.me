class HistoryEvent {
  final int id;
  final String action;
  final String details;
  final String? icon;
  final String? color;
  final String createdAt;

  HistoryEvent({
    required this.id,
    required this.action,
    required this.details,
    this.icon,
    this.color,
    required this.createdAt,
  });

  factory HistoryEvent.fromJson(Map<String, dynamic>? json) {
    if (json == null) {
      return HistoryEvent(id: 0, action: '', details: '', createdAt: '');
    }
    return HistoryEvent(
      id: json['id'] as int? ?? 0,
      action: json['action'] as String? ?? '',
      details: json['details'] as String? ?? '',
      icon: json['icon'] as String?,
      color: json['color'] as String?,
      createdAt: json['createdAt'] as String? ?? '',
    );
  }
}

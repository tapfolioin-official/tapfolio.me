class ChecklistItem {
  final String id;
  final String label;
  final int points;
  final bool completed;
  final String description;

  ChecklistItem({
    required this.id,
    required this.label,
    required this.points,
    required this.completed,
    required this.description,
  });

  factory ChecklistItem.fromJson(Map<String, dynamic>? json) {
    if (json == null) {
      return ChecklistItem(id: '', label: '', points: 0, completed: false, description: '');
    }
    return ChecklistItem(
      id: json['id'] as String? ?? '',
      label: json['label'] as String? ?? '',
      points: json['points'] as int? ?? 0,
      completed: json['completed'] as bool? ?? false,
      description: json['description'] as String? ?? '',
    );
  }
}

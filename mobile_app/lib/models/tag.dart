class Tag {
  final int? id;
  final String text;
  final String type; // "role" | "location"

  Tag({
    this.id,
    required this.text,
    required this.type,
  });

  factory Tag.fromJson(Map<String, dynamic>? json) {
    if (json == null) {
      return Tag(text: '', type: 'role');
    }
    return Tag(
      id: json['id'] as int?,
      text: json['text'] as String? ?? '',
      type: json['type'] as String? ?? 'role',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      if (id != null) 'id': id,
      'text': text,
      'type': type,
    };
  }
}

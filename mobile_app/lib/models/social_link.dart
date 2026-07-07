class SocialLink {
  final int? id;
  final String platform;
  final String handle;
  final String url;
  final String icon;
  final String color;

  SocialLink({
    this.id,
    required this.platform,
    required this.handle,
    required this.url,
    required this.icon,
    required this.color,
  });

  factory SocialLink.fromJson(Map<String, dynamic>? json) {
    if (json == null) {
      return SocialLink(platform: '', handle: '', url: '', icon: '', color: '');
    }
    return SocialLink(
      id: json['id'] as int?,
      platform: json['platform'] as String? ?? '',
      handle: json['handle'] as String? ?? '',
      url: json['url'] as String? ?? '',
      icon: json['icon'] as String? ?? '',
      color: json['color'] as String? ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      if (id != null) 'id': id,
      'platform': platform,
      'handle': handle,
      'url': url,
      'icon': icon,
      'color': color,
    };
  }
}

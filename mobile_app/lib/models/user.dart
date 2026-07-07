import '../core/utils/safe_cast.dart';
import 'profile.dart';

class User {
  final int id;
  final String name;
  final String email;
  final Profile? profile;

  User({
    required this.id,
    required this.name,
    required this.email,
    this.profile,
  });

  factory User.fromJson(Map<String, dynamic>? json) {
    if (json == null) {
      return User(id: 0, name: '', email: '');
    }
    return User(
      id: json['id'] as int? ?? 0,
      name: json['name'] as String? ?? '',
      email: json['email'] as String? ?? '',
      profile: json['profile'] != null ? Profile.fromJson(asMap(json['profile'])) : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'email': email,
      'profile': profile?.toJson(),
    };
  }
}

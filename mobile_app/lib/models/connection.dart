import 'tag.dart';
import 'social_link.dart';
import '../core/utils/safe_cast.dart';

class ConnectionPermissionData {
  final bool shareName;
  final bool shareEmail;
  final bool sharePhone;
  final bool shareWhatsapp;
  final bool shareLocation;
  final List<int> sharedSocialIds;

  ConnectionPermissionData({
    this.shareName = true,
    this.shareEmail = true,
    this.sharePhone = false,
    this.shareWhatsapp = true,
    this.shareLocation = false,
    this.sharedSocialIds = const [],
  });

  factory ConnectionPermissionData.fromJson(Map<String, dynamic>? json) {
    if (json == null) {
      return ConnectionPermissionData();
    }
    final socialIdsList = json['sharedSocialIds'] as List? ?? [];
    return ConnectionPermissionData(
      shareName: json['shareName'] as bool? ?? true,
      shareEmail: json['shareEmail'] as bool? ?? true,
      sharePhone: json['sharePhone'] as bool? ?? false,
      shareWhatsapp: json['shareWhatsapp'] as bool? ?? true,
      shareLocation: json['shareLocation'] as bool? ?? false,
      sharedSocialIds: socialIdsList.map((id) => (id is int) ? id : int.tryParse(id.toString()) ?? 0).where((id) => id > 0).toList(),
    );
  }

  Map<String, dynamic> toJson() => {
        'shareName': shareName,
        'shareEmail': shareEmail,
        'sharePhone': sharePhone,
        'shareWhatsapp': shareWhatsapp,
        'shareLocation': shareLocation,
        'sharedSocialIds': sharedSocialIds,
      };
}

class ConnectionOther {
  final int userId;
  final String? name;
  final String avatar;
  final String tagline;
  final String? email;
  final String? phone;
  final String? whatsapp;
  final String? location;
  final int? profileId;
  final List<Tag> tags;
  final List<SocialLink> socials;

  ConnectionOther({
    required this.userId,
    this.name,
    required this.avatar,
    required this.tagline,
    this.email,
    this.phone,
    this.whatsapp,
    this.location,
    this.profileId,
    required this.tags,
    required this.socials,
  });

  factory ConnectionOther.fromJson(Map<String, dynamic>? json) {
    if (json == null) {
      return ConnectionOther(userId: 0, avatar: '/profile_avatar.png', tagline: '', tags: [], socials: []);
    }
    return ConnectionOther(
      userId: json['userId'] as int? ?? 0,
      name: json['name'] as String?,
      avatar: json['avatar'] as String? ?? '/profile_avatar.png',
      tagline: json['tagline'] as String? ?? '',
      email: json['email'] as String?,
      phone: json['phone'] as String?,
      whatsapp: json['whatsapp'] as String?,
      location: json['location'] as String?,
      profileId: json['profileId'] as int?,
      tags: asList(json['tags'], (t) => Tag.fromJson(asMap(t))),
      socials: asList(json['socials'], (s) => SocialLink.fromJson(asMap(s))),
    );
  }
}

class Connection {
  final int id;
  final String via;
  final DateTime connectedAt;
  final ConnectionOther other;
  final ConnectionPermissionData? permissions;
  final ConnectionPermissionData? myPermissions;

  Connection({
    required this.id,
    required this.via,
    required this.connectedAt,
    required this.other,
    this.permissions,
    this.myPermissions,
  });

  factory Connection.fromJson(Map<String, dynamic>? json) {
    if (json == null) {
      return Connection(id: 0, via: 'link', connectedAt: DateTime.now(), other: ConnectionOther.fromJson(null));
    }
    return Connection(
      id: json['id'] as int? ?? 0,
      via: json['via'] as String? ?? 'link',
      connectedAt: DateTime.tryParse(json['connectedAt'] as String? ?? '') ?? DateTime.now(),
      other: ConnectionOther.fromJson(asMap(json['other'])),
      permissions: json['permissions'] != null
          ? ConnectionPermissionData.fromJson(asMap(json['permissions']))
          : null,
      myPermissions: json['myPermissions'] != null
          ? ConnectionPermissionData.fromJson(asMap(json['myPermissions']))
          : null,
    );
  }
}

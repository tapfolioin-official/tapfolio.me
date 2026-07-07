import 'tag.dart';
import '../core/utils/safe_cast.dart';

class PendingRequest {
  final int id;
  final String via;
  final DateTime createdAt;
  final int requesterUserId;
  final String requesterName;
  final String requesterAvatar;
  final String requesterTagline;
  final int? requesterProfileId;
  final String requesterDiamonds;
  final int requesterConnectionCount;
  final int requesterTapCount;
  final List<Tag> requesterTags;

  PendingRequest({
    required this.id,
    required this.via,
    required this.createdAt,
    required this.requesterUserId,
    required this.requesterName,
    required this.requesterAvatar,
    required this.requesterTagline,
    this.requesterProfileId,
    required this.requesterDiamonds,
    required this.requesterConnectionCount,
    required this.requesterTapCount,
    required this.requesterTags,
  });

  factory PendingRequest.fromJson(Map<String, dynamic>? json) {
    if (json == null) {
      return PendingRequest(
        id: 0,
        via: 'link',
        createdAt: DateTime.now(),
        requesterUserId: 0,
        requesterName: '',
        requesterAvatar: '/profile_avatar.png',
        requesterTagline: '',
        requesterDiamonds: '0',
        requesterConnectionCount: 0,
        requesterTapCount: 0,
        requesterTags: const [],
      );
    }
    final r = asMap(json['requester']) ?? {};
    return PendingRequest(
      id: json['id'] as int? ?? 0,
      via: json['via'] as String? ?? 'link',
      createdAt: DateTime.tryParse(json['createdAt'] as String? ?? '') ?? DateTime.now(),
      requesterUserId: r['userId'] as int? ?? 0,
      requesterName: r['name'] as String? ?? '',
      requesterAvatar: r['avatar'] as String? ?? '/profile_avatar.png',
      requesterTagline: r['tagline'] as String? ?? '',
      requesterProfileId: r['profileId'] as int?,
      requesterDiamonds: r['diamonds'] as String? ?? '0',
      requesterConnectionCount: r['connectionCount'] as int? ?? 0,
      requesterTapCount: r['tapCount'] as int? ?? 0,
      requesterTags: asList(r['tags'], (t) => Tag.fromJson(asMap(t))),
    );
  }
}

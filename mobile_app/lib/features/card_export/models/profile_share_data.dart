import 'package:flutter/material.dart';
import '../../../models/tag.dart';
import '../../../models/social_link.dart';

/// Single source of truth for all profile data consumed by the Share Card,
/// Digital Card preview, and Share via QR modal.
class ProfileShareData {
  final String name;
  final String tagline;
  final String? avatar;
  final String profileUrl;
  final String baseUrl;
  final bool isPremium;
  final bool isOnline;
  final String? location;
  final String? bio;
  final List<Tag> tags;
  final List<SocialLink> socials;

  const ProfileShareData({
    required this.name,
    required this.tagline,
    this.avatar,
    required this.profileUrl,
    required this.baseUrl,
    required this.isPremium,
    this.isOnline = true,
    this.location,
    this.bio,
    this.tags = const [],
    this.socials = const [],
  });

  /// Creates ProfileShareData tailored specifically to a CardItem
  factory ProfileShareData.fromCardAndProfile({
    required dynamic card, // CardItem
    required dynamic profile, // Profile
    required String baseUrl,
  }) {
    final profileName = profile.name?.toString().trim() ?? '';
    final cardName = card.name?.toString().trim() ?? '';

    // The display name on the shared card header MUST be the user's full name.
    // Always prefer the profile full name, only falling back to card.name if it's
    // not the generic "My Card" label.
    final name = profileName.isNotEmpty
        ? profileName
        : ((cardName.isNotEmpty && cardName.toLowerCase() != 'my card')
            ? cardName
            : 'Tapfolio User');

    final cardDesig = card.designation?.toString().trim();
    final cardTitle = card.title?.toString().trim();
    final tagline = (cardDesig != null && cardDesig.isNotEmpty)
        ? cardDesig
        : ((cardTitle != null && cardTitle.isNotEmpty)
            ? cardTitle
            : (profile.tagline?.toString() ?? 'Professional'));

    final cardBio = card.bio?.toString().trim();
    final bio = (cardBio != null && cardBio.isNotEmpty)
        ? cardBio
        : (profile.bio?.toString() ?? '');

    final avatar = card.avatar ?? profile.avatar;
    final username = profile.username?.toString() ?? '';
    final shareUrl = card.shareUrl(baseUrl, username);

    final List<Tag> tags = (card.skills is List && (card.skills as List).isNotEmpty)
        ? (card.skills as List)
            .asMap()
            .entries
            .map((e) => Tag(id: e.key + 1, text: e.value.toString(), type: 'role'))
            .toList()
        : (profile.tags ?? const <Tag>[]);

    return ProfileShareData(
      name: name,
      tagline: tagline,
      avatar: avatar,
      profileUrl: shareUrl,
      baseUrl: baseUrl,
      isPremium: profile.isPremium ?? false,
      isOnline: profile.isOnline ?? true,
      location: profile.location,
      bio: bio,
      tags: tags,
      socials: profile.socials ?? const <SocialLink>[],
    );
  }

  /// Normalizes any raw profile URL, domain, or username into a clean,
  /// canonical HTTPS Tapfolio URL.
  ///
  /// Examples:
  ///  • 'nibras.in' -> 'https://www.tapfolio.me/connect/nibras.in'
  ///  • 'tapfolio.me/connect/nibras.in' -> 'https://www.tapfolio.me/connect/nibras.in'
  ///  • 'http://www.tapfolio.me/connect/nibras.in' -> 'https://www.tapfolio.me/connect/nibras.in'
  ///  • 'https://www.tapfolio.me/connect/nibras.in' -> 'https://www.tapfolio.me/connect/nibras.in'
  static String normalizeProfileUrl(
    String rawUrl, {
    String baseUrl = 'https://www.tapfolio.me',
  }) {
    var trimmed = rawUrl.trim();
    if (trimmed.isEmpty) return 'https://www.tapfolio.me';

    // Remove any trailing slashes
    while (trimmed.endsWith('/')) {
      trimmed = trimmed.substring(0, trimmed.length - 1).trim();
    }

    // If it already has http:// or https://
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      final uri = Uri.tryParse(trimmed);
      if (uri != null && uri.host.isNotEmpty) {
        if (uri.scheme == 'http') {
          return trimmed.replaceFirst('http://', 'https://');
        }
        return trimmed;
      }
    }

    // If it starts with tapfolio.me or www.tapfolio.me
    if (trimmed.startsWith('www.tapfolio.me') ||
        trimmed.startsWith('tapfolio.me')) {
      final clean = trimmed.startsWith('www.') ? trimmed : 'www.$trimmed';
      return 'https://$clean';
    }

    // If it's a relative path like '/connect/nibras.in' or 'connect/nibras.in'
    if (trimmed.startsWith('/connect/') || trimmed.startsWith('connect/')) {
      final path = trimmed.startsWith('/') ? trimmed : '/$trimmed';
      final cleanBase = baseUrl.endsWith('/')
          ? baseUrl.substring(0, baseUrl.length - 1)
          : baseUrl;
      return '$cleanBase$path';
    }

    // Otherwise treat as username
    final cleanBase = baseUrl.endsWith('/')
        ? baseUrl.substring(0, baseUrl.length - 1)
        : baseUrl;
    return '$cleanBase/connect/$trimmed';
  }

  /// Validates if the given URL string is a valid HTTPS or HTTP URL.
  static bool isValidUrl(String? url) {
    if (url == null || url.trim().isEmpty) return false;
    final trimmed = url.trim();
    if (trimmed == 'null' ||
        trimmed == 'undefined' ||
        trimmed.startsWith('javascript:')) {
      return false;
    }
    final uri = Uri.tryParse(trimmed);
    if (uri == null) return false;
    return uri.isAbsolute &&
        (uri.scheme == 'http' || uri.scheme == 'https') &&
        uri.host.isNotEmpty;
  }

  /// Returns the canonical normalized HTTPS URL for QR generation and sharing.
  String get canonicalUrl => normalizeProfileUrl(profileUrl, baseUrl: baseUrl);

  /// Formatted share text for the native share sheet.
  String get shareText =>
      'Scan to connect with me on Tapfolio! $canonicalUrl';
}

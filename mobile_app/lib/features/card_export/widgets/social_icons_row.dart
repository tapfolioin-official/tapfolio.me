import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import '../../../models/social_link.dart';
import '../models/card_theme.dart';

/// A row of social-platform icons — theme-aware.
///
/// All dimensions driven by [iconSize] for proportional rendering.
class SocialIconsRow extends StatelessWidget {
  final List<SocialLink> socials;
  final double iconSize;
  final int maxIcons;
  final CardExportThemeData theme;

  const SocialIconsRow({
    super.key,
    required this.socials,
    this.iconSize = 36,
    this.maxIcons = 5,
    required this.theme,
  });

  @override
  Widget build(BuildContext context) {
    if (socials.isEmpty) return const SizedBox.shrink();

    final t = theme;
    final visible = socials.take(maxIcons).toList();
    final gap = (iconSize * 0.35).clamp(6.0, 18.0);
    final faSize = (iconSize * 0.44).clamp(10.0, 22.0);
    final borderW = (iconSize * 0.04).clamp(0.6, 2.0);

    return Row(
      mainAxisSize: MainAxisSize.min,
      mainAxisAlignment: MainAxisAlignment.center,
      children: visible.map((link) {
        return Padding(
          padding: EdgeInsets.symmetric(horizontal: gap / 2),
          child: Container(
            width: iconSize,
            height: iconSize,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: t.socialBg,
              border: Border.all(color: t.socialBorder, width: borderW),
            ),
            child: Center(
              child: _iconForPlatform(link.icon, size: faSize, color: t.socialIconColor),
            ),
          ),
        );
      }).toList(),
    );
  }

  Widget _iconForPlatform(String name, {required double size, required Color color}) {
    switch (name.toLowerCase()) {
      case 'github':    return FaIcon(FontAwesomeIcons.github,    color: color, size: size);
      case 'linkedin':  return FaIcon(FontAwesomeIcons.linkedin,  color: color, size: size);
      case 'twitter':   return FaIcon(FontAwesomeIcons.xTwitter,  color: color, size: size);
      case 'instagram': return FaIcon(FontAwesomeIcons.instagram, color: color, size: size);
      case 'youtube':   return FaIcon(FontAwesomeIcons.youtube,   color: color, size: size);
      case 'telegram':  return FaIcon(FontAwesomeIcons.telegram,  color: color, size: size);
      case 'whatsapp':  return FaIcon(FontAwesomeIcons.whatsapp,  color: color, size: size);
      case 'behance':   return FaIcon(FontAwesomeIcons.behance,   color: color, size: size);
      case 'facebook':  return FaIcon(FontAwesomeIcons.facebook,  color: color, size: size);
      case 'tiktok':    return FaIcon(FontAwesomeIcons.tiktok,    color: color, size: size);
      case 'globe':     return Icon(Icons.language_rounded,        color: color, size: size);
      case 'email':     return Icon(Icons.email_rounded,           color: color, size: size);
      case 'phone':     return Icon(Icons.phone_rounded,           color: color, size: size);
      default:          return Icon(Icons.link_rounded,            color: color, size: size);
    }
  }
}

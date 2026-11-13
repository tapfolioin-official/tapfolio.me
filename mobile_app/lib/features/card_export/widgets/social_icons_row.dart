import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import '../../../models/social_link.dart';
import '../models/card_theme.dart';

/// A row of social-platform icons — theme-aware and beautifully branded.
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
        final brandStyle = _brandStyleForPlatform(link.icon, t);

        return Padding(
          padding: EdgeInsets.symmetric(horizontal: gap / 2),
          child: Container(
            width: iconSize,
            height: iconSize,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: brandStyle.gradient == null ? brandStyle.color : null,
              gradient: brandStyle.gradient,
              border: brandStyle.border ? Border.all(color: t.socialBorder, width: borderW) : null,
              boxShadow: [
                BoxShadow(
                  color: (brandStyle.color ?? const Color(0xFF3B82F6)).withValues(alpha: 0.15),
                  blurRadius: 4,
                  offset: const Offset(0, 1.5),
                ),
              ],
            ),
            child: Center(
              child: _iconForPlatform(link.icon, size: faSize, color: brandStyle.iconColor),
            ),
          ),
        );
      }).toList(),
    );
  }

  _SocialBrandStyle _brandStyleForPlatform(String name, CardExportThemeData t) {
    if (t.type != CardThemeType.light) {
      return _SocialBrandStyle(
        color: t.socialBg,
        iconColor: t.socialIconColor,
        border: true,
      );
    }

    switch (name.toLowerCase()) {
      case 'instagram':
        return const _SocialBrandStyle(
          gradient: LinearGradient(
            colors: [Color(0xFFF58529), Color(0xFFDD2A7B), Color(0xFF8134AF)],
            begin: Alignment.topRight,
            end: Alignment.bottomLeft,
          ),
          iconColor: Colors.white,
          border: false,
        );
      case 'linkedin':
        return const _SocialBrandStyle(
          color: Color(0xFF0A66C2),
          iconColor: Colors.white,
          border: false,
        );
      case 'facebook':
        return const _SocialBrandStyle(
          color: Color(0xFF1877F2),
          iconColor: Colors.white,
          border: false,
        );
      case 'github':
        return const _SocialBrandStyle(
          color: Color(0xFF24292E),
          iconColor: Colors.white,
          border: false,
        );
      case 'whatsapp':
        return const _SocialBrandStyle(
          color: Color(0xFF25D366),
          iconColor: Colors.white,
          border: false,
        );
      case 'twitter':
      case 'x':
        return const _SocialBrandStyle(
          color: Color(0xFF000000),
          iconColor: Colors.white,
          border: false,
        );
      default:
        return _SocialBrandStyle(
          color: Colors.white,
          iconColor: const Color(0xFF3B82F6),
          border: true,
        );
    }
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

class _SocialBrandStyle {
  final Color? color;
  final Gradient? gradient;
  final Color iconColor;
  final bool border;

  const _SocialBrandStyle({
    this.color,
    this.gradient,
    required this.iconColor,
    this.border = false,
  });
}

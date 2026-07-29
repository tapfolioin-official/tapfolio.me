import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../models/card_theme.dart';

/// ProfileHeader with all dimensions driven by [avatarRadius] and all colors
/// driven by [theme].
///
/// Includes a verified badge with glow and a "✨ Let's Connect" sparkle
/// divider below the tagline.
class ProfileHeader extends StatelessWidget {
  final String name;
  final String? tagline;
  final String? avatar;
  final String baseUrl;
  final bool isOnline;
  final bool isPremium;
  final double avatarRadius;
  final CardExportThemeData theme;

  const ProfileHeader({
    super.key,
    required this.name,
    this.tagline,
    this.avatar,
    required this.baseUrl,
    this.isOnline = true,
    this.isPremium = false,
    this.avatarRadius = 42,
    required this.theme,
  });

  String _initials(String value) {
    final parts = value.trim().split(RegExp(r'\s+'));
    if (parts.isEmpty || parts.first.isEmpty) return '?';
    if (parts.length == 1) return parts.first[0].toUpperCase();
    return '${parts.first[0]}${parts.last[0]}'.toUpperCase();
  }

  @override
  Widget build(BuildContext context) {
    final hasTagline = tagline != null && tagline!.trim().isNotEmpty;
    final t = theme;

    // ── Derived sizes ────────────────────────────────────────────
    final r          = avatarRadius;
    final outerPad   = r * 0.076;
    final innerPad   = r * 0.055;
    final logoFs     = (r * 0.295).clamp(10.0, 28.0);
    final dotSz      = (r * 0.155).clamp( 5.0, 14.0);
    final nameFs     = (r * 0.620).clamp(16.0, 58.0);
    final taglineFs  = (r * 0.295).clamp( 9.0, 24.0);
    final initialsFs = (r * 0.720).clamp(12.0, 50.0);
    final sparkleFs  = (r * 0.250).clamp( 8.0, 22.0);
    final verifiedSz = (nameFs * 0.85).clamp(14.0, 52.0);
    final gapLogo    = r * 0.32;
    final gapAvtr    = r * 0.30;
    final gapName    = r * 0.11;
    final gapSparkle = r * 0.22;

    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        // ── Brand Row ─────────────────────────────────────────────
        Row(
          mainAxisSize: MainAxisSize.min,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            RichText(
              text: TextSpan(
                children: [
                  TextSpan(
                    text: 'Tap',
                    style: GoogleFonts.outfit(
                      color: t.textPrimary,
                      fontWeight: FontWeight.w700,
                      fontSize: logoFs,
                      letterSpacing: 0.2,
                    ),
                  ),
                  TextSpan(
                    text: 'folio',
                    style: GoogleFonts.outfit(
                      color: t.brandAccent,
                      fontWeight: FontWeight.w700,
                      fontSize: logoFs,
                      letterSpacing: 0.2,
                    ),
                  ),
                ],
              ),
            ),
            SizedBox(width: dotSz * 0.8),
            Container(
              width: dotSz,
              height: dotSz,
              decoration: BoxDecoration(
                color: isOnline ? t.onlineDotColor : t.textMuted,
                shape: BoxShape.circle,
                boxShadow: isOnline
                    ? [
                        BoxShadow(
                          color: t.onlineDotGlow.withValues(alpha: 0.70),
                          blurRadius: dotSz * 1.2,
                          spreadRadius: dotSz * 0.15,
                        ),
                      ]
                    : null,
              ),
            ),
          ],
        ),

        SizedBox(height: gapLogo),

        // ── Avatar with gradient ring ─────────────────────────────
        Container(
          padding: EdgeInsets.all(outerPad),
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            gradient: LinearGradient(
              colors: t.avatarRingColors,
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            boxShadow: [
              BoxShadow(
                color: t.avatarRingGlow.withValues(alpha: 0.55),
                blurRadius: r * 0.60,
                spreadRadius: r * 0.04,
              ),
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.40),
                blurRadius: r * 0.40,
                offset: Offset(0, r * 0.17),
              ),
            ],
          ),
          child: Container(
            padding: EdgeInsets.all(innerPad),
            decoration: const BoxDecoration(
              shape: BoxShape.circle,
              color: Color(0xff0F172A),
            ),
            child: SizedBox.square(
              dimension: r * 2,
              child: ClipOval(
                child: _AvatarContent(
                  avatarRaw: avatar,
                  baseUrl: baseUrl,
                  initials: _initials(name),
                  initialsFs: initialsFs,
                  textColor: t.textPrimary,
                ),
              ),
            ),
          ),
        ),

        SizedBox(height: gapAvtr),

        // ── Name + verified badge with glow ──────────────────────
        Padding(
          padding: EdgeInsets.symmetric(horizontal: r * 0.28),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Flexible(
                child: FittedBox(
                  fit: BoxFit.scaleDown,
                  child: Text(
                    name,
                    maxLines: 1,
                    textAlign: TextAlign.center,
                    style: GoogleFonts.outfit(
                      fontSize: nameFs,
                      fontWeight: FontWeight.w700,
                      color: t.textPrimary,
                      letterSpacing: -0.5,
                      height: 1.1,
                    ),
                  ),
                ),
              ),
              if (isPremium) ...[
                SizedBox(width: r * 0.10),
                Container(
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    boxShadow: [
                      BoxShadow(
                        color: t.verifiedGlow.withValues(alpha: 0.60),
                        blurRadius: verifiedSz * 0.60,
                        spreadRadius: verifiedSz * 0.05,
                      ),
                    ],
                  ),
                  child: Icon(
                    Icons.verified_rounded,
                    color: t.verifiedColor,
                    size: verifiedSz,
                  ),
                ),
              ],
            ],
          ),
        ),

        // ── Tagline ───────────────────────────────────────────────
        if (hasTagline) ...[
          SizedBox(height: gapName),
          Padding(
            padding: EdgeInsets.symmetric(horizontal: r * 0.32),
            child: FittedBox(
              fit: BoxFit.scaleDown,
              child: Text(
                tagline!,
                maxLines: 1,
                textAlign: TextAlign.center,
                style: GoogleFonts.outfit(
                  fontSize: taglineFs,
                  fontWeight: FontWeight.w500,
                  color: t.textSecondary,
                  letterSpacing: 0.1,
                ),
              ),
            ),
          ),
        ],

        // ── ✨ Let's Connect sparkle divider ──────────────────────
        SizedBox(height: gapSparkle),
        Text(
          '✨  Let\'s Connect',
          textAlign: TextAlign.center,
          style: GoogleFonts.outfit(
            fontSize: sparkleFs,
            fontWeight: FontWeight.w600,
            color: t.textMuted,
            letterSpacing: 1.0,
          ),
        ),
      ],
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// _AvatarContent — Stable ImageProvider lifecycle
// ─────────────────────────────────────────────────────────────────────────────

class _AvatarContent extends StatefulWidget {
  final String? avatarRaw;
  final String baseUrl;
  final String initials;
  final double initialsFs;
  final Color textColor;

  const _AvatarContent({
    required this.avatarRaw,
    required this.baseUrl,
    required this.initials,
    required this.initialsFs,
    this.textColor = Colors.white,
  });

  @override
  State<_AvatarContent> createState() => _AvatarContentState();
}

class _AvatarContentState extends State<_AvatarContent> {
  ImageProvider? _provider;

  @override
  void initState() {
    super.initState();
    _provider = _resolve(widget.avatarRaw, widget.baseUrl);
  }

  @override
  void didUpdateWidget(_AvatarContent old) {
    super.didUpdateWidget(old);
    if (old.avatarRaw != widget.avatarRaw || old.baseUrl != widget.baseUrl) {
      _provider = _resolve(widget.avatarRaw, widget.baseUrl);
    }
  }

  static ImageProvider? _resolve(String? raw, String baseUrl) {
    if (raw == null || raw.isEmpty || raw == '/profile_avatar.png') return null;
    if (raw.startsWith('data:')) {
      final comma = raw.indexOf(',');
      if (comma == -1) return null;
      try {
        return MemoryImage(base64Decode(raw.substring(comma + 1)));
      } catch (_) {
        return null;
      }
    }
    final url = raw.startsWith('http') ? raw : '$baseUrl$raw';
    return NetworkImage(url);
  }

  @override
  Widget build(BuildContext context) {
    final p = _provider;
    if (p == null) {
      return ColoredBox(
        color: const Color(0xff1F2937),
        child: Center(
          child: Text(
            widget.initials,
            style: GoogleFonts.outfit(
              color: widget.textColor,
              fontWeight: FontWeight.bold,
              fontSize: widget.initialsFs,
            ),
          ),
        ),
      );
    }

    return ColoredBox(
      color: const Color(0xff1F2937),
      child: Image(
        image: p,
        fit: BoxFit.cover,
        frameBuilder: (ctx, child, frame, wasSynchronouslyLoaded) {
          if (wasSynchronouslyLoaded || frame != null) return child;
          return Center(
            child: Text(
              widget.initials,
              style: GoogleFonts.outfit(
                color: widget.textColor.withValues(alpha: 0.38),
                fontWeight: FontWeight.bold,
                fontSize: widget.initialsFs,
              ),
            ),
          );
        },
        errorBuilder: (_, __, ___) => ColoredBox(
          color: const Color(0xff1F2937),
          child: Center(
            child: Text(
              widget.initials,
              style: GoogleFonts.outfit(
                color: widget.textColor,
                fontWeight: FontWeight.bold,
                fontSize: widget.initialsFs,
              ),
            ),
          ),
        ),
      ),
    );
  }
}

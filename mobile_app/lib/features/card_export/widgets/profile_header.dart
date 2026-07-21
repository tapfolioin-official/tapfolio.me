import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

/// ProfileHeader with all dimensions driven by [avatarRadius].
/// This ensures consistent proportions at any card size — small preview
/// or 4× export render.
///
/// The Verified badge lives in digital_card.dart (between the header Expanded
/// and the ContactCard) so it never overlaps the glass card below.
class ProfileHeader extends StatelessWidget {
  final String name;
  final String? tagline;
  final String? avatar;
  final String baseUrl;
  final bool isOnline;
  final bool isPremium;

  /// Controls the size of the avatar and ALL derived sizes (fonts, gaps, ring).
  final double avatarRadius;

  const ProfileHeader({
    super.key,
    required this.name,
    this.tagline,
    this.avatar,
    required this.baseUrl,
    this.isOnline = true,
    this.isPremium = false,
    this.avatarRadius = 42,
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

    // ── Derived sizes (all proportional to avatarRadius) ──────────
    final r          = avatarRadius;
    final outerPad   = r * 0.076;
    final innerPad   = r * 0.055;
    final logoFs     = (r * 0.295).clamp(10.0, 28.0);
    final dotSz      = (r * 0.155).clamp( 5.0, 14.0);
    final nameFs     = (r * 0.620).clamp(16.0, 58.0);
    final taglineFs  = (r * 0.295).clamp( 9.0, 24.0);
    final initialsFs = (r * 0.720).clamp(12.0, 50.0);
    final gapLogo    = r * 0.32;
    final gapAvtr    = r * 0.30;
    final gapName    = r * 0.11;

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
                      color: Colors.white,
                      fontWeight: FontWeight.w700,
                      fontSize: logoFs,
                      letterSpacing: 0.2,
                    ),
                  ),
                  TextSpan(
                    text: 'folio',
                    style: GoogleFonts.outfit(
                      color: const Color(0xFF818CF8),
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
                color: isOnline ? const Color(0xFF4ADE80) : Colors.white38,
                shape: BoxShape.circle,
                boxShadow: isOnline
                    ? [
                        BoxShadow(
                          color: const Color(0xFF4ADE80).withValues(alpha: 0.70),
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
            gradient: const LinearGradient(
              colors: [
                Color(0xff8B5CF6),
                Color(0xff3B82F6),
                Color(0xff06B6D4),
              ],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            boxShadow: [
              BoxShadow(
                color: const Color(0xff8B5CF6).withValues(alpha: 0.55),
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
                // ── Pass RAW strings so _AvatarContent can compare by value ──
                // Do NOT pass a pre-resolved ImageProvider here — every build()
                // call would create a new MemoryImage instance with a different
                // object identity, causing _AvatarContentState to reset its
                // loaded flag on every parent rebuild (including the one that
                // fires from setState(() => _exporting = true) right before the
                // export capture).
                child: _AvatarContent(
                  avatarRaw: avatar,
                  baseUrl: baseUrl,
                  initials: _initials(name),
                  initialsFs: initialsFs,
                ),
              ),
            ),
          ),
        ),

        SizedBox(height: gapAvtr),

        // ── Name + optional blue verified tick ───────────────────
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
                      color: Colors.white,
                      letterSpacing: -0.5,
                      height: 1.1,
                    ),
                  ),
                ),
              ),
              if (isPremium) ...[
                SizedBox(width: r * 0.10),
                Icon(
                  Icons.verified_rounded,
                  color: const Color(0xFF3B82F6),
                  size: (nameFs * 0.85).clamp(14.0, 52.0),
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
                  color: Colors.white54,
                  letterSpacing: 0.1,
                ),
              ),
            ),
          ),
        ],
      ],
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// _AvatarContent
//
// A StatefulWidget that owns the ImageProvider lifetime.
// KEY DESIGN: takes the raw avatar STRING (not an ImageProvider) so that
// didUpdateWidget can compare by string VALUE. This prevents the
// "reset on every parent rebuild" bug that occurred when ProfileHeader
// (a StatelessWidget) created a new MemoryImage instance on each build()
// call, which would always differ from the previous instance by object
// identity, causing the loaded-flag to be reset right before export capture.
// ─────────────────────────────────────────────────────────────────────────────

class _AvatarContent extends StatefulWidget {
  final String? avatarRaw;
  final String baseUrl;
  final String initials;
  final double initialsFs;

  const _AvatarContent({
    required this.avatarRaw,
    required this.baseUrl,
    required this.initials,
    required this.initialsFs,
  });

  @override
  State<_AvatarContent> createState() => _AvatarContentState();
}

class _AvatarContentState extends State<_AvatarContent> {
  /// Resolved once from [widget.avatarRaw]. Re-resolved only when the raw
  /// string actually changes (not on every parent rebuild).
  ImageProvider? _provider;

  @override
  void initState() {
    super.initState();
    _provider = _resolve(widget.avatarRaw, widget.baseUrl);
  }

  @override
  void didUpdateWidget(_AvatarContent old) {
    super.didUpdateWidget(old);
    // Compare by STRING value — only re-resolve when the actual avatar data
    // changes (e.g., user uploads a new photo). Rebuilds of the parent widget
    // with the same avatar/baseUrl values will NOT touch _provider, keeping
    // the image stable across export-related setState calls.
    if (old.avatarRaw != widget.avatarRaw || old.baseUrl != widget.baseUrl) {
      _provider = _resolve(widget.avatarRaw, widget.baseUrl);
    }
  }

  /// Resolves the raw avatar string into a stable [ImageProvider].
  ///
  /// Called exactly once per unique (avatarRaw, baseUrl) pair.
  static ImageProvider? _resolve(String? raw, String baseUrl) {
    if (raw == null || raw.isEmpty || raw == '/profile_avatar.png') return null;

    // Case 1: base64 data URI (server fallback when Cloudinary isn't set up)
    if (raw.startsWith('data:')) {
      final comma = raw.indexOf(',');
      if (comma == -1) return null;
      try {
        return MemoryImage(base64Decode(raw.substring(comma + 1)));
      } catch (_) {
        return null; // malformed → fall through to initials
      }
    }

    // Case 2: full URL (Cloudinary) or relative path (prepend baseUrl)
    final url = raw.startsWith('http') ? raw : '$baseUrl$raw';
    return NetworkImage(url);
  }

  @override
  Widget build(BuildContext context) {
    final p = _provider;

    // No image → initials immediately
    if (p == null) {
      return ColoredBox(
        color: const Color(0xff1F2937),
        child: Center(
          child: Text(
            widget.initials,
            style: GoogleFonts.outfit(
              color: Colors.white,
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
        // frameBuilder: shows dimmed initials while the image is decoding
        // (only meaningful for the very first frame; after that Flutter caches
        // the decoded image so subsequent renders are synchronous).
        frameBuilder: (ctx, child, frame, wasSynchronouslyLoaded) {
          if (wasSynchronouslyLoaded || frame != null) return child;
          return Center(
            child: Text(
              widget.initials,
              style: GoogleFonts.outfit(
                color: Colors.white38,
                fontWeight: FontWeight.bold,
                fontSize: widget.initialsFs,
              ),
            ),
          );
        },
        // errorBuilder: permanent fallback on load failure
        errorBuilder: (_, __, ___) => ColoredBox(
          color: const Color(0xff1F2937),
          child: Center(
            child: Text(
              widget.initials,
              style: GoogleFonts.outfit(
                color: Colors.white,
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

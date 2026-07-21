import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../models/tag.dart';

/// A glass card that shows the user's location, biography, and profile tags.
/// Rows that have no data are hidden automatically — no empty placeholders.
///
/// All sizes are driven by [scale] (0.0–1.0) relative to the card width
/// so the widget looks proportional in both the 280 px preview and the
/// 4× export render.
class ProfileInfoCard extends StatelessWidget {
  final String? location;
  final String? bio;
  final List<Tag> tags;

  /// Scale factor: 1.0 = full-size export, ~0.65 = small preview.
  /// Derived automatically from the card width in digital_card.dart.
  final double scale;

  const ProfileInfoCard({
    super.key,
    this.location,
    this.bio,
    this.tags = const [],
    this.scale = 1.0,
  });

  bool get _hasLocation => location != null && location!.trim().isNotEmpty;
  bool get _hasBio      => bio != null && bio!.trim().isNotEmpty;
  bool get _hasTags     => tags.isNotEmpty;
  bool get _hasContent  => _hasLocation || _hasBio || _hasTags;

  @override
  Widget build(BuildContext context) {
    if (!_hasContent) return const SizedBox.shrink();

    final fs      = (13.0 * scale).clamp(9.0,  18.0); // base font size
    final iconSz  = (14.0 * scale).clamp(10.0, 20.0);
    final tagFs   = (11.0 * scale).clamp( 8.0, 16.0);
    final padH    = 16.0 * scale;
    final padV    = 12.0 * scale;
    final rowGap  = 10.0 * scale;
    final tagGap  =  6.0 * scale;
    final tagPadH =  9.0 * scale;
    final tagPadV =  4.0 * scale;
    final radius  = 18.0 * scale;

    return Container(
      width: double.infinity,
      padding: EdgeInsets.symmetric(horizontal: padH, vertical: padV),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.06),
        borderRadius: BorderRadius.circular(radius),
        border: Border.all(
          color: Colors.white.withValues(alpha: 0.10),
          width: 0.8,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          // ── Location ──────────────────────────────────────────────
          if (_hasLocation) ...[
            Row(
              children: [
                Icon(
                  Icons.location_on_rounded,
                  size: iconSz,
                  color: const Color(0xFF818CF8),
                ),
                SizedBox(width: tagGap),
                Expanded(
                  child: Text(
                    location!,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: GoogleFonts.outfit(
                      color: Colors.white70,
                      fontSize: fs,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ),
              ],
            ),
            if (_hasBio || _hasTags) SizedBox(height: rowGap),
          ],

          // ── Biography ─────────────────────────────────────────────
          if (_hasBio) ...[
            Text(
              bio!,
              maxLines: 3,
              overflow: TextOverflow.ellipsis,
              style: GoogleFonts.outfit(
                color: Colors.white60,
                fontSize: fs * 0.93,
                fontWeight: FontWeight.w400,
                height: 1.45,
              ),
            ),
            if (_hasTags) SizedBox(height: rowGap),
          ],

          // ── Tags ──────────────────────────────────────────────────
          if (_hasTags)
            Wrap(
              spacing: tagGap,
              runSpacing: tagGap * 0.7,
              children: tags.take(6).map((tag) {
                final isRole = tag.type == 'role';
                return Container(
                  padding: EdgeInsets.symmetric(
                    horizontal: tagPadH,
                    vertical: tagPadV,
                  ),
                  decoration: BoxDecoration(
                    gradient: isRole
                        ? const LinearGradient(
                            colors: [
                              Color(0xff4F46E5),
                              Color(0xff7C3AED),
                            ],
                          )
                        : null,
                    color: isRole
                        ? null
                        : Colors.white.withValues(alpha: 0.10),
                    borderRadius: BorderRadius.circular(50),
                    border: isRole
                        ? null
                        : Border.all(
                            color: Colors.white.withValues(alpha: 0.15),
                            width: 0.8,
                          ),
                  ),
                  child: Text(
                    tag.text,
                    style: GoogleFonts.outfit(
                      color: Colors.white,
                      fontSize: tagFs,
                      fontWeight: FontWeight.w600,
                      letterSpacing: 0.2,
                    ),
                  ),
                );
              }).toList(),
            ),
        ],
      ),
    );
  }
}

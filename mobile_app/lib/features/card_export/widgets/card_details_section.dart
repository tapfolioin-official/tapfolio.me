import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../models/tag.dart';
import '../models/card_theme.dart';

/// Compact details section: location + role tags.
///
/// Adds visual weight without being a full description box.
/// All sizes scale from [scale] for proportional rendering.
class CardDetailsSection extends StatelessWidget {
  final String? location;
  final List<Tag> tags;
  final CardExportThemeData theme;

  /// Scale factor (1.0 = full-size export, ~0.65 = small preview).
  final double scale;

  const CardDetailsSection({
    super.key,
    this.location,
    this.tags = const [],
    required this.theme,
    this.scale = 1.0,
  });

  bool get _hasLocation => location != null && location!.trim().isNotEmpty;
  bool get _hasTags => tags.isNotEmpty;
  bool get _hasContent => _hasLocation || _hasTags;

  @override
  Widget build(BuildContext context) {
    if (!_hasContent) return const SizedBox.shrink();

    final locFs   = (12.0 * scale).clamp(8.0, 17.0);
    final locIcon = (13.0 * scale).clamp(9.0, 18.0);
    final tagFs   = (10.0 * scale).clamp(7.0, 15.0);
    final tagPadH = (8.0 * scale).clamp(5.0, 12.0);
    final tagPadV = (3.5 * scale).clamp(2.0, 6.0);
    final gap     = (7.0 * scale).clamp(4.0, 12.0);
    final tagGap  = (5.0 * scale).clamp(3.0, 8.0);
    final divH    = (30.0 * scale).clamp(16.0, 50.0);
    final divThk  = (0.8 * scale).clamp(0.5, 1.2);

    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        // ── Thin divider line ────────────────────────────────────
        Container(
          width: divH,
          height: divThk,
          decoration: BoxDecoration(
            color: theme.dividerColor,
            borderRadius: BorderRadius.circular(1),
          ),
        ),
        SizedBox(height: gap),

        // ── Location row ─────────────────────────────────────────
        if (_hasLocation) ...[
          Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(
                Icons.location_on_rounded,
                size: locIcon,
                color: theme.detailIconColor,
              ),
              SizedBox(width: tagGap * 0.7),
              Text(
                location!,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: GoogleFonts.outfit(
                  color: theme.textSecondary,
                  fontSize: locFs,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ],
          ),
          if (_hasTags) SizedBox(height: gap),
        ],

        // ── Tag pills ────────────────────────────────────────────
        if (_hasTags)
          Wrap(
            spacing: tagGap,
            runSpacing: tagGap * 0.7,
            alignment: WrapAlignment.center,
            children: tags.take(4).map((tag) {
              final isRole = tag.type == 'role';
              return Container(
                padding: EdgeInsets.symmetric(
                  horizontal: tagPadH,
                  vertical: tagPadV,
                ),
                decoration: BoxDecoration(
                  gradient: isRole
                      ? LinearGradient(colors: theme.tagRoleGradient)
                      : null,
                  color: isRole ? null : theme.tagSkillBg,
                  borderRadius: BorderRadius.circular(50),
                  border: isRole
                      ? null
                      : Border.all(
                          color: theme.tagSkillBorder,
                          width: 0.7,
                        ),
                ),
                child: Text(
                  tag.text,
                  style: GoogleFonts.outfit(
                    color: theme.tagTextColor,
                    fontSize: tagFs,
                    fontWeight: FontWeight.w600,
                    letterSpacing: 0.2,
                  ),
                ),
              );
            }).toList(),
          ),
      ],
    );
  }
}

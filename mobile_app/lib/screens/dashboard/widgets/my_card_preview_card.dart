import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import '../../../models/profile.dart';
import '../../../models/card_item.dart';
import '../../../models/tag.dart';
import '../../../models/social_link.dart';

class MyCardPreviewCard extends StatefulWidget {
  final Profile profile;
  final CardItem? card;
  final bool isLeadCaptureEnabled;
  final ValueChanged<bool> onToggleLeadCapture;
  final VoidCallback onPreviewTap;
  final VoidCallback onOptionsTap;
  final VoidCallback onAddSocialTap;

  const MyCardPreviewCard({
    super.key,
    required this.profile,
    this.card,
    required this.isLeadCaptureEnabled,
    required this.onToggleLeadCapture,
    required this.onPreviewTap,
    required this.onOptionsTap,
    required this.onAddSocialTap,
  });

  @override
  State<MyCardPreviewCard> createState() => _MyCardPreviewCardState();
}

class _MyCardPreviewCardState extends State<MyCardPreviewCard> {
  late bool _leadCapture;

  @override
  void initState() {
    super.initState();
    _leadCapture = widget.card?.collectLeads ?? widget.isLeadCaptureEnabled;
  }

  @override
  void didUpdateWidget(covariant MyCardPreviewCard oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.card?.collectLeads != widget.card?.collectLeads) {
      _leadCapture = widget.card?.collectLeads ?? widget.isLeadCaptureEnabled;
    } else if (oldWidget.isLeadCaptureEnabled != widget.isLeadCaptureEnabled) {
      _leadCapture = widget.isLeadCaptureEnabled;
    }
  }

  @override
  Widget build(BuildContext context) {
    final isLight = Theme.of(context).brightness == Brightness.light;
    final cardBg = isLight ? Colors.white : const Color(0xFF13131F);
    final borderColor = isLight
        ? const Color(0xFFE2E8F0)
        : Colors.white.withValues(alpha: 0.08);
    final textColor = isLight ? const Color(0xFF0F172A) : Colors.white;

    final p = widget.profile;
    final card = widget.card;

    final displayName = p.name.isNotEmpty
        ? p.name
        : ((card != null && card.name.isNotEmpty && card.name.toLowerCase() != 'my card')
            ? card.name
            : 'Tapfolio User');
    final cardTitle = (card?.title.isNotEmpty == true) ? card!.title : 'Personal Card';
    final role = (card?.designation.isNotEmpty == true)
        ? card!.designation
        : (p.tagline.isNotEmpty ? p.tagline : 'Full-Stack Developer');

    Color themeAccent;
    try {
      themeAccent = card != null ? Color(int.parse(card.themeColor)) : const Color(0xFF0052FF);
    } catch (_) {
      themeAccent = const Color(0xFF0052FF);
    }

    // Tags
    final displayTags = (card != null && card.skills.isNotEmpty)
        ? card.skills.asMap().entries.map((e) => Tag(id: e.key + 1, text: e.value, type: 'category')).toList()
        : (p.tags.isNotEmpty
            ? p.tags
            : [
                Tag(id: 1, text: 'Technology & IT', type: 'category'),
                Tag(id: 2, text: 'Design & Creativity', type: 'category'),
                Tag(id: 3, text: 'Engineering', type: 'category'),
              ]);

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
      child: GestureDetector(
        onTap: () {
          HapticFeedback.lightImpact();
          widget.onPreviewTap();
        },
        child: Container(
          decoration: BoxDecoration(
            color: cardBg,
            borderRadius: BorderRadius.circular(22),
            border: Border.all(color: borderColor, width: 1),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: isLight ? 0.04 : 0.25),
                blurRadius: 20,
                offset: const Offset(0, 6),
              ),
            ],
          ),
          padding: const EdgeInsets.all(12),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // ── Left: Royal Blue Mini Digital Card ───────────────────────
              Expanded(
                flex: 44,
                child: Container(
                  height: 180,
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(16),
                    gradient: LinearGradient(
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                      colors: [
                        themeAccent.withValues(alpha: 0.90),
                        themeAccent,
                        themeAccent.withValues(alpha: 0.80),
                      ],
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: themeAccent.withValues(alpha: 0.35),
                        blurRadius: 14,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      // Mini card header
                      Row(
                        children: [
                          Container(
                            width: 20,
                            height: 20,
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(5),
                            ),
                            alignment: Alignment.center,
                            child: Text(
                              'T',
                              style: GoogleFonts.outfit(
                                color: themeAccent,
                                fontSize: 13,
                                fontWeight: FontWeight.w900,
                              ),
                            ),
                          ),
                          const SizedBox(width: 6),
                          Text(
                            'tapfolio',
                            style: GoogleFonts.outfit(
                              color: Colors.white,
                              fontSize: 13,
                              fontWeight: FontWeight.w700,
                              letterSpacing: -0.2,
                            ),
                          ),
                        ],
                      ),

                      // User name and title in mini card
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            displayName,
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                            style: GoogleFonts.outfit(
                              color: Colors.white,
                              fontSize: 14,
                              fontWeight: FontWeight.bold,
                              height: 1.2,
                            ),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            role,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: GoogleFonts.outfit(
                              color: Colors.white.withValues(alpha: 0.80),
                              fontSize: 11,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ],
                      ),

                      // Collect Leads toggle
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            'Collect leads',
                            style: GoogleFonts.outfit(
                              color: Colors.white.withValues(alpha: 0.90),
                              fontSize: 10,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                          Transform.scale(
                            scale: 0.65,
                            child: Switch(
                              value: _leadCapture,
                              activeThumbColor: Colors.white,
                              activeTrackColor: const Color(0xFF60A5FA),
                              inactiveThumbColor: Colors.white70,
                              inactiveTrackColor: Colors.white24,
                              onChanged: (val) {
                                HapticFeedback.selectionClick();
                                setState(() => _leadCapture = val);
                                widget.onToggleLeadCapture(val);
                              },
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),

              const SizedBox(width: 14),

              // ── Right: Status, Category Tags & Social Icons ───────────────
              Expanded(
                flex: 56,
                child: SizedBox(
                  height: 180,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      // Top Row: Active status + Options
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          // Status chip
                          Container(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 9, vertical: 4),
                            decoration: BoxDecoration(
                              color: const Color(0xFF10B981)
                                  .withValues(alpha: isLight ? 0.12 : 0.20),
                              borderRadius: BorderRadius.circular(20),
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Container(
                                  width: 6,
                                  height: 6,
                                  decoration: const BoxDecoration(
                                    color: Color(0xFF10B981),
                                    shape: BoxShape.circle,
                                  ),
                                ),
                                const SizedBox(width: 5),
                                Text(
                                  'Active',
                                  style: GoogleFonts.outfit(
                                    color: const Color(0xFF10B981),
                                    fontSize: 11,
                                    fontWeight: FontWeight.w700,
                                  ),
                                ),
                              ],
                            ),
                          ),

                          // Three dots options
                          InkWell(
                            onTap: () {
                              HapticFeedback.lightImpact();
                              widget.onOptionsTap();
                            },
                            borderRadius: BorderRadius.circular(14),
                            child: const Padding(
                              padding: EdgeInsets.all(4),
                              child: Icon(
                                Icons.more_horiz_rounded,
                                color: Colors.grey,
                                size: 20,
                              ),
                            ),
                          ),
                        ],
                      ),

                      // Role Headline
                      Text(
                        role,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: GoogleFonts.outfit(
                          color: textColor,
                          fontSize: 14,
                          fontWeight: FontWeight.w700,
                        ),
                      ),

                      // Category Pills
                      Wrap(
                        spacing: 4,
                        runSpacing: 4,
                        children: [
                          for (final tag in displayTags.take(3))
                            _buildTagPill(tag.text, isLight),
                          if (displayTags.length > 3)
                            _buildTagPill('+${displayTags.length - 3}', isLight),
                        ],
                      ),

                      // Social Icon Bubbles Row
                      Row(
                        children: [
                          for (final social in p.socials.take(4))
                            Padding(
                              padding: const EdgeInsets.only(right: 6),
                              child: _buildSocialIconBubble(social, isLight),
                            ),
                          // Plus Add Social button
                          InkWell(
                            onTap: () {
                              HapticFeedback.lightImpact();
                              widget.onAddSocialTap();
                            },
                            borderRadius: BorderRadius.circular(16),
                            child: Container(
                              width: 30,
                              height: 30,
                              decoration: BoxDecoration(
                                color: isLight
                                    ? const Color(0xFFF1F5F9)
                                    : Colors.white.withValues(alpha: 0.08),
                                shape: BoxShape.circle,
                                border: Border.all(
                                  color: isLight
                                      ? const Color(0xFFE2E8F0)
                                      : Colors.white12,
                                ),
                              ),
                              alignment: Alignment.center,
                              child: Icon(
                                Icons.add_rounded,
                                size: 16,
                                color: isLight
                                    ? const Color(0xFF475569)
                                    : Colors.white70,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildTagPill(String label, bool isLight) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
      decoration: BoxDecoration(
        color: isLight
            ? const Color(0xFFF1F5F9)
            : Colors.white.withValues(alpha: 0.06),
        borderRadius: BorderRadius.circular(6),
        border: Border.all(
          color: isLight
              ? const Color(0xFFE2E8F0)
              : Colors.white.withValues(alpha: 0.06),
          width: 0.8,
        ),
      ),
      child: Text(
        label,
        style: GoogleFonts.outfit(
          color: isLight ? const Color(0xFF475569) : Colors.white70,
          fontSize: 9.5,
          fontWeight: FontWeight.w500,
        ),
      ),
    );
  }

  Widget _buildSocialIconBubble(SocialLink social, bool isLight) {
    Widget iconWidget;

    final platform = social.platform.toLowerCase();
    if (platform.contains('instagram')) {
      iconWidget = const FaIcon(
        FontAwesomeIcons.instagram,
        size: 13,
        color: Color(0xFFE1306C),
      );
    } else if (platform.contains('linkedin')) {
      iconWidget = const FaIcon(
        FontAwesomeIcons.linkedinIn,
        size: 13,
        color: Color(0xFF0077B5),
      );
    } else if (platform.contains('twitter') || platform.contains('x')) {
      iconWidget = const FaIcon(
        FontAwesomeIcons.xTwitter,
        size: 13,
        color: Color(0xFF1DA1F2),
      );
    } else if (platform.contains('whatsapp')) {
      iconWidget = const FaIcon(
        FontAwesomeIcons.whatsapp,
        size: 13,
        color: Color(0xFF25D366),
      );
    } else if (platform.contains('github')) {
      iconWidget = FaIcon(
        FontAwesomeIcons.github,
        size: 13,
        color: isLight ? Colors.black87 : Colors.white,
      );
    } else {
      iconWidget = const Icon(
        Icons.link_rounded,
        size: 13,
        color: Color(0xFF0052FF),
      );
    }

    return Container(
      width: 30,
      height: 30,
      decoration: BoxDecoration(
        color: isLight
            ? const Color(0xFFF8FAFC)
            : Colors.white.withValues(alpha: 0.06),
        shape: BoxShape.circle,
        border: Border.all(
          color: isLight
              ? const Color(0xFFE2E8F0)
              : Colors.white.withValues(alpha: 0.08),
        ),
      ),
      alignment: Alignment.center,
      child: iconWidget,
    );
  }
}

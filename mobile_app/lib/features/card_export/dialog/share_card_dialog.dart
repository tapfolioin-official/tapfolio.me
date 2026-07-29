import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../models/tag.dart';
import '../../../models/social_link.dart';
import '../widgets/digital_card.dart';
import '../services/card_renderer.dart';
import '../services/card_share_service.dart';
import '../services/card_download_service.dart';
import '../services/card_storage_service.dart';

// ─────────────────────────────────────────────────────────────────────────────
// Export format definitions
// ─────────────────────────────────────────────────────────────────────────────

enum _ExportFormat {
  story,
  post,
  businessCard,
}

extension _ExportFormatExt on _ExportFormat {
  String get label {
    switch (this) {
      case _ExportFormat.story:        return 'Story';
      case _ExportFormat.post:         return 'Post';
      case _ExportFormat.businessCard: return 'Card';
    }
  }

  String get subtitle {
    switch (this) {
      case _ExportFormat.story:        return '9:16';
      case _ExportFormat.post:         return '4:5';
      case _ExportFormat.businessCard: return '3.37:2.125';
    }
  }

  IconData get icon {
    switch (this) {
      case _ExportFormat.story:        return Icons.stay_current_portrait_rounded;
      case _ExportFormat.post:         return Icons.crop_portrait_rounded;
      case _ExportFormat.businessCard: return Icons.credit_card_rounded;
    }
  }

  double get aspectRatio {
    switch (this) {
      case _ExportFormat.story:        return 9 / 16;
      case _ExportFormat.post:         return 4 / 5;
      case _ExportFormat.businessCard: return 1012 / 638; // credit card
    }
  }

  double get pixelRatio {
    // Capture multiplier so the final PNG hits the target pixel dimensions.
    // The preview widget is 280 lp wide → render at 4× for story (1080 px).
    switch (this) {
      case _ExportFormat.story:        return 4.0;
      case _ExportFormat.post:         return 4.0;
      case _ExportFormat.businessCard: return 3.6;
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// ShareCardDialog
// ─────────────────────────────────────────────────────────────────────────────

class ShareCardDialog extends StatefulWidget {
  final String name;
  final String tagline;
  final String? avatar;
  final String profileUrl;
  final String baseUrl;
  final bool isPremium;
  final bool isOnline;

  // Profile detail fields
  final String? location;
  final String? bio;
  final List<Tag> tags;
  final List<SocialLink> socials;

  const ShareCardDialog({
    super.key,
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

  static void show(
    BuildContext context, {
    required String name,
    required String tagline,
    String? avatar,
    required String profileUrl,
    required String baseUrl,
    required bool isPremium,
    bool isOnline = true,
    String? location,
    String? bio,
    List<Tag> tags = const [],
    List<SocialLink> socials = const [],
  }) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: const Color(0xFF0F0F1A),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (_) => ShareCardDialog(
        name: name,
        tagline: tagline,
        avatar: avatar,
        profileUrl: profileUrl,
        baseUrl: baseUrl,
        isPremium: isPremium,
        isOnline: isOnline,
        location: location,
        bio: bio,
        tags: tags,
        socials: socials,
      ),
    );
  }

  @override
  State<ShareCardDialog> createState() => _ShareCardDialogState();
}

class _ShareCardDialogState extends State<ShareCardDialog> {
  /// Key for the visible preview (also used as the capture target).
  final GlobalKey _repaintKey = GlobalKey();
  bool _exporting = false;

  /// Currently selected export format.
  _ExportFormat _format = _ExportFormat.story;

  @override
  void initState() {
    super.initState();
    // Pre-warm the avatar so it's in cache before export capture.
    // Skip data: URIs — those are decoded immediately as MemoryImage.
    final raw = widget.avatar;
    if (raw != null &&
        raw.isNotEmpty &&
        raw != '/profile_avatar.png' &&
        !raw.startsWith('data:')) {
      WidgetsBinding.instance.addPostFrameCallback((_) async {
        if (!mounted) return;
        final url = raw.startsWith('http')
            ? raw
            : '${widget.baseUrl}$raw';
        await CardRenderer.prewarmImage(url, context);
        if (mounted) setState(() {}); // trigger rebuild with loaded image
      });
    }
  }

  DigitalCard get _card => DigitalCard(
        name: widget.name,
        tagline: widget.tagline,
        avatar: widget.avatar,
        profileUrl: widget.profileUrl,
        baseUrl: widget.baseUrl,
        removeBranding: widget.isPremium,
        isPremium: widget.isPremium,
        isOnline: widget.isOnline,
        socials: widget.socials,
        location: widget.location,
        bio: widget.bio,
        tags: widget.tags,
      );

  Future<void> _prewarmAvatar() async {
    final raw = widget.avatar;
    if (raw != null &&
        raw.isNotEmpty &&
        raw != '/profile_avatar.png' &&
        !raw.startsWith('data:') &&
        mounted) {
      final url = raw.startsWith('http')
          ? raw
          : '${widget.baseUrl}$raw';
      await CardRenderer.prewarmImage(url, context);
    }
  }

  Future<void> _shareCard() async {
    setState(() => _exporting = true);
    await _prewarmAvatar();

    final file = await CardRenderer.captureToPng(
      _repaintKey,
      pixelRatio: _format.pixelRatio,
    );
    setState(() => _exporting = false);

    if (file != null) {
      await CardShareService.sharePng(
        file,
        text: 'Scan to connect with me on Tapfolio! ${widget.profileUrl}',
      );
      await CardStorageService.cleanTempFiles();
    } else {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Failed to generate card image.'),
            backgroundColor: Colors.redAccent,
          ),
        );
      }
    }
  }

  Future<void> _downloadCard() async {
    setState(() => _exporting = true);
    await _prewarmAvatar();

    final file = await CardRenderer.captureToPng(
      _repaintKey,
      pixelRatio: _format.pixelRatio,
    );
    setState(() => _exporting = false);

    if (file != null) {
      final success = await CardDownloadService.saveToGallery(file);
      await CardStorageService.cleanTempFiles();
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              success
                  ? '✓ Saved successfully to Gallery!'
                  : 'Failed to save to Gallery.',
            ),
            backgroundColor: success ? Colors.green : Colors.redAccent,
          ),
        );
      }
    } else {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Failed to generate card image.'),
            backgroundColor: Colors.redAccent,
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // ── Drag handle ─────────────────────────────────────────
              Container(
                width: 40,
                height: 4,
                margin: const EdgeInsets.only(bottom: 20),
                decoration: BoxDecoration(
                  color: Colors.white24,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
              Text(
                'Share Card',
                style: GoogleFonts.outfit(
                  color: Colors.white,
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                'Choose a format and share your profile',
                style: GoogleFonts.outfit(
                  color: Colors.white38,
                  fontSize: 13,
                ),
              ),
              const SizedBox(height: 18),

              // ── Format selector pills ───────────────────────────────
              _buildFormatSelector(),

              const SizedBox(height: 22),

              // ── Card preview (also the RepaintBoundary capture target) ──
              Center(
                child: Container(
                  width: 280,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(26),
                    border: Border.all(
                      color: Colors.white.withValues(alpha: 0.08),
                      width: 1,
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.40),
                        blurRadius: 32,
                        offset: const Offset(0, 14),
                      ),
                      BoxShadow(
                        color: const Color(0xFF6366F1).withValues(alpha: 0.12),
                        blurRadius: 40,
                        spreadRadius: 2,
                      ),
                    ],
                  ),
                  child: AspectRatio(
                    aspectRatio: _format.aspectRatio,
                    child: RepaintBoundary(
                      key: _repaintKey,
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(24),
                        child: _card,
                      ),
                    ),
                  ),
                ),
              ),

              const SizedBox(height: 28),

              // ── Action Buttons ───────────────────────────────────────
              if (_exporting)
                const Padding(
                  padding: EdgeInsets.symmetric(vertical: 8),
                  child: Center(
                    child:
                        CircularProgressIndicator(color: Color(0xFF6366F1)),
                  ),
                )
              else ...[
                _actionButton(
                  icon: Icons.share_rounded,
                  label: 'Share  ·  ${_format.label}',
                  onPressed: _shareCard,
                ),
                const SizedBox(height: 10),
                _actionButton(
                  icon: Icons.download_rounded,
                  label: 'Save to Gallery',
                  onPressed: _downloadCard,
                ),
                const SizedBox(height: 10),
                _actionButton(
                  icon: Icons.link_rounded,
                  label: 'Copy Profile Link',
                  onPressed: () {
                    Clipboard.setData(
                        ClipboardData(text: widget.profileUrl));
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                          content: Text('✓ Link copied to clipboard!')),
                    );
                    Navigator.pop(context);
                  },
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }

  // ── Format selector ──────────────────────────────────────────────────────

  Widget _buildFormatSelector() {
    return Container(
      padding: const EdgeInsets.all(3),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(14),
        color: Colors.white.withValues(alpha: 0.06),
        border: Border.all(
          color: Colors.white.withValues(alpha: 0.08),
          width: 0.8,
        ),
      ),
      child: Row(
        children: _ExportFormat.values.map((fmt) {
          final selected = fmt == _format;
          return Expanded(
            child: GestureDetector(
              onTap: () => setState(() => _format = fmt),
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 200),
                curve: Curves.easeInOut,
                padding: const EdgeInsets.symmetric(vertical: 10),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(11),
                  color: selected
                      ? const Color(0xFF6366F1).withValues(alpha: 0.20)
                      : Colors.transparent,
                  border: selected
                      ? Border.all(
                          color: const Color(0xFF6366F1).withValues(alpha: 0.40),
                          width: 1,
                        )
                      : null,
                ),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(
                      fmt.icon,
                      size: 18,
                      color: selected
                          ? const Color(0xFF818CF8)
                          : Colors.white38,
                    ),
                    const SizedBox(height: 4),
                    Text(
                      fmt.label,
                      style: GoogleFonts.outfit(
                        fontSize: 12,
                        fontWeight:
                            selected ? FontWeight.w700 : FontWeight.w500,
                        color: selected ? Colors.white : Colors.white38,
                      ),
                    ),
                    Text(
                      fmt.subtitle,
                      style: GoogleFonts.outfit(
                        fontSize: 9,
                        color: selected
                            ? Colors.white38
                            : Colors.white24,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          );
        }).toList(),
      ),
    );
  }

  // ── Action button ────────────────────────────────────────────────────────

  Widget _actionButton({
    required IconData icon,
    required String label,
    required VoidCallback onPressed,
  }) {
    return SizedBox(
      width: double.infinity,
      child: ElevatedButton.icon(
        style: ElevatedButton.styleFrom(
          backgroundColor: Colors.white.withValues(alpha: 0.05),
          foregroundColor: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
            side: const BorderSide(color: Colors.white10),
          ),
          padding: const EdgeInsets.symmetric(vertical: 14),
          elevation: 0,
        ),
        onPressed: onPressed,
        icon: Icon(icon, color: const Color(0xFF6366F1), size: 20),
        label: Text(
          label,
          style:
              GoogleFonts.outfit(fontWeight: FontWeight.w600, fontSize: 14),
        ),
      ),
    );
  }
}

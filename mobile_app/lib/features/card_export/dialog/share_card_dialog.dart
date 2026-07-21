import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../models/tag.dart';
import '../widgets/digital_card.dart';
import '../services/card_renderer.dart';
import '../services/card_share_service.dart';
import '../services/card_download_service.dart';
import '../services/card_storage_service.dart';

class ShareCardDialog extends StatefulWidget {
  final String name;
  final String tagline;
  final String? avatar;
  final String profileUrl;
  final String baseUrl;
  final bool isPremium;
  final bool isOnline;

  // Profile detail fields shown on the card
  final String? location;
  final String? bio;
  final List<Tag> tags;

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
        location: widget.location,
        bio: widget.bio,
        tags: widget.tags,
      );

  Future<void> _shareCard() async {
    setState(() => _exporting = true);

    // Pre-warm network avatar so it is in cache before capture.
    // Skip data: URIs — decoded instantly as MemoryImage, no fetch needed.
    final _raw = widget.avatar;
    if (_raw != null &&
        _raw.isNotEmpty &&
        _raw != '/profile_avatar.png' &&
        !_raw.startsWith('data:') &&
        mounted) {
      final url = _raw.startsWith('http')
          ? _raw
          : '${widget.baseUrl}$_raw';
      await CardRenderer.prewarmImage(url, context);
    }

    final file = await CardRenderer.captureToPng(_repaintKey, pixelRatio: 4.0);
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

    // Pre-warm network avatar so it is in cache before capture.
    // Skip data: URIs — decoded instantly as MemoryImage, no fetch needed.
    final _raw2 = widget.avatar;
    if (_raw2 != null &&
        _raw2.isNotEmpty &&
        _raw2 != '/profile_avatar.png' &&
        !_raw2.startsWith('data:') &&
        mounted) {
      final url = _raw2.startsWith('http')
          ? _raw2
          : '${widget.baseUrl}$_raw2';
      await CardRenderer.prewarmImage(url, context);
    }

    final file = await CardRenderer.captureToPng(_repaintKey, pixelRatio: 4.0);
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
                'Your Digital Card',
                style: GoogleFonts.outfit(
                  color: Colors.white,
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                'Share, save or copy your profile link',
                style: GoogleFonts.outfit(
                  color: Colors.white38,
                  fontSize: 13,
                ),
              ),
              const SizedBox(height: 22),

              // ── Card preview (also the RepaintBoundary capture target) ──
              Center(
                child: Container(
                  width: 280,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(26),
                    border: Border.all(
                      color: Colors.white.withOpacity(0.08),
                      width: 1,
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.40),
                        blurRadius: 32,
                        offset: const Offset(0, 14),
                      ),
                      BoxShadow(
                        color: const Color(0xFF6366F1).withOpacity(0.12),
                        blurRadius: 40,
                        spreadRadius: 2,
                      ),
                    ],
                  ),
                  child: AspectRatio(
                    aspectRatio: 9 / 16,
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
                  label: 'Share  ·  Instagram Story',
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

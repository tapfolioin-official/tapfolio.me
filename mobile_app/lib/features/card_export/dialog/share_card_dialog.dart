import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
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

  const ShareCardDialog({
    super.key,
    required this.name,
    required this.tagline,
    this.avatar,
    required this.profileUrl,
    required this.baseUrl,
    required this.isPremium,
  });

  static void show(
    BuildContext context, {
    required String name,
    required String tagline,
    String? avatar,
    required String profileUrl,
    required String baseUrl,
    required bool isPremium,
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
      ),
    );
  }

  @override
  State<ShareCardDialog> createState() => _ShareCardDialogState();
}

class _ShareCardDialogState extends State<ShareCardDialog> {
  final GlobalKey _repaintKey = GlobalKey();
  bool _exporting = false;

  Future<void> _shareCard() async {
    setState(() => _exporting = true);
    final file = await CardRenderer.captureToPng(_repaintKey, pixelRatio: 4.0);
    setState(() => _exporting = false);

    if (file != null) {
      await CardShareService.sharePng(file, text: 'Scan to connect with me on Tapfolio! ${widget.profileUrl}');
      await CardStorageService.cleanTempFiles();
    } else {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Failed to generate card image.'), backgroundColor: Colors.redAccent),
        );
      }
    }
  }

  Future<void> _downloadCard() async {
    setState(() => _exporting = true);
    final file = await CardRenderer.captureToPng(_repaintKey, pixelRatio: 4.0);
    setState(() => _exporting = false);

    if (file != null) {
      final success = await CardDownloadService.saveToGallery(file);
      await CardStorageService.cleanTempFiles();
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(success ? '✓ Saved successfully to Gallery!' : 'Failed to save to Gallery.'),
            backgroundColor: success ? Colors.green : Colors.redAccent,
          ),
        );
      }
    } else {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Failed to generate card image.'), backgroundColor: Colors.redAccent),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.fromLTRB(24, 24, 24, MediaQuery.of(context).padding.bottom + 24),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Drag handle indicator
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
            'Share Digital NFC Card',
            style: GoogleFonts.outfit(
              color: Colors.white,
              fontSize: 18,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 20),

          // WYSIWYG Digital Card Preview wrapped in RepaintBoundary
          Container(
            height: 280,
            padding: const EdgeInsets.all(4),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: Colors.white10),
            ),
            child: RepaintBoundary(
              key: _repaintKey,
              child: ClipRRect(
                borderRadius: BorderRadius.circular(16),
                child: DigitalCard(
                  name: widget.name,
                  tagline: widget.tagline,
                  avatar: widget.avatar,
                  profileUrl: widget.profileUrl,
                  baseUrl: widget.baseUrl,
                  removeBranding: widget.isPremium,
                ),
              ),
            ),
          ),
          const SizedBox(height: 24),

          // Action Buttons
          if (_exporting)
            const Center(child: CircularProgressIndicator(color: Color(0xFF6366F1)))
          else ...[
            _actionButton(
              icon: Icons.share_rounded,
              label: 'Share Image / Instagram Story',
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
                Clipboard.setData(ClipboardData(text: widget.profileUrl));
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('✓ Link copied to clipboard!')),
                );
                Navigator.pop(context);
              },
            ),
          ],
        ],
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
          style: GoogleFonts.outfit(fontWeight: FontWeight.w600, fontSize: 14),
        ),
      ),
    );
  }
}

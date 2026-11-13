import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:qr_flutter/qr_flutter.dart';
import '../models/profile_share_data.dart';
import '../services/card_renderer.dart';
import '../services/card_share_service.dart';
import '../services/card_storage_service.dart';

/// Polished native bottom sheet / modal providing high-resolution QR scanning,
/// canonical URL copying, and standalone QR sharing.
class ShareViaQrModal extends StatefulWidget {
  final ProfileShareData shareData;

  const ShareViaQrModal({
    super.key,
    required this.shareData,
  });

  /// Presents the QR sharing modal as a swipeable, polished bottom sheet.
  static Future<void> show(BuildContext context, ProfileShareData shareData) {
    return showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      barrierColor: Colors.black.withValues(alpha: 0.60),
      enableDrag: true,
      isDismissible: true,
      builder: (_) => ShareViaQrModal(shareData: shareData),
    );
  }

  @override
  State<ShareViaQrModal> createState() => _ShareViaQrModalState();
}

class _ShareViaQrModalState extends State<ShareViaQrModal> {
  final GlobalKey _qrCaptureKey = GlobalKey();
  bool _isSharing = false;

  static const _blue = Color(0xFF2563EB);
  static const _textPrimary = Color(0xFF111827);
  static const _textSecondary = Color(0xFF6B7280);
  static const _borderColor = Color(0xFFE5E7EB);
  static const _surfaceColor = Color(0xFFF9FAFB);

  Future<void> _shareQrCode() async {
    if (_isSharing) return;
    HapticFeedback.lightImpact();
    setState(() => _isSharing = true);

    try {
      final file = await CardRenderer.captureToPng(
        _qrCaptureKey,
        pixelRatio: 4.0,
      );

      if (file != null) {
        final origin = _getOrigin();
        await CardShareService.shareQr(
          file: file,
          profileUrl: widget.shareData.canonicalUrl,
          sharePositionOrigin: origin,
        );
        await CardStorageService.cleanTempFiles();
      } else {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Unable to prepare QR code for sharing.'),
              backgroundColor: Colors.redAccent,
            ),
          );
        }
      }
    } catch (e) {
      debugPrint('[ShareViaQrModal] Error sharing QR: $e');
    } finally {
      if (mounted) setState(() => _isSharing = false);
    }
  }

  Future<void> _copyLink() async {
    HapticFeedback.lightImpact();
    await Clipboard.setData(
        ClipboardData(text: widget.shareData.canonicalUrl));
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            '✓ Profile link copied: ${widget.shareData.canonicalUrl}',
            style: GoogleFonts.outfit(fontWeight: FontWeight.w500),
          ),
          duration: const Duration(seconds: 2),
          backgroundColor: const Color(0xFF10B981),
          behavior: SnackBarBehavior.floating,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(10),
          ),
        ),
      );
    }
  }

  Rect? _getOrigin() {
    try {
      final box = context.findRenderObject() as RenderBox?;
      if (box != null && box.hasSize) {
        return box.localToGlobal(Offset.zero) & box.size;
      }
    } catch (_) {}
    return null;
  }

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;
    final qrBoxSize = (screenWidth * 0.68).clamp(230.0, 280.0);
    final qrMatrixSize = qrBoxSize - 32;
    final canonicalUrl = widget.shareData.canonicalUrl;
    final isValid = ProfileShareData.isValidUrl(canonicalUrl);

    return Container(
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
        boxShadow: [
          BoxShadow(
            color: Colors.black26,
            blurRadius: 24,
            offset: Offset(0, -4),
          ),
        ],
      ),
      child: SafeArea(
        top: false,
        child: Padding(
          padding: const EdgeInsets.fromLTRB(20, 12, 20, 24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // ── Drag Handle ────────────────────────────────────────────────
              Center(
                child: Container(
                  width: 36,
                  height: 4,
                  decoration: BoxDecoration(
                    color: const Color(0xFFD1D5DB),
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),

              const SizedBox(height: 12),

              // ── Header Row: Title & Close '×' Button ───────────────────────
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  const SizedBox(width: 36), // Balanced spacing
                  Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        'Scan to Connect',
                        style: GoogleFonts.outfit(
                          fontSize: 19,
                          fontWeight: FontWeight.bold,
                          color: _textPrimary,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Container(
                        constraints: BoxConstraints(maxWidth: screenWidth - 120),
                        child: Text(
                          canonicalUrl,
                          textAlign: TextAlign.center,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: GoogleFonts.outfit(
                            fontSize: 12,
                            color: _textSecondary,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ),
                    ],
                  ),
                  Semantics(
                    label: 'Close',
                    button: true,
                    child: InkWell(
                      onTap: () {
                        HapticFeedback.lightImpact();
                        Navigator.of(context).pop();
                      },
                      borderRadius: BorderRadius.circular(18),
                      child: Container(
                        width: 36,
                        height: 36,
                        alignment: Alignment.center,
                        decoration: BoxDecoration(
                          color: _surfaceColor,
                          shape: BoxShape.circle,
                          border: Border.all(color: _borderColor, width: 1),
                        ),
                        child: const Icon(
                          Icons.close_rounded,
                          color: _textPrimary,
                          size: 18,
                        ),
                      ),
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 16),

              // ── Scannable High-Res QR Code Card (Capture Target) ───────────
              RepaintBoundary(
                key: _qrCaptureKey,
                child: Container(
                  width: qrBoxSize,
                  height: qrBoxSize,
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: _borderColor, width: 1.2),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.05),
                        blurRadius: 16,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: isValid
                      ? Stack(
                          alignment: Alignment.center,
                          children: [
                            QrImageView(
                              data: canonicalUrl,
                              version: QrVersions.auto,
                              errorCorrectionLevel: QrErrorCorrectLevel.H,
                              size: qrMatrixSize,
                              gapless: true,
                              backgroundColor: Colors.white,
                              padding: EdgeInsets.zero,
                              eyeStyle: const QrEyeStyle(
                                eyeShape: QrEyeShape.square,
                                color: Color(0xFF000000),
                              ),
                              dataModuleStyle: const QrDataModuleStyle(
                                dataModuleShape: QrDataModuleShape.square,
                                color: Color(0xFF000000),
                              ),
                            ),
                            // Tapfolio Center Logo Badge
                            Container(
                              width: 36,
                              height: 36,
                              decoration: BoxDecoration(
                                color: _blue,
                                borderRadius: BorderRadius.circular(9),
                                border: Border.all(
                                  color: Colors.white,
                                  width: 2.5,
                                ),
                                boxShadow: [
                                  BoxShadow(
                                    color: Colors.black.withValues(alpha: 0.15),
                                    blurRadius: 4,
                                    offset: const Offset(0, 1),
                                  ),
                                ],
                              ),
                              child: const Center(
                                child: Text(
                                  'T',
                                  style: TextStyle(
                                    color: Colors.white,
                                    fontWeight: FontWeight.w900,
                                    fontSize: 19,
                                    height: 1.0,
                                    fontFamily: 'sans-serif',
                                  ),
                                ),
                              ),
                            ),
                          ],
                        )
                      : Center(
                          child: Text(
                            'Unable to generate QR',
                            style: GoogleFonts.outfit(
                              color: Colors.redAccent,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                ),
              ),

              const SizedBox(height: 18),

              // ── Primary Actions: Copy Link & Share QR ───────────────────────
              Row(
                children: [
                  // Copy Link
                  Expanded(
                    child: OutlinedButton.icon(
                      onPressed: _copyLink,
                      style: OutlinedButton.styleFrom(
                        foregroundColor: _blue,
                        side: const BorderSide(color: _borderColor, width: 1.2),
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(14),
                        ),
                      ),
                      icon: const Icon(Icons.link_rounded, size: 18),
                      label: Text(
                        'Copy Link',
                        style: GoogleFonts.outfit(
                          fontWeight: FontWeight.w600,
                          fontSize: 13.5,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 10),

                  // Share QR
                  Expanded(
                    child: OutlinedButton.icon(
                      onPressed: _isSharing ? null : _shareQrCode,
                      style: OutlinedButton.styleFrom(
                        foregroundColor: _blue,
                        side: const BorderSide(color: _borderColor, width: 1.2),
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(14),
                        ),
                      ),
                      icon: _isSharing
                          ? const SizedBox(
                              width: 16,
                              height: 16,
                              child: CircularProgressIndicator(
                                strokeWidth: 2,
                                color: _blue,
                              ),
                            )
                          : const Icon(Icons.share_rounded, size: 17),
                      label: Text(
                        'Share QR',
                        style: GoogleFonts.outfit(
                          fontWeight: FontWeight.w600,
                          fontSize: 13.5,
                        ),
                      ),
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 10),

              // ── Close Button ────────────────────────────────────────────────
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () => Navigator.of(context).pop(),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: _blue,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(14),
                    ),
                    padding: const EdgeInsets.symmetric(vertical: 13),
                    elevation: 0,
                  ),
                  child: Text(
                    'Close',
                    style: GoogleFonts.outfit(
                      fontWeight: FontWeight.w600,
                      fontSize: 14,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:qr_flutter/qr_flutter.dart';

/// QR section with all sizes driven by [qrSize].
/// Shows "Scan to Connect" label only when [qrSize] >= 120 (enough vertical
/// room to display it without overflowing).
class QrSection extends StatelessWidget {
  final String url;

  /// The logical-pixel side length of the QR image itself.
  /// All padding, icon sizes, and font sizes scale from this value.
  final double qrSize;

  const QrSection({
    super.key,
    required this.url,
    this.qrSize = 130,
  });

  @override
  Widget build(BuildContext context) {
    final pad = (qrSize * 0.12).clamp(8.0, 50.0);   // card padding
    final iconSz = (qrSize * 0.20).clamp(14.0, 60.0); // NFC icon container
    final iconFs = (qrSize * 0.12).clamp( 8.0, 36.0); // NFC icon itself
    final labelFs= (qrSize * 0.13).clamp(10.0, 44.0); // "Scan to Connect"
    final showLabel = qrSize >= 120;
    final gapBelowQr = qrSize * 0.10;

    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        // ── QR Code white card ────────────────────────────────────
        Container(
          padding: EdgeInsets.all(pad),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(qrSize * 0.145),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.18),
                blurRadius: qrSize * 0.22,
                offset: Offset(0, qrSize * 0.07),
              ),
              BoxShadow(
                color: const Color(0xFF6366F1).withValues(alpha: 0.10),
                blurRadius: qrSize * 0.28,
                spreadRadius: qrSize * 0.03,
              ),
            ],
          ),
          child: Stack(
            alignment: Alignment.center,
            children: [
              QrImageView(
                data: url,
                version: QrVersions.auto,
                size: qrSize,
                gapless: false,
                eyeStyle: const QrEyeStyle(
                  eyeShape: QrEyeShape.square,
                  color: Colors.black,
                ),
                dataModuleStyle: const QrDataModuleStyle(
                  dataModuleShape: QrDataModuleShape.square,
                  color: Colors.black,
                ),
              ),
              // NFC centre logo
              Container(
                width: iconSz,
                height: iconSz,
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(iconSz * 0.28),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.08),
                      blurRadius: iconSz * 0.30,
                    ),
                  ],
                ),
                child: Icon(
                  Icons.nfc_rounded,
                  size: iconFs,
                  color: const Color(0xFF6366F1),
                ),
              ),
            ],
          ),
        ),

        // ── "Scan to Connect" label (only when there's room) ─────
        if (showLabel) ...[
          SizedBox(height: gapBelowQr),
          Text(
            'Scan to Connect',
            style: GoogleFonts.outfit(
              color: Colors.white,
              fontWeight: FontWeight.w700,
              fontSize: labelFs,
              letterSpacing: 0.1,
            ),
          ),
        ],
      ],
    );
  }
}

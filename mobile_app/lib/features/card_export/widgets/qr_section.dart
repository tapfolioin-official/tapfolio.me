import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:qr_flutter/qr_flutter.dart';
import '../models/card_theme.dart';

/// Premium glassmorphic QR section — theme-aware.
///
/// All sizes scale from [qrSize] for proportional rendering.
class QrSection extends StatelessWidget {
  final String url;
  final double qrSize;
  final CardExportThemeData theme;

  const QrSection({
    super.key,
    required this.url,
    this.qrSize = 130,
    required this.theme,
  });

  @override
  Widget build(BuildContext context) {
    final t = theme;
    final outerPad = (qrSize * 0.14).clamp(10.0, 56.0);
    final innerPad = (qrSize * 0.10).clamp(8.0, 42.0);
    final borderW  = (qrSize * 0.012).clamp(1.0, 3.5);
    final outerR   = (qrSize * 0.20).clamp(14.0, 48.0);
    final innerR   = (qrSize * 0.14).clamp(10.0, 36.0);
    final iconSz   = (qrSize * 0.22).clamp(16.0, 64.0);
    final iconFs   = (qrSize * 0.13).clamp(10.0, 40.0);
    final iconR    = (iconSz * 0.28).clamp(5.0, 18.0);
    final labelFs  = (qrSize * 0.105).clamp(9.0, 36.0);
    final nfcFs    = (qrSize * 0.085).clamp(7.0, 28.0);
    final showLabel = qrSize >= 100;
    final gapBelowQr = qrSize * 0.08;

    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        // ── Glassmorphic QR card with gradient border ─────────────
        Container(
          padding: EdgeInsets.all(borderW),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(outerR),
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: t.qrBorderGradient,
            ),
            boxShadow: [
              BoxShadow(
                color: t.qrGlowColor.withValues(alpha: 0.20),
                blurRadius: qrSize * 0.35,
                spreadRadius: qrSize * 0.02,
              ),
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.30),
                blurRadius: qrSize * 0.25,
                offset: Offset(0, qrSize * 0.06),
              ),
            ],
          ),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(outerR - borderW),
            child: BackdropFilter(
              filter: ImageFilter.blur(sigmaX: 20, sigmaY: 20),
              child: Container(
                padding: EdgeInsets.all(innerPad),
                decoration: BoxDecoration(
                  color: t.qrBackground.withValues(alpha: 0.92),
                  borderRadius: BorderRadius.circular(innerR),
                ),
                child: Stack(
                  alignment: Alignment.center,
                  children: [
                    QrImageView(
                      data: url,
                      version: QrVersions.auto,
                      size: qrSize,
                      gapless: false,
                      eyeStyle: QrEyeStyle(
                        eyeShape: QrEyeShape.square,
                        color: t.qrDotColor,
                      ),
                      dataModuleStyle: QrDataModuleStyle(
                        dataModuleShape: QrDataModuleShape.circle,
                        color: t.qrDotColor,
                      ),
                    ),
                    Container(
                      width: iconSz,
                      height: iconSz,
                      decoration: BoxDecoration(
                        color: t.qrBackground,
                        borderRadius: BorderRadius.circular(iconR),
                        boxShadow: [
                          BoxShadow(
                            color: t.qrGlowColor.withValues(alpha: 0.25),
                            blurRadius: iconSz * 0.40,
                            spreadRadius: iconSz * 0.04,
                          ),
                          BoxShadow(
                            color: Colors.black.withValues(alpha: 0.08),
                            blurRadius: iconSz * 0.30,
                          ),
                        ],
                      ),
                      child: Icon(
                        Icons.nfc_rounded,
                        size: iconFs,
                        color: t.qrIconColor,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),

        // ── "Tap or Scan" label ──────────────────────────────────
        if (showLabel) ...[
          SizedBox(height: gapBelowQr),
          Row(
            mainAxisSize: MainAxisSize.min,
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                Icons.contactless_rounded,
                size: nfcFs * 1.2,
                color: t.textSecondary,
              ),
              SizedBox(width: nfcFs * 0.4),
              Text(
                'Tap or Scan',
                style: GoogleFonts.outfit(
                  color: t.textSecondary,
                  fontWeight: FontWeight.w600,
                  fontSize: labelFs,
                  letterSpacing: 0.3,
                ),
              ),
            ],
          ),
        ],
      ],
    );
  }
}

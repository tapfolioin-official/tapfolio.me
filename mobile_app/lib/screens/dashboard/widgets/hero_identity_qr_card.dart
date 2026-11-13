import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:qr_flutter/qr_flutter.dart';
import '../../../core/utils/image_helper.dart';

class HeroIdentityQrCard extends StatelessWidget {
  final String name;
  final String? avatar;
  final String baseUrl;
  final String publicUrl;
  final bool isOnline;
  final VoidCallback onProfileTap;
  final VoidCallback onQrTap;

  const HeroIdentityQrCard({
    super.key,
    required this.name,
    this.avatar,
    required this.baseUrl,
    required this.publicUrl,
    this.isOnline = true,
    required this.onProfileTap,
    required this.onQrTap,
  });

  @override
  Widget build(BuildContext context) {
    final isLight = Theme.of(context).brightness == Brightness.light;
    final textColor = isLight ? const Color(0xFF0F172A) : Colors.white;
    final subColor =
        isLight ? const Color(0xFF64748B) : Colors.white.withValues(alpha: 0.65);
    final cardBg = isLight ? Colors.white : const Color(0xFF13131F);
    final borderColor = isLight
        ? const Color(0xFFE2E8F0)
        : Colors.white.withValues(alpha: 0.08);

    final avatarProvider = getAvatarImage(avatar, baseUrl);

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 6),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          // ── Left: Avatar & Identity ───────────────────────────────────────
          Expanded(
            child: Row(
              children: [
                // Avatar with outer ring & online badge
                GestureDetector(
                  onTap: () {
                    HapticFeedback.lightImpact();
                    onProfileTap();
                  },
                  child: Stack(
                    clipBehavior: Clip.none,
                    children: [
                      Container(
                        padding: const EdgeInsets.all(3.0),
                        decoration: const BoxDecoration(
                          shape: BoxShape.circle,
                          gradient: LinearGradient(
                            begin: Alignment.topLeft,
                            end: Alignment.bottomRight,
                            colors: [
                              Color(0xFF38BDF8),
                              Color(0xFF0052FF),
                              Color(0xFF6366F1),
                            ],
                          ),
                        ),
                        child: CircleAvatar(
                          radius: 34,
                          backgroundColor: const Color(0xFF1E293B),
                          backgroundImage: avatarProvider,
                        ),
                      ),
                      if (isOnline)
                        Positioned(
                          right: 2,
                          bottom: 2,
                          child: Container(
                            width: 14,
                            height: 14,
                            decoration: BoxDecoration(
                              color: const Color(0xFF10B981),
                              shape: BoxShape.circle,
                              border: Border.all(
                                color: isLight
                                    ? Colors.white
                                    : const Color(0xFF0A0A0F),
                                width: 2.2,
                              ),
                            ),
                          ),
                        ),
                    ],
                  ),
                ),

                const SizedBox(width: 14),

                // Greeting & Name
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Row(
                        children: [
                          Text(
                            "Hey, I'm ",
                            style: GoogleFonts.outfit(
                              color: subColor,
                              fontSize: 13,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                          const Text('👋', style: TextStyle(fontSize: 13)),
                        ],
                      ),
                      const SizedBox(height: 2),
                      Text(
                        name,
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                        style: GoogleFonts.outfit(
                          color: textColor,
                          fontSize: 18,
                          fontWeight: FontWeight.w800,
                          height: 1.2,
                          letterSpacing: -0.3,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Text(
                            "Let's connect!",
                            style: GoogleFonts.outfit(
                              color: const Color(0xFF0052FF),
                              fontSize: 13,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(width: 12),

          // ── Right: Mini Interactive QR Container ──────────────────────────
          Semantics(
            label: 'Tap to scan or share QR code',
            button: true,
            child: GestureDetector(
              onTap: () {
                HapticFeedback.lightImpact();
                onQrTap();
              },
              child: Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: cardBg,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: borderColor, width: 1),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black
                          .withValues(alpha: isLight ? 0.05 : 0.25),
                      blurRadius: 16,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Stack(
                      alignment: Alignment.center,
                      children: [
                        QrImageView(
                          data: publicUrl.isNotEmpty
                              ? publicUrl
                              : 'https://tapfolio.me',
                          version: QrVersions.auto,
                          errorCorrectionLevel: QrErrorCorrectLevel.H,
                          size: 78,
                          gapless: true,
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
                        // Center 'T' Logo Cutout
                        Container(
                          width: 16,
                          height: 16,
                          decoration: BoxDecoration(
                            color: const Color(0xFF0052FF),
                            borderRadius: BorderRadius.circular(4),
                          ),
                          alignment: Alignment.center,
                          child: Text(
                            'T',
                            style: GoogleFonts.outfit(
                              color: Colors.white,
                              fontSize: 10,
                              fontWeight: FontWeight.w900,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 6),
                    Text(
                      'Tap or scan to connect',
                      style: GoogleFonts.outfit(
                        color: const Color(0xFF0052FF),
                        fontSize: 9.5,
                        fontWeight: FontWeight.w600,
                        letterSpacing: 0.1,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

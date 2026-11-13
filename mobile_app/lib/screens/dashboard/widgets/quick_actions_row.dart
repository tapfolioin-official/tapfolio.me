import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';

class QuickActionsRow extends StatelessWidget {
  final VoidCallback onAddContactTap;
  final VoidCallback onQrCodeTap;
  final VoidCallback onMyLinksTap;

  const QuickActionsRow({
    super.key,
    required this.onAddContactTap,
    required this.onQrCodeTap,
    required this.onMyLinksTap,
  });

  @override
  Widget build(BuildContext context) {
    final isLight = Theme.of(context).brightness == Brightness.light;
    final cardBg = isLight ? Colors.white : const Color(0xFF13131F);
    final borderColor = isLight
        ? const Color(0xFFE2E8F0)
        : Colors.white.withValues(alpha: 0.08);
    final titleColor = isLight ? const Color(0xFF0F172A) : Colors.white;
    final subColor =
        isLight ? const Color(0xFF64748B) : Colors.white.withValues(alpha: 0.50);

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: cardBg,
          borderRadius: BorderRadius.circular(22),
          border: Border.all(color: borderColor, width: 1),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: isLight ? 0.03 : 0.20),
              blurRadius: 16,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Quick Actions',
              style: GoogleFonts.outfit(
                color: titleColor,
                fontSize: 16,
                fontWeight: FontWeight.bold,
                letterSpacing: -0.2,
              ),
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: _buildTile(
                    title: 'Add to Contact',
                    subtitle: 'Save my card',
                    icon: Icons.contact_page_outlined,
                    isLight: isLight,
                    titleColor: titleColor,
                    subColor: subColor,
                    onTap: onAddContactTap,
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: _buildTile(
                    title: 'QR Code',
                    subtitle: 'Scan & connect',
                    icon: Icons.qr_code_2_rounded,
                    isLight: isLight,
                    titleColor: titleColor,
                    subColor: subColor,
                    onTap: onQrCodeTap,
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: _buildTile(
                    title: 'My Links',
                    subtitle: 'All my links',
                    icon: Icons.link_rounded,
                    isLight: isLight,
                    titleColor: titleColor,
                    subColor: subColor,
                    onTap: onMyLinksTap,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTile({
    required String title,
    required String subtitle,
    required IconData icon,
    required bool isLight,
    required Color titleColor,
    required Color subColor,
    required VoidCallback onTap,
  }) {
    return Semantics(
      label: '$title: $subtitle',
      button: true,
      child: InkWell(
        onTap: () {
          HapticFeedback.lightImpact();
          onTap();
        },
        borderRadius: BorderRadius.circular(14),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 8),
          decoration: BoxDecoration(
            color: isLight
                ? const Color(0xFFF8FAFC)
                : Colors.white.withValues(alpha: 0.04),
            borderRadius: BorderRadius.circular(14),
            border: Border.all(
              color: isLight
                  ? const Color(0xFFE2E8F0)
                  : Colors.white.withValues(alpha: 0.05),
            ),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(
                icon,
                color: const Color(0xFF0052FF),
                size: 22,
              ),
              const SizedBox(height: 8),
              Text(
                title,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: GoogleFonts.outfit(
                  color: titleColor,
                  fontSize: 11.5,
                  fontWeight: FontWeight.w700,
                ),
              ),
              const SizedBox(height: 2),
              Text(
                subtitle,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: GoogleFonts.outfit(
                  color: subColor,
                  fontSize: 9.5,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

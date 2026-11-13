import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';

class PrimaryActionGrid extends StatelessWidget {
  final VoidCallback onShareTap;
  final VoidCallback onAnalyticsTap;
  final VoidCallback onPreviewTap;
  final VoidCallback onManageCardsTap;

  const PrimaryActionGrid({
    super.key,
    required this.onShareTap,
    required this.onAnalyticsTap,
    required this.onPreviewTap,
    required this.onManageCardsTap,
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

    final actions = [
      _ActionItem(
        title: 'Share',
        subtitle: 'Share your card',
        icon: Icons.send_rounded,
        onTap: onShareTap,
      ),
      _ActionItem(
        title: 'Analytics',
        subtitle: 'View insights',
        icon: Icons.bar_chart_rounded,
        onTap: onAnalyticsTap,
      ),
      _ActionItem(
        title: 'Preview',
        subtitle: 'See your card',
        icon: Icons.visibility_rounded,
        onTap: onPreviewTap,
      ),
      _ActionItem(
        title: 'Cards',
        subtitle: 'Edit & manage',
        icon: Icons.credit_card_rounded,
        onTap: onManageCardsTap,
      ),
    ];

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
      child: Row(
        children: [
          for (int i = 0; i < actions.length; i++) ...[
            if (i > 0) const SizedBox(width: 10),
            Expanded(
              child: _buildActionTile(
                action: actions[i],
                cardBg: cardBg,
                borderColor: borderColor,
                titleColor: titleColor,
                subColor: subColor,
                isLight: isLight,
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildActionTile({
    required _ActionItem action,
    required Color cardBg,
    required Color borderColor,
    required Color titleColor,
    required Color subColor,
    required bool isLight,
  }) {
    return Semantics(
      label: '${action.title}: ${action.subtitle}',
      button: true,
      child: InkWell(
        onTap: () {
          HapticFeedback.lightImpact();
          action.onTap();
        },
        borderRadius: BorderRadius.circular(16),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 6),
          decoration: BoxDecoration(
            color: cardBg,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: borderColor, width: 1),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: isLight ? 0.03 : 0.20),
                blurRadius: 12,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Vibrant Blue Icon
              Icon(
                action.icon,
                color: const Color(0xFF0052FF),
                size: 24,
              ),
              const SizedBox(height: 8),
              Text(
                action.title,
                textAlign: TextAlign.center,
                style: GoogleFonts.outfit(
                  color: titleColor,
                  fontSize: 12.5,
                  fontWeight: FontWeight.w700,
                  letterSpacing: -0.2,
                ),
              ),
              const SizedBox(height: 2),
              Text(
                action.subtitle,
                textAlign: TextAlign.center,
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

class _ActionItem {
  final String title;
  final String subtitle;
  final IconData icon;
  final VoidCallback onTap;

  const _ActionItem({
    required this.title,
    required this.subtitle,
    required this.icon,
    required this.onTap,
  });
}

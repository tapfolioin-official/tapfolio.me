import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

/// A premium, floating Apple-inspired Liquid Glass bottom navigation bar.
///
/// Features:
/// - Native [BackdropFilter] real-time blur behind the navigation surface
/// - Translucent glass background with dynamic light/dark theming
/// - Subtle borders, soft multi-layer drop shadows, and rounded capsule geometry
/// - 5 standard destinations: Home, Connections, Create (+), Leaderboard, Profile
/// - Smooth active selection capsule animations (150-250ms)
/// - Elevated center "+" action button with interactive press spring scale
/// - Badge support with count for pending connection requests
/// - Full accessibility semantics and >=44x44 touch targets
class LiquidGlassNavigation extends StatelessWidget {
  /// The index of the currently active navigation item (0..4).
  final int currentIndex;

  /// Callback when a navigation item is tapped.
  final ValueChanged<int> onItemSelected;

  /// Optional pending request badge count for the Connections tab (index 1).
  final int pendingCount;

  /// Optional custom callback specifically for the center "+" button.
  /// If null, [onItemSelected] will be called with index 2.
  final VoidCallback? onAddPressed;

  const LiquidGlassNavigation({
    super.key,
    required this.currentIndex,
    required this.onItemSelected,
    this.pendingCount = 0,
    this.onAddPressed,
  });

  // Tapfolio Primary Brand Blue
  static const Color _primaryBlue = Color(0xFF0052FF);

  @override
  Widget build(BuildContext context) {
    final isLight = Theme.of(context).brightness == Brightness.light;
    final bottomPadding = MediaQuery.paddingOf(context).bottom;

    // Glass styling tokens
    final glassBorderColor = isLight
        ? Colors.white.withValues(alpha: 0.85)
        : Colors.white.withValues(alpha: 0.14);

    final glassGradientColors = isLight
        ? [
            Colors.white.withValues(alpha: 0.88),
            Colors.white.withValues(alpha: 0.74),
          ]
        : [
            const Color(0xFF1B1E2E).withValues(alpha: 0.86),
            const Color(0xFF0F111E).withValues(alpha: 0.78),
          ];

    final shadows = isLight
        ? [
            BoxShadow(
              color: const Color(0xFF0F172A).withValues(alpha: 0.08),
              blurRadius: 24,
              spreadRadius: 0,
              offset: const Offset(0, 8),
            ),
            BoxShadow(
              color: _primaryBlue.withValues(alpha: 0.04),
              blurRadius: 16,
              spreadRadius: -2,
              offset: const Offset(0, 2),
            ),
          ]
        : [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.45),
              blurRadius: 28,
              spreadRadius: 0,
              offset: const Offset(0, 10),
            ),
            BoxShadow(
              color: _primaryBlue.withValues(alpha: 0.12),
              blurRadius: 20,
              spreadRadius: -4,
              offset: const Offset(0, 4),
            ),
          ];

    return SafeArea(
      top: false,
      minimum: EdgeInsets.only(
        left: 16,
        right: 16,
        bottom: bottomPadding > 0 ? bottomPadding : 12,
      ),
      child: Container(
        height: 72,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(34),
          boxShadow: shadows,
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(34),
          child: BackdropFilter(
            filter: ImageFilter.blur(sigmaX: 24, sigmaY: 24),
            child: DecoratedBox(
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(34),
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: glassGradientColors,
                ),
                border: Border.all(
                  color: glassBorderColor,
                  width: 1.2,
                ),
              ),
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    // 1. Home
                    Expanded(
                      child: _NavItem(
                        index: 0,
                        currentIndex: currentIndex,
                        label: 'Home',
                        outlinedIcon: Icons.home_outlined,
                        activeIcon: Icons.home_rounded,
                        onTap: () => onItemSelected(0),
                        isLight: isLight,
                      ),
                    ),

                    // 2. Connections
                    Expanded(
                      child: _NavItem(
                        index: 1,
                        currentIndex: currentIndex,
                        label: 'Connections',
                        outlinedIcon: Icons.people_outline_rounded,
                        activeIcon: Icons.people_rounded,
                        badgeCount: pendingCount,
                        onTap: () => onItemSelected(1),
                        isLight: isLight,
                      ),
                    ),

                    // 3. Center Create (+) Button
                    _CenterCreateButton(
                      isSelected: currentIndex == 2,
                      onTap: onAddPressed ?? () => onItemSelected(2),
                    ),

                    // 4. Leaderboard
                    Expanded(
                      child: _NavItem(
                        index: 3,
                        currentIndex: currentIndex,
                        label: 'Leaderboard',
                        outlinedIcon: Icons.emoji_events_outlined,
                        activeIcon: Icons.emoji_events_rounded,
                        onTap: () => onItemSelected(3),
                        isLight: isLight,
                      ),
                    ),

                    // 5. Profile
                    Expanded(
                      child: _NavItem(
                        index: 4,
                        currentIndex: currentIndex,
                        label: 'Profile',
                        outlinedIcon: Icons.person_outline_rounded,
                        activeIcon: Icons.person_rounded,
                        onTap: () => onItemSelected(4),
                        isLight: isLight,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

/// Individual animated navigation tab item with Liquid Glass selection capsule.
class _NavItem extends StatelessWidget {
  final int index;
  final int currentIndex;
  final String label;
  final IconData outlinedIcon;
  final IconData activeIcon;
  final int badgeCount;
  final VoidCallback onTap;
  final bool isLight;

  const _NavItem({
    required this.index,
    required this.currentIndex,
    required this.label,
    required this.outlinedIcon,
    required this.activeIcon,
    this.badgeCount = 0,
    required this.onTap,
    required this.isLight,
  });

  bool get _isActive => currentIndex == index;

  @override
  Widget build(BuildContext context) {
    const activeColor = Color(0xFF0052FF);
    final inactiveColor = isLight ? const Color(0xFF64748B) : const Color(0xFF94A3B8);

    final capsuleBg = _isActive
        ? (isLight
            ? activeColor.withValues(alpha: 0.10)
            : activeColor.withValues(alpha: 0.20))
        : Colors.transparent;

    final capsuleBorder = _isActive
        ? Border.all(
            color: activeColor.withValues(alpha: isLight ? 0.18 : 0.32),
            width: 1.0,
          )
        : Border.all(color: Colors.transparent, width: 1.0);

    return Semantics(
      label: label,
      selected: _isActive,
      button: true,
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(18),
          splashColor: activeColor.withValues(alpha: 0.1),
          highlightColor: Colors.transparent,
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 220),
            curve: Curves.easeOutCubic,
            padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 4),
            decoration: BoxDecoration(
              color: capsuleBg,
              borderRadius: BorderRadius.circular(18),
              border: capsuleBorder,
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // Icon with optional badge
                Stack(
                  clipBehavior: Clip.none,
                  alignment: Alignment.center,
                  children: [
                    AnimatedScale(
                      scale: _isActive ? 1.08 : 1.0,
                      duration: const Duration(milliseconds: 220),
                      curve: Curves.easeOutCubic,
                      child: Icon(
                        _isActive ? activeIcon : outlinedIcon,
                        size: 22,
                        color: _isActive ? activeColor : inactiveColor,
                      ),
                    ),
                    if (badgeCount > 0)
                      Positioned(
                        top: -4,
                        right: -10,
                        child: _NavBadge(count: badgeCount, isLight: isLight),
                      ),
                  ],
                ),
                const SizedBox(height: 3),
                // Label
                AnimatedDefaultTextStyle(
                  duration: const Duration(milliseconds: 220),
                  curve: Curves.easeOutCubic,
                  style: GoogleFonts.outfit(
                    fontSize: 10.5,
                    fontWeight: _isActive ? FontWeight.w600 : FontWeight.w500,
                    color: _isActive ? activeColor : inactiveColor,
                    height: 1.1,
                  ),
                  child: Text(
                    label,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

/// Center elevated Circular Action "+" button with spring-scale press physics.
class _CenterCreateButton extends StatefulWidget {
  final bool isSelected;
  final VoidCallback onTap;

  const _CenterCreateButton({
    required this.isSelected,
    required this.onTap,
  });

  @override
  State<_CenterCreateButton> createState() => _CenterCreateButtonState();
}

class _CenterCreateButtonState extends State<_CenterCreateButton>
    with SingleTickerProviderStateMixin {
  late AnimationController _pressController;
  late Animation<double> _scaleAnimation;

  @override
  void initState() {
    super.initState();
    _pressController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 100),
      reverseDuration: const Duration(milliseconds: 160),
    );
    _scaleAnimation = Tween<double>(begin: 1.0, end: 0.92).animate(
      CurvedAnimation(
        parent: _pressController,
        curve: Curves.easeInOut,
        reverseCurve: Curves.elasticOut,
      ),
    );
  }

  @override
  void dispose() {
    _pressController.dispose();
    super.dispose();
  }

  void _onTapDown(TapDownDetails details) {
    _pressController.forward();
  }

  void _onTapUp(TapUpDetails details) {
    _pressController.reverse();
    widget.onTap();
  }

  void _onTapCancel() {
    _pressController.reverse();
  }

  @override
  Widget build(BuildContext context) {
    const primaryBlue = Color(0xFF0052FF);
    const lighterBlue = Color(0xFF2563EB);

    return Semantics(
      label: 'Create',
      button: true,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 4),
        child: GestureDetector(
          onTapDown: _onTapDown,
          onTapUp: _onTapUp,
          onTapCancel: _onTapCancel,
          behavior: HitTestBehavior.opaque,
          child: AnimatedBuilder(
            animation: _scaleAnimation,
            builder: (context, child) => Transform.scale(
              scale: _scaleAnimation.value,
              child: child,
            ),
            child: Container(
              width: 50,
              height: 50,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: const LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [lighterBlue, primaryBlue],
                ),
                boxShadow: [
                  BoxShadow(
                    color: primaryBlue.withValues(alpha: 0.38),
                    blurRadius: 12,
                    spreadRadius: 0,
                    offset: const Offset(0, 4),
                  ),
                  if (widget.isSelected)
                    BoxShadow(
                      color: primaryBlue.withValues(alpha: 0.6),
                      blurRadius: 18,
                      spreadRadius: 1,
                      offset: const Offset(0, 2),
                    ),
                ],
                border: Border.all(
                  color: Colors.white.withValues(alpha: 0.35),
                  width: 1.5,
                ),
              ),
              alignment: Alignment.center,
              child: const Icon(
                Icons.add_rounded,
                color: Colors.white,
                size: 26,
              ),
            ),
          ),
        ),
      ),
    );
  }
}

/// Animated notification badge for items like Connections.
class _NavBadge extends StatelessWidget {
  final int count;
  final bool isLight;

  const _NavBadge({
    required this.count,
    required this.isLight,
  });

  @override
  Widget build(BuildContext context) {
    final text = count > 99 ? '99+' : '$count';

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 1.5),
      constraints: const BoxConstraints(minWidth: 16, minHeight: 16),
      decoration: BoxDecoration(
        color: const Color(0xFFEF4444),
        borderRadius: BorderRadius.circular(10),
        border: Border.all(
          color: isLight ? Colors.white : const Color(0xFF1B1E2E),
          width: 1.5,
        ),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFFEF4444).withValues(alpha: 0.4),
            blurRadius: 4,
            offset: const Offset(0, 1),
          ),
        ],
      ),
      child: Text(
        text,
        style: GoogleFonts.outfit(
          color: Colors.white,
          fontSize: 9,
          fontWeight: FontWeight.bold,
          height: 1.1,
        ),
        textAlign: TextAlign.center,
      ),
    );
  }
}

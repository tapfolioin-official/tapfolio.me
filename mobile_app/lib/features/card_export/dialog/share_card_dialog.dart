import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../../models/tag.dart';
import '../../../models/social_link.dart';
import '../models/card_theme.dart';
import '../models/profile_share_data.dart';
import '../widgets/digital_card.dart';
import '../widgets/share_via_qr_modal.dart';
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
      case _ExportFormat.story:
        return 'Story';
      case _ExportFormat.post:
        return 'Post';
      case _ExportFormat.businessCard:
        return 'Card';
    }
  }

  String get subtitle {
    switch (this) {
      case _ExportFormat.story:
        return '9:16';
      case _ExportFormat.post:
        return '4:5';
      case _ExportFormat.businessCard:
        return '3.37:2.125';
    }
  }

  IconData get icon {
    switch (this) {
      case _ExportFormat.story:
        return Icons.auto_awesome_rounded;
      case _ExportFormat.post:
        return Icons.grid_view_rounded;
      case _ExportFormat.businessCard:
        return Icons.credit_card_rounded;
    }
  }

  double get aspectRatio {
    switch (this) {
      case _ExportFormat.story:
        return 9 / 16;
      case _ExportFormat.post:
        return 4 / 5;
      case _ExportFormat.businessCard:
        return 1012 / 638; // standard landscape card ratio
    }
  }

  double previewWidth(double screenWidth, double screenHeight) {
    final availableHeight = (screenHeight * 0.46).clamp(240.0, 480.0);
    switch (this) {
      case _ExportFormat.story:
        return (availableHeight * (9 / 16)).clamp(180.0, 260.0);
      case _ExportFormat.post:
        return (availableHeight * (4 / 5)).clamp(220.0, 290.0);
      case _ExportFormat.businessCard:
        return (screenWidth * 0.82).clamp(280.0, 340.0);
    }
  }

  double get pixelRatio {
    switch (this) {
      case _ExportFormat.story:
        return 4.0;
      case _ExportFormat.post:
        return 3.86;
      case _ExportFormat.businessCard:
        return 3.16;
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
    Navigator.of(context).push(
      PageRouteBuilder(
        opaque: false,
        barrierDismissible: true,
        barrierColor: Colors.black.withValues(alpha: 0.80),
        pageBuilder: (context, animation, secondaryAnimation) => ShareCardDialog(
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
        transitionsBuilder: (context, animation, secondaryAnimation, child) {
          const begin = Offset(0.0, 1.0);
          const end = Offset.zero;
          const curve = Curves.easeOutCubic;
          final tween =
              Tween(begin: begin, end: end).chain(CurveTween(curve: curve));
          return SlideTransition(
            position: animation.drive(tween),
            child: child,
          );
        },
      ),
    );
  }

  @override
  State<ShareCardDialog> createState() => _ShareCardDialogState();
}

class _ShareCardDialogState extends State<ShareCardDialog>
    with SingleTickerProviderStateMixin {
  /// Key for the visible preview (used as the capture target).
  final GlobalKey _repaintKey = GlobalKey();
  final ScrollController _scrollController = ScrollController();

  late AnimationController _animController;
  late Animation<double> _dragAnimation;
  double _dragOffsetY = 0.0;
  bool _isDismissing = false;
  bool _exporting = false;

  /// Currently selected export format.
  _ExportFormat _format = _ExportFormat.story;

  // ── Design tokens ──────────────────────────────────────────────────────────
  static const _blue = Color(0xFF2563EB);
  static const _blueLight = Color(0xFF3B82F6);
  static const _blueDark = Color(0xFF1D4ED8);
  static const _bgColor = Color(0xFFF8F9FC);
  static const _surfaceColor = Colors.white;
  static const _textPrimary = Color(0xFF111827);
  static const _textSecondary = Color(0xFF6B7280);
  static const _borderColor = Color(0xFFE5E7EB);

  late ProfileShareData _shareData;

  @override
  void initState() {
    super.initState();
    _initShareData();

    _animController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 240),
    )..addListener(() {
        setState(() {
          _dragOffsetY = _dragAnimation.value;
        });
      });

    // Pre-warm the avatar so it's in cache before export capture.
    final raw = widget.avatar;
    if (raw != null &&
        raw.isNotEmpty &&
        raw != '/profile_avatar.png' &&
        !raw.startsWith('data:')) {
      WidgetsBinding.instance.addPostFrameCallback((_) async {
        if (!mounted) return;
        final url = raw.startsWith('http') ? raw : '${widget.baseUrl}$raw';
        await CardRenderer.prewarmImage(url, context);
        if (mounted) setState(() {});
      });
    }
  }

  @override
  void didUpdateWidget(covariant ShareCardDialog oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.profileUrl != widget.profileUrl ||
        oldWidget.name != widget.name ||
        oldWidget.avatar != widget.avatar) {
      _initShareData();
    }
  }

  void _initShareData() {
    _shareData = ProfileShareData(
      name: widget.name,
      tagline: widget.tagline,
      avatar: widget.avatar,
      profileUrl: widget.profileUrl,
      baseUrl: widget.baseUrl,
      isPremium: widget.isPremium,
      isOnline: widget.isOnline,
      location: widget.location,
      bio: widget.bio,
      tags: widget.tags,
      socials: widget.socials,
    );
  }

  @override
  void dispose() {
    _animController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  DigitalCard get _card => DigitalCard(
        name: _shareData.name,
        tagline: _shareData.tagline,
        avatar: _shareData.avatar,
        profileUrl: _shareData.canonicalUrl,
        baseUrl: _shareData.baseUrl,
        removeBranding: _shareData.isPremium,
        isPremium: _shareData.isPremium,
        isOnline: _shareData.isOnline,
        theme: CardThemeType.light,
        aspectRatio: _format.aspectRatio,
        socials: _shareData.socials,
        location: _shareData.location,
        bio: _shareData.bio,
        tags: _shareData.tags,
      );

  Future<void> _prewarmAvatar() async {
    final raw = _shareData.avatar;
    if (raw != null &&
        raw.isNotEmpty &&
        raw != '/profile_avatar.png' &&
        !raw.startsWith('data:') &&
        mounted) {
      final url = raw.startsWith('http') ? raw : '${_shareData.baseUrl}$raw';
      await CardRenderer.prewarmImage(url, context);
    }
  }

  Rect? _getShareOrigin() {
    try {
      final box = context.findRenderObject() as RenderBox?;
      if (box != null && box.hasSize) {
        return box.localToGlobal(Offset.zero) & box.size;
      }
    } catch (_) {}
    return null;
  }

  /// Centralized export and share action triggered by the Share Instantly buttons.
  Future<void> _shareCard() async {
    if (_exporting) return; // Prevent duplicate rapid taps
    HapticFeedback.lightImpact();
    setState(() => _exporting = true);

    try {
      await _prewarmAvatar();

      final file = await CardRenderer.captureToPng(
        _repaintKey,
        pixelRatio: _format.pixelRatio,
      );

      if (file != null) {
        final origin = _getShareOrigin();
        final success = await CardShareService.shareCard(
          file: file,
          profileUrl: _shareData.canonicalUrl,
          formatLabel: _format.label,
          sharePositionOrigin: origin,
        );
        await CardStorageService.cleanTempFiles();

        if (!success && mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Unable to open sharing options. Please try again.'),
              backgroundColor: Colors.redAccent,
            ),
          );
        }
      } else {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Unable to prepare your card. Please try again.'),
              backgroundColor: Colors.redAccent,
            ),
          );
        }
      }
    } catch (e) {
      debugPrint('[ShareCardDialog] Error during card export: $e');
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Unable to prepare your card. Please try again.'),
            backgroundColor: Colors.redAccent,
          ),
        );
      }
    } finally {
      if (mounted) setState(() => _exporting = false);
    }
  }

  Future<void> _shareToWhatsApp() async {
    if (_exporting) return;
    HapticFeedback.lightImpact();

    final text = Uri.encodeComponent(
        'Scan to connect with me on Tapfolio! ${_shareData.canonicalUrl}');
    final whatsappUri = Uri.parse('whatsapp://send?text=$text');
    final webUri = Uri.parse('https://wa.me/?text=$text');

    try {
      if (await canLaunchUrl(whatsappUri)) {
        await launchUrl(whatsappUri);
      } else if (await canLaunchUrl(webUri)) {
        await launchUrl(webUri, mode: LaunchMode.externalApplication);
      } else {
        await _shareCard();
      }
    } catch (_) {
      await _shareCard();
    }
  }

  Future<void> _downloadCard() async {
    if (_exporting) return;
    HapticFeedback.lightImpact();
    setState(() => _exporting = true);

    try {
      await _prewarmAvatar();

      final file = await CardRenderer.captureToPng(
        _repaintKey,
        pixelRatio: _format.pixelRatio,
      );

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
              backgroundColor:
                  success ? const Color(0xFF10B981) : Colors.redAccent,
            ),
          );
        }
      } else {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Unable to prepare your card. Please try again.'),
              backgroundColor: Colors.redAccent,
            ),
          );
        }
      }
    } catch (e) {
      debugPrint('[ShareCardDialog] Download error: $e');
    } finally {
      if (mounted) setState(() => _exporting = false);
    }
  }

  void _handleDragUpdate(DragUpdateDetails details) {
    if (_scrollController.hasClients && _scrollController.offset > 0) {
      return; // Only drag when at top
    }
    if ((details.primaryDelta ?? 0) > 0 || _dragOffsetY > 0) {
      setState(() {
        _dragOffsetY = (_dragOffsetY + (details.primaryDelta ?? 0.0))
            .clamp(0.0, 500.0);
      });
    }
  }

  void _handleDragEnd(DragEndDetails details) {
    final velocity = details.primaryVelocity ?? 0.0;
    if (_dragOffsetY > 90 || velocity > 500) {
      _dismissWithAnimation();
    } else if (_dragOffsetY > 0) {
      _springBackAnimation();
    }
  }

  void _dismissWithAnimation() {
    if (_isDismissing) return;
    _isDismissing = true;
    HapticFeedback.selectionClick();
    _dragAnimation = Tween<double>(begin: _dragOffsetY, end: 700.0).animate(
      CurvedAnimation(parent: _animController, curve: Curves.easeInCubic),
    );
    _animController.forward(from: 0.0).then((_) {
      if (mounted) Navigator.of(context).pop();
    });
  }

  void _springBackAnimation() {
    _dragAnimation = Tween<double>(begin: _dragOffsetY, end: 0.0).animate(
      CurvedAnimation(parent: _animController, curve: Curves.easeOutBack),
    );
    _animController.forward(from: 0.0);
  }

  @override
  Widget build(BuildContext context) {
    final screenSize = MediaQuery.of(context).size;

    return PopScope(
      canPop: true,
      onPopInvokedWithResult: (didPop, result) {
        if (didPop) return;
        Navigator.of(context).pop();
      },
      child: Scaffold(
        backgroundColor: _bgColor,
        body: AnimatedBuilder(
          animation: _animController,
          builder: (context, child) {
            return Transform.translate(
              offset: Offset(0, _dragOffsetY),
              child: child,
            );
          },
          child: GestureDetector(
            onVerticalDragUpdate: _handleDragUpdate,
            onVerticalDragEnd: _handleDragEnd,
            behavior: HitTestBehavior.translucent,
            child: Column(
              children: [
                // ── Pinned Top App Bar ──────────────────────────────────────
                SafeArea(
                  bottom: false,
                  child: Padding(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        // ── Back Arrow ─────────────────────────────────────
                        Semantics(
                          label: 'Go back to previous screen',
                          button: true,
                          child: InkWell(
                            onTap: () {
                              HapticFeedback.lightImpact();
                              Navigator.of(context).pop();
                            },
                            borderRadius: BorderRadius.circular(22),
                            child: Container(
                              width: 40,
                              height: 40,
                              alignment: Alignment.center,
                              decoration: BoxDecoration(
                                color: Colors.white,
                                shape: BoxShape.circle,
                                border: Border.all(
                                  color: _borderColor,
                                  width: 1,
                                ),
                                boxShadow: [
                                  BoxShadow(
                                    color: Colors.black.withValues(alpha: 0.04),
                                    blurRadius: 6,
                                    offset: const Offset(0, 2),
                                  ),
                                ],
                              ),
                              child: const Icon(
                                Icons.arrow_back_ios_new_rounded,
                                color: _textPrimary,
                                size: 16,
                              ),
                            ),
                          ),
                        ),

                        // ── Title & Subtitle ────────────────────────────────
                        Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Text(
                              'Share Your Card',
                              style: GoogleFonts.outfit(
                                color: _textPrimary,
                                fontSize: 17,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              'Choose a format and share instantly',
                              style: GoogleFonts.outfit(
                                color: _textSecondary,
                                fontSize: 11.5,
                              ),
                            ),
                          ],
                        ),

                        // ── Close button ────────────────────────────────────
                        Semantics(
                          label: 'Close',
                          button: true,
                          child: InkWell(
                            onTap: () {
                              HapticFeedback.lightImpact();
                              Navigator.of(context).pop();
                            },
                            borderRadius: BorderRadius.circular(22),
                            child: Container(
                              width: 40,
                              height: 40,
                              alignment: Alignment.center,
                              decoration: BoxDecoration(
                                color: Colors.white,
                                shape: BoxShape.circle,
                                border: Border.all(
                                  color: _borderColor,
                                  width: 1,
                                ),
                                boxShadow: [
                                  BoxShadow(
                                    color: Colors.black.withValues(alpha: 0.04),
                                    blurRadius: 6,
                                    offset: const Offset(0, 2),
                                  ),
                                ],
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
                  ),
                ),

                // ── Scrollable Body ────────────────────────────────────────
                Expanded(
                  child: SingleChildScrollView(
                    controller: _scrollController,
                    physics: const BouncingScrollPhysics(
                        parent: AlwaysScrollableScrollPhysics()),
                    child: Padding(
                      padding: const EdgeInsets.fromLTRB(16, 8, 16, 32),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // ── Format selector pills ──────────────────────────
                          _buildFormatSelector(),

                          const SizedBox(height: 16),

                          // ── Card preview ───────────────────────────────────
                          Center(
                            child: Container(
                              width: _format.previewWidth(
                                  screenSize.width, screenSize.height),
                              decoration: BoxDecoration(
                                borderRadius: BorderRadius.circular(20),
                                color: _surfaceColor,
                                boxShadow: [
                                  BoxShadow(
                                    color: Colors.black.withValues(alpha: 0.07),
                                    blurRadius: 24,
                                    offset: const Offset(0, 8),
                                  ),
                                  BoxShadow(
                                    color: _blue.withValues(alpha: 0.08),
                                    blurRadius: 36,
                                    spreadRadius: 2,
                                  ),
                                ],
                              ),
                              child: AspectRatio(
                                aspectRatio: _format.aspectRatio,
                                child: RepaintBoundary(
                                  key: _repaintKey,
                                  child: ClipRRect(
                                    borderRadius: BorderRadius.circular(18),
                                    child: _card,
                                  ),
                                ),
                              ),
                            ),
                          ),

                          const SizedBox(height: 24),

                          // ── Share your card instantly section ───────────────
                          Text(
                            'Share your card instantly',
                            style: GoogleFonts.outfit(
                              fontSize: 15,
                              fontWeight: FontWeight.w700,
                              color: _textPrimary,
                            ),
                          ),
                          const SizedBox(height: 10),

                          // ── Unified Blue Bar for Instant Sharing ────────────
                          _buildUnifiedShareBar(),
                        ],
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  // ── Unified Blue Share Bar ────────────────────────────────────────────────

  Widget _buildUnifiedShareBar() {
    return Container(
      height: 52,
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [_blueLight, _blueDark],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: _blue.withValues(alpha: 0.32),
            blurRadius: 14,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        children: [
          // ── Left: Primary "Share Now" Button ───────────────────────
          Expanded(
            child: Material(
              color: Colors.transparent,
              child: InkWell(
                onTap: () {
                  HapticFeedback.lightImpact();
                  ShareViaQrModal.show(context, _shareData);
                },
                borderRadius: BorderRadius.circular(12),
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 6),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(
                        Icons.qr_code_2_rounded,
                        color: Colors.white,
                        size: 20,
                      ),
                      const SizedBox(width: 8),
                      Flexible(
                        child: Text(
                          'Share Now',
                          overflow: TextOverflow.ellipsis,
                          style: GoogleFonts.outfit(
                            fontSize: 14.5,
                            fontWeight: FontWeight.w700,
                            color: Colors.white,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),

          // ── Divider ──────────────────────────────────────────────────────
          Container(
            width: 1,
            height: 26,
            margin: const EdgeInsets.symmetric(horizontal: 6),
            color: Colors.white.withValues(alpha: 0.28),
          ),

          // ── Right: Social Quick Icons Row (All Use Centralized Service) ──
          Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Instagram (native share sheet)
              _socialCircleIcon(
                gradient: const LinearGradient(
                  colors: [
                    Color(0xFFF58529),
                    Color(0xFFDD2A7B),
                    Color(0xFF8134AF),
                  ],
                  begin: Alignment.topRight,
                  end: Alignment.bottomLeft,
                ),
                onTap: _shareCard,
                child: const FaIcon(FontAwesomeIcons.instagram,
                    color: Colors.white, size: 16),
              ),
              const SizedBox(width: 6),

              // Facebook (native share sheet)
              _socialCircleIcon(
                color: const Color(0xFF1877F2),
                onTap: _shareCard,
                child: const FaIcon(FontAwesomeIcons.facebookF,
                    color: Colors.white, size: 15),
              ),
              const SizedBox(width: 6),

              // WhatsApp / Messages
              _socialCircleIcon(
                color: const Color(0xFF25D366),
                onTap: _shareToWhatsApp,
                child: const FaIcon(FontAwesomeIcons.whatsapp,
                    color: Colors.white, size: 16),
              ),
              const SizedBox(width: 6),

              // More ••• (native share sheet)
              _socialCircleIcon(
                color: Colors.white,
                onTap: _shareCard,
                child: const Icon(Icons.more_horiz_rounded,
                    color: Color(0xFF3B82F6), size: 18),
              ),
            ],
          ),
        ],
      ),
    );
  }

  // ── Format selector ──────────────────────────────────────────────────────

  Widget _buildFormatSelector() {
    return Container(
      padding: const EdgeInsets.all(4),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(16),
        color: _surfaceColor,
        border: Border.all(
          color: _borderColor,
          width: 1,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.03),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        children: _ExportFormat.values.map((fmt) {
          final selected = fmt == _format;
          return Expanded(
            child: GestureDetector(
              onTap: () {
                if (_format != fmt) {
                  HapticFeedback.selectionClick();
                  setState(() => _format = fmt);
                }
              },
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 220),
                curve: Curves.easeInOut,
                padding:
                    const EdgeInsets.symmetric(vertical: 10, horizontal: 4),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(12),
                  gradient: selected
                      ? const LinearGradient(
                          colors: [_blueLight, _blueDark],
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                        )
                      : null,
                  color: selected ? null : Colors.transparent,
                  boxShadow: selected
                      ? [
                          BoxShadow(
                            color: _blue.withValues(alpha: 0.25),
                            blurRadius: 8,
                            offset: const Offset(0, 2),
                          ),
                        ]
                      : null,
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      fmt.icon,
                      size: 16,
                      color: selected ? Colors.white : _textSecondary,
                    ),
                    const SizedBox(width: 6),
                    Column(
                      mainAxisSize: MainAxisSize.min,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          fmt.label,
                          style: GoogleFonts.outfit(
                            fontSize: 12,
                            fontWeight:
                                selected ? FontWeight.w700 : FontWeight.w500,
                            color:
                                selected ? Colors.white : _textSecondary,
                          ),
                        ),
                        Text(
                          fmt.subtitle,
                          style: GoogleFonts.outfit(
                            fontSize: 9,
                            color: selected
                                ? Colors.white70
                                : _textSecondary.withValues(alpha: 0.60),
                          ),
                        ),
                      ],
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

  // ── Social circle icon ──────────────────────────────────────────────────

  Widget _socialCircleIcon({
    required Widget child,
    Color? color,
    Gradient? gradient,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 36,
        height: 36,
        alignment: Alignment.center,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          gradient: gradient,
          color: gradient == null ? (color ?? Colors.white) : null,
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.12),
              blurRadius: 4,
              offset: const Offset(0, 1.5),
            ),
          ],
        ),
        child: child,
      ),
    );
  }
}

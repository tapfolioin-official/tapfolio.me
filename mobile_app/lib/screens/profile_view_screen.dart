import 'dart:async';
import 'dart:ui';
import 'package:flutter/material.dart' hide CardTheme, ButtonTheme;
import 'package:google_fonts/google_fonts.dart';
import '../models/profile.dart';
import '../models/social_link.dart';
import '../screens/theme_studio/models/theme_models.dart';
import '../screens/theme_studio/services/theme_serializer.dart';
import '../core/utils/image_helper.dart';
import '../services/api_service.dart';

class ProfileViewScreen extends StatefulWidget {
  final int? userId;
  final String? username;
  final Profile? initialProfile;

  const ProfileViewScreen({
    super.key, 
    this.userId, 
    this.username,
    this.initialProfile,
  });

  @override
  State<ProfileViewScreen> createState() => _ProfileViewScreenState();
}

class _ProfileViewScreenState extends State<ProfileViewScreen> {
  final ApiService _apiService = ApiService();
  final _searchController = TextEditingController();

  Profile? _profile;
  int? _userId;
  bool _loading = false;
  String? _error;
  bool _connecting = false;
  bool _connected = false;
  String? _connectionStatus;
  bool _aboutOpen = false;
  bool _contactOpen = false;
  bool _isOwnProfile = false;

  @override
  void initState() {
    super.initState();
    debugPrint('[PROFILE-01] ProfileViewScreen initState entered.');
    _profile = widget.initialProfile;
    _userId = widget.userId ?? widget.initialProfile?.userId;
    debugPrint('[PROFILE-02] _profile is null: ${_profile == null}, username=${_profile?.username}, userId=$_userId');
    debugPrint('[PROFILE-03] initialProfile theme: ${_profile?.theme}');

    _checkOwnProfile();

    if (_userId != null && _userId! > 0) {
      debugPrint('[PROFILE-04] Triggering _loadProfile($_userId)');
      _loadProfile(_userId!);
    } else if (widget.username != null && widget.username!.isNotEmpty) {
      debugPrint('[PROFILE-04] Triggering _loadProfileByUsername(${widget.username})');
      _loadProfileByUsername(widget.username!);
    } else if (widget.initialProfile != null && widget.initialProfile!.username.isNotEmpty) {
      debugPrint('[PROFILE-04] Triggering _loadProfileByUsername(${widget.initialProfile!.username})');
      _loadProfileByUsername(widget.initialProfile!.username);
    }
  }

  Future<void> _checkOwnProfile() async {
    try {
      final me = await _apiService.getMe();
      if (me != null && mounted) {
        setState(() {
          _isOwnProfile = (me.id == _userId ||
              (_profile != null &&
                  (me.id == _profile!.userId ||
                      (me.profile != null &&
                          me.profile!.username.isNotEmpty &&
                          me.profile!.username.toLowerCase() == _profile!.username.toLowerCase()))));
        });
      }
    } catch (_) {}
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  Future<void> _loadProfile(int userId) async {
    setState(() {
      _loading = _profile == null;
      _error = null;
    });

    try {
      final res = await _apiService.getProfile(userId: userId);
      if (!mounted) return;

      if (res != null && res['profile'] != null) {
        setState(() {
          _profile = res['profile'];
          _connectionStatus = res['connectionStatus'];
          _connected = _connectionStatus == 'accepted';
        });
      } else if (widget.username != null && widget.username!.isNotEmpty) {
        await _loadProfileByUsername(widget.username!);
        return;
      } else if (_profile == null) {
        setState(() {
          _error = 'Profile not found. Make sure user ID is correct.';
        });
      }
    } catch (e) {
      debugPrint('[PROFILE-VIEW] Load error: $e');
      if (widget.username != null && widget.username!.isNotEmpty) {
        await _loadProfileByUsername(widget.username!);
        return;
      }
      if (_profile == null) {
        setState(() {
          _error = 'Profile not found.';
        });
      }
    } finally {
      if (mounted) {
        setState(() {
          _loading = false;
        });
      }
    }
  }

  Future<void> _loadProfileByUsername(String username) async {
    setState(() {
      _loading = _profile == null;
      _error = null;
    });

    try {
      final res = await _apiService.getPublicProfile(username);
      if (!mounted) return;

      if (res != null && res['profile'] != null) {
        setState(() {
          _profile = res['profile'];
          _connectionStatus = res['connectionStatus'];
          _connected = _connectionStatus == 'accepted';
        });
      } else if (_profile == null) {
        setState(() {
          _error = 'Profile not found.';
        });
      }
    } catch (e) {
      debugPrint('[PROFILE-VIEW] Load by username error: $e');
      if (_profile == null) {
        setState(() {
          _error = 'Profile not found.';
        });
      }
    } finally {
      if (mounted) {
        setState(() {
          _loading = false;
        });
      }
    }
  }

  Future<void> _handleConnect() async {
    if (_profile == null || _connected || _connecting || _connectionStatus == 'pending') return;

    setState(() {
      _connecting = true;
    });

    final res = await _apiService.sendConnectionRequest(_profile!.username, via: 'app');

    if (!mounted) return;

    setState(() {
      _connecting = false;
    });

    if (res['success'] == true) {
      setState(() {
        _connectionStatus = 'pending';
      });
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Connection request sent!'), backgroundColor: Colors.teal),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(res['error'] ?? 'Failed to connect'), backgroundColor: Colors.redAccent),
      );
    }
  }

  void _handleSaveContact() {
    if (_profile == null) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Saving ${_profile!.name} to contacts...'),
        backgroundColor: const Color(0xFF0F172A),
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  void _handleShare() {
    if (_profile == null) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Profile link: tapfolio.me/${_profile!.username}'),
        backgroundColor: const Color(0xFF0F172A),
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  String _getRolesSubtitle() {
    if (_profile == null) return '';
    final roles = _profile!.tags
        .where((t) => t.type == 'role' || t.type == 'skill')
        .map((t) => t.text)
        .toList();
    if (roles.isNotEmpty) {
      return roles.join(' • ');
    }
    if (_profile!.tagline.isNotEmpty && _profile!.tagline != "Let's connect!") {
      return _profile!.tagline;
    }
    return 'Designer • Ai Creater • Script Writer';
  }

  Color _parseHex(String? hex, Color fallback) {
    if (hex == null || hex.isEmpty) return fallback;
    try {
      final clean = hex.replaceAll('#', '');
      if (clean.length == 6) {
        return Color(int.parse('FF$clean', radix: 16));
      } else if (clean.length == 8) {
        return Color(int.parse(clean, radix: 16));
      }
    } catch (_) {}
    return fallback;
  }

  Widget _buildDynamicBackground(ThemeSettings theme) {
    final bg = theme.background;
    final colors = theme.colors;

    final bgColor = _parseHex(colors.background, const Color(0xFF0F172A));
    final primaryColor = _parseHex(colors.primary, const Color(0xFF6366F1));
    final accentColor = _parseHex(colors.accent, const Color(0xFF10B981));
    final secondaryColor = _parseHex(colors.secondary, const Color(0xFF8B5CF6));

    final isImg = bg.type == 'image' ||
        bg.value.startsWith('http') ||
        bg.value.startsWith('/') ||
        bg.value.contains('.jpg') ||
        bg.value.contains('.png') ||
        bg.value.contains('.webp');

    if (isImg) {
      String url = bg.value;
      if (!url.startsWith('http')) {
        final cleanBase = _apiService.baseUrl.endsWith('/') 
            ? _apiService.baseUrl.substring(0, _apiService.baseUrl.length - 1) 
            : _apiService.baseUrl;
        final cleanPath = url.startsWith('/') ? url : '/$url';
        url = '$cleanBase$cleanPath';
      }
      final safeBlur = (bg.blur.isFinite && bg.blur > 0) ? bg.blur.clamp(0.0, 50.0) : 0.0;
      final safeOpacity = (bg.overlayOpacity.isFinite && bg.overlayOpacity >= 0) ? bg.overlayOpacity.clamp(0.0, 0.9) : 0.0;

      return Stack(
        fit: StackFit.expand,
        children: [
          Positioned.fill(
            child: Image.network(
              url,
              fit: BoxFit.cover,
              errorBuilder: (_, __, ___) => Container(color: bgColor),
            ),
          ),
          if (safeBlur > 0)
            Positioned.fill(
              child: BackdropFilter(
                filter: ImageFilter.blur(sigmaX: safeBlur, sigmaY: safeBlur),
                child: Container(color: Colors.transparent),
              ),
            ),
          Positioned.fill(
            child: Container(
              color: Colors.black.withValues(alpha: safeOpacity),
            ),
          ),
        ],
      );
    }

    if (bg.type == 'aurora') {
      return Container(
        color: const Color(0xFF090D1A),
        child: Stack(
          fit: StackFit.expand,
          children: [
            Positioned(
              top: -100,
              left: -80,
              child: Container(
                width: 320,
                height: 320,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  gradient: RadialGradient(
                    colors: [
                      const Color(0xFF14B8A6).withValues(alpha: 0.45),
                      Colors.transparent,
                    ],
                  ),
                ),
              ),
            ),
            Positioned(
              bottom: 80,
              right: -60,
              child: Container(
                width: 340,
                height: 340,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  gradient: RadialGradient(
                    colors: [
                      const Color(0xFF8B5CF6).withValues(alpha: 0.40),
                      Colors.transparent,
                    ],
                  ),
                ),
              ),
            ),
            Positioned.fill(
              child: BackdropFilter(
                filter: ImageFilter.blur(sigmaX: 40, sigmaY: 40),
                child: Container(
                  color: Colors.black.withValues(alpha: 0.2),
                ),
              ),
            ),
          ],
        ),
      );
    }

    if (bg.type == 'animated_gradient' || bg.type == 'gradient' || bg.type == 'mesh') {
      return Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [
              primaryColor.withValues(alpha: 0.9),
              secondaryColor.withValues(alpha: 0.8),
              bgColor,
            ],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
        ),
      );
    }

    if (bg.type == 'particles') {
      return Container(
        color: const Color(0xFF030712),
        child: Stack(
          fit: StackFit.expand,
          children: [
            Positioned(
              top: 80,
              right: 20,
              child: Container(
                width: 200,
                height: 200,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  gradient: RadialGradient(
                    colors: [
                      accentColor.withValues(alpha: 0.25),
                      Colors.transparent,
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      );
    }

    // Default Solid Background
    return Container(
      color: bgColor,
    );
  }

  Widget _buildSocialWidget(dynamic link, Color cardBg, Color textColor, Color subtextColor, double radius) {
    final platform = link.platform.toString();
    final p = platform.toLowerCase();

    Widget iconWidget;
    if (p.contains('instagram')) {
      iconWidget = Container(
        width: 42,
        height: 42,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(12),
          gradient: const LinearGradient(
            colors: [Color(0xFF833AB4), Color(0xFFFD1D1D), Color(0xFFFCB045)],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
        ),
        child: const Icon(Icons.camera_alt, color: Colors.white, size: 22),
      );
    } else if (p.contains('linkedin')) {
      iconWidget = Container(
        width: 42,
        height: 42,
        decoration: BoxDecoration(
          color: const Color(0xFF0A66C2),
          borderRadius: BorderRadius.circular(12),
        ),
        child: const Icon(Icons.business_center, color: Colors.white, size: 22),
      );
    } else if (p.contains('whatsapp')) {
      iconWidget = Container(
        width: 42,
        height: 42,
        decoration: BoxDecoration(
          color: const Color(0xFF25D366),
          borderRadius: BorderRadius.circular(12),
        ),
        child: const Icon(Icons.chat, color: Colors.white, size: 22),
      );
    } else {
      iconWidget = Container(
        width: 42,
        height: 42,
        decoration: BoxDecoration(
          color: const Color(0xFF0F172A),
          borderRadius: BorderRadius.circular(12),
        ),
        child: const Icon(Icons.link, color: Colors.white, size: 22),
      );
    }

    return Container(
      decoration: BoxDecoration(
        color: cardBg,
        borderRadius: BorderRadius.circular(radius),
        border: Border.all(color: Colors.white.withValues(alpha: 0.1)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.08),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 16),
      child: Row(
        children: [
          iconWidget,
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  platform,
                  style: GoogleFonts.outfit(
                    color: textColor,
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                if (link.handle != null && link.handle.isNotEmpty)
                  Text(
                    link.handle,
                    style: GoogleFonts.outfit(
                      color: subtextColor,
                      fontSize: 13,
                    ),
                  ),
              ],
            ),
          ),
          Icon(Icons.arrow_forward_ios, size: 14, color: subtextColor),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    debugPrint('[PROFILE-05] build() started. _profile null=${_profile == null}');
    // Deserialize the custom theme saved by the user in Theme Studio / Theme Store
    debugPrint('[PROFILE-06] Deserializing theme: ${_profile?.theme}');
    final themeSettings = ThemeSerializer.deserialize(_profile?.theme);
    debugPrint('[PROFILE-07] Theme deserialized. Background type: ${themeSettings.background.type}, avatar: ${themeSettings.avatar.shape}');

    final colors = themeSettings.colors;
    final cards = themeSettings.cards;
    final avatar = themeSettings.avatar;

    // Background and theme colors
    final isDarkBg = _parseHex(colors.background, const Color(0xFF0F172A)).computeLuminance() < 0.5;

    // Card Colors & Radii
    double cardRadius = 24.0;
    try {
      final numVal = int.parse(cards.borderRadius.replaceAll(RegExp(r'[^0-9]'), ''));
      cardRadius = numVal.toDouble();
    } catch (_) {}
    if (cardRadius < 12.0) cardRadius = 16.0;

    final heroCardBg = isDarkBg 
        ? const Color(0xFF1E293B).withValues(alpha: 0.94) 
        : Colors.white.withValues(alpha: 0.95);

    final accordionCardBg = isDarkBg 
        ? Colors.white 
        : Colors.white;

    final textColor = isDarkBg ? Colors.white : const Color(0xFF0F172A);
    final subtextColor = isDarkBg ? Colors.white.withValues(alpha: 0.75) : const Color(0xFF64748B);
    final primaryBtnColor = _parseHex(colors.primary, const Color(0xFF0F172A));

    // Avatar shape
    BoxShape avatarShape = BoxShape.circle;
    BorderRadius? avatarRadius;
    if (avatar.shape == 'rounded') {
      avatarShape = BoxShape.rectangle;
      avatarRadius = BorderRadius.circular(22);
    } else if (avatar.shape == 'square') {
      avatarShape = BoxShape.rectangle;
      avatarRadius = BorderRadius.circular(10);
    }

    debugPrint('[PROFILE-08] Building dynamic background');
    return Scaffold(
      backgroundColor: _parseHex(colors.background, const Color(0xFF0F172A)),
      body: Stack(
        fit: StackFit.expand,
        children: [
          // 1. Dynamic Wallpaper / Gradient / Solid Background from Theme Store
          Positioned.fill(
            child: _buildDynamicBackground(themeSettings),
          ),

          // 2. Main Profile Scrollable Content
          SafeArea(
            bottom: false,
            child: _profile != null
                ? SingleChildScrollView(
                    padding: EdgeInsets.fromLTRB(
                      20, 
                      8, 
                      20, 
                      MediaQuery.of(context).padding.bottom + 40
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        // Top Bar: Floating Glass Back Button
                        Row(
                          children: [
                            GestureDetector(
                              onTap: () {
                                if (Navigator.canPop(context)) {
                                  Navigator.pop(context);
                                }
                              },
                              child: Container(
                                width: 44,
                                height: 44,
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  color: Colors.black.withValues(alpha: 0.35),
                                  border: Border.all(color: Colors.white.withValues(alpha: 0.25), width: 1),
                                ),
                                child: const Icon(Icons.arrow_back_ios_new, color: Colors.white, size: 18),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 16),

                                // ─── HERO PROFILE CARD (Theme Stylized Container) ───
                                Builder(
                                  builder: (context) {
                                    debugPrint('[PROFILE-09] Building Hero Profile Card and Avatar');
                                    return Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 28),
                                  decoration: BoxDecoration(
                                    color: heroCardBg,
                                    borderRadius: BorderRadius.circular(cardRadius),
                                    border: Border.all(
                                      color: isDarkBg 
                                          ? Colors.white.withValues(alpha: 0.14) 
                                          : Colors.black.withValues(alpha: 0.08), 
                                      width: 1
                                    ),
                                    boxShadow: [
                                      BoxShadow(
                                        color: Colors.black.withValues(alpha: isDarkBg ? 0.35 : 0.1),
                                        blurRadius: 24,
                                        offset: const Offset(0, 10),
                                      ),
                                    ],
                                  ),
                                  child: Column(
                                    children: [
                                      // Avatar with Green Online Status Dot & Optional Glow
                                      Center(
                                        child: Stack(
                                          clipBehavior: Clip.none,
                                          children: [
                                            Container(
                                              width: 96,
                                              height: 96,
                                              decoration: BoxDecoration(
                                                shape: avatarShape,
                                                borderRadius: avatarShape == BoxShape.rectangle ? avatarRadius : null,
                                                border: Border.all(
                                                  color: _parseHex(colors.primary, Colors.white).withValues(alpha: 0.5), 
                                                  width: 3
                                                ),
                                                boxShadow: [
                                                  if (avatar.glow == 'glow')
                                                    BoxShadow(
                                                      color: _parseHex(colors.primary, const Color(0xFF6366F1)).withValues(alpha: 0.6),
                                                      blurRadius: 20,
                                                      spreadRadius: 2,
                                                    ),
                                                  BoxShadow(
                                                    color: Colors.black.withValues(alpha: 0.2),
                                                    blurRadius: 12,
                                                    offset: const Offset(0, 4),
                                                  ),
                                                ],
                                              ),
                                              child: avatarShape == BoxShape.circle
                                                  ? ClipOval(
                                                      child: Image(
                                                        image: getAvatarImage(_profile!.avatar, _apiService.baseUrl),
                                                        fit: BoxFit.cover,
                                                        errorBuilder: (_, __, ___) => const Icon(Icons.person, size: 48, color: Colors.white70),
                                                      ),
                                                    )
                                                  : ClipRRect(
                                                      borderRadius: avatarRadius ?? BorderRadius.circular(16),
                                                      child: Image(
                                                        image: getAvatarImage(_profile!.avatar, _apiService.baseUrl),
                                                        fit: BoxFit.cover,
                                                        errorBuilder: (_, __, ___) => const Icon(Icons.person, size: 48, color: Colors.white70),
                                                      ),
                                                    ),
                                            ),
                                            // Active Green Dot
                                            Positioned(
                                              right: 4,
                                              bottom: 4,
                                              child: Container(
                                                width: 16,
                                                height: 16,
                                                decoration: BoxDecoration(
                                                  color: const Color(0xFF10B981),
                                                  shape: BoxShape.circle,
                                                  border: Border.all(color: const Color(0xFF1E293B), width: 2.5),
                                                ),
                                              ),
                                            ),
                                          ],
                                        ),
                                      ),
                                      const SizedBox(height: 16),

                                      // Full Name with Verified Badge
                                      Row(
                                        mainAxisAlignment: MainAxisAlignment.center,
                                        children: [
                                          Flexible(
                                            child: Text(
                                              _profile!.name,
                                              textAlign: TextAlign.center,
                                              style: GoogleFonts.outfit(
                                                color: textColor,
                                                fontSize: 24,
                                                fontWeight: FontWeight.bold,
                                                letterSpacing: -0.3,
                                              ),
                                            ),
                                          ),
                                          const SizedBox(width: 6),
                                          const Icon(Icons.verified, color: Color(0xFF1D9BF0), size: 20),
                                        ],
                                      ),
                                      const SizedBox(height: 6),

                                      // Subtitle / Roles (e.g. Designer • Ai Creater • Script Writer)
                                      Text(
                                        _getRolesSubtitle(),
                                        textAlign: TextAlign.center,
                                        style: GoogleFonts.outfit(
                                          color: subtextColor,
                                          fontSize: 13.5,
                                          fontWeight: FontWeight.w400,
                                        ),
                                      ),
                                      const SizedBox(height: 8),

                                      // Location Pin
                                      Row(
                                        mainAxisAlignment: MainAxisAlignment.center,
                                        children: [
                                          Icon(Icons.location_on, color: subtextColor, size: 14),
                                          const SizedBox(width: 4),
                                          Text(
                                            _profile!.location != null && _profile!.location!.isNotEmpty
                                                ? _profile!.location!
                                                : 'Kochi',
                                            style: GoogleFonts.outfit(
                                              color: subtextColor,
                                              fontSize: 13,
                                            ),
                                          ),
                                        ],
                                      ),
                                      const SizedBox(height: 24),

                                      // Action Row: [ 🔖 Save Contact ] + [ ⍗ ] Share Button
                                      Row(
                                        children: [
                                          Expanded(
                                            child: SizedBox(
                                              height: 52,
                                              child: ElevatedButton.icon(
                                                style: ElevatedButton.styleFrom(
                                                  backgroundColor: primaryBtnColor,
                                                  foregroundColor: Colors.white,
                                                  elevation: 0,
                                                  shape: RoundedRectangleBorder(
                                                    borderRadius: BorderRadius.circular(16),
                                                    side: BorderSide(color: Colors.white.withValues(alpha: 0.1)),
                                                  ),
                                                ),
                                                onPressed: _handleSaveContact,
                                                icon: const Icon(Icons.bookmark_outline, size: 18),
                                                label: Text(
                                                  'Save Contact',
                                                  style: GoogleFonts.outfit(
                                                    fontSize: 15,
                                                    fontWeight: FontWeight.bold,
                                                  ),
                                                ),
                                              ),
                                            ),
                                          ),
                                          const SizedBox(width: 12),
                                          Container(
                                            width: 52,
                                            height: 52,
                                            decoration: BoxDecoration(
                                              color: isDarkBg 
                                                  ? const Color(0xFF334155).withValues(alpha: 0.8)
                                                  : Colors.black.withValues(alpha: 0.08),
                                              borderRadius: BorderRadius.circular(16),
                                              border: Border.all(color: Colors.white.withValues(alpha: 0.1)),
                                            ),
                                            child: IconButton(
                                              icon: Icon(Icons.upload, color: textColor, size: 20),
                                              onPressed: _handleShare,
                                            ),
                                          ),
                                        ],
                                      ),
                                    ],
                                  ),
                                );
                                  },
                                ),
                                const SizedBox(height: 16),

                                // ─── ACCORDION: ABOUT ME ───
                                Builder(
                                  builder: (context) {
                                    debugPrint('[PROFILE-10] Building About section');
                                    return Material(
                                      color: accordionCardBg,
                                      borderRadius: BorderRadius.circular(cardRadius),
                                      elevation: 2,
                                      shadowColor: Colors.black.withValues(alpha: 0.06),
                                      child: ClipRRect(
                                        borderRadius: BorderRadius.circular(cardRadius),
                                        child: ExpansionTile(
                                          initiallyExpanded: _aboutOpen,
                                          onExpansionChanged: (val) => setState(() => _aboutOpen = val),
                                          tilePadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 6),
                                          title: Text(
                                            'About Me',
                                            style: GoogleFonts.outfit(
                                              color: const Color(0xFF0F172A),
                                              fontSize: 16,
                                              fontWeight: FontWeight.bold,
                                            ),
                                          ),
                                          trailing: Icon(
                                            _aboutOpen ? Icons.keyboard_arrow_up : Icons.chevron_right,
                                            color: const Color(0xFF64748B),
                                          ),
                                          children: [
                                            Padding(
                                              padding: const EdgeInsets.fromLTRB(20, 0, 20, 20),
                                              child: Text(
                                                _profile!.bio.isNotEmpty 
                                                    ? _profile!.bio 
                                                    : 'A passionate graphic designer dedicated to creating visually compelling brands and meaningful digital experiences. Specializing in brand identity, UI/UX design, social media creatives, and visual storytelling.',
                                                style: GoogleFonts.outfit(
                                                  color: const Color(0xFF475569),
                                                  fontSize: 14,
                                                  height: 1.55,
                                                ),
                                              ),
                                            ),
                                          ],
                                        ),
                                      ),
                                    );
                                  },
                                ),
                                const SizedBox(height: 12),

                                // ─── ACCORDION: CONTACT ───
                                Builder(
                                  builder: (context) {
                                    debugPrint('[PROFILE-11] Building Contact section');
                                    return Material(
                                      color: accordionCardBg,
                                      borderRadius: BorderRadius.circular(cardRadius),
                                      elevation: 2,
                                      shadowColor: Colors.black.withValues(alpha: 0.06),
                                      child: ClipRRect(
                                        borderRadius: BorderRadius.circular(cardRadius),
                                        child: ExpansionTile(
                                          initiallyExpanded: _contactOpen,
                                          onExpansionChanged: (val) => setState(() => _contactOpen = val),
                                          tilePadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 6),
                                          title: Text(
                                            'Contact',
                                            style: GoogleFonts.outfit(
                                              color: const Color(0xFF0F172A),
                                              fontSize: 16,
                                              fontWeight: FontWeight.bold,
                                            ),
                                          ),
                                          trailing: Icon(
                                            _contactOpen ? Icons.keyboard_arrow_up : Icons.chevron_right,
                                            color: const Color(0xFF64748B),
                                          ),
                                          children: [
                                            Padding(
                                              padding: const EdgeInsets.fromLTRB(20, 0, 20, 20),
                                              child: Column(
                                                children: [
                                                  ListTile(
                                                    contentPadding: EdgeInsets.zero,
                                                    leading: const Icon(Icons.location_on, color: Color(0xFFEF4444)),
                                                    title: Text(
                                                      _profile!.location != null && _profile!.location!.isNotEmpty 
                                                          ? _profile!.location! 
                                                          : 'Kochi, Kerala', 
                                                      style: GoogleFonts.outfit(fontSize: 14),
                                                    ),
                                                  ),
                                              if (_profile!.phone != null && _profile!.phone!.isNotEmpty)
                                                ListTile(
                                                  contentPadding: EdgeInsets.zero,
                                                  leading: const Icon(Icons.phone, color: Color(0xFF0F172A)),
                                                  title: Text(_profile!.phone!, style: GoogleFonts.outfit(fontSize: 14)),
                                                ),
                                              if (_profile!.whatsapp != null && _profile!.whatsapp!.isNotEmpty)
                                                ListTile(
                                                  contentPadding: EdgeInsets.zero,
                                                  leading: const Icon(Icons.chat, color: Color(0xFF25D366)),
                                                  title: Text(_profile!.whatsapp!, style: GoogleFonts.outfit(fontSize: 14)),
                                                ),
                                            ],
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                );
                                  },
                                ),
                                const SizedBox(height: 14),

                                // ─── SOCIAL TILES (Instagram, LinkedIn, etc.) ───
                                Builder(
                                  builder: (context) {
                                    debugPrint('[PROFILE-12] Building Socials list');
                                    return Column(
                                      children: [
                                        if (_profile!.socials.isNotEmpty) ...[
                                          ..._profile!.socials.map((link) => Padding(
                                            padding: const EdgeInsets.only(bottom: 12),
                                            child: _buildSocialWidget(
                                              link, 
                                              accordionCardBg, 
                                              const Color(0xFF0F172A), 
                                              const Color(0xFF64748B), 
                                              cardRadius
                                            ),
                                          )),
                                        ] else ...[
                                          _buildSocialWidget(
                                            SocialLink(
                                              id: 1,
                                              platform: 'Instagram',
                                              handle: '@${_profile!.username}',
                                              url: 'https://instagram.com/${_profile!.username}',
                                              icon: 'instagram',
                                              color: '#E4405F',
                                            ),
                                            accordionCardBg,
                                            const Color(0xFF0F172A),
                                            const Color(0xFF64748B),
                                            cardRadius,
                                          ),
                                        ],
                                      ],
                                    );
                                  },
                                ),
                                const SizedBox(height: 18),

                                // ─── CONNECTION STATUS PILL (Seamlessly Inlined at the Bottom) ───
                                Builder(
                                  builder: (context) {
                                    debugPrint('[PROFILE-13] Building Connection Status Pill');
                                    final isConnected = _connected || _connectionStatus == 'accepted';
                                    final isPending = _connectionStatus == 'pending';

                                    String buttonText;
                                    Color pillBg;
                                    Color pillBorder;
                                    Color contentColor;
                                    IconData statusIcon;

                                    if (_isOwnProfile) {
                                      buttonText = 'Your Profile';
                                      pillBg = const Color(0xFFF1F5F9);
                                      pillBorder = const Color(0xFFCBD5E1);
                                      contentColor = const Color(0xFF475569);
                                      statusIcon = Icons.person_outline_rounded;
                                    } else if (isConnected) {
                                      buttonText = 'Connected';
                                      pillBg = const Color(0xFFD1FAE5);
                                      pillBorder = const Color(0xFF10B981).withValues(alpha: 0.35);
                                      contentColor = const Color(0xFF059669);
                                      statusIcon = Icons.check_circle_rounded;
                                    } else if (isPending) {
                                      buttonText = 'Pending Acceptance...';
                                      pillBg = const Color(0xFFFEF3C7);
                                      pillBorder = const Color(0xFFF59E0B).withValues(alpha: 0.35);
                                      contentColor = const Color(0xFFD97706);
                                      statusIcon = Icons.hourglass_top_rounded;
                                    } else {
                                      buttonText = 'Connect with ${_profile!.name}';
                                      pillBg = Colors.white;
                                      pillBorder = Colors.black.withValues(alpha: 0.08);
                                      contentColor = const Color(0xFF0F172A);
                                      statusIcon = Icons.bolt_rounded;
                                    }

                                    return Container(
                                      height: 56,
                                      decoration: BoxDecoration(
                                        color: pillBg,
                                        borderRadius: BorderRadius.circular(18),
                                        border: Border.all(
                                          color: pillBorder,
                                          width: 1.5,
                                        ),
                                        boxShadow: [
                                          BoxShadow(
                                            color: Colors.black.withValues(alpha: 0.08),
                                            blurRadius: 16,
                                            offset: const Offset(0, 6),
                                          ),
                                        ],
                                      ),
                                      child: Material(
                                        color: Colors.transparent,
                                        child: InkWell(
                                          borderRadius: BorderRadius.circular(18),
                                          onTap: (isConnected || isPending || _isOwnProfile) ? null : _handleConnect,
                                          child: Center(
                                            child: _connecting
                                                ? const SizedBox(
                                                    width: 24,
                                                    height: 24,
                                                    child: CircularProgressIndicator(
                                                      strokeWidth: 2.5,
                                                      color: Color(0xFF0F172A),
                                                    ),
                                                  )
                                                : Row(
                                                    mainAxisAlignment: MainAxisAlignment.center,
                                                    children: [
                                                      Icon(
                                                        statusIcon,
                                                        color: (!isConnected && !isPending && !_isOwnProfile)
                                                            ? const Color(0xFF0052FF)
                                                            : contentColor,
                                                        size: 20,
                                                      ),
                                                      const SizedBox(width: 8),
                                                      Text(
                                                        buttonText,
                                                        style: GoogleFonts.outfit(
                                                          color: contentColor,
                                                          fontSize: 16,
                                                          fontWeight: FontWeight.bold,
                                                        ),
                                                      ),
                                                    ],
                                                  ),
                                          ),
                                        ),
                                      ),
                                    );
                                  },
                                ),
                              ],
                            ),
                          )
                : _loading
                    ? const Center(child: CircularProgressIndicator(color: Colors.white))
                    : _error != null
                        ? Center(
                            child: Container(
                              margin: const EdgeInsets.all(24),
                              padding: const EdgeInsets.all(24),
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(24),
                                boxShadow: [
                                  BoxShadow(
                                    color: Colors.black.withValues(alpha: 0.1),
                                    blurRadius: 20,
                                    offset: const Offset(0, 8),
                                  ),
                                ],
                              ),
                              child: Column(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Container(
                                    width: 56,
                                    height: 56,
                                    decoration: const BoxDecoration(
                                      color: Color(0xFFFEF2F2),
                                      shape: BoxShape.circle,
                                    ),
                                    child: const Icon(Icons.error_outline, color: Color(0xFFEF4444), size: 28),
                                  ),
                                  const SizedBox(height: 16),
                                  Text(
                                    'Unable to Load Profile',
                                    style: GoogleFonts.outfit(
                                      fontSize: 18,
                                      fontWeight: FontWeight.bold,
                                      color: const Color(0xFF0F172A),
                                    ),
                                  ),
                                  const SizedBox(height: 8),
                                  Text(
                                    _error!,
                                    textAlign: TextAlign.center,
                                    style: GoogleFonts.outfit(
                                      fontSize: 14,
                                      color: const Color(0xFF64748B),
                                    ),
                                  ),
                                  const SizedBox(height: 20),
                                  ElevatedButton.icon(
                                    onPressed: () {
                                      if (_userId != null && _userId! > 0) {
                                        _loadProfile(_userId!);
                                      } else if (widget.username != null && widget.username!.isNotEmpty) {
                                        _loadProfileByUsername(widget.username!);
                                      }
                                    },
                                    icon: const Icon(Icons.refresh, size: 18),
                                    label: const Text('Retry'),
                                    style: ElevatedButton.styleFrom(
                                      backgroundColor: const Color(0xFF0052FF),
                                      foregroundColor: Colors.white,
                                      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          )
                        : Center(
                            child: Padding(
                              padding: const EdgeInsets.all(24.0),
                              child: Column(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Container(
                                    decoration: BoxDecoration(
                                      color: Colors.white,
                                      borderRadius: BorderRadius.circular(16),
                                    ),
                                    padding: const EdgeInsets.all(16),
                                    child: TextField(
                                      controller: _searchController,
                                      keyboardType: TextInputType.number,
                                      decoration: const InputDecoration(
                                        hintText: 'Enter user ID to view profile',
                                        border: InputBorder.none,
                                        icon: Icon(Icons.search, color: Color(0xFF0052FF)),
                                      ),
                                      onSubmitted: (val) {
                                        final id = int.tryParse(val.trim());
                                        if (id != null) _loadProfile(id);
                                      },
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

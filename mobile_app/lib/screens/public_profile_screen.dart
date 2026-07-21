import 'dart:async';
import 'dart:convert';
import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:video_player/video_player.dart';
import '../models/tag.dart';
import '../models/social_link.dart';
import '../core/utils/color_parser.dart';
import '../services/api_service.dart';


/// Public-facing profile screen shown when an NFC card is tapped.
class PublicProfileScreen extends StatefulWidget {
  final String username;
  const PublicProfileScreen({super.key, required this.username});

  @override
  State<PublicProfileScreen> createState() => _PublicProfileScreenState();
}

class _PublicProfileScreenState extends State<PublicProfileScreen>
    with TickerProviderStateMixin {
  final ApiService _api = ApiService();

  bool _loading = true;
  String? _error;
  Map<String, dynamic>? _rawProfile;
  String? _connectionStatus;
  bool _sending = false;
  bool _sent = false;
  bool _isLoggedIn = false;
  bool _isOwnProfile = false;
  Timer? _pollTimer;

  // Animations
  late AnimationController _heroCtrl;
  late Animation<double> _heroScale;
  late Animation<double> _heroFade;
  late AnimationController _contentCtrl;
  late Animation<Offset> _contentSlide;
  late Animation<double> _contentFade;

  @override
  void initState() {
    super.initState();
    _heroCtrl = AnimationController(
      vsync: this, duration: const Duration(milliseconds: 900),
    );
    _heroScale = Tween<double>(begin: 0.65, end: 1.0).animate(
      CurvedAnimation(parent: _heroCtrl, curve: Curves.elasticOut),
    );
    _heroFade = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _heroCtrl, curve: const Interval(0, 0.55, curve: Curves.easeOut)),
    );
    _contentCtrl = AnimationController(
      vsync: this, duration: const Duration(milliseconds: 700),
    );
    _contentSlide = Tween<Offset>(begin: const Offset(0, 0.14), end: Offset.zero)
        .animate(CurvedAnimation(parent: _contentCtrl, curve: Curves.easeOutCubic));
    _contentFade = CurvedAnimation(parent: _contentCtrl, curve: Curves.easeOut);
    _loadProfile();
  }

  @override
  void dispose() {
    _pollTimer?.cancel();
    _heroCtrl.dispose();
    _contentCtrl.dispose();
    super.dispose();
  }

  // ─── Data ──────────────────────────────────────────────────────────────────

  Future<void> _loadProfile() async {
    setState(() { _loading = true; _error = null; });
    _isLoggedIn = _api.isAuthenticated;

    final result = await _api.lookupUser(widget.username);
    if (!mounted) return;

    if (result == null) {
      setState(() { _loading = false; _error = 'not_found'; });
      return;
    }

    final profileData = result['profile'] as Map<String, dynamic>?;
    if (_isLoggedIn) {
      final me = await _api.getMe();
      if (me != null && profileData != null) {
        _isOwnProfile = me.id == (profileData['userId'] as int? ?? -1);
      }
    }

    setState(() {
      _rawProfile = profileData;
      _connectionStatus = result['connectionStatus'] as String?;
      _loading = false;
    });

    _heroCtrl.forward();
    Future.delayed(const Duration(milliseconds: 220), () {
      if (mounted) _contentCtrl.forward();
    });

    if (_connectionStatus == 'pending') _startPolling();
  }

  void _startPolling() {
    _pollTimer?.cancel();
    if (!_isLoggedIn || _isOwnProfile) return;
    _pollTimer = Timer.periodic(const Duration(seconds: 5), (t) async {
      if (!mounted) { t.cancel(); return; }
      final r = await _api.lookupUser(widget.username);
      if (r != null && mounted) {
        final s = r['connectionStatus'] as String?;
        if (s != _connectionStatus) {
          setState(() => _connectionStatus = s);
          if (s == 'accepted') {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('✓ Connected!'), backgroundColor: Color(0xFF10B981)),
            );
            t.cancel();
          }
        }
      }
    });
  }

  Future<void> _handleConnect() async {
    if (!_isLoggedIn) { _showLoginDialog(); return; }
    setState(() => _sending = true);
    final r = await _api.sendConnectionRequest(widget.username, via: 'nfc');
    if (!mounted) return;
    setState(() => _sending = false);
    if (r['success'] == true) {
      setState(() { _sent = true; _connectionStatus = 'pending'; });
      _startPolling();
    } else {
      final s = r['status'] as String?;
      if (s != null) setState(() => _connectionStatus = s);
    }
  }

  void _showLoginDialog() {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: const Color(0xFF0F1020),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: Text('Sign in to Connect',
            style: GoogleFonts.outfit(color: Colors.white, fontWeight: FontWeight.bold)),
        content: Text('Create a free Tapfolio account to send a connection request.',
            style: GoogleFonts.outfit(color: Colors.white60, fontSize: 14)),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx),
              child: Text('Cancel', style: GoogleFonts.outfit(color: Colors.white38))),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF6366F1),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10))),
            onPressed: () {
              Navigator.pop(ctx);
              Navigator.pushNamedAndRemoveUntil(context, '/login', (_) => false);
            },
            child: Text('Sign In',
                style: GoogleFonts.outfit(color: Colors.white, fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }

  // ─── Avatar helper (handles data: URI + network URL + relative path) ───────

  ImageProvider? _resolveAvatar(String raw, String baseUrl) {
    if (raw.isEmpty || raw == '/profile_avatar.png') return null;
    if (raw.startsWith('data:')) {
      final comma = raw.indexOf(',');
      if (comma == -1) return null;
      try { return MemoryImage(base64Decode(raw.substring(comma + 1))); }
      catch (_) { return null; }
    }
    final url = raw.startsWith('http') ? raw : '$baseUrl$raw';
    return NetworkImage(url);
  }

  // ─── Build ─────────────────────────────────────────────────────────────────

  @override
  Widget build(BuildContext context) {
    SystemChrome.setSystemUIOverlayStyle(SystemUiOverlayStyle.light);
    return Scaffold(
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        systemOverlayStyle: SystemUiOverlayStyle.light,
        leading: Padding(
          padding: const EdgeInsets.all(8),
          child: GestureDetector(
            onTap: () => Navigator.canPop(context)
                ? Navigator.pop(context)
                : Navigator.pushReplacementNamed(context, '/'),
            child: Container(
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.10),
                shape: BoxShape.circle,
                border: Border.all(color: Colors.white.withOpacity(0.15)),
              ),
              child: const Icon(Icons.arrow_back_ios_new, color: Colors.white, size: 18),
            ),
          ),
        ),
      ),
      body: _loading
          ? Container(color: const Color(0xFF07080F), child: _buildSkeleton())
          : _error != null
              ? Container(color: const Color(0xFF07080F), child: _buildError())
              : _buildProfile(),
    );
  }

  // ─── Skeleton ──────────────────────────────────────────────────────────────

  Widget _buildSkeleton() {
    return SingleChildScrollView(
      child: Column(children: [
        _skeletonHeader(),
        const SizedBox(height: 24),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: Column(children: [
            _skeletonRect(double.infinity, 130),
            const SizedBox(height: 14),
            _skeletonRect(double.infinity, 100),
            const SizedBox(height: 14),
            _skeletonRect(double.infinity, 180),
          ]),
        ),
      ]),
    );
  }

  Widget _skeletonHeader() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.fromLTRB(24, 110, 24, 40),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [const Color(0xFF6366F1).withOpacity(0.18), Colors.transparent],
        ),
      ),
      child: Column(children: [
        _shimmerCircle(110),
        const SizedBox(height: 20),
        _skeletonRect(200, 28),
        const SizedBox(height: 10),
        _skeletonRect(140, 16),
      ]),
    );
  }

  Widget _skeletonRect(double w, double h) => Container(
    width: w, height: h,
    margin: const EdgeInsets.symmetric(vertical: 4),
    decoration: BoxDecoration(
      color: Colors.white.withOpacity(0.07),
      borderRadius: BorderRadius.circular(14),
    ),
  );

  Widget _shimmerCircle(double size) => Container(
    width: size, height: size,
    decoration: BoxDecoration(
      shape: BoxShape.circle,
      color: Colors.white.withOpacity(0.09),
    ),
  );

  // ─── Error ─────────────────────────────────────────────────────────────────

  Widget _buildError() {
    final isNotFound = _error == 'not_found';
    return Center(child: Padding(
      padding: const EdgeInsets.all(36),
      child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
        Container(
          padding: const EdgeInsets.all(28),
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            color: Colors.white.withOpacity(0.05),
          ),
          child: Icon(
            isNotFound ? Icons.person_search_outlined : Icons.wifi_off_rounded,
            size: 72, color: Colors.white24,
          ),
        ),
        const SizedBox(height: 28),
        Text(
          isNotFound ? 'Profile Not Found' : 'Connection Error',
          style: GoogleFonts.outfit(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 12),
        Text(
          isNotFound
              ? '@${widget.username} doesn\'t exist or has been removed.'
              : 'Check your internet connection and try again.',
          textAlign: TextAlign.center,
          style: GoogleFonts.outfit(color: Colors.white54, fontSize: 15, height: 1.55),
        ),
        const SizedBox(height: 36),
        ElevatedButton.icon(
          onPressed: _loadProfile,
          icon: const Icon(Icons.refresh),
          label: Text('Try Again', style: GoogleFonts.outfit(fontWeight: FontWeight.w600)),
          style: ElevatedButton.styleFrom(
            backgroundColor: const Color(0xFF6366F1), foregroundColor: Colors.white,
            padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 14),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
          ),
        ),
      ]),
    ));
  }

  // ─── Main Profile ──────────────────────────────────────────────────────────

  Widget _buildProfile() {
    final p = _rawProfile!;
    final name       = p['name'] as String? ?? '';
    final bio        = p['bio'] as String? ?? '';
    final location   = p['location'] as String? ?? '';
    final avatarRaw  = p['avatar'] as String? ?? '';
    final isPremium  = p['isPremium'] as bool? ?? false;
    final isOnline   = p['isOnline'] as bool? ?? true;

    final socials = ((p['socials'] as List?) ?? [])
        .map((s) => SocialLink.fromJson(s as Map<String, dynamic>))
        .toList();
    final projects = p['projects'] as List? ?? [];

    final baseUrl = _api.baseUrl;
    final avatarProvider = _resolveAvatar(avatarRaw, baseUrl);

    // ─── Theme settings parsing ──────────────────────────────────────────────
    final themeSettings = ProfileThemeSettings.fromJson(p['theme'] as Map<String, dynamic>?);

    final sectionsList = <Widget>[];

    for (final sec in themeSettings.sectionsOrder) {
      if (themeSettings.sectionsVisibility[sec] != true) continue;

      if (sec == 'about' && bio.isNotEmpty) {
        sectionsList.add(
          ProfileAccordion(
            title: 'About Me',
            theme: themeSettings,
            child: Text(
              bio,
              style: GoogleFonts.outfit(
                color: themeSettings.textColor.withOpacity(0.8),
                fontSize: 14,
                height: 1.6,
              ),
            ),
          ),
        );
      } else if (sec == 'contact') {
        final contactContent = _buildContactAccordionContent(socials, location, themeSettings);
        if (contactContent != null) {
          sectionsList.add(
            ProfileAccordion(
              title: 'Contact',
              theme: themeSettings,
              child: contactContent,
            ),
          );
        }
      } else if (sec == 'socials' && socials.isNotEmpty) {
        sectionsList.add(_buildSocialGrid(socials, themeSettings));
      } else if (sec == 'portfolio' && (p['portfolioUrl'] as String? ?? '').isNotEmpty) {
        sectionsList.add(_buildPortfolioCard(p['portfolioUrl'] as String, themeSettings));
      } else if (sec == 'projects' && projects.isNotEmpty) {
        sectionsList.add(_buildProjectsSection(projects, themeSettings));
      }
    }

    return DynamicBackground(
      theme: themeSettings,
      baseUrl: baseUrl,
      child: Stack(children: [
        // ── Scrollable content ─────────────────────────────────────────
        SingleChildScrollView(
          padding: const EdgeInsets.fromLTRB(18, 108, 18, 110),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              // ── Hero Banner Card ─────────────────────────────────────
              _buildHeroCard(
                p, themeSettings, avatarProvider, isPremium, isOnline,
              ),

              const SizedBox(height: 16),

              // ── Dynamic Ordered Sections ─────────────────────────────
              SlideTransition(
                position: _contentSlide,
                child: FadeTransition(
                  opacity: _contentFade,
                  child: ListView.separated(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    padding: EdgeInsets.zero,
                    itemCount: sectionsList.length,
                    separatorBuilder: (_, __) => const SizedBox(height: 14),
                    itemBuilder: (_, index) => sectionsList[index],
                  ),
                ),
              ),
            ],
          ),
        ),

        // ── Sticky connect bar ────────────────────────────────────────
        if (!_isOwnProfile)
          Positioned(bottom: 0, left: 0, right: 0, child: _buildConnectBar(name, themeSettings)),
      ]),
    );
  }

  // ─── Hero Card ─────────────────────────────────────────────────────────────

  Widget _buildHeroCard(
    Map<String, dynamic> p,
    ProfileThemeSettings theme,
    ImageProvider? avatarProvider,
    bool isPremium,
    bool isOnline,
  ) {
    final name = p['name'] as String? ?? '';
    final tagline = p['tagline'] as String? ?? '';
    final location = p['location'] as String? ?? '';

    // Extract roles from tags
    final tags = ((p['tags'] as List?) ?? [])
        .map((t) => Tag.fromJson(t as Map<String, dynamic>))
        .toList();
    final rolesList = tags
        .where((t) => t.type == 'role' || t.type == 'skill')
        .map((t) => t.text)
        .toList();
    final rolesText = rolesList.isNotEmpty ? rolesList.join(' • ') : tagline;

    final borderRadius = theme.cardBorderRadius;

    BorderRadius avatarRadius;
    if (theme.avatarShape == 'rounded') {
      avatarRadius = BorderRadius.circular(18);
    } else if (theme.avatarShape == 'square') {
      avatarRadius = BorderRadius.zero;
    } else {
      avatarRadius = BorderRadius.circular(100);
    }

    return ScaleTransition(
      scale: _heroScale,
      child: FadeTransition(
        opacity: _heroFade,
        child: Container(
          width: double.infinity,
          padding: const EdgeInsets.all(22),
          decoration: BoxDecoration(
            color: const Color(0xFF1E293B), // slate dark blue background
            borderRadius: BorderRadius.circular(borderRadius),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.08),
                blurRadius: 20,
                offset: const Offset(0, 6),
              )
            ],
          ),
          child: Column(
        children: [
          // Avatar
          Stack(clipBehavior: Clip.none, children: [
            Container(
              width: 80, height: 80,
              decoration: BoxDecoration(
                borderRadius: avatarRadius,
                border: Border.all(color: Colors.white.withOpacity(0.15), width: 3),
              ),
              child: ClipRRect(
                borderRadius: avatarRadius.subtract(BorderRadius.circular(3)),
                child: SizedBox(
                  width: 74, height: 74,
                  child: _buildAvatarContent(avatarProvider, name),
                ),
              ),
            ),
            // Online status dot
            Positioned(
              bottom: 0, right: 0,
              child: Container(
                width: 14, height: 14,
                decoration: BoxDecoration(
                  color: isOnline ? const Color(0xFF10B981) : Colors.white38,
                  shape: BoxShape.circle,
                  border: Border.all(color: const Color(0xFF1E293B), width: 2),
                ),
              ),
            ),
          ]),

          const SizedBox(height: 16),

          // Name + verified badge
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Flexible(
                child: Text(
                  name,
                  textAlign: TextAlign.center,
                  style: GoogleFonts.outfit(
                    color: Colors.white,
                    fontSize: 22,
                    fontWeight: FontWeight.w700,
                    letterSpacing: -0.5,
                  ),
                ),
              ),
              if (isPremium) ...[
                const SizedBox(width: 6),
                const Icon(Icons.verified_rounded, color: Color(0xFF1D9BF0), size: 20),
              ],
            ],
          ),

          if (rolesText.isNotEmpty) ...[
            const SizedBox(height: 8),
            Text(
              rolesText,
              textAlign: TextAlign.center,
              style: GoogleFonts.outfit(
                color: Colors.white70,
                fontSize: 13,
                height: 1.4,
              ),
            ),
          ],

          if (location.isNotEmpty) ...[
            const SizedBox(height: 10),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(Icons.location_on_rounded, size: 13, color: Color(0xFF94A3B8)),
                const SizedBox(width: 4),
                Text(
                  location,
                  style: GoogleFonts.outfit(
                    color: const Color(0xFF94A3B8),
                    fontSize: 13,
                  ),
                ),
              ],
            ),
          ],

          const SizedBox(height: 20),

          // Hero action buttons
          Row(
            children: [
              Expanded(
                child: SizedBox(
                  height: 46,
                  child: ElevatedButton.icon(
                    onPressed: () {
                      final uri = Uri.parse('https://www.tapfolio.me/api/profile/${widget.username}/vcard');
                      launchUrl(uri, mode: LaunchMode.externalApplication);
                    },
                    icon: const Icon(Icons.bookmark_border_rounded, size: 18),
                    label: Text(
                      'Save Contact',
                      style: GoogleFonts.outfit(fontWeight: FontWeight.bold, fontSize: 14),
                    ),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF0F172A),
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                      elevation: 0,
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 10),
              Container(
                width: 46, height: 46,
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.08),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: IconButton(
                  icon: const Icon(Icons.ios_share_rounded, color: Colors.white, size: 18),
                  onPressed: () {
                    final shareUrl = 'https://www.tapfolio.me/connect/${widget.username}';
                    Clipboard.setData(ClipboardData(text: shareUrl));
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('✓ Profile link copied!'), backgroundColor: Color(0xFF10B981)),
                    );
                  },
                ),
              ),
            ],
          ),
        ],
      ),
        ),
      ),
    );
  }

  Widget _buildAvatarContent(ImageProvider? provider, String name) {
    final initials = _initials(name);
    if (provider == null) {
      return ColoredBox(
        color: const Color(0xFF1E1B4B),
        child: Center(child: Text(initials, style: GoogleFonts.outfit(
          color: Colors.white, fontWeight: FontWeight.bold, fontSize: 28,
        ))),
      );
    }
    if (provider is MemoryImage) {
      return Image(image: provider, fit: BoxFit.cover,
          errorBuilder: (_, __, ___) => ColoredBox(color: const Color(0xFF1E1B4B),
            child: Center(child: Text(initials, style: GoogleFonts.outfit(
              color: Colors.white, fontWeight: FontWeight.bold, fontSize: 28,
            )))));
    }
    return Image(
      image: provider,
      fit: BoxFit.cover,
      frameBuilder: (_, child, frame, wasSync) => (wasSync || frame != null) ? child :
          ColoredBox(color: const Color(0xFF1E1B4B),
            child: Center(child: Text(initials, style: GoogleFonts.outfit(
              color: Colors.white38, fontWeight: FontWeight.bold, fontSize: 28,
            )))),
      errorBuilder: (_, __, ___) => ColoredBox(color: const Color(0xFF1E1B4B),
        child: Center(child: Text(initials, style: GoogleFonts.outfit(
          color: Colors.white, fontWeight: FontWeight.bold, fontSize: 28,
        )))),
    );
  }

  String _initials(String value) {
    final parts = value.trim().split(RegExp(r'\s+'));
    if (parts.isEmpty || parts.first.isEmpty) return '?';
    if (parts.length == 1) return parts.first[0].toUpperCase();
    return '${parts.first[0]}${parts.last[0]}'.toUpperCase();
  }

  // ─── Social Grid ───────────────────────────────────────────────────────────

  Widget _buildSocialGrid(List<SocialLink> socials, ProfileThemeSettings theme) {
    final surfaceColor = theme.surfaceColor;
    final borderColor = theme.borderColor;
    final borderRadius = theme.cardBorderRadius;
    final textColor = theme.textColor;

    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      padding: EdgeInsets.zero,
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 3,
        crossAxisSpacing: 10,
        mainAxisSpacing: 10,
        childAspectRatio: 1.15,
      ),
      itemCount: socials.length,
      itemBuilder: (context, index) {
        final social = socials[index];
        final color = parseHexColor(social.color);
        return GestureDetector(
          onTap: () async {
            final uri = Uri.parse(social.url);
            if (await canLaunchUrl(uri)) {
              await launchUrl(uri, mode: LaunchMode.externalApplication);
            }
          },
          child: Container(
            decoration: BoxDecoration(
              color: surfaceColor.withOpacity(theme.cardOpacity),
              borderRadius: BorderRadius.circular(borderRadius),
              border: Border.all(color: borderColor),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.01),
                  blurRadius: 6,
                  offset: const Offset(0, 3),
                )
              ],
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                _socialIcon(social.icon, color),
                const SizedBox(height: 8),
                Text(
                  social.platform,
                  textAlign: TextAlign.center,
                  style: GoogleFonts.outfit(
                    color: textColor,
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _socialIcon(String name, Color color) {
    const sz = 24.0;
    switch (name) {
      case 'github':    return FaIcon(FontAwesomeIcons.github,    color: color, size: sz);
      case 'linkedin':  return FaIcon(FontAwesomeIcons.linkedin,  color: color, size: sz);
      case 'twitter':   return FaIcon(FontAwesomeIcons.xTwitter,  color: color, size: sz);
      case 'instagram': return FaIcon(FontAwesomeIcons.instagram, color: color, size: sz);
      case 'youtube':   return FaIcon(FontAwesomeIcons.youtube,   color: color, size: sz);
      case 'telegram':  return FaIcon(FontAwesomeIcons.telegram,  color: color, size: sz);
      case 'whatsapp':  return FaIcon(FontAwesomeIcons.whatsapp,  color: color, size: sz);
      case 'behance':   return FaIcon(FontAwesomeIcons.behance,   color: color, size: sz);
      case 'facebook':  return FaIcon(FontAwesomeIcons.facebook,  color: color, size: sz);
      case 'tiktok':    return FaIcon(FontAwesomeIcons.tiktok,    color: color, size: sz);
      case 'globe':     return Icon(Icons.language_rounded,        color: color, size: sz);
      default:          return Icon(Icons.link_rounded,            color: color, size: sz);
    }
  }

  // ─── Contact Info ──────────────────────────────────────────────────────────

  Widget? _buildContactAccordionContent(List<SocialLink> socials, String location, ProfileThemeSettings theme) {
    final items = <_ContactItem>[];

    final email = socials.firstWhereOrNull((s) => s.platform.toLowerCase().contains('email'));
    if (email != null) {
      items.add(_ContactItem(
        label: 'Email',
        val: email.handle.isNotEmpty ? email.handle : email.url.replaceFirst('mailto:', ''),
        url: email.url,
      ));
    }

    final phone = socials.firstWhereOrNull((s) => s.platform.toLowerCase().contains('phone') || s.platform.toLowerCase().contains('whatsapp'));
    if (phone != null) {
      final displayVal = phone.handle.isNotEmpty
          ? phone.handle
          : phone.url.replaceFirst('tel:', '').replaceFirst('https://wa.me/', '').split('?')[0];
      items.add(_ContactItem(
        label: 'Phone',
        val: displayVal,
        url: phone.url,
      ));
    }

    final web = socials.firstWhereOrNull((s) => s.platform.toLowerCase().contains('portfolio') || s.platform.toLowerCase().contains('website'));
    if (web != null) {
      items.add(_ContactItem(
        label: 'Website',
        val: web.handle.isNotEmpty ? web.handle : web.url,
        url: web.url,
      ));
    }

    if (location.isNotEmpty) {
      items.add(_ContactItem(
        label: 'Location',
        val: location,
        url: 'https://maps.google.com/?q=${Uri.encodeComponent(location)}',
      ));
    }

    if (items.isEmpty) return null;

    return Column(
      children: items.map((item) {
        return Padding(
          padding: const EdgeInsets.symmetric(vertical: 6),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              SizedBox(
                width: 90,
                child: Text(
                  item.label,
                  style: GoogleFonts.outfit(
                    color: theme.mutedTextColor,
                    fontSize: 13,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
              Expanded(
                child: GestureDetector(
                  onTap: () async {
                    final uri = Uri.parse(item.url);
                    if (await canLaunchUrl(uri)) {
                      await launchUrl(uri, mode: LaunchMode.externalApplication);
                    }
                  },
                  child: Text(
                    item.val,
                    style: GoogleFonts.outfit(
                      color: theme.primaryColor,
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                      decoration: TextDecoration.underline,
                    ),
                  ),
                ),
              ),
            ],
          ),
        );
      }).toList(),
    );
  }

  // ─── Portfolio Card ────────────────────────────────────────────────────────

  Widget _buildPortfolioCard(String url, ProfileThemeSettings theme) {
    final surfaceColor = theme.surfaceColor;
    final borderColor = theme.borderColor;
    final borderRadius = theme.cardBorderRadius;
    final textColor = theme.textColor;

    return Container(
      decoration: BoxDecoration(
        color: surfaceColor.withOpacity(theme.cardOpacity),
        borderRadius: BorderRadius.circular(borderRadius),
        border: Border.all(color: borderColor),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.02),
            blurRadius: 10,
            offset: const Offset(0, 4),
          )
        ],
      ),
      child: InkWell(
        onTap: () async {
          final uri = Uri.parse(url.startsWith('http') ? url : 'https://www.tapfolio.me$url');
          if (await canLaunchUrl(uri)) {
            await launchUrl(uri, mode: LaunchMode.externalApplication);
          }
        },
        borderRadius: BorderRadius.circular(borderRadius),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 16),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'View Interactive Portfolio Showcase',
                style: GoogleFonts.outfit(
                  color: textColor,
                  fontSize: 15,
                  fontWeight: FontWeight.w600,
                ),
              ),
              Icon(
                Icons.keyboard_arrow_right_rounded,
                color: textColor.withOpacity(0.5),
                size: 20,
              ),
            ],
          ),
        ),
      ),
    );
  }

  // ─── Projects Section ──────────────────────────────────────────────────────

  Widget _buildProjectsSection(List<dynamic> projects, ProfileThemeSettings theme) {
    final surfaceColor = theme.surfaceColor;
    final borderColor = theme.borderColor;
    final borderRadius = theme.cardBorderRadius;
    final textColor = theme.textColor;
    final mutedTextColor = theme.mutedTextColor;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.only(left: 4, bottom: 10),
          child: Text(
            'FEATURED PROJECTS',
            style: GoogleFonts.outfit(
              color: mutedTextColor.withOpacity(0.7),
              fontSize: 11,
              fontWeight: FontWeight.w700,
              letterSpacing: 1.3,
            ),
          ),
        ),
        ...projects.map((proj) {
          final name = proj['name'] as String? ?? '';
          final shortDesc = proj['shortDesc'] as String? ?? '';
          final slug = proj['slug'] as String? ?? '';

          return Container(
            margin: const EdgeInsets.only(bottom: 10),
            decoration: BoxDecoration(
              color: surfaceColor.withOpacity(theme.cardOpacity),
              borderRadius: BorderRadius.circular(borderRadius),
              border: Border.all(color: borderColor),
            ),
            child: InkWell(
              onTap: () async {
                final url = 'https://www.tapfolio.me/${widget.username}/projects/$slug';
                final uri = Uri.parse(url);
                if (await canLaunchUrl(uri)) {
                  await launchUrl(uri, mode: LaunchMode.externalApplication);
                }
              },
              borderRadius: BorderRadius.circular(borderRadius),
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            name,
                            style: GoogleFonts.outfit(
                              color: textColor,
                              fontSize: 14,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          if (shortDesc.isNotEmpty) ...[
                            const SizedBox(height: 4),
                            Text(
                              shortDesc,
                              style: GoogleFonts.outfit(
                                color: mutedTextColor,
                                fontSize: 12,
                              ),
                            ),
                          ],
                        ],
                      ),
                    ),
                    Icon(
                      Icons.keyboard_arrow_right_rounded,
                      color: textColor.withOpacity(0.5),
                      size: 20,
                    ),
                  ],
                ),
              ),
            ),
          );
        }).toList(),
      ],
    );
  }

  // ─── Connect Bar ───────────────────────────────────────────────────────────

  Widget _buildConnectBar(String name, ProfileThemeSettings theme) {
    return ClipRect(
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 24, sigmaY: 24),
        child: Container(
          padding: EdgeInsets.fromLTRB(18, 14, 18,
              MediaQuery.of(context).padding.bottom + 14),
          decoration: BoxDecoration(
            color: theme.bgColor.withOpacity(0.88),
            border: Border(top: BorderSide(color: Colors.white.withOpacity(0.08))),
          ),
          child: _buildConnectButton(name, theme),
        ),
      ),
    );
  }

  Widget _buildConnectButton(String name, ProfileThemeSettings theme) {
    if (_connectionStatus == 'accepted') {
      return _statusChip(Icons.check_circle_outline_rounded, 'Already Connected', const Color(0xFF10B981));
    }
    if (_connectionStatus == 'pending' || _sent) {
      return _statusChip(Icons.hourglass_top_rounded, 'Request Pending', const Color(0xFFF59E0B));
    }
    if (_connectionStatus == 'blocked') {
      return _statusChip(Icons.block_rounded, 'Unavailable', Colors.redAccent);
    }

    final primary = theme.primaryColor;
    final accent = theme.accentColor;

    return SizedBox(
      width: double.infinity,
      height: 56,
      child: DecoratedBox(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [primary, accent],
          ),
          borderRadius: BorderRadius.circular(18),
          boxShadow: [
            BoxShadow(
              color: primary.withOpacity(0.40),
              blurRadius: 20, offset: const Offset(0, 6),
            ),
          ],
        ),
        child: ElevatedButton(
          onPressed: _sending ? null : _handleConnect,
          style: ElevatedButton.styleFrom(
            backgroundColor: Colors.transparent,
            foregroundColor: Colors.white,
            shadowColor: Colors.transparent,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
          ),
          child: _sending
              ? const SizedBox(width: 24, height: 24,
                  child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2.5))
              : Row(mainAxisAlignment: MainAxisAlignment.center, children: [
                  const Icon(Icons.person_add_alt_1_rounded, size: 22),
                  const SizedBox(width: 10),
                  Text(
                    'Connect with $name',
                    style: GoogleFonts.outfit(fontSize: 17, fontWeight: FontWeight.bold),
                  ),
                ]),
        ),
      ),
    );
  }

  Widget _statusChip(IconData icon, String label, Color color) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(vertical: 16),
      decoration: BoxDecoration(
        color: color.withOpacity(0.12),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: color.withOpacity(0.35)),
      ),
      child: Row(mainAxisAlignment: MainAxisAlignment.center, children: [
        Icon(icon, color: color, size: 22),
        const SizedBox(width: 10),
        Text(label, style: GoogleFonts.outfit(color: color, fontWeight: FontWeight.w600, fontSize: 16)),
      ]),
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// ProfileAccordion (Custom Accordion Row Card matching website)
// ─────────────────────────────────────────────────────────────────────────────

class ProfileAccordion extends StatefulWidget {
  final String title;
  final Widget child;
  final ProfileThemeSettings theme;

  const ProfileAccordion({
    super.key,
    required this.title,
    required this.child,
    required this.theme,
  });

  @override
  State<ProfileAccordion> createState() => _ProfileAccordionState();
}

class _ProfileAccordionState extends State<ProfileAccordion> {
  bool _expanded = false;

  @override
  Widget build(BuildContext context) {
    final surfaceColor = widget.theme.surfaceColor;
    final borderColor = widget.theme.borderColor;
    final textColor = widget.theme.textColor;
    final borderRadius = widget.theme.cardBorderRadius;

    return Container(
      decoration: BoxDecoration(
        color: surfaceColor.withOpacity(widget.theme.cardOpacity),
        borderRadius: BorderRadius.circular(borderRadius),
        border: Border.all(color: borderColor),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.02),
            blurRadius: 10,
            offset: const Offset(0, 4),
          )
        ],
      ),
      child: Column(
        children: [
          InkWell(
            onTap: () => setState(() => _expanded = !_expanded),
            borderRadius: BorderRadius.circular(borderRadius),
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 16),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    widget.title,
                    style: GoogleFonts.outfit(
                      color: textColor,
                      fontSize: 15,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  Icon(
                    _expanded ? Icons.keyboard_arrow_down_rounded : Icons.keyboard_arrow_right_rounded,
                    color: textColor.withOpacity(0.5),
                    size: 20,
                  ),
                ],
              ),
            ),
          ),
          if (_expanded)
            Container(
              width: double.infinity,
              padding: const EdgeInsets.fromLTRB(18, 0, 18, 18),
              child: widget.child,
            ),
        ],
      ),
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// ProfileThemeSettings & Helper classes
// ─────────────────────────────────────────────────────────────────────────────

class ProfileThemeSettings {
  final Color primaryColor;
  final Color accentColor;
  final Color bgColor;
  final Color surfaceColor;
  final Color textColor;
  final Color mutedTextColor;
  final Color borderColor;

  final String bgType;
  final String bgValue;
  final double bgBrightness;
  final double bgBlur;
  final double bgOverlayOpacity;

  final String cardStyle;
  final double cardBorderRadius;
  final double cardOpacity;

  final String avatarShape;
  final bool avatarGlow;

  final String layoutAlignment;
  final List<String> sectionsOrder;
  final Map<String, bool> sectionsVisibility;

  ProfileThemeSettings({
    required this.primaryColor,
    required this.accentColor,
    required this.bgColor,
    required this.surfaceColor,
    required this.textColor,
    required this.mutedTextColor,
    required this.borderColor,
    required this.bgType,
    required this.bgValue,
    required this.bgBrightness,
    required this.bgBlur,
    required this.bgOverlayOpacity,
    required this.cardStyle,
    required this.cardBorderRadius,
    required this.cardOpacity,
    required this.avatarShape,
    required this.avatarGlow,
    required this.layoutAlignment,
    required this.sectionsOrder,
    required this.sectionsVisibility,
  });

  factory ProfileThemeSettings.fromJson(Map<String, dynamic>? json) {
    final colors = json?['colors'] as Map<String, dynamic>?;
    final bg = json?['background'] as Map<String, dynamic>?;
    final cards = json?['cards'] as Map<String, dynamic>?;
    final avatar = json?['avatar'] as Map<String, dynamic>?;
    final layout = json?['layout'] as Map<String, dynamic>?;
    final sections = json?['sections'] as Map<String, dynamic>?;

    final order = (sections?['order'] as List?)?.map((e) => e.toString()).toList() ??
        ['about', 'contact', 'socials', 'portfolio', 'projects'];
    final visibilityMap = sections?['visibility'] as Map<String, dynamic>?;
    final visibility = <String, bool>{
      'about': visibilityMap?['about'] != false,
      'contact': visibilityMap?['contact'] != false,
      'socials': visibilityMap?['socials'] != false,
      'portfolio': visibilityMap?['portfolio'] != false,
      'projects': visibilityMap?['projects'] != false,
    };

    return ProfileThemeSettings(
      primaryColor: _parseColor(colors?['primary'], const Color(0xFF6366F1)),
      accentColor: _parseColor(colors?['accent'], const Color(0xFF8B5CF6)),
      bgColor: _parseColor(colors?['background'], const Color(0xFF07080F)),
      surfaceColor: _parseColor(colors?['surface'], const Color(0xFFFFFFFF)), // default white surface
      textColor: _parseColor(colors?['text'], const Color(0xFF111827)), // default dark text
      mutedTextColor: _parseColor(colors?['mutedText'], const Color(0xFF6B7280)),
      borderColor: _parseColor(colors?['border'], const Color(0xFFE5E7EB)), // default grey borders

      bgType: bg?['type'] as String? ?? 'solid',
      bgValue: bg?['value'] as String? ?? '',
      bgBrightness: _toDouble(bg?['brightness']) ?? 0.8,
      bgBlur: _toDouble(bg?['blur']) ?? 0.0,
      bgOverlayOpacity: _toDouble(bg?['overlayOpacity']) ?? 0.3,

      cardStyle: cards?['style'] as String? ?? 'rounded',
      cardBorderRadius: _parseRadius(cards?['borderRadius']) ?? 16.0,
      cardOpacity: _toDouble(cards?['opacity']) ?? 1.0,

      avatarShape: avatar?['shape'] as String? ?? 'circle',
      avatarGlow: avatar?['glow'] == 'glow',

      layoutAlignment: layout?['alignment'] as String? ?? 'center',
      sectionsOrder: order,
      sectionsVisibility: visibility,
    );
  }

  static Color _parseColor(dynamic val, Color fallback) {
    if (val == null) return fallback;
    final str = val.toString().trim();
    if (str.startsWith('rgba')) {
      try {
        final match = RegExp(r'rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d.]+)\s*\)').firstMatch(str);
        if (match != null) {
          final r = int.parse(match.group(1)!);
          final g = int.parse(match.group(2)!);
          final b = int.parse(match.group(3)!);
          final a = double.parse(match.group(4)!);
          return Color.fromARGB((a * 255).round(), r, g, b);
        }
      } catch (_) {}
    } else if (str.startsWith('rgb')) {
      try {
        final match = RegExp(r'rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)').firstMatch(str);
        if (match != null) {
          final r = int.parse(match.group(1)!);
          final g = int.parse(match.group(2)!);
          final b = int.parse(match.group(3)!);
          return Color.fromARGB(255, r, g, b);
        }
      } catch (_) {}
    }
    return parseHexColor(str, fallback: fallback);
  }

  static double? _toDouble(dynamic val) {
    if (val == null) return null;
    if (val is num) return val.toDouble();
    if (val is String) return double.tryParse(val);
    return null;
  }

  static double? _parseRadius(dynamic val) {
    if (val == null) return null;
    if (val is num) return val.toDouble();
    if (val is String) {
      final clean = val.replaceAll(RegExp(r'[a-zA-Z%]'), '');
      final parsed = double.tryParse(clean);
      if (parsed != null) {
        if (val.endsWith('rem')) return parsed * 16.0;
        return parsed;
      }
    }
    return null;
  }
}

class VideoBackground extends StatefulWidget {
  final String url;
  final double blur;
  final double overlayOpacity;

  const VideoBackground({
    super.key,
    required this.url,
    required this.blur,
    required this.overlayOpacity,
  });

  @override
  State<VideoBackground> createState() => _VideoBackgroundState();
}

class _VideoBackgroundState extends State<VideoBackground> {
  VideoPlayerController? _controller;
  bool _initialized = false;

  @override
  void initState() {
    super.initState();
    _initVideo();
  }

  @override
  void didUpdateWidget(VideoBackground oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.url != widget.url) {
      _initVideo();
    }
  }

  Future<void> _initVideo() async {
    await _controller?.dispose();
    final controller = VideoPlayerController.networkUrl(Uri.parse(widget.url));
    _controller = controller;
    try {
      await controller.initialize();
      if (!mounted) return;
      controller.setLooping(true);
      controller.setVolume(0.0); // mute background video
      controller.play();
      setState(() => _initialized = true);
    } catch (e) {
      debugPrint('[EXCEPTION] VideoBackground error: $e');
    }
  }

  @override
  void dispose() {
    _controller?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final controller = _controller;
    if (controller == null || !_initialized) {
      return const SizedBox.shrink();
    }

    return Stack(
      children: [
        Positioned.fill(
          child: FittedBox(
            fit: BoxFit.cover,
            child: SizedBox(
              width: controller.value.size.width,
              height: controller.value.size.height,
              child: VideoPlayer(controller),
            ),
          ),
        ),
        Positioned.fill(
          child: BackdropFilter(
            filter: ImageFilter.blur(sigmaX: widget.blur, sigmaY: widget.blur),
            child: Container(
              color: Colors.black.withOpacity(widget.overlayOpacity),
            ),
          ),
        ),
      ],
    );
  }
}

class DynamicBackground extends StatelessWidget {
  final ProfileThemeSettings theme;
  final String baseUrl;
  final Widget child;

  const DynamicBackground({
    super.key,
    required this.theme,
    required this.baseUrl,
    required this.child,
  });

  @override
  Widget build(BuildContext context) {
    final bgType = theme.bgType;
    final bgValue = theme.bgValue;
    final bgColor = theme.bgColor;
    final primary = theme.primaryColor;
    final accent = theme.accentColor;

    if (bgType == 'video' && bgValue.isNotEmpty) {
      final videoUrl = bgValue.startsWith('http') ? bgValue : '$baseUrl$bgValue';
      return Stack(
        children: [
          Positioned.fill(
            child: VideoBackground(
              url: videoUrl,
              blur: theme.bgBlur,
              overlayOpacity: theme.bgOverlayOpacity,
            ),
          ),
          child,
        ],
      );
    }

    if (bgType == 'image' && bgValue.isNotEmpty) {
      final imageUrl = bgValue.startsWith('http') ? bgValue : '$baseUrl$bgValue';
      return Stack(
        children: [
          Positioned.fill(
            child: Image.network(
              imageUrl,
              fit: BoxFit.cover,
              errorBuilder: (_, __, ___) => Container(color: bgColor),
            ),
          ),
          Positioned.fill(
            child: BackdropFilter(
              filter: ImageFilter.blur(sigmaX: theme.bgBlur, sigmaY: theme.bgBlur),
              child: Container(
                color: Colors.black.withOpacity(theme.bgOverlayOpacity),
              ),
            ),
          ),
          child,
        ],
      );
    }

    if (bgType == 'gradient') {
      return Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [primary, accent],
          ),
        ),
        child: child,
      );
    }

    // Default solid background
    return Container(
      color: bgColor,
      child: child,
    );
  }
}

class _ContactItem {
  final String label;
  final String val;
  final String url;

  _ContactItem({
    required this.label,
    required this.val,
    required this.url,
  });
}

extension IterableExtension<T> on Iterable<T> {
  T? firstWhereOrNull(bool Function(T element) test) {
    for (var element in this) {
      if (test(element)) return element;
    }
    return null;
  }
}

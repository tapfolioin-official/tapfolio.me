import 'dart:async';
import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:url_launcher/url_launcher.dart';
import '../models/profile.dart';
import '../services/api_service.dart';

/// Public-facing profile screen shown when an NFC card is tapped.
/// Completely visitor-oriented — no editing controls.
class PublicProfileScreen extends StatefulWidget {
  /// The username slug from the deep link (e.g. "nibras")
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

  late AnimationController _heroController;
  late Animation<double> _heroScale;
  late Animation<double> _heroFade;
  late AnimationController _cardController;
  late Animation<Offset> _cardSlide;

  @override
  void initState() {
    super.initState();
    _heroController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 800),
    );
    _heroScale = Tween<double>(begin: 0.7, end: 1.0).animate(
      CurvedAnimation(parent: _heroController, curve: Curves.elasticOut),
    );
    _heroFade = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _heroController,
        curve: const Interval(0.0, 0.6, curve: Curves.easeOut),
      ),
    );
    _cardController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 600),
    );
    _cardSlide = Tween<Offset>(
      begin: const Offset(0, 0.15),
      end: Offset.zero,
    ).animate(
      CurvedAnimation(parent: _cardController, curve: Curves.easeOutCubic),
    );

    _loadProfile();
  }

  @override
  void dispose() {
    _pollTimer?.cancel();
    _heroController.dispose();
    _cardController.dispose();
    super.dispose();
  }

  void _startPolling() {
    _pollTimer?.cancel();
    if (!_isLoggedIn || _isOwnProfile) return;
    _pollTimer = Timer.periodic(const Duration(seconds: 5), (timer) async {
      if (!mounted) {
        timer.cancel();
        return;
      }
      final result = await _api.lookupUser(widget.username);
      if (result != null && mounted) {
        final newStatus = result['connectionStatus'] as String?;
        if (newStatus != _connectionStatus) {
          setState(() {
            _connectionStatus = newStatus;
          });
          if (newStatus == 'accepted') {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                content: Text('✓ Connected! Your request was accepted.'),
                backgroundColor: Color(0xFF10b981),
              ),
            );
            timer.cancel();
          }
        }
      }
    });
  }

  Future<void> _loadProfile() async {
    setState(() {
      _loading = true;
      _error = null;
    });

    _isLoggedIn = _api.isAuthenticated;
    User? currentUser;
    if (_isLoggedIn) {
      currentUser = await _api.getMe();
      if (currentUser == null) {
        await _api.logout();
        _isLoggedIn = false;
      }
    }

    final result = await _api.lookupUser(widget.username);
    if (!mounted) return;

    if (result == null) {
      setState(() {
        _loading = false;
        _error = 'not_found';
      });
      return;
    }

    final profileData = result['profile'] as Map<String, dynamic>?;
    final int? targetUserId = profileData?['userId'] as int?;

    setState(() {
      _rawProfile = profileData;
      _connectionStatus = result['connectionStatus'] as String?;
      _isOwnProfile = currentUser != null && targetUserId != null && currentUser.id == targetUserId;
      _loading = false;
    });

    _heroController.forward();
    Future.delayed(const Duration(milliseconds: 200), () {
      if (mounted) _cardController.forward();
    });

    if (_connectionStatus == 'pending') {
      _startPolling();
    }
  }

  Future<void> _handleConnect() async {
    if (!_isLoggedIn) {
      _showLoginRequiredDialog();
      return;
    }

    // Verify session is active before sending connection request
    final currentUser = await _api.getMe();
    if (currentUser == null) {
      await _api.logout();
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('✓ Session expired. Please log in again.'),
            backgroundColor: Colors.redAccent,
          ),
        );
        Navigator.pushNamedAndRemoveUntil(context, '/login', (r) => false);
      }
      return;
    }

    setState(() => _sending = true);

    final result = await _api.sendConnectionRequest(widget.username, via: 'nfc');
    if (!mounted) return;

    setState(() => _sending = false);

    if (result['success'] == true) {
      setState(() {
        _sent = true;
        _connectionStatus = 'pending';
      });
      _startPolling();
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('✓ Connection request sent'),
          backgroundColor: Color(0xFF10b981),
        ),
      );
    } else {
      final status = result['status'] as String?;
      final statusCode = result['statusCode'] as int?;
      final error = result['error'] as String? ?? 'Failed to send request';

      if (statusCode == 401 || error.contains('authenticated') || error.contains('token')) {
        await _api.logout();
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('✓ Session expired'),
            backgroundColor: Colors.redAccent,
          ),
        );
        Navigator.pushNamedAndRemoveUntil(context, '/login', (r) => false);
        return;
      }

      if (error == 'Internet unavailable') {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('✓ Internet unavailable'),
            backgroundColor: Colors.redAccent,
          ),
        );
        return;
      }

      if (statusCode == 500 || error.contains('500') || error.contains('Server')) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('✓ Server unavailable'),
            backgroundColor: Colors.redAccent,
          ),
        );
        return;
      }

      if (status == 'accepted') {
        setState(() => _connectionStatus = 'accepted');
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('✓ Already connected'),
            backgroundColor: Color(0xFF10b981),
          ),
        );
      } else if (status == 'pending') {
        setState(() => _connectionStatus = 'pending');
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('✓ Request already pending'),
            backgroundColor: Color(0xFFf59e0b),
          ),
        );
      } else if (status == 'blocked' || statusCode == 403) {
        setState(() => _connectionStatus = 'blocked');
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('✓ User unavailable'),
            backgroundColor: Colors.redAccent,
          ),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed: $error'),
            backgroundColor: Colors.redAccent,
          ),
        );
      }
    }
  }

  void _showLoginRequiredDialog() {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: const Color(0xFF161824),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: Text('Sign in to Connect',
            style: GoogleFonts.outfit(
                color: Colors.white, fontWeight: FontWeight.bold)),
        content: Text(
          'Create a free Tapfolio account to send a connection request.',
          style: GoogleFonts.outfit(color: Colors.white70, fontSize: 14),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: Text('Cancel',
                style: GoogleFonts.outfit(color: Colors.white38)),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF6366f1),
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(10)),
            ),
            onPressed: () {
              Navigator.pop(ctx);
              Navigator.pushNamedAndRemoveUntil(
                  context, '/login', (r) => false);
            },
            child: Text('Sign In',
                style: GoogleFonts.outfit(
                    color: Colors.white, fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF080810),
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, color: Colors.white70),
          onPressed: () {
            if (Navigator.canPop(context)) {
              Navigator.pop(context);
            } else {
              Navigator.pushReplacementNamed(context, '/');
            }
          },
        ),
        systemOverlayStyle: SystemUiOverlayStyle.light,
      ),
      body: _loading
          ? _buildSkeleton()
          : _error != null
              ? _buildError()
              : _buildProfile(),
    );
  }

  Widget _buildSkeleton() {
    return SingleChildScrollView(
      child: Column(
        children: [
          _buildGradientHeader(child: _shimmerCircle(120)),
          const SizedBox(height: 24),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24),
            child: Column(
              children: [
                _shimmerRect(200, 28),
                const SizedBox(height: 12),
                _shimmerRect(140, 18),
                const SizedBox(height: 32),
                _shimmerRect(double.infinity, 120),
                const SizedBox(height: 16),
                _shimmerRect(double.infinity, 56),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _shimmerRect(double width, double height) {
    return Container(
      width: width,
      height: height,
      margin: const EdgeInsets.symmetric(vertical: 6),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.07),
        borderRadius: BorderRadius.circular(12),
      ),
    );
  }

  Widget _shimmerCircle(double size) {
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        color: Colors.white.withValues(alpha: 0.12),
      ),
    );
  }

  Widget _buildError() {
    final isNotFound = _error == 'not_found';
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              isNotFound
                  ? Icons.person_search_outlined
                  : Icons.wifi_off_rounded,
              size: 80,
              color: Colors.white24,
            ),
            const SizedBox(height: 24),
            Text(
              isNotFound ? 'Profile Not Found' : 'Connection Error',
              style: GoogleFonts.outfit(
                  color: Colors.white,
                  fontSize: 22,
                  fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),
            Text(
              isNotFound
                  ? '@${widget.username} doesn\'t exist or has been removed.'
                  : 'Check your connection and try again.',
              textAlign: TextAlign.center,
              style: GoogleFonts.outfit(color: Colors.white54, fontSize: 15),
            ),
            const SizedBox(height: 32),
            ElevatedButton.icon(
              onPressed: _loadProfile,
              icon: const Icon(Icons.refresh),
              label: Text('Retry', style: GoogleFonts.outfit()),
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF6366f1),
                foregroundColor: Colors.white,
                padding:
                    const EdgeInsets.symmetric(horizontal: 32, vertical: 14),
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(14)),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildProfile() {
    final p = _rawProfile!;
    final name = p['name'] as String? ?? '';
    final tagline = p['tagline'] as String? ?? '';
    final bio = p['bio'] as String? ?? '';
    final location = p['location'] as String? ?? '';
    final avatarRaw = p['avatar'] as String? ?? '';
    final avatarUrl = avatarRaw.startsWith('http')
        ? avatarRaw
        : 'https://www.tapfolio.me$avatarRaw';

    final tags = ((p['tags'] as List?) ?? [])
        .map((t) => Tag.fromJson(t as Map<String, dynamic>))
        .toList();
    final socials = ((p['socials'] as List?) ?? [])
        .map((s) => SocialLink.fromJson(s as Map<String, dynamic>))
        .toList();

    return Stack(
      children: [
        SingleChildScrollView(
          padding: const EdgeInsets.only(bottom: 120),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildHeroHeader(
                  name: name,
                  tagline: tagline,
                  location: location,
                  avatarUrl: avatarUrl),
              SlideTransition(
                position: _cardSlide,
                child: FadeTransition(
                  opacity: _cardController,
                  child: Padding(
                    padding: const EdgeInsets.all(20),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        if (tags.isNotEmpty) ...[
                          _buildSection(
                            icon: Icons.label_outline,
                            title: 'SKILLS & ROLES',
                            child: Wrap(
                              spacing: 8,
                              runSpacing: 8,
                              children: tags.map(_buildTag).toList(),
                            ),
                          ),
                          const SizedBox(height: 20),
                        ],
                        if (bio.isNotEmpty) ...[
                          _buildSection(
                            icon: Icons.info_outline,
                            title: 'ABOUT',
                            child: Text(
                              bio,
                              style: GoogleFonts.outfit(
                                color: Colors.white70,
                                fontSize: 15,
                                height: 1.65,
                              ),
                            ),
                          ),
                          const SizedBox(height: 20),
                        ],
                        if (socials.isNotEmpty)
                          _buildSection(
                            icon: Icons.link,
                            title: 'LINKS',
                            child: Column(
                              children: socials.map(_buildSocialRow).toList(),
                            ),
                          ),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
        Positioned(
          bottom: 0,
          left: 0,
          right: 0,
          child: _buildConnectBar(name),
        ),
      ],
    );
  }

  Widget _buildHeroHeader({
    required String name,
    required String tagline,
    required String location,
    required String avatarUrl,
  }) {
    return _buildGradientHeader(
      child: Column(
        children: [
          ScaleTransition(
            scale: _heroScale,
            child: FadeTransition(
              opacity: _heroFade,
              child: Container(
                width: 120,
                height: 120,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  gradient: const LinearGradient(
                    colors: [
                      Color(0xFF6366f1),
                      Color(0xFF818cf8),
                      Color(0xFFa78bfa)
                    ],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: const Color(0xFF6366f1).withValues(alpha: 0.5),
                      blurRadius: 40,
                      spreadRadius: 4,
                    ),
                  ],
                ),
                padding: const EdgeInsets.all(3),
                child: CircleAvatar(
                  radius: 57,
                  backgroundColor: const Color(0xFF141420),
                  backgroundImage: NetworkImage(avatarUrl),
                  onBackgroundImageError: (_, _) {},
                ),
              ),
            ),
          ),
          const SizedBox(height: 20),
          FadeTransition(
            opacity: _heroFade,
            child: Text(
              name,
              textAlign: TextAlign.center,
              style: GoogleFonts.outfit(
                color: Colors.white,
                fontSize: 30,
                fontWeight: FontWeight.bold,
                letterSpacing: -0.5,
              ),
            ),
          ),
          if (tagline.isNotEmpty) ...[
            const SizedBox(height: 6),
            FadeTransition(
              opacity: _heroFade,
              child: Text(
                tagline,
                textAlign: TextAlign.center,
                style: GoogleFonts.outfit(
                  color: Colors.white60,
                  fontSize: 16,
                  fontStyle: FontStyle.italic,
                ),
              ),
            ),
          ],
          if (location.isNotEmpty) ...[
            const SizedBox(height: 12),
            FadeTransition(
              opacity: _heroFade,
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.location_on,
                      size: 14, color: Color(0xFF818cf8)),
                  const SizedBox(width: 4),
                  Text(
                    location,
                    style: GoogleFonts.outfit(
                      color: const Color(0xFF818cf8),
                      fontSize: 13,
                    ),
                  ),
                ],
              ),
            ),
          ],
          const SizedBox(height: 8),
        ],
      ),
    );
  }

  Widget _buildGradientHeader({required Widget child}) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.fromLTRB(24, 100, 24, 32),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [
            const Color(0xFF6366f1).withValues(alpha: 0.25),
            Colors.transparent,
          ],
        ),
      ),
      child: Column(children: [child]),
    );
  }

  Widget _buildSection({
    required IconData icon,
    required String title,
    required Widget child,
  }) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(20),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 12, sigmaY: 12),
        child: Container(
          width: double.infinity,
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: Colors.white.withValues(alpha: 0.04),
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: Colors.white.withValues(alpha: 0.07)),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Icon(icon, color: const Color(0xFF818cf8), size: 16),
                  const SizedBox(width: 8),
                  Text(
                    title,
                    style: GoogleFonts.outfit(
                      color: Colors.white38,
                      fontSize: 11,
                      fontWeight: FontWeight.w700,
                      letterSpacing: 1.2,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              child,
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildTag(Tag tag) {
    final isLocation = tag.type == 'location';
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
      decoration: BoxDecoration(
        color: isLocation
            ? const Color(0xFF10b981).withValues(alpha: 0.12)
            : const Color(0xFF6366f1).withValues(alpha: 0.12),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: isLocation
              ? const Color(0xFF10b981).withValues(alpha: 0.3)
              : const Color(0xFF6366f1).withValues(alpha: 0.3),
        ),
      ),
      child: Text(
        '${isLocation ? '📍 ' : '⚙️ '}${tag.text}',
        style: GoogleFonts.outfit(
            color: Colors.white70, fontSize: 13, fontWeight: FontWeight.w500),
      ),
    );
  }

  Widget _buildSocialRow(SocialLink social) {
    Color platformColor;
    try {
      platformColor =
          Color(int.parse(social.color.replaceFirst('#', '0xFF')));
    } catch (_) {
      platformColor = const Color(0xFF6366f1);
    }

    return GestureDetector(
      onTap: () async {
        final uri = Uri.parse(social.url);
        if (await canLaunchUrl(uri)) {
          await launchUrl(uri, mode: LaunchMode.externalApplication);
        }
      },
      child: Container(
        margin: const EdgeInsets.only(bottom: 10),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        decoration: BoxDecoration(
          color: platformColor.withValues(alpha: 0.07),
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: platformColor.withValues(alpha: 0.25)),
        ),
        child: Row(
          children: [
            _buildSocialIcon(social.icon, platformColor),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    social.platform,
                    style: GoogleFonts.outfit(
                      color: Colors.white,
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  if (social.handle.isNotEmpty)
                    Text(
                      social.handle,
                      style:
                          GoogleFonts.outfit(color: Colors.white38, fontSize: 12),
                    ),
                ],
              ),
            ),
            Icon(Icons.open_in_new, color: platformColor, size: 18),
          ],
        ),
      ),
    );
  }

  Widget _buildSocialIcon(String iconName, Color color) {
    const double size = 22;
    switch (iconName) {
      case 'github':
        return FaIcon(FontAwesomeIcons.github, color: color, size: size);
      case 'linkedin':
        return FaIcon(FontAwesomeIcons.linkedin, color: color, size: size);
      case 'twitter':
        return FaIcon(FontAwesomeIcons.xTwitter, color: color, size: size);
      case 'instagram':
        return FaIcon(FontAwesomeIcons.instagram, color: color, size: size);
      case 'youtube':
        return FaIcon(FontAwesomeIcons.youtube, color: color, size: size);
      case 'telegram':
        return FaIcon(FontAwesomeIcons.telegram, color: color, size: size);
      case 'whatsapp':
        return FaIcon(FontAwesomeIcons.whatsapp, color: color, size: size);
      case 'behance':
        return FaIcon(FontAwesomeIcons.behance, color: color, size: size);
      case 'globe':
        return Icon(Icons.language, color: color, size: size);
      default:
        return Icon(Icons.link, color: color, size: size);
    }
  }

  Widget _buildConnectBar(String name) {
    if (_isOwnProfile) {
      return const SizedBox.shrink();
    }
    return ClipRect(
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 20, sigmaY: 20),
        child: Container(
          padding: const EdgeInsets.fromLTRB(20, 16, 20, 32),
          decoration: BoxDecoration(
            color: const Color(0xFF080810).withValues(alpha: 0.85),
            border:
                Border(top: BorderSide(color: Colors.white.withValues(alpha: 0.07))),
          ),
          child: _buildConnectButton(name),
        ),
      ),
    );
  }

  Widget _buildConnectButton(String name) {
    if (_connectionStatus == 'accepted') {
      return _statusChip(
          Icons.check_circle_outline, 'Already Connected', const Color(0xFF10b981));
    }
    if (_connectionStatus == 'pending' || _sent) {
      return _statusChip(
          Icons.hourglass_top_rounded, 'Request Pending', const Color(0xFFf59e0b));
    }
    if (_connectionStatus == 'blocked') {
      return _statusChip(Icons.block, 'Blocked', Colors.redAccent);
    }

    return SizedBox(
      width: double.infinity,
      height: 56,
      child: ElevatedButton(
        onPressed: _sending ? null : _handleConnect,
        style: ElevatedButton.styleFrom(
          backgroundColor: const Color(0xFF6366f1),
          foregroundColor: Colors.white,
          elevation: 0,
          shape:
              RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        ),
        child: _sending
            ? const SizedBox(
                width: 22,
                height: 22,
                child: CircularProgressIndicator(
                    color: Colors.white, strokeWidth: 2.5))
            : Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.person_add_alt_1, size: 22),
                  const SizedBox(width: 10),
                  Text(
                    'Connect with $name',
                    style: GoogleFonts.outfit(
                        fontSize: 17, fontWeight: FontWeight.bold),
                  ),
                ],
              ),
      ),
    );
  }

  Widget _statusChip(IconData icon, String label, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.12),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: color.withValues(alpha: 0.35)),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(icon, color: color, size: 22),
          const SizedBox(width: 10),
          Text(label,
              style: GoogleFonts.outfit(
                  color: color,
                  fontWeight: FontWeight.w600,
                  fontSize: 16)),
        ],
      ),
    );
  }
}

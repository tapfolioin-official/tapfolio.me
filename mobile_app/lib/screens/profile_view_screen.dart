import 'dart:async';
import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../models/profile.dart';
import '../models/profile_theme.dart';
import '../core/utils/color_parser.dart';
import '../core/utils/image_helper.dart';
import '../services/api_service.dart';

class ProfileViewScreen extends StatefulWidget {
  final int? userId;

  const ProfileViewScreen({super.key, this.userId});

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

  bool get _isLight => Theme.of(context).brightness == Brightness.light;
  Color get _textColor => _isLight ? const Color(0xFF1F2937) : Colors.white;
  Color get _subtitleColor => _isLight ? const Color(0xFF4B5563) : Colors.white60;
  Color get _cardBg => _isLight ? Colors.white : Colors.white.withValues(alpha: 0.04);
  Color get _cardBorder => _isLight ? Colors.black12 : Colors.white.withValues(alpha: 0.08);

  _ProfileViewScreenState() {
    debugPrint('[TRACE-PROFILEVIEW] State constructor called.');
  }

  @override
  void initState() {
    debugPrint('[TRACE-PROFILEVIEW] initState() started.');
    super.initState();
    _userId = widget.userId;
    if (_userId != null) {
      _loadProfile(_userId!);
    }
    debugPrint('[TRACE-PROFILEVIEW] initState() completed.');
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  Future<void> _loadProfile(int userId) async {
    setState(() {
      _loading = true;
      _error = null;
      _profile = null;
      _connected = false;
      _connectionStatus = null;
    });

    final res = await _apiService.getProfile(userId: userId);

    if (!mounted) return;

    if (res != null) {
      setState(() {
        _profile = res['profile'];
        _connectionStatus = res['connectionStatus'];
        _connected = _connectionStatus == 'accepted';
      });
    } else {
      setState(() {
        _error = 'Profile not found. Make sure user ID is correct.';
      });
    }

    setState(() {
      _loading = false;
    });
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
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(res['error'] ?? 'Failed to connect'), backgroundColor: Colors.redAccent),
      );
    }
  }

  Widget _buildGlassCard({required List<Widget> children, ProfileThemeSettings? theme}) {
    final customBorderRadius = theme != null ? BorderRadius.circular(theme.cardBorderRadius) : BorderRadius.circular(24);
    final customCardBg = theme != null ? theme.surfaceColor.withValues(alpha: theme.cardOpacity) : _cardBg;
    final customBorderColor = theme != null ? theme.borderColor : _cardBorder;

    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: customCardBg,
        borderRadius: customBorderRadius,
        border: Border.all(color: customBorderColor),
      ),
      child: Column(
        children: children,
      ),
    );
  }

  Widget _buildAvatar(ProfileThemeSettings? theme) {
    final avatarImage = getAvatarImage(_profile!.avatar, _apiService.baseUrl);

    Widget shapedAvatar;
    if (theme != null && theme.avatarShape == 'rounded') {
      shapedAvatar = ClipRRect(
        borderRadius: BorderRadius.circular(16),
        child: Container(
          width: 100,
          height: 100,
          decoration: BoxDecoration(
            image: DecorationImage(
              image: avatarImage,
              fit: BoxFit.cover,
            ),
          ),
        ),
      );
    } else if (theme != null && theme.avatarShape == 'square') {
      shapedAvatar = ClipRRect(
        borderRadius: BorderRadius.zero,
        child: Container(
          width: 100,
          height: 100,
          decoration: BoxDecoration(
            image: DecorationImage(
              image: avatarImage,
              fit: BoxFit.cover,
            ),
          ),
        ),
      );
    } else {
      shapedAvatar = CircleAvatar(
        radius: 50,
        backgroundImage: avatarImage,
      );
    }

    if (theme != null && theme.avatarGlow) {
      return Container(
        decoration: BoxDecoration(
          shape: theme.avatarShape == 'circle' ? BoxShape.circle : BoxShape.rectangle,
          borderRadius: theme.avatarShape != 'circle' ? BorderRadius.circular(16) : null,
          boxShadow: [
            BoxShadow(
              color: theme.primaryColor.withValues(alpha: 0.5),
              blurRadius: 16,
              spreadRadius: 2,
            ),
          ],
        ),
        child: shapedAvatar,
      );
    }

    return shapedAvatar;
  }

  Widget _buildBackground({required ProfileThemeSettings theme, required Widget child}) {
    final bgType = theme.bgType;
    final bgValue = theme.bgValue;
    final primary = theme.primaryColor;
    final accent = theme.accentColor;

    if (bgType == 'image' && bgValue.isNotEmpty) {
      final imageUrl = bgValue.startsWith('http') ? bgValue : '${_apiService.baseUrl}$bgValue';
      return Stack(
        children: [
          Positioned.fill(
            child: Image.network(
              imageUrl,
              fit: BoxFit.cover,
              errorBuilder: (_, __, ___) => Container(color: theme.bgColor),
            ),
          ),
          Positioned.fill(
            child: BackdropFilter(
              filter: ImageFilter.blur(sigmaX: theme.bgBlur, sigmaY: theme.bgBlur),
              child: Container(
                color: Colors.black.withValues(alpha: theme.bgOverlayOpacity),
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

    return Container(
      color: theme.bgColor,
      child: child,
    );
  }

  @override
  Widget build(BuildContext context) {
    debugPrint('[TRACE-PROFILEVIEW] build() called.');
    final customTheme = _profile?.theme != null ? ProfileThemeSettings.fromJson(_profile!.theme) : null;
    
    final scaffoldBg = customTheme == null 
        ? (_isLight ? const Color(0xFFF3F4F6) : const Color(0xFF06070D))
        : Colors.transparent;

    final textColor = customTheme?.textColor ?? _textColor;
    final subtitleColor = customTheme?.mutedTextColor ?? _subtitleColor;
    final cardBorder = customTheme?.borderColor ?? _cardBorder;

    Widget mainContent;

    if (_loading) {
      mainContent = const Center(child: CircularProgressIndicator(color: Color(0xFF0052FF)));
    } else if (_error != null) {
      mainContent = Center(child: Text(_error!, style: const TextStyle(color: Colors.redAccent)));
    } else if (_profile == null && widget.userId == null) {
      mainContent = Center(
        child: Padding(
          padding: const EdgeInsets.only(top: 40.0, left: 24, right: 24),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.nfc_outlined, size: 80, color: _subtitleColor.withValues(alpha: 0.25)),
              const SizedBox(height: 16),
              Text(
                'Search a user above, or tap a user in the Leaderboard to view their card.',
                style: GoogleFonts.outfit(color: _subtitleColor, fontSize: 14),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      );
    } else if (_profile != null) {
      final btnBg = _connectionStatus == 'accepted'
          ? const Color(0xFF10B981)
          : _connectionStatus == 'pending'
              ? const Color(0xFFf59e0b)
              : (customTheme?.primaryColor ?? const Color(0xFF0052FF));

      mainContent = SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            _buildGlassCard(
              theme: customTheme,
              children: [
                // Header (Avatar, name, tagline)
                _buildAvatar(customTheme),
                const SizedBox(height: 16),
                Text(
                  _profile!.name,
                  style: GoogleFonts.outfit(color: textColor, fontSize: 24, fontWeight: FontWeight.bold),
                ),
                if (_profile!.tagline.isNotEmpty) ...[
                  const SizedBox(height: 4),
                  Text(
                    _profile!.tagline,
                    style: GoogleFonts.outfit(color: subtitleColor, fontSize: 15),
                    textAlign: TextAlign.center,
                  ),
                ],
                const SizedBox(height: 24),

                // Connect button & Tap stats
                SizedBox(
                  width: double.infinity,
                  height: 50,
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: btnBg,
                      shape: RoundedRectangleBorder(
                        borderRadius: customTheme != null
                            ? BorderRadius.circular(customTheme.cardBorderRadius * 0.75)
                            : BorderRadius.circular(12),
                      ),
                      elevation: 0,
                    ),
                    onPressed: _connecting || _connectionStatus == 'accepted' || _connectionStatus == 'pending' || _connectionStatus == 'blocked'
                        ? null
                        : _handleConnect,
                    child: _connecting
                        ? const CircularProgressIndicator(color: Colors.white)
                        : Text(
                            _connectionStatus == 'accepted'
                                ? '✓ Connected!'
                                : _connectionStatus == 'pending'
                                    ? 'Pending Acceptance...'
                                    : _connectionStatus == 'blocked'
                                        ? 'Blocked'
                                        : 'Connect with me',
                            style: GoogleFonts.outfit(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white),
                          ),
                  ),
                ),
                const SizedBox(height: 10),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(Icons.bolt, color: Colors.teal, size: 16),
                    const SizedBox(width: 4),
                    Text(
                      '${_profile!.tapCount} total connections',
                      style: GoogleFonts.outfit(color: subtitleColor, fontSize: 13),
                    ),
                  ],
                ),
                const SizedBox(height: 20),

                // Quote
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                  decoration: BoxDecoration(
                    color: customTheme != null
                        ? customTheme.surfaceColor.withValues(alpha: 0.1)
                        : (_isLight ? const Color(0xFFF9FAFB) : Colors.white.withValues(alpha: 0.02)),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    '“Design is not just what it looks like, it’s how it connects.”',
                    style: GoogleFonts.outfit(color: subtitleColor.withValues(alpha: 0.7), fontSize: 12, fontStyle: FontStyle.italic),
                    textAlign: TextAlign.center,
                  ),
                ),
                const SizedBox(height: 24),

                // About section
                if (_profile!.bio.isNotEmpty) ...[
                  Align(
                    alignment: Alignment.centerLeft,
                    child: Text(
                      'About',
                      style: GoogleFonts.outfit(color: textColor, fontSize: 16, fontWeight: FontWeight.bold),
                    ),
                  ),
                  const SizedBox(height: 8),
                  Align(
                    alignment: Alignment.centerLeft,
                    child: Text(
                      _profile!.bio,
                      style: GoogleFonts.outfit(color: subtitleColor, fontSize: 14, height: 1.4),
                    ),
                  ),
                  const SizedBox(height: 20),
                ],

                // Tags section
                if (_profile!.tags.isNotEmpty) ...[
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    alignment: WrapAlignment.center,
                    children: _profile!.tags.map((t) {
                      final isLoc = t.type == 'location';
                      return Chip(
                        backgroundColor: customTheme != null
                            ? customTheme.surfaceColor.withValues(alpha: 0.15)
                            : (_isLight ? const Color(0xFFF3F4F6) : Colors.white.withValues(alpha: 0.05)),
                        side: BorderSide(color: cardBorder),
                        avatar: Text(isLoc ? '📍' : '⚙️'),
                        label: Text(
                          t.text,
                          style: GoogleFonts.outfit(color: textColor, fontSize: 12),
                        ),
                      );
                    }).toList(),
                  ),
                  const SizedBox(height: 20),
                ],

                // Social Links section
                if (_profile!.socials.isNotEmpty) ...[
                  Align(
                    alignment: Alignment.centerLeft,
                    child: Text(
                      'Links',
                      style: GoogleFonts.outfit(color: textColor, fontSize: 16, fontWeight: FontWeight.bold),
                    ),
                  ),
                  const SizedBox(height: 12),
                  ..._profile!.socials.map((link) {
                    final cardColor = parseHexColor(link.color);
                    return Container(
                      margin: const EdgeInsets.only(bottom: 12),
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: customTheme != null
                            ? customTheme.surfaceColor.withValues(alpha: 0.1)
                            : (_isLight ? const Color(0xFFF9FAFB) : Colors.white.withValues(alpha: 0.02)),
                        borderRadius: customTheme != null
                            ? BorderRadius.circular(customTheme.cardBorderRadius * 0.75)
                            : BorderRadius.circular(12),
                        border: Border.all(color: cardColor.withValues(alpha: 0.3)),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                link.platform,
                                style: GoogleFonts.outfit(color: textColor, fontWeight: FontWeight.bold),
                              ),
                              Text(
                                link.handle,
                                style: GoogleFonts.outfit(color: subtitleColor, fontSize: 12),
                              ),
                            ],
                          ),
                          Icon(Icons.open_in_new, color: cardColor, size: 20),
                        ],
                      ),
                    );
                  }),
                ],
              ],
            ),
          ],
        ),
      );
    } else {
      mainContent = const SizedBox.shrink();
    }

    Widget rootWidget = mainContent;

    if (customTheme != null) {
      rootWidget = _buildBackground(theme: customTheme, child: mainContent);
    }

    if (widget.userId == null) {
      return Column(
        children: [
          // Search UI (only if not loaded directly)
          Container(
            margin: const EdgeInsets.only(bottom: 24, left: 16, right: 16, top: 16),
            decoration: BoxDecoration(
              color: _isLight ? const Color(0xFFF9FAFB) : Colors.white.withValues(alpha: 0.04),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: _cardBorder),
            ),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _searchController,
                    keyboardType: TextInputType.number,
                    style: GoogleFonts.outfit(color: _textColor),
                    decoration: InputDecoration(
                      hintText: 'Enter User ID to view profile',
                      hintStyle: TextStyle(color: _subtitleColor.withValues(alpha: 0.5)),
                      border: InputBorder.none,
                      contentPadding: const EdgeInsets.symmetric(horizontal: 16),
                    ),
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.search, color: Color(0xFF0052FF)),
                  onPressed: () {
                    final val = int.tryParse(_searchController.text.trim());
                    if (val != null) {
                      _loadProfile(val);
                    } else {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Please enter a valid numeric ID')),
                      );
                    }
                  },
                ),
              ],
            ),
          ),
          Expanded(child: rootWidget),
        ],
      );
    }

    return Scaffold(
      backgroundColor: scaffoldBg,
      appBar: AppBar(
        backgroundColor: customTheme != null ? Colors.transparent : (_isLight ? Colors.white : const Color(0xFF0F1122)),
        elevation: 0,
        title: Text(
          _profile?.name ?? 'Profile View',
          style: GoogleFonts.outfit(
            fontWeight: FontWeight.bold,
            color: textColor,
          ),
        ),
        iconTheme: IconThemeData(color: textColor),
      ),
      extendBodyBehindAppBar: customTheme != null,
      body: SafeArea(
        top: customTheme == null,
        child: rootWidget,
      ),
    );
  }
}

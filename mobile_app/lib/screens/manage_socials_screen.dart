import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import '../models/profile.dart';
import '../models/social_link.dart';
import '../services/api_service.dart';

class ManageSocialsScreen extends StatefulWidget {
  final Profile? initialProfile;
  const ManageSocialsScreen({super.key, this.initialProfile});

  @override
  State<ManageSocialsScreen> createState() => _ManageSocialsScreenState();
}

class _ManageSocialsScreenState extends State<ManageSocialsScreen> {
  final ApiService _apiService = ApiService();

  final _handleController = TextEditingController();
  final _urlController = TextEditingController();

  Profile? _profile;
  bool _saving = false;
  String _selectedPlatform = 'GitHub';

  bool get _isLight => Theme.of(context).brightness == Brightness.light;
  Color get _textColor => _isLight ? const Color(0xFF0F172A) : Colors.white;
  Color get _subtitleColor => _isLight ? const Color(0xFF64748B) : const Color(0xFF94A3B8);
  Color get _cardBg => _isLight ? Colors.white : const Color(0xFF131622);
  Color get _cardBorder => _isLight ? const Color(0xFFE2E8F0) : const Color(0xFF1E2235);
  Color get _inputBg => _isLight ? Colors.white : const Color(0xFF181B2C);

  static final Map<String, _PlatformConfig> _platforms = {
    'Instagram': _PlatformConfig(
      name: 'Instagram',
      icon: FontAwesomeIcons.instagram,
      color: const Color(0xFFE1306C),
      urlPrefix: 'https://instagram.com/',
      placeholder: 'e.g. nibras',
    ),
    'LinkedIn': _PlatformConfig(
      name: 'LinkedIn',
      icon: FontAwesomeIcons.linkedin,
      color: const Color(0xFF0A66C2),
      urlPrefix: 'https://linkedin.com/in/',
      placeholder: 'e.g. nibras',
    ),
    'Facebook': _PlatformConfig(
      name: 'Facebook',
      icon: FontAwesomeIcons.facebook,
      color: const Color(0xFF1877F2),
      urlPrefix: 'https://facebook.com/',
      placeholder: 'e.g. nibras',
    ),
    'GitHub': _PlatformConfig(
      name: 'GitHub',
      icon: FontAwesomeIcons.github,
      color: const Color(0xFF24292E),
      urlPrefix: 'https://github.com/',
      placeholder: 'e.g. nibras',
    ),
    'Google Pay': _PlatformConfig(
      name: 'Google Pay',
      icon: FontAwesomeIcons.googlePay,
      color: const Color(0xFF1A73E8),
      urlPrefix: 'upi://pay?pa=',
      placeholder: 'e.g. user@okaxis',
    ),
    'X (Twitter)': _PlatformConfig(
      name: 'X (Twitter)',
      icon: FontAwesomeIcons.xTwitter,
      color: const Color(0xFF000000),
      urlPrefix: 'https://x.com/',
      placeholder: 'e.g. nibras_dev',
    ),
    'YouTube': _PlatformConfig(
      name: 'YouTube',
      icon: FontAwesomeIcons.youtube,
      color: const Color(0xFFFF0000),
      urlPrefix: 'https://youtube.com/@',
      placeholder: 'e.g. channelname',
    ),
    'WhatsApp': _PlatformConfig(
      name: 'WhatsApp',
      icon: FontAwesomeIcons.whatsapp,
      color: const Color(0xFF25D366),
      urlPrefix: 'https://wa.me/',
      placeholder: 'e.g. 1234567890',
    ),
    'Telegram': _PlatformConfig(
      name: 'Telegram',
      icon: FontAwesomeIcons.telegram,
      color: const Color(0xFF26A5E4),
      urlPrefix: 'https://t.me/',
      placeholder: 'e.g. username',
    ),
    'TikTok': _PlatformConfig(
      name: 'TikTok',
      icon: FontAwesomeIcons.tiktok,
      color: const Color(0xFF000000),
      urlPrefix: 'https://tiktok.com/@',
      placeholder: 'e.g. username',
    ),
    'Discord': _PlatformConfig(
      name: 'Discord',
      icon: FontAwesomeIcons.discord,
      color: const Color(0xFF5865F2),
      urlPrefix: 'https://discord.gg/',
      placeholder: 'e.g. servercode',
    ),
    'Spotify': _PlatformConfig(
      name: 'Spotify',
      icon: FontAwesomeIcons.spotify,
      color: const Color(0xFF1DB954),
      urlPrefix: 'https://open.spotify.com/user/',
      placeholder: 'e.g. username',
    ),
    'Behance': _PlatformConfig(
      name: 'Behance',
      icon: FontAwesomeIcons.behance,
      color: const Color(0xFF1769FF),
      urlPrefix: 'https://behance.net/',
      placeholder: 'e.g. username',
    ),
    'Dribbble': _PlatformConfig(
      name: 'Dribbble',
      icon: FontAwesomeIcons.dribbble,
      color: const Color(0xFFEA4C89),
      urlPrefix: 'https://dribbble.com/',
      placeholder: 'e.g. username',
    ),
    'Website': _PlatformConfig(
      name: 'Website',
      icon: FontAwesomeIcons.globe,
      color: const Color(0xFF10B981),
      urlPrefix: 'https://',
      placeholder: 'e.g. myportfolio.com',
    ),
    'Email': _PlatformConfig(
      name: 'Email',
      icon: FontAwesomeIcons.envelope,
      color: const Color(0xFFEA4335),
      urlPrefix: 'mailto:',
      placeholder: 'e.g. hello@domain.com',
    ),
  };

  @override
  void initState() {
    super.initState();
    _profile = widget.initialProfile;
    _fetchProfile();
  }

  @override
  void dispose() {
    _handleController.dispose();
    _urlController.dispose();
    super.dispose();
  }

  Future<void> _fetchProfile() async {
    try {
      final res = await _apiService.getProfile();
      if (res != null && res['profile'] != null) {
        if (mounted) {
          setState(() {
            _profile = res['profile'] is Profile
                ? res['profile'] as Profile
                : Profile.fromJson(res['profile'] as Map<String, dynamic>?);
          });
        }
      }
    } catch (e) {
      debugPrint('[MANAGE-SOCIALS] Fetch error: $e');
    }
  }

  void _onHandleChanged(String val) {
    final cleanVal = val.trim();
    if (cleanVal.isEmpty) {
      _urlController.clear();
      return;
    }

    final config = _platforms[_selectedPlatform];
    if (config != null) {
      final sanitizedHandle = cleanVal.startsWith('@') ? cleanVal.substring(1) : cleanVal;
      setState(() {
        _urlController.text = '${config.urlPrefix}$sanitizedHandle';
      });
    }
  }

  void _onPlatformSelected(String platform) {
    setState(() {
      _selectedPlatform = platform;
    });
    if (_handleController.text.trim().isNotEmpty) {
      _onHandleChanged(_handleController.text);
    }
  }

  Future<void> _addSocial() async {
    final handle = _handleController.text.trim();
    var url = _urlController.text.trim();
    if (handle.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter a handle or username.')),
      );
      return;
    }

    if (url.isEmpty) {
      final config = _platforms[_selectedPlatform];
      final sanitizedHandle = handle.startsWith('@') ? handle.substring(1) : handle;
      url = '${config?.urlPrefix ?? 'https://'}$sanitizedHandle';
    }

    if (!url.startsWith('http') && !url.startsWith('mailto:') && !url.startsWith('upi:')) {
      url = 'https://$url';
    }

    final config = _platforms[_selectedPlatform];
    final colorHex = config != null
        ? '#${config.color.toARGB32().toRadixString(16).padLeft(8, '0').substring(2)}'
        : '#0052FF';

    final currentSocials = _profile != null ? List<SocialLink>.from(_profile!.socials) : <SocialLink>[];
    final newLink = SocialLink(
      platform: _selectedPlatform,
      handle: handle,
      url: url,
      icon: _selectedPlatform.toLowerCase().replaceAll(' ', ''),
      color: colorHex,
    );

    currentSocials.add(newLink);
    setState(() => _saving = true);

    try {
      final result = await _apiService.updateProfile({
        'socials': currentSocials.map((s) => s.toJson()).toList(),
      });

      if (result['success'] == true) {
        if (mounted) {
          setState(() {
            _profile = result['profile'] is Profile
                ? result['profile'] as Profile
                : Profile.fromJson(result['profile'] as Map<String, dynamic>?);
            _handleController.clear();
            _urlController.clear();
          });
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Added $_selectedPlatform link!'),
              backgroundColor: const Color(0xFF10B981),
            ),
          );
        }
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Add error: $e'), backgroundColor: Colors.redAccent),
        );
      }
    } finally {
      if (mounted) setState(() => _saving = false);
    }
  }

  Future<void> _removeSocial(int index) async {
    if (_profile == null || index < 0 || index >= _profile!.socials.length) return;

    final updatedSocials = List<SocialLink>.from(_profile!.socials)..removeAt(index);
    setState(() => _saving = true);

    try {
      final result = await _apiService.updateProfile({
        'socials': updatedSocials.map((s) => s.toJson()).toList(),
      });

      if (result['success'] == true) {
        if (mounted) {
          setState(() {
            _profile = result['profile'] is Profile
                ? result['profile'] as Profile
                : Profile.fromJson(result['profile'] as Map<String, dynamic>?);
          });
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Social link removed.'),
              backgroundColor: Color(0xFF10B981),
            ),
          );
        }
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Delete error: $e'), backgroundColor: Colors.redAccent),
        );
      }
    } finally {
      if (mounted) setState(() => _saving = false);
    }
  }

  Future<void> _reorderSocialsItem(int oldIndex, int newIndex) async {
    if (_profile == null) return;

    final updatedSocials = List<SocialLink>.from(_profile!.socials);
    final movedItem = updatedSocials.removeAt(oldIndex);
    updatedSocials.insert(newIndex, movedItem);

    setState(() {
      _profile = Profile(
        id: _profile!.id,
        userId: _profile!.userId,
        name: _profile!.name,
        username: _profile!.username,
        tagline: _profile!.tagline,
        avatar: _profile!.avatar,
        isOnline: _profile!.isOnline,
        bio: _profile!.bio,
        phone: _profile!.phone,
        whatsapp: _profile!.whatsapp,
        location: _profile!.location,
        diamonds: _profile!.diamonds,
        isPremium: _profile!.isPremium,
        tapCount: _profile!.tapCount,
        tags: _profile!.tags,
        socials: updatedSocials,
        theme: _profile!.theme,
      );
    });

    try {
      await _apiService.updateProfile({
        'socials': updatedSocials.map((s) => s.toJson()).toList(),
      });
    } catch (e) {
      debugPrint('[REORDER] Save error: $e');
    }
  }

  void _showPlatformPicker() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: _cardBg,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) {
        return SafeArea(
          child: Container(
            constraints: BoxConstraints(
              maxHeight: MediaQuery.sizeOf(context).height * 0.65,
            ),
            padding: const EdgeInsets.all(20.0),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Choose Platform',
                      style: GoogleFonts.outfit(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: _textColor,
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.close),
                      color: _subtitleColor,
                      onPressed: () => Navigator.pop(context),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                Expanded(
                  child: ListView(
                    physics: const BouncingScrollPhysics(),
                    children: _platforms.entries.map((entry) {
                      final name = entry.key;
                      final config = entry.value;
                      final isSelected = _selectedPlatform == name;

                      return ListTile(
                        onTap: () {
                          Navigator.pop(context);
                          _onPlatformSelected(name);
                        },
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                        tileColor: isSelected
                            ? const Color(0xFF0052FF).withValues(alpha: 0.1)
                            : Colors.transparent,
                        leading: Container(
                          width: 36,
                          height: 36,
                          decoration: BoxDecoration(
                            color: config.color.withValues(alpha: 0.12),
                            shape: BoxShape.circle,
                          ),
                          alignment: Alignment.center,
                          child: FaIcon(config.icon, color: config.color, size: 18),
                        ),
                        title: Text(
                          name,
                          style: GoogleFonts.outfit(
                            fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                            color: isSelected ? const Color(0xFF0052FF) : _textColor,
                          ),
                        ),
                        trailing: isSelected
                            ? const Icon(Icons.check_circle_rounded, color: Color(0xFF0052FF), size: 20)
                            : null,
                      );
                    }).toList(),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  void _showHelpModal() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: _cardBg,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) {
        return SafeArea(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Social Links Help',
                      style: GoogleFonts.outfit(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: _textColor,
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.close),
                      color: _subtitleColor,
                      onPressed: () => Navigator.pop(context),
                    ),
                  ],
                ),
                const SizedBox(height: 14),
                Text(
                  'Connected social links are displayed on your digital card, profile preview, and NFC tap destination. Anyone who visits your Tapfolio can tap to open your direct profile.',
                  style: GoogleFonts.outfit(fontSize: 13.5, color: _subtitleColor, height: 1.4),
                ),
                const SizedBox(height: 16),
                _buildHelpItem(Icons.touch_app_outlined, 'Instant Auto-Link', 'Enter your username and Tapfolio automatically generates the correct profile URL.'),
                _buildHelpItem(Icons.drag_indicator_rounded, 'Reorder Anywhere', 'Drag using the 6-dots handle to place your primary platforms at the very top.'),
                _buildHelpItem(Icons.account_balance_wallet_outlined, 'Payment Links', 'Add Google Pay or UPI IDs to receive instant contact payments.'),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildHelpItem(IconData icon, String title, String desc) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 14.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: const Color(0xFF0052FF).withValues(alpha: 0.1),
              shape: BoxShape.circle,
            ),
            child: Icon(icon, color: const Color(0xFF0052FF), size: 18),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.bold, color: _textColor)),
                const SizedBox(height: 2),
                Text(desc, style: GoogleFonts.outfit(fontSize: 12, color: _subtitleColor)),
              ],
            ),
          ),
        ],
      ),
    );
  }

  dynamic _getPlatformIcon(String platform) {
    final clean = platform.trim();
    for (final entry in _platforms.entries) {
      if (entry.key.toLowerCase() == clean.toLowerCase() ||
          clean.toLowerCase().contains(entry.key.toLowerCase())) {
        return entry.value.icon;
      }
    }
    return FontAwesomeIcons.link;
  }

  Color _getPlatformColor(String platform) {
    final clean = platform.trim();
    for (final entry in _platforms.entries) {
      if (entry.key.toLowerCase() == clean.toLowerCase() ||
          clean.toLowerCase().contains(entry.key.toLowerCase())) {
        return entry.value.color;
      }
    }
    return const Color(0xFF0052FF);
  }

  @override
  Widget build(BuildContext context) {
    final socials = _profile?.socials ?? <SocialLink>[];
    final activeConfig = _platforms[_selectedPlatform] ?? _platforms['GitHub']!;

    return Scaffold(
      backgroundColor: _isLight ? const Color(0xFFF8FAFC) : const Color(0xFF070913),
      body: SafeArea(
        bottom: false,
        child: RefreshIndicator(
          onRefresh: _fetchProfile,
          color: const Color(0xFF0052FF),
          child: SingleChildScrollView(
            physics: const AlwaysScrollableScrollPhysics(
              parent: BouncingScrollPhysics(),
            ),
            padding: const EdgeInsets.symmetric(horizontal: 16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(height: 12),

                // ── 1. Top Bar with Back & Help Buttons ──────────────────────
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    // Back Button Pill
                    GestureDetector(
                      onTap: () => Navigator.maybePop(context),
                      child: Container(
                        width: 40,
                        height: 40,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: _cardBg,
                          border: Border.all(color: _cardBorder),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withValues(alpha: 0.03),
                              blurRadius: 6,
                              offset: const Offset(0, 2),
                            ),
                          ],
                        ),
                        alignment: Alignment.center,
                        child: Icon(
                          Icons.arrow_back_ios_new_rounded,
                          size: 16,
                          color: _textColor,
                        ),
                      ),
                    ),

                    // Help (?) Button Pill
                    GestureDetector(
                      onTap: _showHelpModal,
                      child: Container(
                        width: 40,
                        height: 40,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: _cardBg,
                          border: Border.all(color: _cardBorder),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withValues(alpha: 0.03),
                              blurRadius: 6,
                              offset: const Offset(0, 2),
                            ),
                          ],
                        ),
                        alignment: Alignment.center,
                        child: Icon(
                          Icons.help_outline_rounded,
                          size: 20,
                          color: _textColor,
                        ),
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 16),

                // ── 2. Screen Title & Subtitle ──────────────────────────────
                Text(
                  'Manage Social Links',
                  style: GoogleFonts.outfit(
                    color: _textColor,
                    fontSize: 26,
                    fontWeight: FontWeight.bold,
                    letterSpacing: -0.4,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  'Add and manage your social profiles in one place.',
                  style: GoogleFonts.outfit(
                    color: _subtitleColor,
                    fontSize: 13.5,
                  ),
                ),

                const SizedBox(height: 20),

                // ── 3. Card 1: Add New Social Link ──────────────────────────
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(18),
                  decoration: BoxDecoration(
                    color: _cardBg,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: _cardBorder),
                    boxShadow: [
                      BoxShadow(
                        color: const Color(0xFF6366F1).withValues(alpha: 0.03),
                        blurRadius: 12,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Header Row (Icon + Title + Subtitle)
                      Row(
                        children: [
                          Container(
                            width: 36,
                            height: 36,
                            decoration: BoxDecoration(
                              color: const Color(0xFF0052FF).withValues(alpha: 0.08),
                              shape: BoxShape.circle,
                            ),
                            alignment: Alignment.center,
                            child: const Icon(
                              Icons.add_rounded,
                              color: Color(0xFF0052FF),
                              size: 22,
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'Add New Social Link',
                                  style: GoogleFonts.outfit(
                                    fontSize: 15,
                                    fontWeight: FontWeight.bold,
                                    color: _textColor,
                                  ),
                                ),
                                const SizedBox(height: 1),
                                Text(
                                  'Share all your important profiles with your audience.',
                                  style: GoogleFonts.outfit(
                                    fontSize: 12,
                                    color: _subtitleColor,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),

                      const SizedBox(height: 18),

                      // Row 1: Platform Selector + Handle Field
                      Row(
                        children: [
                          // Platform Dropdown Pill
                          GestureDetector(
                            onTap: _showPlatformPicker,
                            child: Container(
                              height: 48,
                              padding: const EdgeInsets.symmetric(horizontal: 12),
                              decoration: BoxDecoration(
                                color: _inputBg,
                                borderRadius: BorderRadius.circular(14),
                                border: Border.all(color: _cardBorder),
                              ),
                              child: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  FaIcon(
                                    activeConfig.icon as dynamic,
                                    color: activeConfig.color,
                                    size: 18,
                                  ),
                                  const SizedBox(width: 8),
                                  Text(
                                    _selectedPlatform,
                                    style: GoogleFonts.outfit(
                                      fontSize: 13.5,
                                      fontWeight: FontWeight.w600,
                                      color: _textColor,
                                    ),
                                  ),
                                  const SizedBox(width: 6),
                                  Icon(
                                    Icons.keyboard_arrow_down_rounded,
                                    color: _subtitleColor,
                                    size: 18,
                                  ),
                                ],
                              ),
                            ),
                          ),
                          const SizedBox(width: 10),

                          // Handle Input Field
                          Expanded(
                            child: Container(
                              height: 48,
                              padding: const EdgeInsets.symmetric(horizontal: 14),
                              decoration: BoxDecoration(
                                color: _inputBg,
                                borderRadius: BorderRadius.circular(14),
                                border: Border.all(color: _cardBorder),
                              ),
                              alignment: Alignment.centerLeft,
                              child: TextField(
                                controller: _handleController,
                                onChanged: _onHandleChanged,
                                style: GoogleFonts.outfit(fontSize: 13.5, color: _textColor),
                                decoration: InputDecoration(
                                  hintText: activeConfig.placeholder,
                                  hintStyle: GoogleFonts.outfit(
                                    fontSize: 13,
                                    color: _subtitleColor.withValues(alpha: 0.7),
                                  ),
                                  border: InputBorder.none,
                                  isDense: true,
                                  contentPadding: EdgeInsets.zero,
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),

                      const SizedBox(height: 10),

                      // Row 2: Profile URL + Add Button
                      Row(
                        children: [
                          // URL field
                          Expanded(
                            child: Container(
                              height: 48,
                              padding: const EdgeInsets.symmetric(horizontal: 12),
                              decoration: BoxDecoration(
                                color: _inputBg,
                                borderRadius: BorderRadius.circular(14),
                                border: Border.all(color: _cardBorder),
                              ),
                              alignment: Alignment.centerLeft,
                              child: Row(
                                children: [
                                  Icon(Icons.link_rounded, size: 18, color: _subtitleColor),
                                  const SizedBox(width: 8),
                                  Expanded(
                                    child: TextField(
                                      controller: _urlController,
                                      style: GoogleFonts.outfit(fontSize: 13, color: _textColor),
                                      decoration: InputDecoration(
                                        hintText: 'e.g. ${activeConfig.urlPrefix}username',
                                        hintStyle: GoogleFonts.outfit(
                                          fontSize: 12.5,
                                          color: _subtitleColor.withValues(alpha: 0.7),
                                        ),
                                        border: InputBorder.none,
                                        isDense: true,
                                        contentPadding: EdgeInsets.zero,
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                          const SizedBox(width: 10),

                          // Add Button
                          GestureDetector(
                            onTap: _saving ? null : _addSocial,
                            child: Container(
                              width: 48,
                              height: 48,
                              decoration: BoxDecoration(
                                gradient: const LinearGradient(
                                  begin: Alignment.topLeft,
                                  end: Alignment.bottomRight,
                                  colors: [Color(0xFF2563EB), Color(0xFF0052FF)],
                                ),
                                borderRadius: BorderRadius.circular(14),
                                boxShadow: [
                                  BoxShadow(
                                    color: const Color(0xFF0052FF).withValues(alpha: 0.35),
                                    blurRadius: 10,
                                    offset: const Offset(0, 3),
                                  ),
                                ],
                              ),
                              alignment: Alignment.center,
                              child: _saving
                                  ? const SizedBox(
                                      width: 18,
                                      height: 18,
                                      child: CircularProgressIndicator(
                                        strokeWidth: 2.2,
                                        color: Colors.white,
                                      ),
                                    )
                                  : const Icon(
                                      Icons.add_rounded,
                                      color: Colors.white,
                                      size: 24,
                                    ),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 20),

                // ── 4. Card 2: Your Connected Links ─────────────────────────
                Container(
                  width: double.infinity,
                  decoration: BoxDecoration(
                    color: _cardBg,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: _cardBorder),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.02),
                        blurRadius: 10,
                        offset: const Offset(0, 3),
                      ),
                    ],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Header with count badge
                      Padding(
                        padding: const EdgeInsets.all(18.0),
                        child: Row(
                          children: [
                            Container(
                              width: 36,
                              height: 36,
                              decoration: BoxDecoration(
                                color: const Color(0xFF6366F1).withValues(alpha: 0.08),
                                shape: BoxShape.circle,
                              ),
                              alignment: Alignment.center,
                              child: const Icon(
                                Icons.link_rounded,
                                color: Color(0xFF6366F1),
                                size: 20,
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    'Your Connected Links',
                                    style: GoogleFonts.outfit(
                                      fontSize: 15,
                                      fontWeight: FontWeight.bold,
                                      color: _textColor,
                                    ),
                                  ),
                                  const SizedBox(height: 1),
                                  Text(
                                    'These links will be visible on your Tapfolio profile.',
                                    style: GoogleFonts.outfit(
                                      fontSize: 12,
                                      color: _subtitleColor,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            // Links count badge
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                              decoration: BoxDecoration(
                                color: const Color(0xFFEEF2FF),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Text(
                                '${socials.length} Links',
                                style: GoogleFonts.outfit(
                                  color: const Color(0xFF4F46E5),
                                  fontSize: 11.5,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),

                      Divider(height: 1, color: _cardBorder.withValues(alpha: 0.7)),

                      // Socials List or Empty State
                      if (socials.isEmpty)
                        Padding(
                          padding: const EdgeInsets.all(32.0),
                          child: Center(
                            child: Column(
                              children: [
                                Icon(Icons.link_off_rounded, size: 44, color: _subtitleColor),
                                const SizedBox(height: 10),
                                Text(
                                  'No Connected Links Yet',
                                  style: GoogleFonts.outfit(
                                    fontSize: 15,
                                    fontWeight: FontWeight.bold,
                                    color: _textColor,
                                  ),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  'Add your GitHub, LinkedIn, Instagram, or other socials above.',
                                  style: GoogleFonts.outfit(fontSize: 12.5, color: _subtitleColor),
                                  textAlign: TextAlign.center,
                                ),
                              ],
                            ),
                          ),
                        )
                      else
                        ReorderableListView.builder(
                          shrinkWrap: true,
                          physics: const NeverScrollableScrollPhysics(),
                          itemCount: socials.length,
                          onReorderItem: _reorderSocialsItem,
                          itemBuilder: (context, index) {
                            final social = socials[index];
                            final iconData = _getPlatformIcon(social.platform);
                            final brandColor = _getPlatformColor(social.platform);

                            return Container(
                              key: ValueKey('${social.platform}_${social.handle}_$index'),
                              decoration: BoxDecoration(
                                border: index < socials.length - 1
                                    ? Border(
                                        bottom: BorderSide(
                                          color: _cardBorder.withValues(alpha: 0.5),
                                          width: 0.8,
                                        ),
                                      )
                                    : null,
                              ),
                              child: Padding(
                                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                                child: Row(
                                  children: [
                                    // Brand Icon in colored round container
                                    Container(
                                      width: 38,
                                      height: 38,
                                      decoration: BoxDecoration(
                                        color: brandColor.withValues(alpha: 0.10),
                                        borderRadius: BorderRadius.circular(12),
                                      ),
                                      alignment: Alignment.center,
                                      child: FaIcon(iconData as dynamic, color: brandColor, size: 18),
                                    ),
                                    const SizedBox(width: 12),

                                    // Platform Name & Handle
                                    Expanded(
                                      child: Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          Text(
                                            social.platform,
                                            style: GoogleFonts.outfit(
                                              fontSize: 14.5,
                                              fontWeight: FontWeight.bold,
                                              color: _textColor,
                                            ),
                                          ),
                                          const SizedBox(height: 1),
                                          Text(
                                            social.handle.startsWith('@') || social.handle.startsWith('http')
                                                ? social.handle
                                                : '@${social.handle}',
                                            style: GoogleFonts.outfit(
                                              fontSize: 12,
                                              color: _subtitleColor,
                                            ),
                                            maxLines: 1,
                                            overflow: TextOverflow.ellipsis,
                                          ),
                                        ],
                                      ),
                                    ),

                                    // Active Status Pill
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2.5),
                                      decoration: BoxDecoration(
                                        color: const Color(0xFFECFDF5),
                                        borderRadius: BorderRadius.circular(8),
                                        border: Border.all(color: const Color(0xFFA7F3D0)),
                                      ),
                                      child: Text(
                                        'Active',
                                        style: GoogleFonts.outfit(
                                          color: const Color(0xFF059669),
                                          fontSize: 10.5,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                    ),
                                    const SizedBox(width: 10),

                                    // Drag Indicator Handle
                                    ReorderableDragStartListener(
                                      index: index,
                                      child: Icon(
                                        Icons.drag_indicator_rounded,
                                        color: _subtitleColor.withValues(alpha: 0.6),
                                        size: 20,
                                      ),
                                    ),
                                    const SizedBox(width: 8),

                                    // Delete Action Button
                                    GestureDetector(
                                      onTap: () => _removeSocial(index),
                                      child: Container(
                                        width: 32,
                                        height: 32,
                                        decoration: BoxDecoration(
                                          color: const Color(0xFFFEF2F2),
                                          borderRadius: BorderRadius.circular(8),
                                        ),
                                        alignment: Alignment.center,
                                        child: const Icon(
                                          Icons.delete_outline_rounded,
                                          color: Color(0xFFEF4444),
                                          size: 18,
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            );
                          },
                        ),
                    ],
                  ),
                ),

                const SizedBox(height: 20),

                // ── 5. Tip Banner ───────────────────────────────────────────
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: _isLight
                        ? const Color(0xFFEFF6FF)
                        : const Color(0xFF1E293B).withValues(alpha: 0.5),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(
                      color: _isLight ? const Color(0xFFDBEAFE) : const Color(0xFF334155),
                    ),
                  ),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Icon(
                        Icons.info_rounded,
                        color: Color(0xFF3B82F6),
                        size: 20,
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Tip',
                              style: GoogleFonts.outfit(
                                fontSize: 13,
                                fontWeight: FontWeight.bold,
                                color: _isLight ? const Color(0xFF1E40AF) : const Color(0xFF93C5FD),
                              ),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              'Drag the dots to reorder your links. The top links will appear first on your profile.',
                              style: GoogleFonts.outfit(
                                fontSize: 12,
                                color: _isLight ? const Color(0xFF1E40AF) : const Color(0xFF93C5FD),
                                height: 1.35,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),

                // Safe bottom padding for floating navigation bar
                const SizedBox(height: 100),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _PlatformConfig {
  final String name;
  final dynamic icon;
  final Color color;
  final String urlPrefix;
  final String placeholder;

  _PlatformConfig({
    required this.name,
    required this.icon,
    required this.color,
    required this.urlPrefix,
    required this.placeholder,
  });
}

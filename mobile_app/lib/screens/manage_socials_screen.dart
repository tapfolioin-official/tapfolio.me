import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import '../models/profile.dart';
import '../models/social_link.dart';
import '../services/api_service.dart';
import '../core/utils/color_parser.dart';

class ManageSocialsScreen extends StatefulWidget {
  const ManageSocialsScreen({super.key});

  @override
  State<ManageSocialsScreen> createState() => _ManageSocialsScreenState();
}

class _ManageSocialsScreenState extends State<ManageSocialsScreen> {
  final ApiService _apiService = ApiService();

  final _socialHandleController = TextEditingController();
  final _socialUrlController = TextEditingController();

  Profile? _profile;
  bool _loading = true;
  bool _saving = false;
  String _socialPlatform = 'GitHub';

  bool get _isLight => Theme.of(context).brightness == Brightness.light;
  Color get _textColor => _isLight ? const Color(0xFF1F2937) : Colors.white;
  Color get _subtitleColor => _isLight ? const Color(0xFF4B5563) : Colors.white60;
  Color get _cardBg => _isLight ? Colors.white : const Color(0xFF0F1122);
  Color get _cardBorder => _isLight ? const Color(0xFFEEF2F6) : Colors.white12;
  Color get _inputBg => _isLight ? const Color(0xFFF9FAFB) : const Color(0xFF15192D);
  Color get _inputBorder => _isLight ? const Color(0xFFE5E7EB) : Colors.white10;
  Color get _hintColor => _isLight ? Colors.black38 : Colors.white38;

  @override
  void initState() {
    super.initState();
    _fetchProfile();
  }

  @override
  void dispose() {
    _socialHandleController.dispose();
    _socialUrlController.dispose();
    super.dispose();
  }

  Future<void> _fetchProfile() async {
    if (!mounted) return;
    setState(() => _loading = true);

    try {
      final res = await _apiService.getProfile();
      if (res != null && res['profile'] != null) {
        setState(() {
          _profile = res['profile'];
        });
      }
    } catch (e) {
      debugPrint('[MANAGE-SOCIALS] Fetch error: $e');
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  Future<void> _addSocial() async {
    final handle = _socialHandleController.text.trim();
    var url = _socialUrlController.text.trim();
    if (handle.isEmpty || url.isEmpty || _profile == null) return;

    if (!url.startsWith('http')) {
      url = 'https://$url';
    }

    final platformSpecs = {
      'GitHub': {'color': '#24292e', 'icon': 'github'},
      'LinkedIn': {'color': '#0077b5', 'icon': 'linkedin'},
      'Twitter': {'color': '#1da1f2', 'icon': 'twitter'},
      'Instagram': {'color': '#e1306c', 'icon': 'instagram'},
      'YouTube': {'color': '#ff0000', 'icon': 'youtube'},
      'Website': {'color': '#10b981', 'icon': 'globe'},
      'Telegram': {'color': '#26A5E4', 'icon': 'telegram'},
      'WhatsApp': {'color': '#25D366', 'icon': 'whatsapp'},
      'Behance': {'color': '#1769FF', 'icon': 'behance'},
    };

    final specs = platformSpecs[_socialPlatform] ?? {'color': '#0052FF', 'icon': 'link'};

    final updatedSocials = List<SocialLink>.from(_profile!.socials);
    updatedSocials.add(
      SocialLink(
        platform: _socialPlatform,
        handle: handle,
        url: url,
        icon: specs['icon']!,
        color: specs['color']!,
      ),
    );

    setState(() => _saving = true);

    final result = await _apiService.updateProfile({
      'socials': updatedSocials.map((s) => s.toJson()).toList(),
    });

    setState(() {
      _saving = false;
      _socialHandleController.clear();
      _socialUrlController.clear();
    });

    if (result['success'] == true) {
      setState(() {
        _profile = result['profile'];
      });
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Added $_socialPlatform link!'), backgroundColor: const Color(0xFF10B981)),
      );
    }
  }

  Future<void> _removeSocial(int index) async {
    if (_profile == null) return;
    final updatedSocials = List<SocialLink>.from(_profile!.socials)..removeAt(index);

    setState(() => _saving = true);

    final result = await _apiService.updateProfile({
      'socials': updatedSocials.map((s) => s.toJson()).toList(),
    });

    setState(() => _saving = false);

    if (result['success'] == true) {
      setState(() {
        _profile = result['profile'];
      });
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Social link removed.'), backgroundColor: Color(0xFF10B981)),
      );
    }
  }

  Widget _buildGlassCard({required List<Widget> children}) {
    return Container(
      margin: const EdgeInsets.only(bottom: 20),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: _cardBg,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: _cardBorder),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.02),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: children,
      ),
    );
  }

  Widget _buildSocialIcon(String iconName, Color color) {
    const double size = 20;
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
      default:
        return Icon(Icons.link, color: color, size: size);
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator(color: Color(0xFF0052FF))),
      );
    }

    if (_profile == null) {
      return Scaffold(
        body: Center(
          child: Text('Profile not loaded.', style: GoogleFonts.outfit(color: Colors.redAccent)),
        ),
      );
    }

    return Scaffold(
      backgroundColor: _isLight ? const Color(0xFFF3F4F6) : const Color(0xFF06070D),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 20),
        child: Column(
          children: [
            // Custom Title
            Row(
              children: [
                Text(
                  'Manage Social Links',
                  style: GoogleFonts.outfit(
                    color: _textColor,
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),

            // Card 1: Add New Social Link
            _buildGlassCard(
              children: [
                Text(
                  'Add New Social Link',
                  style: GoogleFonts.outfit(color: _textColor, fontSize: 16, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 16),
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8),
                      decoration: BoxDecoration(
                        color: _inputBg,
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(color: _inputBorder),
                      ),
                      child: DropdownButtonHideUnderline(
                        child: DropdownButton<String>(
                          dropdownColor: _cardBg,
                          value: _socialPlatform,
                          style: GoogleFonts.outfit(color: _textColor),
                          onChanged: (String? val) {
                            if (val != null) setState(() => _socialPlatform = val);
                          },
                          items: const [
                            DropdownMenuItem(value: 'GitHub', child: Text('GitHub')),
                            DropdownMenuItem(value: 'LinkedIn', child: Text('LinkedIn')),
                            DropdownMenuItem(value: 'Twitter', child: Text('Twitter')),
                            DropdownMenuItem(value: 'Instagram', child: Text('Instagram')),
                            DropdownMenuItem(value: 'YouTube', child: Text('YouTube')),
                            DropdownMenuItem(value: 'Website', child: Text('Website')),
                            DropdownMenuItem(value: 'Telegram', child: Text('Telegram')),
                            DropdownMenuItem(value: 'WhatsApp', child: Text('WhatsApp')),
                            DropdownMenuItem(value: 'Behance', child: Text('Behance')),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Container(
                        decoration: BoxDecoration(
                          color: _inputBg,
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(color: _inputBorder),
                        ),
                        child: TextField(
                          controller: _socialHandleController,
                          style: GoogleFonts.outfit(color: _textColor),
                          decoration: InputDecoration(
                            hintText: 'Handle/Username',
                            hintStyle: TextStyle(color: _hintColor),
                            border: InputBorder.none,
                            contentPadding: const EdgeInsets.symmetric(horizontal: 12),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    Expanded(
                      child: Container(
                        decoration: BoxDecoration(
                          color: _inputBg,
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(color: _inputBorder),
                        ),
                        child: TextField(
                          controller: _socialUrlController,
                          style: GoogleFonts.outfit(color: _textColor),
                          decoration: InputDecoration(
                            hintText: 'URL (e.g. github.com/username)',
                            hintStyle: TextStyle(color: _hintColor),
                            border: InputBorder.none,
                            contentPadding: const EdgeInsets.symmetric(horizontal: 12),
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    IconButton(
                      icon: const Icon(Icons.add_circle, color: Color(0xFF0052FF), size: 36),
                      onPressed: _saving ? null : _addSocial,
                    ),
                  ],
                ),
              ],
            ),

            // Card 2: Existing Social Links
            _buildGlassCard(
              children: [
                Text(
                  'Your Connected Links',
                  style: GoogleFonts.outfit(color: _textColor, fontSize: 16, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 16),
                if (_profile!.socials.isEmpty)
                  Padding(
                    padding: const EdgeInsets.symmetric(vertical: 20),
                    child: Center(
                      child: Text(
                        'No social links connected yet.',
                        style: GoogleFonts.outfit(color: _subtitleColor, fontSize: 14),
                      ),
                    ),
                  )
                else
                  ...List.generate(_profile!.socials.length, (idx) {
                    final link = _profile!.socials[idx];
                    final cardColor = parseHexColor(link.color);
                    return Container(
                      margin: const EdgeInsets.only(bottom: 8),
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                      decoration: BoxDecoration(
                        color: _isLight ? const Color(0xFFF9FAFB) : Colors.white12,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: cardColor.withValues(alpha: 0.2)),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Row(
                            children: [
                              _buildSocialIcon(link.icon, cardColor),
                              const SizedBox(width: 12),
                              Text(
                                '${link.platform}: ',
                                style: GoogleFonts.outfit(
                                  color: _textColor,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              Text(
                                link.handle,
                                style: GoogleFonts.outfit(color: _subtitleColor),
                              ),
                            ],
                          ),
                          IconButton(
                            icon: const Icon(Icons.delete_outline, color: Colors.redAccent, size: 20),
                            onPressed: _saving ? null : () => _removeSocial(idx),
                          ),
                        ],
                      ),
                    );
                  }),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

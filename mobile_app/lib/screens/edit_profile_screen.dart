import 'dart:convert';
import 'dart:typed_data';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:image_picker/image_picker.dart';
import '../models/profile.dart';
import '../models/tag.dart';
import '../services/api_service.dart';
import '../core/utils/image_helper.dart';
import '../widgets/image_crop_dialog.dart';
import 'theme_studio/theme_studio_screen.dart';
import 'delete_account_screen.dart';
import 'notification_screen.dart';

class EditProfileScreen extends StatefulWidget {
  final VoidCallback? onLogout;
  const EditProfileScreen({super.key, this.onLogout});

  @override
  State<EditProfileScreen> createState() => _EditProfileScreenState();
}

class _EditProfileScreenState extends State<EditProfileScreen> {
  final ApiService _apiService = ApiService();
  Profile? _profile;
  bool _loading = true;

  bool get _isLight => Theme.of(context).brightness == Brightness.light;
  Color get _textColor => _isLight ? const Color(0xFF1F2937) : Colors.white;
  Color get _subtitleColor => _isLight ? const Color(0xFF4B5563) : Colors.white60;
  Color get _cardBg => _isLight ? Colors.white : const Color(0xFF0F1122);
  Color get _cardBorder => _isLight ? const Color(0xFFEEF2F6) : Colors.white12;

  @override
  void initState() {
    super.initState();
    _fetchProfile();
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
      debugPrint('[SETTINGS] Fetch error: $e');
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  Widget _buildTopHeader() {
    final isPremium = _profile?.isPremium ?? false;

    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        // Upgrade to Pro (hidden if already premium)
        if (!isPremium)
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: _isLight
                    ? [const Color(0xFFFFF7ED), const Color(0xFFFEF3C7)]
                    : [const Color(0xFF78350F).withOpacity(0.2), const Color(0xFFD97706).withOpacity(0.2)],
              ),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: _isLight ? const Color(0xFFFDE68A) : Colors.amber.withOpacity(0.3)),
            ),
            child: Row(
              children: [
                const Text('👑 ', style: TextStyle(fontSize: 14)),
                Text(
                  'Upgrade to Pro',
                  style: GoogleFonts.outfit(
                    color: _isLight ? const Color(0xFFB45309) : Colors.amberAccent,
                    fontWeight: FontWeight.bold,
                    fontSize: 13,
                  ),
                ),
              ],
            ),
          )
        else
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF6366F1), Color(0xFF8B5CF6)],
              ),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Row(
              children: [
                const Text('✨ ', style: TextStyle(fontSize: 14)),
                Text(
                  'Pro',
                  style: GoogleFonts.outfit(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                    fontSize: 13,
                  ),
                ),
              ],
            ),
          ),
        // Rewards
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
          decoration: BoxDecoration(
            color: _isLight ? const Color(0xFFF3F4F6) : Colors.white.withOpacity(0.05),
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: _cardBorder),
          ),
          child: Row(
            children: [
              const Text('🎁 ', style: TextStyle(fontSize: 14)),
              Text(
                'Rewards',
                style: GoogleFonts.outfit(
                  color: _textColor,
                  fontWeight: FontWeight.bold,
                  fontSize: 13,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildTeamBanner() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: _isLight ? Colors.white : const Color(0xFF0F1122),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: _cardBorder),
        boxShadow: _isLight
            ? [
                BoxShadow(
                  color: Colors.black.withOpacity(0.02),
                  blurRadius: 10,
                  offset: const Offset(0, 4),
                )
              ]
            : null,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.group_outlined, color: Color(0xFF6366f1), size: 22),
              const SizedBox(width: 8),
              Text(
                'Managing a team?',
                style: GoogleFonts.outfit(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: _textColor,
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            'Smarter meetings. Cleaner CRM. Real visibility. Your brand on everything.',
            style: GoogleFonts.outfit(
              fontSize: 13,
              color: _subtitleColor,
            ),
          ),
          const SizedBox(height: 16),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF6366f1),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(20),
              ),
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            ),
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Connecting to Sales team...')),
              );
            },
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  'Talk to sales ',
                  style: GoogleFonts.outfit(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                    fontSize: 12,
                  ),
                ),
                const Icon(Icons.arrow_outward, color: Colors.white, size: 12),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCategoryHeader(String title) {
    return Padding(
      padding: const EdgeInsets.only(left: 4, bottom: 8, top: 20),
      child: Text(
        title,
        style: GoogleFonts.outfit(
          fontSize: 16,
          fontWeight: FontWeight.bold,
          color: _textColor.withOpacity(0.9),
        ),
      ),
    );
  }

  Widget _buildCategoryContainer(List<Widget> children) {
    return Container(
      decoration: BoxDecoration(
        color: _isLight ? Colors.white : const Color(0xFF0F1122),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: _cardBorder),
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(20),
        child: Column(
          children: children,
        ),
      ),
    );
  }

  Widget _buildSettingItem({
    required IconData icon,
    required String title,
    String? trailingText,
    required VoidCallback onTap,
    bool showDivider = true,
    Color? iconColor,
  }) {
    return Column(
      children: [
        ListTile(
          onTap: onTap,
          leading: Icon(icon, color: iconColor ?? const Color(0xFF0052FF), size: 20),
          title: Text(
            title,
            style: GoogleFonts.outfit(
              fontSize: 14,
              color: _textColor,
              fontWeight: FontWeight.w500,
            ),
          ),
          trailing: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              if (trailingText != null) ...[
                Text(
                  trailingText,
                  style: GoogleFonts.outfit(
                    color: _subtitleColor,
                    fontSize: 13,
                  ),
                ),
                const SizedBox(width: 4),
              ],
              Icon(Icons.chevron_right, color: _textColor.withOpacity(0.3), size: 18),
            ],
          ),
        ),
        if (showDivider)
          Divider(
            height: 1,
            indent: 56,
            endIndent: 16,
            color: _isLight ? const Color(0xFFEEF2F6) : Colors.white10,
          ),
      ],
    );
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
      backgroundColor: _isLight ? const Color(0xFFF9FAFB) : const Color(0xFF06070D),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildTopHeader(),
              const SizedBox(height: 24),
              Text(
                'Settings',
                style: GoogleFonts.outfit(
                  color: _textColor,
                  fontSize: 28,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 16),
              _buildTeamBanner(),
              const SizedBox(height: 12),

              _buildCategoryHeader('Account'),
              _buildCategoryContainer([
                _buildSettingItem(
                  icon: Icons.person_outline,
                  title: 'User Profile',
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => ProfileDetailsSettingsScreen(
                          profile: _profile!,
                          onUpdated: _fetchProfile,
                        ),
                      ),
                    );
                  },
                ),
                _buildSettingItem(
                  icon: Icons.style_outlined,
                  title: 'My Cards',
                  onTap: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('My Cards details feature coming soon!')),
                    );
                  },
                ),
                _buildSettingItem(
                  icon: Icons.shopping_bag_outlined,
                  title: 'My Products',
                  showDivider: false,
                  onTap: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Products checkout is coming soon!')),
                    );
                  },
                ),
              ]),

              _buildCategoryHeader('App Settings'),
              _buildCategoryContainer([
                _buildSettingItem(
                  icon: Icons.palette_outlined,
                  title: 'Theme Studio',
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => ThemeStudioScreen(isPremium: _profile!.isPremium),
                      ),
                    ).then((_) => _fetchProfile());
                  },
                ),
                _buildSettingItem(
                  icon: Icons.notifications_none,
                  title: 'Notifications',
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => NotificationScreen(
                          onUnreadCountChanged: (_) {},
                        ),
                      ),
                    );
                  },
                ),
                _buildSettingItem(
                  icon: Icons.translate,
                  title: 'Language',
                  trailingText: 'English',
                  onTap: () {
                    showDialog(
                      context: context,
                      builder: (context) => AlertDialog(
                        backgroundColor: _cardBg,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                        title: Text('Select Language', style: GoogleFonts.outfit(color: _textColor, fontWeight: FontWeight.bold)),
                        content: Text('Only English is currently supported in this version.', style: GoogleFonts.outfit(color: _textColor)),
                        actions: [
                          TextButton(
                            onPressed: () => Navigator.pop(context),
                            child: Text('OK', style: GoogleFonts.outfit(fontWeight: FontWeight.bold)),
                          )
                        ],
                      ),
                    );
                  },
                ),
                _buildSettingItem(
                  icon: Icons.delete_forever_outlined,
                  title: 'Delete Account',
                  iconColor: Colors.redAccent,
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => DeleteAccountScreen(
                          onAccountDeleted: () {
                            if (widget.onLogout != null) {
                              widget.onLogout!();
                            }
                          },
                        ),
                      ),
                    );
                  },
                ),
                _buildSettingItem(
                  icon: Icons.logout,
                  title: 'Sign Out',
                  iconColor: Colors.redAccent,
                  showDivider: false,
                  onTap: () {
                    _apiService.logout();
                    if (widget.onLogout != null) {
                      widget.onLogout!();
                    } else {
                      Navigator.pushNamedAndRemoveUntil(context, '/login', (route) => false);
                    }
                  },
                ),
              ]),
            ],
          ),
        ),
      ),
    );
  }
}

class ProfileDetailsSettingsScreen extends StatefulWidget {
  final Profile profile;
  final VoidCallback onUpdated;
  const ProfileDetailsSettingsScreen({super.key, required this.profile, required this.onUpdated});

  @override
  State<ProfileDetailsSettingsScreen> createState() => _ProfileDetailsSettingsScreenState();
}

class _ProfileDetailsSettingsScreenState extends State<ProfileDetailsSettingsScreen> {
  final ApiService _apiService = ApiService();
  final ImagePicker _picker = ImagePicker();

  late TextEditingController _nameController;
  late TextEditingController _taglineController;
  late TextEditingController _bioController;
  late TextEditingController _phoneController;
  late TextEditingController _whatsappController;
  late TextEditingController _locationController;
  final _tagController = TextEditingController();

  late Profile _profile;
  bool _saving = false;
  String _tagType = 'skill';

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
    _profile = widget.profile;
    _nameController = TextEditingController(text: _profile.name);
    _taglineController = TextEditingController(text: _profile.tagline);
    _bioController = TextEditingController(text: _profile.bio);
    _phoneController = TextEditingController(text: _profile.phone ?? '');
    _whatsappController = TextEditingController(text: _profile.whatsapp ?? '');
    _locationController = TextEditingController(text: _profile.location ?? '');
  }

  @override
  void dispose() {
    _nameController.dispose();
    _taglineController.dispose();
    _bioController.dispose();
    _phoneController.dispose();
    _whatsappController.dispose();
    _locationController.dispose();
    _tagController.dispose();
    super.dispose();
  }

  Future<void> _pickAndUploadImage() async {
    try {
      final XFile? image = await _picker.pickImage(source: ImageSource.gallery);
      if (image == null) return;

      final bytes = await image.readAsBytes();
      if (!mounted) return;

      final croppedBytes = await showDialog<Uint8List>(
        context: context,
        barrierDismissible: false,
        builder: (context) => ImageCropDialog(imageBytes: bytes),
      );

      if (croppedBytes == null) return;

      setState(() => _saving = true);

      final base64Image = base64Encode(croppedBytes);
      const mimeType = 'image/png';

      final result = await _apiService.uploadAvatar(base64Image, mimeType);
      if (result['success'] == true) {
        final saveRes = await _apiService.updateProfile({
          'avatar': result['url'],
        });
        if (saveRes['success'] == true) {
          setState(() {
            _profile = saveRes['profile'];
          });
          widget.onUpdated();
          if (!mounted) return;
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Avatar updated successfully!'),
              backgroundColor: Color(0xFF10B981),
            ),
          );
        }
      }
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error uploading avatar: $e'), backgroundColor: Colors.redAccent),
      );
    } finally {
      if (mounted) setState(() => _saving = false);
    }
  }

  Future<void> _saveProfile() async {
    setState(() => _saving = true);

    final result = await _apiService.updateProfile({
      'name': _nameController.text.trim(),
      'tagline': _taglineController.text.trim(),
      'bio': _bioController.text.trim(),
      'phone': _phoneController.text.trim(),
      'whatsapp': _whatsappController.text.trim(),
      'location': _locationController.text.trim(),
    });

    setState(() => _saving = false);

    if (result['success'] == true) {
      setState(() {
        _profile = result['profile'];
      });
      widget.onUpdated();
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Profile saved successfully!'),
          backgroundColor: Color(0xFF10B981),
        ),
      );
    } else {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(result['error'] ?? 'Save failed'),
          backgroundColor: Colors.redAccent,
        ),
      );
    }
  }

  Future<void> _addTag() async {
    final text = _tagController.text.trim();
    if (text.isEmpty) return;

    final updatedTags = List<Tag>.from(_profile.tags);
    if (updatedTags.any((t) => t.text.toLowerCase() == text.toLowerCase() && t.type == _tagType)) {
      return;
    }

    updatedTags.add(Tag(text: text, type: _tagType));

    setState(() => _saving = true);

    final result = await _apiService.updateProfile({
      'tags': updatedTags.map((t) => t.toJson()).toList(),
    });

    setState(() {
      _saving = false;
      _tagController.clear();
    });

    if (result['success'] == true) {
      setState(() {
        _profile = result['profile'];
      });
      widget.onUpdated();
    }
  }

  Future<void> _removeTag(int index) async {
    final updatedTags = List<Tag>.from(_profile.tags)..removeAt(index);

    setState(() => _saving = true);

    final result = await _apiService.updateProfile({
      'tags': updatedTags.map((t) => t.toJson()).toList(),
    });

    setState(() => _saving = false);

    if (result['success'] == true) {
      setState(() {
        _profile = result['profile'];
      });
      widget.onUpdated();
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
            color: Colors.black.withOpacity(0.02),
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

  Widget _buildTextField(TextEditingController controller, String label, {int maxLines = 1}) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: GoogleFonts.outfit(
              color: _textColor,
              fontSize: 14,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 6),
          Container(
            decoration: BoxDecoration(
              color: _inputBg,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: _inputBorder),
            ),
            child: TextField(
              controller: controller,
              maxLines: maxLines,
              style: GoogleFonts.outfit(color: _textColor),
              decoration: InputDecoration(
                border: InputBorder.none,
                contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                hintStyle: GoogleFonts.outfit(color: _hintColor),
              ),
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final avatarUrl = getAvatarImage(_profile.avatar, _apiService.baseUrl);

    return Scaffold(
      backgroundColor: _isLight ? const Color(0xFFF9FAFB) : const Color(0xFF06070D),
      appBar: AppBar(
        backgroundColor: _cardBg,
        elevation: 0.5,
        leading: IconButton(
          icon: Icon(Icons.arrow_back, color: _textColor),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(
          'User Profile Details',
          style: GoogleFonts.outfit(color: _textColor, fontWeight: FontWeight.bold, fontSize: 18),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            _buildGlassCard(
              children: [
                Center(
                  child: Stack(
                    children: [
                      Container(
                        width: 104,
                        height: 104,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          border: Border.all(color: const Color(0xFF0052FF), width: 1.5),
                        ),
                        child: Padding(
                          padding: const EdgeInsets.all(4.0),
                          child: CircleAvatar(
                            radius: 48,
                            backgroundColor: Colors.white,
                            backgroundImage: avatarUrl,
                          ),
                        ),
                      ),
                      Positioned(
                        bottom: 0,
                        right: 0,
                        child: GestureDetector(
                          onTap: _saving ? null : _pickAndUploadImage,
                          child: Container(
                            width: 32,
                            height: 32,
                            decoration: const BoxDecoration(
                              color: Color(0xFF0052FF),
                              shape: BoxShape.circle,
                            ),
                            child: _saving
                                ? const Padding(
                                    padding: EdgeInsets.all(8.0),
                                    child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                                  )
                                : const Icon(Icons.camera_alt, size: 16, color: Colors.white),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 24),
                _buildTextField(_nameController, 'Full Name'),
                _buildTextField(_taglineController, 'Tagline'),
                _buildTextField(_bioController, 'Bio Description', maxLines: 3),
                _buildTextField(_phoneController, 'Phone Number'),
                _buildTextField(_whatsappController, 'WhatsApp Number'),
                _buildTextField(_locationController, 'Location'),
                const SizedBox(height: 8),
                SizedBox(
                  width: double.infinity,
                  height: 48,
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF0052FF),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    onPressed: _saving ? null : _saveProfile,
                    child: _saving
                        ? const CircularProgressIndicator(color: Colors.white)
                        : Text(
                            'Save Profile Details',
                            style: GoogleFonts.outfit(color: Colors.white, fontWeight: FontWeight.bold),
                          ),
                  ),
                ),
              ],
            ),
            _buildGlassCard(
              children: [
                Text(
                  'Skills & Location Tags',
                  style: GoogleFonts.outfit(color: _textColor, fontSize: 18, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    Expanded(
                      flex: 3,
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12),
                        decoration: BoxDecoration(
                          color: _inputBg,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: _inputBorder),
                        ),
                        child: TextField(
                          controller: _tagController,
                          style: GoogleFonts.outfit(color: _textColor),
                          decoration: InputDecoration(
                            hintText: 'e.g. Next.js, Kochi',
                            hintStyle: TextStyle(color: _hintColor, fontSize: 13),
                            border: InputBorder.none,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      flex: 2,
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12),
                        decoration: BoxDecoration(
                          color: _inputBg,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: _inputBorder),
                        ),
                        child: DropdownButtonHideUnderline(
                          child: DropdownButton<String>(
                            dropdownColor: _cardBg,
                            value: _tagType,
                            style: GoogleFonts.outfit(color: _textColor, fontSize: 13, fontWeight: FontWeight.w600),
                            onChanged: (String? val) {
                              if (val != null) setState(() => _tagType = val);
                            },
                            items: const [
                              DropdownMenuItem(value: 'skill', child: Text('Skill')),
                              DropdownMenuItem(value: 'location', child: Text('Location')),
                            ],
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    GestureDetector(
                      onTap: _saving ? null : _addTag,
                      child: Container(
                        width: 44,
                        height: 44,
                        decoration: BoxDecoration(
                          color: const Color(0xFF0052FF),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: const Icon(Icons.add, color: Colors.white, size: 22),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: List.generate(_profile.tags.length, (idx) {
                    final tag = _profile.tags[idx];
                    final isLoc = tag.type == 'location';
                    final bgColor = isLoc 
                        ? const Color(0xFFECFDF5) 
                        : const Color(0xFFEEF2FF);
                    final txtColor = isLoc 
                        ? const Color(0xFF047857) 
                        : const Color(0xFF4F46E5);
                    final borderColor = isLoc 
                        ? const Color(0xFFD1FAE5) 
                        : const Color(0xFFE0E7FF);
                    final iconData = isLoc 
                        ? Icons.location_on_outlined 
                        : Icons.psychology_outlined;

                    return Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                      decoration: BoxDecoration(
                        color: bgColor,
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: borderColor, width: 1),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(iconData, size: 14, color: txtColor),
                          const SizedBox(width: 6),
                          Text(
                            tag.text,
                            style: GoogleFonts.outfit(
                              color: txtColor,
                              fontWeight: FontWeight.w600,
                              fontSize: 12,
                            ),
                          ),
                          const SizedBox(width: 6),
                          GestureDetector(
                            onTap: _saving ? null : () => _removeTag(idx),
                            child: Icon(
                              Icons.cancel,
                              size: 14,
                              color: txtColor.withOpacity(0.5),
                            ),
                          ),
                        ],
                      ),
                    );
                  }),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

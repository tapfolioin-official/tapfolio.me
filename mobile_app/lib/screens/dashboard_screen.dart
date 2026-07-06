import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:image_picker/image_picker.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import '../models/profile.dart';
import '../services/api_service.dart';
import '../widgets/image_crop_dialog.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  final ApiService _apiService = ApiService();
  final ImagePicker _picker = ImagePicker();

  Profile? _profile;
  int _score = 0;
  List<ChecklistItem> _checklist = [];
  bool _loading = true;
  bool _saving = false;
  int _pendingCount = 0;
  bool _isEditing = false; // Toggle between view and edit

  // Controllers
  final _nameController = TextEditingController();
  final _taglineController = TextEditingController();
  final _bioController = TextEditingController();
  final _phoneController = TextEditingController();
  final _whatsappController = TextEditingController();
  final _locationController = TextEditingController();

  // Tags states
  final _tagController = TextEditingController();
  String _tagType = 'role';

  // Socials states
  String _socialPlatform = 'GitHub';
  final _socialHandleController = TextEditingController();
  final _socialUrlController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _fetchProfile();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _checkForUpdates(silent: true);
      _fetchPendingCount();
    });
  }

  Future<void> _fetchPendingCount() async {
    final pending = await _apiService.getPendingRequests();
    if (mounted) setState(() => _pendingCount = pending.length);
  }

  Future<void> _checkForUpdates({bool silent = false}) async {
    final updateInfo = await _apiService.checkLatestVersion();
    if (updateInfo != null) {
      if (mounted) {
        _showUpdateDialog(updateInfo);
      }
    } else if (!silent) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('You are on the latest version of Tapfolio.'),
            backgroundColor: Color(0xFF10B981),
          ),
        );
      }
    }
  }

  void _showUpdateDialog(Map<String, dynamic> updateInfo) {
    final versionName = updateInfo['versionName'] as String;
    final buildNumber = updateInfo['buildNumber'] as int;
    final forceUpdate = updateInfo['forceUpdate'] as bool;
    final downloadUrl = updateInfo['downloadUrl'] as String;
    final changelog = updateInfo['changelog'] as List<dynamic>;

    showDialog(
      context: context,
      barrierDismissible: !forceUpdate,
      builder: (context) {
        return PopScope(
          canPop: !forceUpdate,
          child: AlertDialog(
            backgroundColor: const Color(0xFF0F1122),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(16),
              side: BorderSide(color: Colors.white.withValues(alpha: 0.08)),
            ),
            title: Text(
              'New Version Available',
              style: GoogleFonts.outfit(
                color: Colors.white,
                fontWeight: FontWeight.bold,
              ),
            ),
            content: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Version $versionName (Build $buildNumber)',
                  style: GoogleFonts.outfit(
                    color: const Color(0xFF6366F1),
                    fontWeight: FontWeight.bold,
                    fontSize: 15,
                  ),
                ),
                const SizedBox(height: 12),
                if (changelog.isNotEmpty) ...[
                  Text(
                    'Changelog:',
                    style: GoogleFonts.outfit(
                      color: Colors.white70,
                      fontWeight: FontWeight.w600,
                      fontSize: 13,
                    ),
                  ),
                  const SizedBox(height: 6),
                  Flexible(
                    child: SingleChildScrollView(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: changelog
                            .map(
                              (item) => Padding(
                                padding: const EdgeInsets.only(bottom: 4),
                                child: Row(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    const Text(
                                      '• ',
                                      style: TextStyle(
                                        color: Color(0xFF6366F1),
                                      ),
                                    ),
                                    Expanded(
                                      child: Text(
                                        item.toString(),
                                        style: GoogleFonts.outfit(
                                          color: Colors.white60,
                                          fontSize: 13,
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            )
                            .toList(),
                      ),
                    ),
                  ),
                ],
                if (forceUpdate) ...[
                  const SizedBox(height: 16),
                  Text(
                    'This is a required update to continue using the application.',
                    style: GoogleFonts.outfit(
                      color: Colors.redAccent,
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ],
            ),
            actions: [
              if (!forceUpdate)
                TextButton(
                  onPressed: () => Navigator.pop(context),
                  child: Text(
                    'Later',
                    style: GoogleFonts.outfit(color: Colors.white54),
                  ),
                ),
              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF6366F1),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
                onPressed: () async {
                  final uri = Uri.parse(downloadUrl);
                  if (await canLaunchUrl(uri)) {
                    await launchUrl(uri, mode: LaunchMode.externalApplication);
                  } else {
                    if (!context.mounted) return;
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text(
                          'Could not open download link: $downloadUrl',
                        ),
                      ),
                    );
                  }
                },
                child: Text(
                  'Update Now',
                  style: GoogleFonts.outfit(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
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
    _socialHandleController.dispose();
    _socialUrlController.dispose();
    super.dispose();
  }

  Future<void> _fetchProfile() async {
    setState(() {
      _loading = true;
    });

    final res = await _apiService.getProfile();
    if (res != null) {
      setState(() {
        _profile = res['profile'];
        _score = res['score'];
        _checklist = res['checklist'];

        _nameController.text = _profile!.name;
        _taglineController.text = _profile!.tagline;
        _bioController.text = _profile!.bio;
        _phoneController.text = _profile!.phone ?? '';
        _whatsappController.text = _profile!.whatsapp ?? '';
        _locationController.text = _profile!.location ?? '';
      });
    }

    setState(() {
      _loading = false;
    });
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

      setState(() {
        _saving = true;
      });

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
            _score = saveRes['score'];
            _checklist = saveRes['checklist'];
          });
          if (!mounted) return;
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Avatar cropped & uploaded successfully!'),
              backgroundColor: Color(0xFF10B981),
            ),
          );
        }
      } else {
        if (!mounted) return;
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(result['error'] ?? 'Upload failed'),
            backgroundColor: Colors.redAccent,
          ),
        );
      }
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Error picking or cropping image: $e'),
          backgroundColor: Colors.redAccent,
        ),
      );
    } finally {
      if (mounted) {
        setState(() {
          _saving = false;
        });
      }
    }
  }

  Future<void> _saveProfile() async {
    setState(() {
      _saving = true;
    });

    final result = await _apiService.updateProfile({
      'name': _nameController.text.trim(),
      'tagline': _taglineController.text.trim(),
      'bio': _bioController.text.trim(),
      'phone': _phoneController.text.trim(),
      'whatsapp': _whatsappController.text.trim(),
      'location': _locationController.text.trim(),
    });

    setState(() {
      _saving = false;
    });

    if (result['success'] == true) {
      setState(() {
        _profile = result['profile'];
        _score = result['score'];
        _checklist = result['checklist'];
      });
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Profile saved!'),
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
    if (text.isEmpty || _profile == null) return;

    final updatedTags = List<Tag>.from(_profile!.tags);
    if (updatedTags.any(
      (t) => t.text.toLowerCase() == text.toLowerCase() && t.type == _tagType,
    )) {
      return;
    }

    updatedTags.add(Tag(text: text, type: _tagType));

    setState(() {
      _saving = true;
    });

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
        _score = result['score'];
        _checklist = result['checklist'];
      });
    }
  }

  Future<void> _removeTag(int index) async {
    if (_profile == null) return;
    final updatedTags = List<Tag>.from(_profile!.tags)..removeAt(index);

    setState(() {
      _saving = true;
    });

    final result = await _apiService.updateProfile({
      'tags': updatedTags.map((t) => t.toJson()).toList(),
    });

    setState(() {
      _saving = false;
    });

    if (result['success'] == true) {
      setState(() {
        _profile = result['profile'];
        _score = result['score'];
        _checklist = result['checklist'];
      });
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

    final specs =
        platformSpecs[_socialPlatform] ?? {'color': '#6366f1', 'icon': 'link'};

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

    setState(() {
      _saving = true;
    });

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
        _score = result['score'];
        _checklist = result['checklist'];
      });
    }
  }

  Future<void> _removeSocial(int index) async {
    if (_profile == null) return;
    final updatedSocials = List<SocialLink>.from(_profile!.socials)
      ..removeAt(index);

    setState(() {
      _saving = true;
    });

    final result = await _apiService.updateProfile({
      'socials': updatedSocials.map((s) => s.toJson()).toList(),
    });

    setState(() {
      _saving = false;
    });

    if (result['success'] == true) {
      setState(() {
        _profile = result['profile'];
        _score = result['score'];
        _checklist = result['checklist'];
      });
    }
  }

  Future<void> _upgradeToPremium() async {
    setState(() {
      _saving = true;
    });

    final result = await _apiService.updateProfile({'isPremium': true});

    setState(() {
      _saving = false;
    });

    if (result['success'] == true) {
      setState(() {
        _profile = result['profile'];
        _score = result['score'];
        _checklist = result['checklist'];
      });
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Upgraded to Premium successfully!'),
          backgroundColor: Colors.amber,
        ),
      );
    }
  }

  void _showCheckoutDialog() {
    bool processing = false;
    showDialog(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (context, setModalState) {
          return AlertDialog(
            backgroundColor: const Color(0xFF0F1122),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(20),
              side: BorderSide(color: Colors.white.withValues(alpha: 0.1)),
            ),
            title: Text(
              'Tapfolio Checkout',
              style: GoogleFonts.outfit(
                color: Colors.white,
                fontWeight: FontWeight.bold,
              ),
            ),
            content: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Upgrade profile to Premium membership.',
                  style: GoogleFonts.outfit(
                    color: Colors.white70,
                    fontSize: 14,
                  ),
                ),
                const SizedBox(height: 20),
                Text(
                  'Card Number',
                  style: GoogleFonts.outfit(
                    color: Colors.white60,
                    fontSize: 12,
                  ),
                ),
                const SizedBox(height: 4),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 12,
                    vertical: 12,
                  ),
                  decoration: BoxDecoration(
                    color: Colors.white.withValues(alpha: 0.05),
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: Colors.white.withValues(alpha: 0.1)),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.credit_card, color: Colors.white54),
                      const SizedBox(width: 12),
                      Text(
                        '4242 •••• •••• 4242',
                        style: GoogleFonts.outfit(color: Colors.white),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Expires',
                            style: GoogleFonts.outfit(
                              color: Colors.white60,
                              fontSize: 12,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 12,
                              vertical: 12,
                            ),
                            decoration: BoxDecoration(
                              color: Colors.white.withValues(alpha: 0.05),
                              borderRadius: BorderRadius.circular(8),
                              border: Border.all(
                                color: Colors.white.withValues(alpha: 0.1),
                              ),
                            ),
                            child: Text(
                              '12/28',
                              style: GoogleFonts.outfit(color: Colors.white),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'CVC',
                            style: GoogleFonts.outfit(
                              color: Colors.white60,
                              fontSize: 12,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 12,
                              vertical: 12,
                            ),
                            decoration: BoxDecoration(
                              color: Colors.white.withValues(alpha: 0.05),
                              borderRadius: BorderRadius.circular(8),
                              border: Border.all(
                                color: Colors.white.withValues(alpha: 0.1),
                              ),
                            ),
                            child: Text(
                              '***',
                              style: GoogleFonts.outfit(color: Colors.white),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ],
            ),
            actions: [
              TextButton(
                onPressed: processing ? null : () => Navigator.pop(context),
                child: Text(
                  'Cancel',
                  style: GoogleFonts.outfit(color: Colors.white54),
                ),
              ),
              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.amber,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
                onPressed: processing
                    ? null
                    : () async {
                        setModalState(() {
                          processing = true;
                        });
                        Navigator.pop(context);
                        await _upgradeToPremium();
                      },
                child: Text(
                  'Pay \$9.99',
                  style: GoogleFonts.outfit(
                    color: Colors.black,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ],
          );
        },
      ),
    );
  }

  // ========== NEW PROFILE CARD BUILDER ==========
  Widget _buildProfileCard() {
    final profile = _profile!;
    final avatarUrl = profile.avatar.startsWith('data:')
        ? MemoryImage(base64Decode(profile.avatar.split(',')[1]))
        : NetworkImage('${_apiService.baseUrl}${profile.avatar}')
              as ImageProvider;

    // Separate role tags, location tags, and other tags
    final roleTags = profile.tags.where((t) => t.type == 'role').toList();
    final locationTags = profile.tags
        .where((t) => t.type == 'location')
        .toList();

    // Social links we want to display (you can filter if needed)
    final socials = profile.socials;

    // Extract WhatsApp separately for "Chat with me"
    final whatsappSocial = socials.firstWhere(
      (s) => s.platform.toLowerCase() == 'whatsapp',
      orElse: () =>
          SocialLink(platform: '', handle: '', url: '', icon: '', color: ''),
    );

    // Extract Behance separately for special button
    final behanceSocial = socials.firstWhere(
      (s) => s.platform.toLowerCase() == 'behance',
      orElse: () =>
          SocialLink(platform: '', handle: '', url: '', icon: '', color: ''),
    );

    // Extract portfolio (Website or custom)
    final portfolioSocial = socials.firstWhere(
      (s) =>
          s.platform.toLowerCase() == 'website' ||
          s.platform.toLowerCase() == 'portfolio',
      orElse: () =>
          SocialLink(platform: '', handle: '', url: '', icon: '', color: ''),
    );

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header: "tapfolio" + score
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'tapfolio',
                style: GoogleFonts.outfit(
                  color: Colors.white,
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 1.2,
                ),
              ),
              Text(
                '$_score',
                style: GoogleFonts.outfit(
                  color: Colors.white70,
                  fontSize: 18,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),

          // "Hey, iam Abhinand"
          Text(
            'Hey, iam ${profile.name}',
            style: GoogleFonts.outfit(
              color: Colors.white,
              fontSize: 28,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            "Let's connect!",
            style: GoogleFonts.outfit(
              color: Colors.white70,
              fontSize: 18,
              fontWeight: FontWeight.w400,
            ),
          ),
          const SizedBox(height: 24),

          // Avatar with gradient border
          Center(
            child: Stack(
              clipBehavior: Clip.none,
              children: [
                Container(
                  width: 120,
                  height: 120,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    gradient: const LinearGradient(
                      colors: [Colors.orange, Colors.pink, Colors.purple],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                  ),
                  child: Padding(
                    padding: const EdgeInsets.all(3.0),
                    child: CircleAvatar(
                      radius: 57,
                      backgroundColor: Colors.black,
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
                      width: 36,
                      height: 36,
                      decoration: const BoxDecoration(
                        color: Color(0xFF6366F1),
                        shape: BoxShape.circle,
                      ),
                      child: _saving
                          ? const SizedBox(
                              width: 18,
                              height: 18,
                              child: CircularProgressIndicator(
                                strokeWidth: 2,
                                color: Colors.white,
                              ),
                            )
                          : const Icon(
                              Icons.camera_alt,
                              size: 18,
                              color: Colors.white,
                            ),
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),

          // Role & Location tags
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: [
              ...roleTags.map(
                (tag) => _buildChip(tag.text, const Color(0xFF6366F1)),
              ),
              ...locationTags.map(
                (tag) => _buildChip(tag.text, Colors.tealAccent),
              ),
            ],
          ),
          const SizedBox(height: 20),

          // Bio
          if (profile.bio.isNotEmpty)
            Text(
              profile.bio,
              style: GoogleFonts.outfit(
                color: Colors.white70,
                fontSize: 16,
                height: 1.5,
              ),
            ),
          const SizedBox(height: 24),

          // Connect with me
          Text(
            'Connect with me',
            style: GoogleFonts.outfit(
              color: Colors.white,
              fontSize: 18,
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: 12),
          ...socials
              .where(
                (s) =>
                    s.platform.toLowerCase() != 'whatsapp' &&
                    s.platform.toLowerCase() != 'behance',
              )
              .map((social) => _buildSocialTile(social)),
          const SizedBox(height: 16),

          // Chat with me (WhatsApp)
          if (whatsappSocial.url.isNotEmpty) ...[
            Text(
              'Chat with me',
              style: GoogleFonts.outfit(
                color: Colors.white,
                fontSize: 18,
                fontWeight: FontWeight.w600,
              ),
            ),
            const SizedBox(height: 12),
            _buildSocialTile(whatsappSocial),
            const SizedBox(height: 16),
          ],

          // Action buttons: Download CV, Portfolio, Behance
          Text(
            'Download My CV / Resume',
            style: GoogleFonts.outfit(
              color: Colors.white,
              fontSize: 16,
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: 8),
          _buildActionButton(
            icon: Icons.download,
            label: 'View & Download',
            onPressed: () {
              // Replace with actual CV URL from your profile model or a constant
              // For now, we'll show a snackbar
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('CV download will be available soon.'),
                ),
              );
            },
          ),
          const SizedBox(height: 12),

          if (portfolioSocial.url.isNotEmpty) ...[
            Text(
              'Portfolio Link',
              style: GoogleFonts.outfit(
                color: Colors.white,
                fontSize: 16,
                fontWeight: FontWeight.w600,
              ),
            ),
            const SizedBox(height: 8),
            _buildActionButton(
              icon: Icons.link,
              label: portfolioSocial.url.replaceFirst(
                RegExp(r'^https?://'),
                '',
              ),
              onPressed: () async {
                final uri = Uri.parse(portfolioSocial.url);
                if (await canLaunchUrl(uri)) {
                  await launchUrl(uri, mode: LaunchMode.externalApplication);
                }
              },
            ),
            const SizedBox(height: 12),
          ],

          if (behanceSocial.url.isNotEmpty) ...[
            Text(
              'Behance',
              style: GoogleFonts.outfit(
                color: Colors.white,
                fontSize: 16,
                fontWeight: FontWeight.w600,
              ),
            ),
            const SizedBox(height: 8),
            _buildActionButton(
              icon: Icons.brush,
              label: behanceSocial.handle.isNotEmpty
                  ? behanceSocial.handle
                  : 'Behance',
              onPressed: () async {
                final uri = Uri.parse(behanceSocial.url);
                if (await canLaunchUrl(uri)) {
                  await launchUrl(uri, mode: LaunchMode.externalApplication);
                }
              },
            ),
            const SizedBox(height: 12),
          ],

          // Quote
          const SizedBox(height: 20),
          Center(
            child: Text(
              'Design is not just what it looks like,\nit\'s how it connects.',
              textAlign: TextAlign.center,
              style: GoogleFonts.outfit(
                color: Colors.white70,
                fontSize: 14,
                fontStyle: FontStyle.italic,
                height: 1.6,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildChip(String label, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.15),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: color.withValues(alpha: 0.4)),
      ),
      child: Text(
        label,
        style: GoogleFonts.outfit(
          color: color,
          fontSize: 14,
          fontWeight: FontWeight.w500,
        ),
      ),
    );
  }

  Widget _buildSocialTile(SocialLink social) {
    return GestureDetector(
      onTap: () async {
        final uri = Uri.parse(social.url);
        if (await canLaunchUrl(uri)) {
          await launchUrl(uri, mode: LaunchMode.externalApplication);
        }
      },
      child: Container(
        margin: const EdgeInsets.only(bottom: 8),
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
        decoration: BoxDecoration(
          color: Colors.white.withValues(alpha: 0.03),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: Colors.white.withValues(alpha: 0.06)),
        ),
        child: Row(
          children: [
            _buildSocialIcon(
              social.icon,
              Color(int.parse(social.color.replaceFirst('#', '0xFF'))),
            ),
            const SizedBox(width: 12),
            Text(
              social.handle.isNotEmpty ? social.handle : social.url,
              style: GoogleFonts.outfit(
                color: Colors.white70,
                fontSize: 15,
                fontWeight: FontWeight.w500,
              ),
            ),
            const Spacer(),
            const Icon(Icons.chevron_right, color: Colors.white24, size: 18),
          ],
        ),
      ),
    );
  }

  /// Builds the correct icon widget for a social platform.
  /// Uses [FaIcon] for FontAwesome icons and [Icon] for Material icons,
  /// avoiding the FalconData → IconData cast error in font_awesome_flutter v11.
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

  Widget _buildActionButton({
    required IconData icon,
    required String label,
    required VoidCallback onPressed,
  }) {
    return Container(
      width: double.infinity,
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.04),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.white.withValues(alpha: 0.08)),
      ),
      child: TextButton.icon(
        onPressed: onPressed,
        icon: Icon(icon, color: Colors.white70, size: 20),
        label: Text(
          label,
          style: GoogleFonts.outfit(
            color: Colors.white70,
            fontSize: 15,
            fontWeight: FontWeight.w500,
          ),
        ),
        style: TextButton.styleFrom(
          padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 16),
          alignment: Alignment.centerLeft,
        ),
      ),
    );
  }

  // ========== ORIGINAL EDIT FORM (unchanged but moved to separate method) ==========
  Widget _buildEditForm() {
    final profile = _profile!;
    final publicLink = '${_apiService.baseUrl}/connect/${profile.username}';

    return Column(
      children: [
        // Pending Connection Requests Card
        if (_pendingCount > 0)
          GestureDetector(
            onTap: () => Navigator.of(context).pushNamed('/connections'),
            child: Container(
              margin: const EdgeInsets.only(bottom: 12),
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    const Color(0xFF6366f1).withValues(alpha: 0.18),
                    const Color(0xFF818cf8).withValues(alpha: 0.10),
                  ],
                ),
                borderRadius: BorderRadius.circular(14),
                border: Border.all(
                  color: const Color(0xFF6366f1).withValues(alpha: 0.35),
                ),
              ),
              child: Row(
                children: [
                  const Icon(
                    Icons.people,
                    color: Color(0xFF6366F1),
                    size: 24,
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          '$_pendingCount Pending Connection${_pendingCount > 1 ? 's' : ''}',
                          style: GoogleFonts.outfit(
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                            fontSize: 15,
                          ),
                        ),
                        Text(
                          'Tap to review requests',
                          style: GoogleFonts.outfit(
                            color: Colors.white54,
                            fontSize: 12,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const Icon(Icons.chevron_right, color: Colors.white38),
                ],
              ),
            ),
          ),

        // Public NFC Link Card
        _buildGlassCard(
          children: [
            Text(
              'Share NFC Card',
              style: GoogleFonts.outfit(
                color: Colors.white,
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              'Link programmed to your physical tag.',
              style: GoogleFonts.outfit(color: Colors.white60, fontSize: 13),
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 12,
                      vertical: 10,
                    ),
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: 0.04),
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(
                        color: Colors.white.withValues(alpha: 0.08),
                      ),
                    ),
                    child: Text(
                      publicLink,
                      style: GoogleFonts.outfit(
                        color: Colors.white70,
                        fontSize: 13,
                      ),
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF6366F1),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                    padding: const EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 12,
                    ),
                  ),
                  onPressed: () {
                    Clipboard.setData(ClipboardData(text: publicLink));
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('Link copied to clipboard!'),
                      ),
                    );
                  },
                  child: Text(
                    'Copy',
                    style: GoogleFonts.outfit(color: Colors.white),
                  ),
                ),
              ],
            ),
          ],
        ),

        // Score / Checklist Card
        _buildGlassCard(
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Profile Score',
                  style: GoogleFonts.outfit(
                    color: Colors.white,
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 8,
                    vertical: 4,
                  ),
                  decoration: BoxDecoration(
                    color: const Color(0xFF6366F1).withValues(alpha: 0.2),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    '$_score / 100',
                    style: GoogleFonts.outfit(
                      color: const Color(0xFF6366F1),
                      fontWeight: FontWeight.bold,
                      fontSize: 14,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            ClipRRect(
              borderRadius: BorderRadius.circular(6),
              child: LinearProgressIndicator(
                value: _score / 100,
                backgroundColor: Colors.white.withValues(alpha: 0.1),
                color: const Color(0xFF6366F1),
                minHeight: 12,
              ),
            ),
            const SizedBox(height: 16),
            ..._checklist.map((item) {
              return Padding(
                padding: const EdgeInsets.only(bottom: 12.0),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Icon(
                      item.completed
                          ? Icons.check_circle
                          : Icons.radio_button_unchecked,
                      color: item.completed
                          ? const Color(0xFF10B981)
                          : Colors.white38,
                      size: 20,
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Text(
                                item.label,
                                style: GoogleFonts.outfit(
                                  color: item.completed
                                      ? Colors.white
                                      : Colors.white60,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              const SizedBox(width: 6),
                              Text(
                                '+${item.points} pts',
                                style: GoogleFonts.outfit(
                                  color: const Color(0xFF6366F1),
                                  fontSize: 11,
                                ),
                              ),
                            ],
                          ),
                          Text(
                            item.description,
                            style: GoogleFonts.outfit(
                              color: Colors.white38,
                              fontSize: 12,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              );
            }),
          ],
        ),

        // Premium Subscription Card
        _buildGlassCard(
          children: [
            profile.isPremium
                ? Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 10,
                          vertical: 6,
                        ),
                        decoration: BoxDecoration(
                          color: Colors.amber.withValues(alpha: 0.2),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Text(
                          '💎 PREMIUM MEMBER',
                          style: GoogleFonts.outfit(
                            color: Colors.amber,
                            fontWeight: FontWeight.bold,
                            fontSize: 12,
                          ),
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'Your profile subscription is active! Reach 60 pts to join the public rankings.',
                        style: GoogleFonts.outfit(
                          color: Colors.white70,
                          fontSize: 14,
                        ),
                      ),
                    ],
                  )
                : Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Tapfolio Premium',
                        style: GoogleFonts.outfit(
                          color: Colors.white,
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Upgrade to premium to display your profile in the global leaderboard.',
                        style: GoogleFonts.outfit(
                          color: Colors.white60,
                          fontSize: 13,
                        ),
                      ),
                      const SizedBox(height: 14),
                      SizedBox(
                        width: double.infinity,
                        child: ElevatedButton(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.amber,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(8),
                            ),
                          ),
                          onPressed: _saving ? null : _showCheckoutDialog,
                          child: Text(
                            'Upgrade for \$9.99',
                            style: GoogleFonts.outfit(
                              color: Colors.black,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
          ],
        ),

        // Edit Profile Details Card
        _buildGlassCard(
          children: [
            Text(
              'Edit Profile details',
              style: GoogleFonts.outfit(
                color: Colors.white,
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            // Avatar
            Center(
              child: Stack(
                children: [
                  CircleAvatar(
                    radius: 50,
                    backgroundColor: Colors.white10,
                    backgroundImage: profile.avatar.startsWith('data:')
                        ? MemoryImage(
                            base64Decode(profile.avatar.split(',')[1]),
                          )
                        : NetworkImage(
                                '${_apiService.baseUrl}${profile.avatar}',
                              )
                              as ImageProvider,
                  ),
                  Positioned(
                    bottom: 0,
                    right: 0,
                    child: GestureDetector(
                      onTap: _saving ? null : _pickAndUploadImage,
                      child: CircleAvatar(
                        radius: 18,
                        backgroundColor: const Color(0xFF6366F1),
                        child: _saving
                            ? const SizedBox(
                                width: 14,
                                height: 14,
                                child: CircularProgressIndicator(
                                  strokeWidth: 2,
                                  color: Colors.white,
                                ),
                              )
                            : const Icon(
                                Icons.camera_alt,
                                size: 16,
                                color: Colors.white,
                              ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),
            _buildTextField(_nameController, 'Full Name'),
            _buildTextField(_taglineController, 'Card Tagline'),
            _buildTextField(_bioController, 'Professional Bio', maxLines: 4),
            _buildTextField(_phoneController, 'Phone Number'),
            _buildTextField(_whatsappController, 'WhatsApp Handle/Number'),
            _buildTextField(
              _locationController,
              'Location (e.g. Kerala, India)',
            ),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF6366F1),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
                onPressed: _saving ? null : _saveProfile,
                child: _saving
                    ? const SizedBox(
                        width: 20,
                        height: 20,
                        child: CircularProgressIndicator(color: Colors.white),
                      )
                    : Text(
                        'Save Profile Card',
                        style: GoogleFonts.outfit(color: Colors.white),
                      ),
              ),
            ),
          ],
        ),

        // Tags Card
        _buildGlassCard(
          children: [
            Text(
              'Skills & Location Tags',
              style: GoogleFonts.outfit(
                color: Colors.white,
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: Container(
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: 0.04),
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: Colors.white.withValues(alpha: 0.08)),
                    ),
                    child: TextField(
                      controller: _tagController,
                      style: GoogleFonts.outfit(color: Colors.white),
                      decoration: const InputDecoration(
                        hintText: 'Tag name',
                        hintStyle: TextStyle(color: Colors.white24),
                        border: InputBorder.none,
                        contentPadding: EdgeInsets.symmetric(
                          horizontal: 12,
                          vertical: 10,
                        ),
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8),
                  decoration: BoxDecoration(
                    color: Colors.white.withValues(alpha: 0.04),
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: Colors.white.withValues(alpha: 0.08)),
                  ),
                  child: DropdownButtonHideUnderline(
                    child: DropdownButton<String>(
                      dropdownColor: const Color(0xFF0F1122),
                      value: _tagType,
                      style: GoogleFonts.outfit(color: Colors.white),
                      onChanged: (String? newVal) {
                        if (newVal != null) {
                          setState(() {
                            _tagType = newVal;
                          });
                        }
                      },
                      items: const [
                        DropdownMenuItem(
                          value: 'role',
                          child: Text('Role/Skill'),
                        ),
                        DropdownMenuItem(
                          value: 'location',
                          child: Text('Location'),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                IconButton(
                  icon: const Icon(
                    Icons.add_circle,
                    color: Color(0xFF6366F1),
                    size: 36,
                  ),
                  onPressed: _saving ? null : _addTag,
                ),
              ],
            ),
            const SizedBox(height: 16),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: List.generate(profile.tags.length, (idx) {
                final tag = profile.tags[idx];
                final isRole = tag.type == 'role';
                return Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 10,
                    vertical: 6,
                  ),
                  decoration: BoxDecoration(
                    color: isRole
                        ? const Color(0xFF6366F1).withValues(alpha: 0.1)
                        : Colors.teal.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(
                      color: isRole
                          ? const Color(0xFF6366F1).withValues(alpha: 0.3)
                          : Colors.teal.withValues(alpha: 0.3),
                    ),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        tag.text,
                        style: GoogleFonts.outfit(
                          color: isRole
                              ? const Color(0xFF6366F1)
                              : Colors.tealAccent,
                          fontSize: 13,
                        ),
                      ),
                      const SizedBox(width: 4),
                      GestureDetector(
                        onTap: _saving ? null : () => _removeTag(idx),
                        child: const Icon(
                          Icons.close,
                          size: 14,
                          color: Colors.white54,
                        ),
                      ),
                    ],
                  ),
                );
              }),
            ),
          ],
        ),

        // Socials Card
        _buildGlassCard(
          children: [
            Text(
              'Social Profiles',
              style: GoogleFonts.outfit(
                color: Colors.white,
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8),
                  decoration: BoxDecoration(
                    color: Colors.white.withValues(alpha: 0.04),
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: Colors.white.withValues(alpha: 0.08)),
                  ),
                  child: DropdownButtonHideUnderline(
                    child: DropdownButton<String>(
                      dropdownColor: const Color(0xFF0F1122),
                      value: _socialPlatform,
                      style: GoogleFonts.outfit(color: Colors.white),
                      onChanged: (String? newVal) {
                        if (newVal != null) {
                          setState(() {
                            _socialPlatform = newVal;
                          });
                        }
                      },
                      items: const [
                        DropdownMenuItem(
                          value: 'GitHub',
                          child: Text('GitHub'),
                        ),
                        DropdownMenuItem(
                          value: 'LinkedIn',
                          child: Text('LinkedIn'),
                        ),
                        DropdownMenuItem(
                          value: 'Twitter',
                          child: Text('Twitter'),
                        ),
                        DropdownMenuItem(
                          value: 'Instagram',
                          child: Text('Instagram'),
                        ),
                        DropdownMenuItem(
                          value: 'YouTube',
                          child: Text('YouTube'),
                        ),
                        DropdownMenuItem(
                          value: 'Website',
                          child: Text('Website'),
                        ),
                        DropdownMenuItem(
                          value: 'Telegram',
                          child: Text('Telegram'),
                        ),
                        DropdownMenuItem(
                          value: 'WhatsApp',
                          child: Text('WhatsApp'),
                        ),
                        DropdownMenuItem(
                          value: 'Behance',
                          child: Text('Behance'),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: Container(
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: 0.04),
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: Colors.white.withValues(alpha: 0.08)),
                    ),
                    child: TextField(
                      controller: _socialHandleController,
                      style: GoogleFonts.outfit(color: Colors.white),
                      decoration: const InputDecoration(
                        hintText: 'Handle',
                        hintStyle: TextStyle(color: Colors.white24),
                        border: InputBorder.none,
                        contentPadding: EdgeInsets.symmetric(
                          horizontal: 12,
                          vertical: 10,
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                Expanded(
                  child: Container(
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: 0.04),
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: Colors.white.withValues(alpha: 0.08)),
                    ),
                    child: TextField(
                      controller: _socialUrlController,
                      style: GoogleFonts.outfit(color: Colors.white),
                      decoration: const InputDecoration(
                        hintText: 'URL (e.g. github.com/username)',
                        hintStyle: TextStyle(color: Colors.white24),
                        border: InputBorder.none,
                        contentPadding: EdgeInsets.symmetric(
                          horizontal: 12,
                          vertical: 10,
                        ),
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                IconButton(
                  icon: const Icon(
                    Icons.add_circle,
                    color: Color(0xFF6366F1),
                    size: 36,
                  ),
                  onPressed: _saving ? null : _addSocial,
                ),
              ],
            ),
            const SizedBox(height: 16),
            ...List.generate(profile.socials.length, (idx) {
              final link = profile.socials[idx];
              final cardColor = Color(
                int.parse(link.color.replaceFirst('#', '0xFF')),
              );
              return Container(
                margin: const EdgeInsets.only(bottom: 8),
                padding: const EdgeInsets.symmetric(
                  horizontal: 12,
                  vertical: 10,
                ),
                decoration: BoxDecoration(
                  color: Colors.white.withValues(alpha: 0.02),
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: cardColor.withValues(alpha: 0.2)),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        Container(
                          width: 10,
                          height: 10,
                          decoration: BoxDecoration(
                            color: cardColor,
                            shape: BoxShape.circle,
                          ),
                        ),
                        const SizedBox(width: 10),
                        Text(
                          '${link.platform}: ',
                          style: GoogleFonts.outfit(
                            color: Colors.white70,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        Text(
                          link.handle,
                          style: GoogleFonts.outfit(color: Colors.white),
                        ),
                      ],
                    ),
                    GestureDetector(
                      onTap: _saving ? null : () => _removeSocial(idx),
                      child: const Icon(
                        Icons.delete,
                        color: Colors.redAccent,
                        size: 18,
                      ),
                    ),
                  ],
                ),
              );
            }),
          ],
        ),

        // App Update Card
        _buildGlassCard(
          children: [
            Text(
              'Application Update',
              style: GoogleFonts.outfit(
                color: Colors.white,
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              'Check if you are running the latest version of Tapfolio.',
              style: GoogleFonts.outfit(color: Colors.white60, fontSize: 13),
            ),
            const SizedBox(height: 14),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF6366F1),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
                onPressed: () => _checkForUpdates(silent: false),
                child: Text(
                  'Check for Updates',
                  style: GoogleFonts.outfit(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
          ],
        ),
      ],
    );
  }

  // ========== HELPER WIDGETS FOR EDIT FORM ==========
  Widget _buildGlassCard({
    required List<Widget> children,
    CrossAxisAlignment crossAxisAlignment = CrossAxisAlignment.start,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 24),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.03),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white.withValues(alpha: 0.06)),
      ),
      child: Column(crossAxisAlignment: crossAxisAlignment, children: children),
    );
  }

  Widget _buildTextField(
    TextEditingController controller,
    String label, {
    int maxLines = 1,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: GoogleFonts.outfit(
            color: Colors.white70,
            fontSize: 14,
            fontWeight: FontWeight.w500,
          ),
        ),
        const SizedBox(height: 6),
        Container(
          decoration: BoxDecoration(
            color: Colors.white.withValues(alpha: 0.04),
            borderRadius: BorderRadius.circular(8),
            border: Border.all(color: Colors.white.withValues(alpha: 0.08)),
          ),
          child: TextField(
            controller: controller,
            maxLines: maxLines,
            style: GoogleFonts.outfit(color: Colors.white),
            decoration: const InputDecoration(
              border: InputBorder.none,
              contentPadding: EdgeInsets.symmetric(
                horizontal: 12,
                vertical: 10,
              ),
            ),
          ),
        ),
        const SizedBox(height: 16),
      ],
    );
  }

  // ========== MAIN BUILD ==========
  @override
  Widget build(BuildContext context) {
    if (_loading) {
      return const Center(
        child: CircularProgressIndicator(color: Color(0xFF6366F1)),
      );
    }

    if (_profile == null) {
      return Scaffold(
        backgroundColor: const Color(0xFF06070D),
        body: Center(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(
                  Icons.error_outline_rounded,
                  color: Colors.redAccent,
                  size: 48,
                ),
                const SizedBox(height: 16),
                Text(
                  'Unable to load profile card.',
                  style: GoogleFonts.outfit(
                    color: Colors.white,
                    fontWeight: FontWeight.w600,
                    fontSize: 16,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Please check your internet connection and try again.',
                  textAlign: TextAlign.center,
                  style: GoogleFonts.outfit(
                    color: Colors.white38,
                    fontSize: 13,
                  ),
                ),
                const SizedBox(height: 24),
                ElevatedButton.icon(
                  onPressed: _fetchProfile,
                  icon: const Icon(Icons.refresh_rounded),
                  label: const Text('Retry'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF6366F1),
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      );
    }

    return Scaffold(
      backgroundColor: const Color(0xFF0A0A0F),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          setState(() {
            _isEditing = !_isEditing;
          });
        },
        backgroundColor: const Color(0xFF6366F1),
        child: Icon(_isEditing ? Icons.visibility : Icons.edit),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.only(bottom: 80),
          child: _isEditing ? _buildEditForm() : _buildProfileCard(),
        ),
      ),
    );
  }
}

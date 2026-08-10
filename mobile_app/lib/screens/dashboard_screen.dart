import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:image_picker/image_picker.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import '../models/profile.dart';
import '../models/tag.dart';
import '../models/social_link.dart';
import '../models/checklist_item.dart';
import '../core/utils/color_parser.dart';
import '../core/utils/image_helper.dart';
import '../services/api_service.dart';
import '../widgets/image_crop_dialog.dart';
import 'theme_studio/theme_studio_screen.dart';
import '../features/card_export/dialog/share_card_dialog.dart';

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

  bool get _isLight => Theme.of(context).brightness == Brightness.light;
  Color get _textColor => _isLight ? const Color(0xFF1F2937) : Colors.white;
  Color get _subtitleColor =>
      _isLight ? const Color(0xFF4B5563) : Colors.white70;
  Color get _cardBg =>
      _isLight ? Colors.white : Colors.white.withValues(alpha: 0.05);
  Color get _cardBorder => _isLight ? Colors.black12 : Colors.white10;
  Color get _inputBg =>
      _isLight ? const Color(0xFFF3F4F6) : Colors.white.withValues(alpha: 0.04);
  Color get _inputBorder =>
      _isLight ? Colors.black12 : Colors.white.withValues(alpha: 0.08);
  Color get _hintColor => _isLight ? Colors.black38 : Colors.white24;
  Color get _dropdownBg => _isLight ? Colors.white : const Color(0xFF0F1122);

  // Controllers
  final _nameController = TextEditingController();
  final _taglineController = TextEditingController();
  final _bioController = TextEditingController();
  final _phoneController = TextEditingController();
  final _whatsappController = TextEditingController();
  final _locationController = TextEditingController();

  // Tags states
  final _tagController = TextEditingController();

  // Socials states
  String _socialPlatform = 'GitHub';
  final _socialHandleController = TextEditingController();
  final _socialUrlController = TextEditingController();

  _DashboardScreenState() {
    debugPrint('[TRACE-DASHBOARD] State constructor called.');
  }

  @override
  void initState() {
    debugPrint('[TRACE-DASHBOARD] initState() started.');
    super.initState();
    debugPrint('[TRACE-DASHBOARD] Calling _fetchProfile()...');
    _fetchProfile();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      debugPrint('[TRACE-DASHBOARD] postFrameCallback triggered.');
      _fetchPendingCount();
      debugPrint('[TRACE-DASHBOARD] postFrameCallback completed.');
    });
    debugPrint('[TRACE-DASHBOARD] initState() completed.');
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
                  final String fullDownloadUrl = downloadUrl.startsWith('/')
                      ? '${_apiService.baseUrl}$downloadUrl'
                      : downloadUrl;
                  final uri = Uri.parse(fullDownloadUrl);
                  if (await canLaunchUrl(uri)) {
                    await launchUrl(uri, mode: LaunchMode.externalApplication);
                  } else {
                    if (!context.mounted) return;
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text(
                          'Could not open download link: $fullDownloadUrl',
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

    try {
      final res = await _apiService.getProfile();
      if (res != null && res['profile'] != null) {
        setState(() {
          _profile = res['profile'];
          _score = res['score'];
          _checklist = res['checklist'];

          _nameController.text = _profile!.name;
          _taglineController.text = _profile!.tagline;
          _bioController.text = _profile!.bio;
          _phoneController.text =
              (_profile!.phone != null && _profile!.phone!.isNotEmpty)
              ? (_profile!.phone!.startsWith('+')
                    ? _profile!.phone!
                    : (_profile!.phone!.replaceAll(RegExp(r'\D'), '').length ==
                              10
                          ? '+91${_profile!.phone!.replaceAll(RegExp(r'\D'), '')}'
                          : _profile!.phone!))
              : '+91';
          _whatsappController.text =
              (_profile!.whatsapp != null && _profile!.whatsapp!.isNotEmpty)
              ? (_profile!.whatsapp!.startsWith('+')
                    ? _profile!.whatsapp!
                    : (_profile!.whatsapp!
                                  .replaceAll(RegExp(r'\D'), '')
                                  .length ==
                              10
                          ? '+91${_profile!.whatsapp!.replaceAll(RegExp(r'\D'), '')}'
                          : _profile!.whatsapp!))
              : '+91';
          _locationController.text = _profile!.location ?? '';
        });
      } else {
        setState(() {
          _profile = null;
        });
      }
    } catch (e, stackTrace) {
      debugPrint('[DASHBOARD] _fetchProfile error: $e');
      debugPrint('[DASHBOARD] StackTrace: $stackTrace');
      setState(() {
        _profile = null;
      });
    } finally {
      if (mounted) {
        setState(() {
          _loading = false;
        });
      }
    }
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
      (t) => t.text.toLowerCase() == text.toLowerCase(),
    )) {
      return;
    }

    updatedTags.add(Tag(text: text, type: 'role'));

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
                    border: Border.all(
                      color: Colors.white.withValues(alpha: 0.1),
                    ),
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
    final avatarUrl = getAvatarImage(profile.avatar, _apiService.baseUrl);

    // Separate role tags, location tags, and other tags
    final roleTags = profile.tags.where((t) => t.type == 'role').toList();
    final socials = profile.socials;

    // Extract WhatsApp separately
    final whatsappSocial = socials.firstWhere(
      (s) => s.platform.toLowerCase() == 'whatsapp',
      orElse: () =>
          SocialLink(platform: '', handle: '', url: '', icon: '', color: ''),
    );

    // Extract Behance separately
    final behanceSocial = socials.firstWhere(
      (s) => s.platform.toLowerCase() == 'behance',
      orElse: () =>
          SocialLink(platform: '', handle: '', url: '', icon: '', color: ''),
    );

    // Extract portfolio
    final portfolioSocial = socials.firstWhere(
      (s) =>
          s.platform.toLowerCase() == 'website' ||
          s.platform.toLowerCase() == 'portfolio',
      orElse: () =>
          SocialLink(platform: '', handle: '', url: '', icon: '', color: ''),
    );

    // Dynamic mock chips based on mockup style
    List<Widget> chips = [];
    String role1 = roleTags.isNotEmpty ? roleTags[0].text : 'UI/UX Designer';
    chips.add(_buildMockChip(Icons.person, role1));
    chips.add(const SizedBox(height: 8));

    String role2 = roleTags.length > 1 ? roleTags[1].text : 'Digital Creator';
    chips.add(_buildMockChip(Icons.videocam, role2));
    chips.add(const SizedBox(height: 8));

    String loc = (profile.location != null && profile.location!.isNotEmpty)
        ? profile.location!
        : 'Bangalore, India';
    chips.add(_buildMockChip(Icons.location_on, loc));

    // Map socials
    final socialTilesList = socials
        .where(
          (s) =>
              s.platform.toLowerCase() != 'whatsapp' &&
              s.platform.toLowerCase() != 'behance' &&
              s.platform.toLowerCase() != 'website' &&
              s.platform.toLowerCase() != 'portfolio',
        )
        .map((social) {
          return _buildMockSocialTile(
            icon: _buildBrandIcon(
              social.platform,
              social.icon,
              parseHexColor(social.color),
            ),
            title: social.platform,
            subtitle: social.handle.isNotEmpty ? social.handle : social.url,
            onTap: () async {
              final uri = Uri.parse(social.url);
              if (await canLaunchUrl(uri)) {
                await launchUrl(uri, mode: LaunchMode.externalApplication);
              }
            },
          );
        })
        .toList();

    // Map WhatsApp
    Widget? whatsappTile;
    if (whatsappSocial.url.isNotEmpty) {
      whatsappTile = _buildMockSocialTile(
        icon: _buildBrandIcon('whatsapp', whatsappSocial.icon, Colors.green),
        title: 'WhatsApp',
        subtitle: whatsappSocial.handle.isNotEmpty
            ? whatsappSocial.handle
            : 'Chat with me',
        onTap: () async {
          final uri = Uri.parse(whatsappSocial.url);
          if (await canLaunchUrl(uri)) {
            await launchUrl(uri, mode: LaunchMode.externalApplication);
          }
        },
      );
    }

    // Map CV
    final cvTile = _buildMockSocialTile(
      icon: _buildBrandIcon('cv', '', const Color(0xFF0052FF)),
      title: 'Download My CV / Resume',
      subtitle: 'View & Download',
      onTap: () {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('CV download will be available soon.')),
        );
      },
    );

    // Map Portfolio
    Widget? portfolioTile;
    if (portfolioSocial.url.isNotEmpty) {
      portfolioTile = _buildMockSocialTile(
        icon: _buildBrandIcon('website', '', const Color(0xFF0052FF)),
        title: 'Portfolio Link',
        subtitle: portfolioSocial.url.replaceFirst(RegExp(r'^https?://'), ''),
        onTap: () async {
          final uri = Uri.parse(portfolioSocial.url);
          if (await canLaunchUrl(uri)) {
            await launchUrl(uri, mode: LaunchMode.externalApplication);
          }
        },
      );
    }

    // Map Behance
    Widget? behanceTile;
    if (behanceSocial.url.isNotEmpty) {
      behanceTile = _buildMockSocialTile(
        icon: _buildBrandIcon(
          'behance',
          behanceSocial.icon,
          const Color(0xFF1769FF),
        ),
        title: 'Behance',
        subtitle: behanceSocial.handle.isNotEmpty
            ? behanceSocial.handle
            : 'Behance Profile',
        onTap: () async {
          final uri = Uri.parse(behanceSocial.url);
          if (await canLaunchUrl(uri)) {
            await launchUrl(uri, mode: LaunchMode.externalApplication);
          }
        },
      );
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // ─── Greeting Name Header ───
          Row(
            children: [
              const Text('👋 ', style: TextStyle(fontSize: 16)),
              Text(
                'Hey, i am',
                style: GoogleFonts.outfit(
                  color: _subtitleColor,
                  fontSize: 15,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ],
          ),
          const SizedBox(height: 2),
          Text(
            profile.name,
            style: GoogleFonts.outfit(
              color: const Color(0xFF0B1B3D),
              fontSize: 28,
              fontWeight: FontWeight.w800,
            ),
          ),
          const SizedBox(height: 4),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                profile.tagline,
                style: GoogleFonts.outfit(
                  color: const Color(0xFF0052FF),
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 2),
              Container(
                width: profile.tagline.length * 7.5,
                constraints: const BoxConstraints(maxWidth: 200),
                height: 2,
                decoration: BoxDecoration(
                  color: const Color(0xFF0052FF),
                  borderRadius: BorderRadius.circular(1),
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),

          // ─── Avatar and Chips Row ───
          Row(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              // Avatar with Double Border & Green Status Dot
              Stack(
                clipBehavior: Clip.none,
                children: [
                  Container(
                    width: 104,
                    height: 104,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      border: Border.all(
                        color: const Color(0xFF0052FF),
                        width: 1.5,
                      ),
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
                  if (profile.isOnline)
                    Positioned(
                      bottom: 4,
                      right: 4,
                      child: Container(
                        width: 16,
                        height: 16,
                        decoration: BoxDecoration(
                          color: const Color(0xFF4ADE80),
                          shape: BoxShape.circle,
                          border: Border.all(color: Colors.white, width: 2.5),
                        ),
                      ),
                    ),
                ],
              ),
              const SizedBox(width: 20),
              // Chips List
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: chips,
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),

          // ─── Bio Description ───
          if (profile.bio.isNotEmpty) ...[
            Text(
              profile.bio,
              style: GoogleFonts.outfit(
                color: const Color(0xFF374151),
                fontSize: 15,
                height: 1.5,
                fontWeight: FontWeight.w400,
              ),
            ),
            const SizedBox(height: 24),
          ],

          // ─── SINGLE LARGE CARD FOR ALL SOCIALS & ACTIONS ───
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(24),
              border: Border.all(color: const Color(0xFFEEF2F6)),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.02),
                  blurRadius: 10,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                // Connect Header Dots
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      '···',
                      style: GoogleFonts.outfit(
                        color: const Color(0xFF0052FF),
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                      ),
                    ),
                    const SizedBox(width: 12),
                    Text(
                      'Connect with me',
                      style: GoogleFonts.outfit(
                        color: const Color(0xFF0052FF),
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(width: 12),
                    Text(
                      '···',
                      style: GoogleFonts.outfit(
                        color: const Color(0xFF0052FF),
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 20),

                // All Link Tiles
                ...socialTilesList,
                if (whatsappTile != null) whatsappTile,
                cvTile,
                if (portfolioTile != null) portfolioTile,
                if (behanceTile != null) behanceTile,
                const SizedBox(height: 12),

                // Blue Quote Container
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.symmetric(
                    horizontal: 16,
                    vertical: 16,
                  ),
                  decoration: BoxDecoration(
                    color: const Color(0xFF0052FF),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Row(
                    children: [
                      const Icon(
                        Icons.format_quote_rounded,
                        color: Colors.white24,
                        size: 24,
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          "Design is not just what it looks like, it's how it connects.",
                          style: GoogleFonts.outfit(
                            color: Colors.white,
                            fontSize: 12,
                            fontWeight: FontWeight.w500,
                            height: 1.4,
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Text(
                        profile.name.split(' ')[0], // First name as signature
                        style: GoogleFonts.yellowtail(
                          color: Colors.white,
                          fontSize: 22,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMockChip(IconData icon, String text) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        color: const Color(0xFF0052FF).withValues(alpha: 0.05),
        borderRadius: BorderRadius.circular(10),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, color: const Color(0xFF0052FF), size: 15),
          const SizedBox(width: 8),
          Flexible(
            child: Text(
              text,
              style: GoogleFonts.outfit(
                color: const Color(0xFF1F2937),
                fontSize: 13,
                fontWeight: FontWeight.w500,
              ),
              overflow: TextOverflow.ellipsis,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMockSocialTile({
    required Widget icon,
    required String title,
    required String subtitle,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: const Color(0xFFEEF2F6)),
        ),
        child: Row(
          children: [
            icon,
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: GoogleFonts.outfit(
                      color: const Color(0xFF1F2937),
                      fontSize: 15,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    subtitle,
                    style: GoogleFonts.outfit(
                      color: const Color(0xFF6B7280),
                      fontSize: 13,
                      fontWeight: FontWeight.w400,
                    ),
                    overflow: TextOverflow.ellipsis,
                  ),
                ],
              ),
            ),
            const Icon(
              Icons.chevron_right_rounded,
              color: Colors.black26,
              size: 20,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildBrandIcon(
    String platformName,
    String iconName,
    Color fallbackColor,
  ) {
    final String pName = platformName.toLowerCase();

    if (pName == 'instagram') {
      return Container(
        width: 38,
        height: 38,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(10),
          gradient: const LinearGradient(
            colors: [Color(0xFF833AB4), Color(0xFFFD1D1D), Color(0xFFF56040)],
            begin: Alignment.bottomLeft,
            end: Alignment.topRight,
          ),
        ),
        alignment: Alignment.center,
        child: const FaIcon(
          FontAwesomeIcons.instagram,
          color: Colors.white,
          size: 18,
        ),
      );
    }

    Color bgColor = fallbackColor;
    Widget iconWidget = const Icon(Icons.link, color: Colors.white, size: 18);

    if (pName == 'linkedin') {
      bgColor = const Color(0xFF0A66C2);
      iconWidget = const FaIcon(
        FontAwesomeIcons.linkedin,
        color: Colors.white,
        size: 18,
      );
    } else if (pName == 'telegram') {
      bgColor = const Color(0xFF229ED9);
      iconWidget = const FaIcon(
        FontAwesomeIcons.telegram,
        color: Colors.white,
        size: 18,
      );
    } else if (pName == 'whatsapp') {
      bgColor = const Color(0xFF25D366);
      iconWidget = const FaIcon(
        FontAwesomeIcons.whatsapp,
        color: Colors.white,
        size: 18,
      );
    } else if (pName == 'behance') {
      bgColor = const Color(0xFF1769FF);
      iconWidget = const FaIcon(
        FontAwesomeIcons.behance,
        color: Colors.white,
        size: 18,
      );
    } else if (pName == 'website' || pName == 'portfolio') {
      bgColor = const Color(0xFF0052FF);
      iconWidget = const Icon(Icons.link, color: Colors.white, size: 18);
    } else if (pName == 'cv' || pName == 'resume') {
      bgColor = const Color(0xFF0052FF);
      iconWidget = const Icon(Icons.description, color: Colors.white, size: 18);
    }

    return Container(
      width: 38,
      height: 38,
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: BorderRadius.circular(10),
      ),
      alignment: Alignment.center,
      child: iconWidget,
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
                  const Icon(Icons.people, color: Color(0xFF6366F1), size: 24),
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

        // Customize Theme Card
        _buildGlassCard(
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Customize Theme 🎨',
                        style: GoogleFonts.outfit(
                          color: _textColor,
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Change colors, background, layouts & more',
                        style: GoogleFonts.outfit(
                          color: _subtitleColor,
                          fontSize: 13,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF6366F1),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                  padding: const EdgeInsets.symmetric(vertical: 12),
                ),
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) =>
                          ThemeStudioScreen(isPremium: profile.isPremium),
                    ),
                  ).then((_) => _fetchProfile());
                },
                icon: const Icon(Icons.palette_outlined, color: Colors.white),
                label: Text(
                  'Open Theme Customizer',
                  style: GoogleFonts.outfit(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
          ],
        ),

        // Public NFC Link Card
        _buildGlassCard(
          children: [
            Text(
              'Share NFC Card',
              style: GoogleFonts.outfit(
                color: _textColor,
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              'Link programmed to your physical tag.',
              style: GoogleFonts.outfit(color: _subtitleColor, fontSize: 13),
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
                      color: _inputBg,
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: _inputBorder),
                    ),
                    child: Text(
                      publicLink,
                      style: GoogleFonts.outfit(
                        color: _subtitleColor,
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
            const SizedBox(height: 12),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF6366F1),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                  padding: const EdgeInsets.symmetric(vertical: 12),
                ),
                onPressed: () {
                  ShareCardDialog.show(
                    context,
                    name: profile.name,
                    tagline: profile.tagline,
                    avatar: profile.avatar,
                    profileUrl: publicLink,
                    baseUrl: _apiService.baseUrl,
                    isPremium: profile.isPremium,
                    isOnline: profile.isOnline,
                    location: profile.location,
                    bio: profile.bio,
                    tags: profile.tags,
                    socials: profile.socials,
                  );
                },
                icon: const Icon(
                  Icons.share_rounded,
                  color: Colors.white,
                  size: 18,
                ),
                label: Text(
                  'Share or Download Card',
                  style: GoogleFonts.outfit(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
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
                    color: _textColor,
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
                backgroundColor: _isLight
                    ? Colors.black.withValues(alpha: 0.05)
                    : Colors.white.withValues(alpha: 0.1),
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
                          : (_isLight ? Colors.black38 : Colors.white38),
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
                                      ? _textColor
                                      : _subtitleColor,
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
                              color: _isLight ? Colors.black45 : Colors.white38,
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
                          color: _subtitleColor,
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
                          color: _textColor,
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Upgrade to premium to display your profile in the global leaderboard.',
                        style: GoogleFonts.outfit(
                          color: _subtitleColor,
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
                color: _textColor,
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
                    backgroundColor: _isLight
                        ? Colors.black.withValues(alpha: 0.05)
                        : Colors.white10,
                    backgroundImage: getAvatarImage(
                      profile.avatar,
                      _apiService.baseUrl,
                    ),
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
              'Profile Skills & Tags',
              style: GoogleFonts.outfit(
                color: _textColor,
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
                      color: _inputBg,
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: _inputBorder),
                    ),
                    child: TextField(
                      controller: _tagController,
                      style: GoogleFonts.outfit(color: _textColor),
                      decoration: InputDecoration(
                        hintText: 'e.g. Next.js, UI/UX Designer',
                        hintStyle: TextStyle(color: _hintColor),
                        border: InputBorder.none,
                        contentPadding: const EdgeInsets.symmetric(
                          horizontal: 12,
                          vertical: 10,
                        ),
                      ),
                      onSubmitted: (_) => _addTag(),
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
                        child: Icon(
                          Icons.close,
                          size: 14,
                          color: _isLight ? Colors.black54 : Colors.white54,
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
                color: _textColor,
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
                    color: _inputBg,
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: _inputBorder),
                  ),
                  child: DropdownButtonHideUnderline(
                    child: DropdownButton<String>(
                      dropdownColor: _dropdownBg,
                      value: _socialPlatform,
                      style: GoogleFonts.outfit(color: _textColor),
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
                      color: _inputBg,
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: _inputBorder),
                    ),
                    child: TextField(
                      controller: _socialHandleController,
                      style: GoogleFonts.outfit(color: _textColor),
                      decoration: InputDecoration(
                        hintText: 'Handle',
                        hintStyle: TextStyle(color: _hintColor),
                        border: InputBorder.none,
                        contentPadding: const EdgeInsets.symmetric(
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
                        contentPadding: const EdgeInsets.symmetric(
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
              final cardColor = parseHexColor(link.color);
              return Container(
                margin: const EdgeInsets.only(bottom: 8),
                padding: const EdgeInsets.symmetric(
                  horizontal: 12,
                  vertical: 10,
                ),
                decoration: BoxDecoration(
                  color: _isLight
                      ? const Color(0xFFF9FAFB)
                      : Colors.white.withValues(alpha: 0.02),
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
                            color: _subtitleColor,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        Text(
                          link.handle,
                          style: GoogleFonts.outfit(color: _textColor),
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
                color: _textColor,
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              'Check if you are running the latest version of Tapfolio.',
              style: GoogleFonts.outfit(color: _subtitleColor, fontSize: 13),
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
        color: _cardBg,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: _cardBorder),
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
            color: _subtitleColor,
            fontSize: 14,
            fontWeight: FontWeight.w500,
          ),
        ),
        const SizedBox(height: 6),
        Container(
          decoration: BoxDecoration(
            color: _inputBg,
            borderRadius: BorderRadius.circular(8),
            border: Border.all(color: _inputBorder),
          ),
          child: TextField(
            controller: controller,
            maxLines: maxLines,
            style: GoogleFonts.outfit(color: _textColor),
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
    debugPrint(
      '[TRACE-DASHBOARD] build() called. _loading = $_loading, _profile = ${_profile != null ? "present" : "null"}',
    );
    if (_loading) {
      return const Center(
        child: CircularProgressIndicator(color: Color(0xFF6366F1)),
      );
    }

    if (_profile == null) {
      return Scaffold(
        backgroundColor: _isLight
            ? const Color(0xFFF3F4F6)
            : const Color(0xFF06070D),
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
                    color: _textColor,
                    fontWeight: FontWeight.w600,
                    fontSize: 16,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Please check your internet connection and try again.',
                  textAlign: TextAlign.center,
                  style: GoogleFonts.outfit(
                    color: _subtitleColor,
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
                    padding: const EdgeInsets.symmetric(
                      horizontal: 24,
                      vertical: 12,
                    ),
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
      backgroundColor: _isLight
          ? const Color(0xFFF3F4F6)
          : const Color(0xFF0A0A0F),
      body: SafeArea(
        child: RefreshIndicator(
          onRefresh: _fetchProfile,
          color: const Color(0xFF0052FF),
          child: SingleChildScrollView(
            physics: const AlwaysScrollableScrollPhysics(),
            child: _buildProfileCard(),
          ),
        ),
      ),
    );
  }
}

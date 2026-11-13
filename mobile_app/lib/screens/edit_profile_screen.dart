import 'dart:convert';
import 'dart:typed_data';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:image_picker/image_picker.dart';
import 'package:share_plus/share_plus.dart';
import '../models/profile.dart';
import '../models/tag.dart';
import '../services/api_service.dart';
import '../core/utils/image_helper.dart';
import '../widgets/image_crop_dialog.dart';
import '../core/widget/tapfolio_widget_service.dart';
import 'theme_studio/theme_studio_screen.dart';
import 'delete_account_screen.dart';
import 'notification_screen.dart';
import 'manage_cards_screen.dart';
import 'analytics_screen.dart';

class EditProfileScreen extends StatefulWidget {
  final VoidCallback? onLogout;
  final Profile? initialProfile;
  const EditProfileScreen({super.key, this.onLogout, this.initialProfile});

  @override
  State<EditProfileScreen> createState() => _EditProfileScreenState();
}

class _EditProfileScreenState extends State<EditProfileScreen> {
  final ApiService _apiService = ApiService();
  final TextEditingController _searchController = TextEditingController();

  Profile? _profile;
  String _searchQuery = '';

  bool get _isLight => Theme.of(context).brightness == Brightness.light;
  Color get _textColor => _isLight ? const Color(0xFF0F172A) : Colors.white;
  Color get _subtitleColor => _isLight ? const Color(0xFF64748B) : const Color(0xFF94A3B8);
  Color get _cardBg => _isLight ? Colors.white : const Color(0xFF131622);
  Color get _cardBorder => _isLight ? const Color(0xFFE2E8F0) : const Color(0xFF1E2235);
  Color get _searchBg => _isLight ? Colors.white : const Color(0xFF131622);

  @override
  void initState() {
    super.initState();
    _profile = widget.initialProfile;
    _fetchProfile();
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  Future<void> _fetchProfile() async {
    try {
      final res = await _apiService.getProfile();
      if (res != null && res['profile'] != null) {
        if (mounted) {
          setState(() {
            _profile = res['profile'];
          });
        }
      }
    } catch (e) {
      debugPrint('[SETTINGS] Fetch error: $e');
    }
  }

  void _showProModal() {
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
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                      decoration: BoxDecoration(
                        gradient: const LinearGradient(
                          colors: [Color(0xFF6366F1), Color(0xFF8B5CF6)],
                        ),
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: Text(
                        '✨ Pro Member',
                        style: GoogleFonts.outfit(
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                          fontSize: 13,
                        ),
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.close),
                      color: _subtitleColor,
                      onPressed: () => Navigator.pop(context),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                Text(
                  'Tapfolio Pro Benefits',
                  style: GoogleFonts.outfit(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: _textColor,
                  ),
                ),
                const SizedBox(height: 6),
                Text(
                  'Your account has full access to premium identity cards, advanced analytics, custom themes, and leaderboard ranking.',
                  style: GoogleFonts.outfit(
                    fontSize: 13.5,
                    color: _subtitleColor,
                    height: 1.4,
                  ),
                ),
                const SizedBox(height: 20),
                _buildBenefitItem(Icons.style_outlined, 'Unlimited Digital Cards', 'Create and manage multiple tailored profiles.'),
                _buildBenefitItem(Icons.palette_outlined, 'Theme Studio Access', 'Fully customizable themes, gradients, and fonts.'),
                _buildBenefitItem(Icons.insights, 'Deep Analytics', 'Real-time viewer locations, click rates, and taps.'),
                _buildBenefitItem(Icons.emoji_events_outlined, 'Verified Leaderboard', 'Ranked visibility with premium diamond status.'),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildBenefitItem(IconData icon, String title, String desc) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 14.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: const Color(0xFF6366F1).withValues(alpha: 0.12),
              shape: BoxShape.circle,
            ),
            child: Icon(icon, color: const Color(0xFF6366F1), size: 18),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: GoogleFonts.outfit(
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                    color: _textColor,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  desc,
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
    );
  }

  void _showTeamModal() {
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
                      'Team & Members',
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
                const SizedBox(height: 12),
                Text(
                  'Manage digital identity for your entire organization. Centralized control, uniform branding, and team analytics.',
                  style: GoogleFonts.outfit(
                    fontSize: 14,
                    color: _subtitleColor,
                    height: 1.4,
                  ),
                ),
                const SizedBox(height: 20),
                SizedBox(
                  width: double.infinity,
                  height: 48,
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFFF97316),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                      elevation: 0,
                    ),
                    onPressed: () {
                      Navigator.pop(context);
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Team management request submitted.')),
                      );
                    },
                    child: Text(
                      'Request Enterprise Demo',
                      style: GoogleFonts.outfit(
                        color: Colors.white,
                        fontSize: 15,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  void _showProductsModal() {
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
                      'My Products & Services',
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
                const SizedBox(height: 12),
                Text(
                  'Showcase digital goods, booking links, and services directly on your Tapfolio profile.',
                  style: GoogleFonts.outfit(
                    fontSize: 14,
                    color: _subtitleColor,
                    height: 1.4,
                  ),
                ),
                const SizedBox(height: 20),
                Center(
                  child: Container(
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: _isLight ? const Color(0xFFF8FAFC) : const Color(0xFF1B1E2E),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: _cardBorder),
                    ),
                    child: Column(
                      children: [
                        const Icon(Icons.shopping_bag_outlined, size: 48, color: Color(0xFF10B981)),
                        const SizedBox(height: 12),
                        Text(
                          'Products Storefront',
                          style: GoogleFonts.outfit(fontSize: 16, fontWeight: FontWeight.bold, color: _textColor),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'Add direct links to your courses, portfolios, and paid consultations.',
                          style: GoogleFonts.outfit(fontSize: 12.5, color: _subtitleColor),
                          textAlign: TextAlign.center,
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  void _showPrivacyModal() {
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
                      'Privacy & Security',
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
                const SizedBox(height: 16),
                _buildModalActionTile(
                  icon: Icons.lock_outline,
                  color: const Color(0xFF10B981),
                  title: 'Data & Visibility',
                  subtitle: 'Control who can view your contact info and stats',
                  onTap: () {
                    Navigator.pop(context);
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Privacy settings are up to date.')),
                    );
                  },
                ),
                _buildModalActionTile(
                  icon: Icons.delete_forever_outlined,
                  color: Colors.redAccent,
                  title: 'Delete Account',
                  subtitle: 'Permanently remove your account and all data',
                  onTap: () {
                    Navigator.pop(context);
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => DeleteAccountScreen(
                          onAccountDeleted: () {
                            widget.onLogout?.call();
                          },
                        ),
                      ),
                    );
                  },
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildModalActionTile({
    required IconData icon,
    required Color color,
    required String title,
    required String subtitle,
    required VoidCallback onTap,
  }) {
    return ListTile(
      contentPadding: EdgeInsets.zero,
      onTap: onTap,
      leading: Container(
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          color: color.withValues(alpha: 0.12),
          shape: BoxShape.circle,
        ),
        child: Icon(icon, color: color, size: 20),
      ),
      title: Text(
        title,
        style: GoogleFonts.outfit(fontSize: 14.5, fontWeight: FontWeight.bold, color: _textColor),
      ),
      subtitle: Text(
        subtitle,
        style: GoogleFonts.outfit(fontSize: 12, color: _subtitleColor),
      ),
      trailing: Icon(Icons.chevron_right, color: _subtitleColor, size: 18),
    );
  }

  void _showLanguageDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: _cardBg,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
        title: Text(
          'Select Language',
          style: GoogleFonts.outfit(color: _textColor, fontWeight: FontWeight.bold),
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            ListTile(
              leading: const Icon(Icons.check_circle, color: Color(0xFF0052FF)),
              title: Text('English (US)', style: GoogleFonts.outfit(color: _textColor, fontWeight: FontWeight.bold)),
              onTap: () => Navigator.pop(context),
            ),
            ListTile(
              leading: const Icon(Icons.circle_outlined, color: Colors.grey),
              title: Text('Español', style: GoogleFonts.outfit(color: _subtitleColor)),
              onTap: () {
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Additional languages coming soon!')),
                );
              },
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text('Done', style: GoogleFonts.outfit(fontWeight: FontWeight.bold, color: const Color(0xFF0052FF))),
          ),
        ],
      ),
    );
  }

  void _showStorageDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: _cardBg,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
        title: Text(
          'Storage & Cache',
          style: GoogleFonts.outfit(color: _textColor, fontWeight: FontWeight.bold),
        ),
        content: Text(
          'Clear locally cached avatars, profile data, and preview assets to free up device space.',
          style: GoogleFonts.outfit(color: _subtitleColor, fontSize: 13.5),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text('Cancel', style: GoogleFonts.outfit(color: _subtitleColor)),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF0052FF),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
            ),
            onPressed: () {
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Storage cache cleared successfully.')),
              );
            },
            child: Text('Clear Cache', style: GoogleFonts.outfit(color: Colors.white, fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }

  void _showHelpCenter() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: _cardBg,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) => SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('Help Center', style: GoogleFonts.outfit(fontSize: 20, fontWeight: FontWeight.bold, color: _textColor)),
                  IconButton(icon: const Icon(Icons.close), color: _subtitleColor, onPressed: () => Navigator.pop(context)),
                ],
              ),
              const SizedBox(height: 16),
              _buildHelpFAQ('How do NFC card taps work?', 'Hold any NFC-compatible smartphone near your card to instantly open your live Tapfolio link.'),
              _buildHelpFAQ('How do I rank on Leaderboard?', 'Earn Diamond points through profile views, card sharing, and verified networking.'),
              _buildHelpFAQ('How can I export my QR code?', 'Tap the QR icon on your dashboard card or share dialog to download high-resolution vector QR codes.'),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHelpFAQ(String question, String answer) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(question, style: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.bold, color: _textColor)),
          const SizedBox(height: 3),
          Text(answer, style: GoogleFonts.outfit(fontSize: 12.5, color: _subtitleColor, height: 1.35)),
        ],
      ),
    );
  }

  void _showContactSupport() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: _cardBg,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
        title: Text('Contact Support', style: GoogleFonts.outfit(color: _textColor, fontWeight: FontWeight.bold)),
        content: Text('Reach our dedicated concierge team at support@tapfolio.me or via live in-app chat.', style: GoogleFonts.outfit(color: _subtitleColor, fontSize: 13.5)),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text('Close', style: GoogleFonts.outfit(color: _subtitleColor)),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF8B5CF6),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
            ),
            onPressed: () {
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Support ticket created. We will get back to you shortly!')),
              );
            },
            child: Text('Send Message', style: GoogleFonts.outfit(color: Colors.white, fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }

  void _showAboutDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: _cardBg,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
        title: Text('About Tapfolio', style: GoogleFonts.outfit(color: _textColor, fontWeight: FontWeight.bold)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Tapfolio Mobile', style: GoogleFonts.outfit(fontSize: 15, fontWeight: FontWeight.bold, color: _textColor)),
            const SizedBox(height: 2),
            Text('Version 1.1.0 (Build 2026.1)', style: GoogleFonts.outfit(fontSize: 13, color: _subtitleColor)),
            const SizedBox(height: 12),
            Text('The premier digital identity & smart networking card platform.', style: GoogleFonts.outfit(fontSize: 13, color: _subtitleColor)),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text('Close', style: GoogleFonts.outfit(fontWeight: FontWeight.bold, color: const Color(0xFF0052FF))),
          ),
        ],
      ),
    );
  }

  void _confirmLogout() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: _cardBg,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
        title: Text('Log Out', style: GoogleFonts.outfit(color: _textColor, fontWeight: FontWeight.bold)),
        content: Text('Are you sure you want to log out of your Tapfolio account?', style: GoogleFonts.outfit(color: _subtitleColor, fontSize: 14)),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text('Cancel', style: GoogleFonts.outfit(color: _subtitleColor)),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFFEF4444),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
            ),
            onPressed: () {
              Navigator.pop(context);
              _apiService.logout();
              if (widget.onLogout != null) {
                widget.onLogout!();
              } else {
                Navigator.pushNamedAndRemoveUntil(context, '/login', (route) => false);
              }
            },
            child: Text('Log Out', style: GoogleFonts.outfit(color: Colors.white, fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    // All settings items for search filtering
    final List<_SettingsItemData> allItems = [
      _SettingsItemData(
        section: 'Account',
        title: 'User Profile',
        subtitle: 'Manage your personal information',
        icon: Icons.person_outline_rounded,
        iconColor: const Color(0xFF6366F1),
        onTap: () {
          if (_profile != null) {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (_) => ProfileDetailsSettingsScreen(
                  profile: _profile!,
                  onUpdated: _fetchProfile,
                ),
              ),
            );
          }
        },
      ),
      _SettingsItemData(
        section: 'Account',
        title: 'My Cards',
        subtitle: 'Create, edit and manage your cards',
        icon: Icons.credit_card_outlined,
        iconColor: const Color(0xFF0052FF),
        onTap: () {
          if (_profile != null) {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (_) => ManageCardsScreen(initialProfile: _profile),
              ),
            );
          }
        },
      ),
      _SettingsItemData(
        section: 'Account',
        title: 'My Products',
        subtitle: 'Manage your products and services',
        icon: Icons.shopping_bag_outlined,
        iconColor: const Color(0xFF10B981),
        onTap: _showProductsModal,
      ),
      _SettingsItemData(
        section: 'Account',
        title: 'Team & Members',
        subtitle: 'Invite, manage and control your team',
        icon: Icons.group_outlined,
        iconColor: const Color(0xFFF97316),
        onTap: _showTeamModal,
      ),
      _SettingsItemData(
        section: 'Account',
        title: 'Analytics',
        subtitle: 'Track your performance and insights',
        icon: Icons.insert_chart_outlined_rounded,
        iconColor: const Color(0xFFEC4899),
        onTap: () {
          if (_profile != null) {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (_) => AnalyticsScreen(initialProfile: _profile),
              ),
            );
          }
        },
      ),

      // App Settings
      _SettingsItemData(
        section: 'App Settings',
        title: 'Theme Studio',
        subtitle: 'Customize app theme and appearance',
        icon: Icons.palette_outlined,
        iconColor: const Color(0xFF8B5CF6),
        onTap: () {
          if (_profile != null) {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (_) => ThemeStudioScreen(isPremium: _profile!.isPremium),
              ),
            ).then((_) => _fetchProfile());
          }
        },
      ),
      _SettingsItemData(
        section: 'App Settings',
        title: 'Notifications',
        subtitle: 'Manage your notification preferences',
        icon: Icons.notifications_none_rounded,
        iconColor: const Color(0xFFF59E0B),
        onTap: () {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (_) => NotificationScreen(onUnreadCountChanged: (_) {}),
            ),
          );
        },
      ),
      _SettingsItemData(
        section: 'App Settings',
        title: 'Privacy & Security',
        subtitle: 'Control your data and privacy',
        icon: Icons.shield_outlined,
        iconColor: const Color(0xFF10B981),
        onTap: _showPrivacyModal,
      ),
      _SettingsItemData(
        section: 'App Settings',
        title: 'Language',
        subtitle: 'Choose your preferred language',
        icon: Icons.language_rounded,
        iconColor: const Color(0xFF0052FF),
        onTap: _showLanguageDialog,
      ),
      _SettingsItemData(
        section: 'App Settings',
        title: 'Storage',
        subtitle: 'Manage cache and storage usage',
        icon: Icons.sd_storage_outlined,
        iconColor: const Color(0xFF6366F1),
        onTap: _showStorageDialog,
      ),

      // Support & Others
      _SettingsItemData(
        section: 'Support & Others',
        title: 'Help Center',
        subtitle: 'FAQs, guides and support',
        icon: Icons.help_outline_rounded,
        iconColor: const Color(0xFF0284C7),
        onTap: _showHelpCenter,
      ),
      _SettingsItemData(
        section: 'Support & Others',
        title: 'Contact Support',
        subtitle: 'Get help from our team',
        icon: Icons.smart_toy_outlined,
        iconColor: const Color(0xFF8B5CF6),
        onTap: _showContactSupport,
      ),
      _SettingsItemData(
        section: 'Support & Others',
        title: 'Share Tapfolio',
        subtitle: 'Invite friends and grow your network',
        icon: Icons.share_outlined,
        iconColor: const Color(0xFFF43F5E),
        onTap: () {
          Share.share('Join me on Tapfolio — the digital identity platform: https://www.tapfolio.me');
        },
      ),
      _SettingsItemData(
        section: 'Support & Others',
        title: 'About Tapfolio',
        subtitle: 'App info, terms and policies',
        icon: Icons.info_outline_rounded,
        iconColor: const Color(0xFFF59E0B),
        onTap: _showAboutDialog,
      ),
    ];

    final isSearching = _searchQuery.trim().isNotEmpty;
    final filteredItems = isSearching
        ? allItems.where((item) {
            final q = _searchQuery.trim().toLowerCase();
            return item.title.toLowerCase().contains(q) ||
                item.subtitle.toLowerCase().contains(q) ||
                item.section.toLowerCase().contains(q);
          }).toList()
        : allItems;

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

                // ── 1. Top Header Row (✨ Pro Badge + Centered "Settings") ────
                Stack(
                  alignment: Alignment.center,
                  children: [
                    // Centered Title
                    Center(
                      child: Text(
                        'Settings',
                        style: GoogleFonts.outfit(
                          color: _textColor,
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                          letterSpacing: -0.3,
                        ),
                      ),
                    ),

                    // Left-aligned Pro Badge
                    Align(
                      alignment: Alignment.centerLeft,
                      child: GestureDetector(
                        onTap: _showProModal,
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                          decoration: BoxDecoration(
                            gradient: const LinearGradient(
                              colors: [Color(0xFF6366F1), Color(0xFF8B5CF6)],
                            ),
                            borderRadius: BorderRadius.circular(16),
                            boxShadow: [
                              BoxShadow(
                                color: const Color(0xFF6366F1).withValues(alpha: 0.35),
                                blurRadius: 8,
                                offset: const Offset(0, 2),
                              ),
                            ],
                          ),
                          child: Text(
                            '✨ Pro',
                            style: GoogleFonts.outfit(
                              color: Colors.white,
                              fontWeight: FontWeight.bold,
                              fontSize: 12.5,
                            ),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 18),

                // ── 2. Search Settings Bar ──────────────────────────────────
                Container(
                  height: 48,
                  decoration: BoxDecoration(
                    color: _searchBg,
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(color: _cardBorder),
                  ),
                  child: TextField(
                    controller: _searchController,
                    onChanged: (val) => setState(() => _searchQuery = val),
                    style: GoogleFonts.outfit(fontSize: 14, color: _textColor),
                    decoration: InputDecoration(
                      hintText: 'Search settings...',
                      hintStyle: GoogleFonts.outfit(
                        fontSize: 13.5,
                        color: _subtitleColor.withValues(alpha: 0.7),
                      ),
                      prefixIcon: Icon(
                        Icons.search_rounded,
                        size: 20,
                        color: _subtitleColor,
                      ),
                      suffixIcon: _searchQuery.isNotEmpty
                          ? GestureDetector(
                              onTap: () {
                                _searchController.clear();
                                setState(() => _searchQuery = '');
                              },
                              child: Icon(Icons.close_rounded, size: 18, color: _subtitleColor),
                            )
                          : null,
                      border: InputBorder.none,
                      contentPadding: const EdgeInsets.symmetric(vertical: 13),
                    ),
                  ),
                ),

                const SizedBox(height: 16),

                // ── 3. Search Results or Grouped Sections ───────────────────
                if (isSearching) ...[
                  if (filteredItems.isEmpty)
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(32),
                      decoration: BoxDecoration(
                        color: _cardBg,
                        borderRadius: BorderRadius.circular(18),
                        border: Border.all(color: _cardBorder),
                      ),
                      child: Column(
                        children: [
                          Icon(Icons.search_off_rounded, size: 48, color: _subtitleColor),
                          const SizedBox(height: 12),
                          Text(
                            'No settings found',
                            style: GoogleFonts.outfit(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                              color: _textColor,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            'No match found for "$_searchQuery"',
                            style: GoogleFonts.outfit(fontSize: 13, color: _subtitleColor),
                          ),
                        ],
                      ),
                    )
                  else ...[
                    Padding(
                      padding: const EdgeInsets.only(left: 4, bottom: 8),
                      child: Text(
                        'Search Results',
                        style: GoogleFonts.outfit(
                          fontSize: 15,
                          fontWeight: FontWeight.bold,
                          color: _textColor,
                        ),
                      ),
                    ),
                    _buildSettingsCard(filteredItems),
                  ],
                ] else ...[
                  // ── Section 1: Account ────────────────────────────────────
                  _buildSectionHeader('Account'),
                  _buildSettingsCard(
                    allItems.where((i) => i.section == 'Account').toList(),
                  ),

                  const SizedBox(height: 20),

                  // ── Section 2: App Settings ───────────────────────────────
                  _buildSectionHeader('App Settings'),
                  _buildSettingsCard(
                    allItems.where((i) => i.section == 'App Settings').toList(),
                  ),

                  const SizedBox(height: 20),

                  // ── Section 3: Support & Others ───────────────────────────
                  _buildSectionHeader('Support & Others'),
                  _buildSettingsCard(
                    allItems.where((i) => i.section == 'Support & Others').toList(),
                  ),

                  const SizedBox(height: 24),

                  // ── Log Out Button ────────────────────────────────────────
                  GestureDetector(
                    onTap: _confirmLogout,
                    child: Container(
                      width: double.infinity,
                      height: 48,
                      decoration: BoxDecoration(
                        color: const Color(0xFFEF4444).withValues(alpha: _isLight ? 0.04 : 0.12),
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(
                          color: const Color(0xFFEF4444).withValues(alpha: 0.35),
                        ),
                      ),
                      alignment: Alignment.center,
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Icon(
                            Icons.logout_rounded,
                            color: Color(0xFFEF4444),
                            size: 18,
                          ),
                          const SizedBox(width: 8),
                          Text(
                            'Log Out',
                            style: GoogleFonts.outfit(
                              color: const Color(0xFFEF4444),
                              fontSize: 14.5,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],

                // Safe bottom padding for floating navigation bar
                const SizedBox(height: 100),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildSectionHeader(String title) {
    return Padding(
      padding: const EdgeInsets.only(left: 4, bottom: 8),
      child: Text(
        title,
        style: GoogleFonts.outfit(
          fontSize: 15,
          fontWeight: FontWeight.bold,
          color: _textColor,
          letterSpacing: -0.2,
        ),
      ),
    );
  }

  Widget _buildSettingsCard(List<_SettingsItemData> items) {
    return Container(
      decoration: BoxDecoration(
        color: _cardBg,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: _cardBorder),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.02),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(18),
        child: Column(
          children: List.generate(items.length, (index) {
            final item = items[index];
            final showDivider = index < items.length - 1;

            return Column(
              children: [
                Material(
                  color: Colors.transparent,
                  child: InkWell(
                    onTap: item.onTap,
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 13),
                      child: Row(
                        children: [
                          // Colored Icon
                          Icon(
                            item.icon,
                            color: item.iconColor,
                            size: 22,
                          ),
                          const SizedBox(width: 14),

                          // Title and Subtitle
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  item.title,
                                  style: GoogleFonts.outfit(
                                    fontSize: 14.5,
                                    fontWeight: FontWeight.bold,
                                    color: _textColor,
                                  ),
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  item.subtitle,
                                  style: GoogleFonts.outfit(
                                    fontSize: 12,
                                    color: _subtitleColor,
                                  ),
                                ),
                              ],
                            ),
                          ),

                          // Chevron
                          Icon(
                            Icons.chevron_right_rounded,
                            color: _subtitleColor.withValues(alpha: 0.5),
                            size: 20,
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
                if (showDivider)
                  Divider(
                    height: 1,
                    indent: 50,
                    endIndent: 14,
                    color: _cardBorder.withValues(alpha: 0.7),
                  ),
              ],
            );
          }),
        ),
      ),
    );
  }
}

class _SettingsItemData {
  final String section;
  final String title;
  final String subtitle;
  final IconData icon;
  final Color iconColor;
  final VoidCallback onTap;

  _SettingsItemData({
    required this.section,
    required this.title,
    required this.subtitle,
    required this.icon,
    required this.iconColor,
    required this.onTap,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// User Profile Detail Editing Screen (Preserved for full profile editing)
// ─────────────────────────────────────────────────────────────────────────────

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

  bool get _isLight => Theme.of(context).brightness == Brightness.light;
  Color get _textColor => _isLight ? const Color(0xFF0F172A) : Colors.white;
  Color get _subtitleColor => _isLight ? const Color(0xFF64748B) : const Color(0xFF94A3B8);
  Color get _cardBg => _isLight ? Colors.white : const Color(0xFF131622);
  Color get _cardBorder => _isLight ? const Color(0xFFE2E8F0) : const Color(0xFF1E2235);
  Color get _inputBg => _isLight ? const Color(0xFFF9FAFB) : const Color(0xFF15192D);
  Color get _inputBorder => _isLight ? const Color(0xFFE5E7EB) : Colors.white10;

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

  Future<void> _saveProfile() async {
    setState(() => _saving = true);

    try {
      final updatedData = {
        'name': _nameController.text.trim(),
        'tagline': _taglineController.text.trim(),
        'bio': _bioController.text.trim(),
        'phone': _phoneController.text.trim(),
        'whatsapp': _whatsappController.text.trim(),
        'location': _locationController.text.trim(),
        'isOnline': _profile.isOnline,
        'tags': _profile.tags.map((t) => {'text': t.text, 'type': t.type}).toList(),
      };

      final res = await _apiService.updateProfile(updatedData);
      final profileObj = res['profile'] is Profile
          ? res['profile'] as Profile
          : Profile.fromJson(res['profile'] as Map<String, dynamic>?);

      await TapfolioWidgetService().updateProfileData(
        profile: profileObj,
        connectionsCount: 0,
        viewsCount: profileObj.tapCount,
      );

      if (mounted) {
        setState(() {
          _profile = profileObj;
        });
        widget.onUpdated();
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Profile saved successfully!'),
            backgroundColor: Color(0xFF10B981),
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Save error: $e'), backgroundColor: Colors.redAccent),
        );
      }
    } finally {
      if (mounted) setState(() => _saving = false);
    }
  }

  Future<void> _pickAndUploadAvatar() async {
    try {
      final XFile? image = await _picker.pickImage(source: ImageSource.gallery, imageQuality: 85);
      if (image == null) return;

      final Uint8List bytes = await image.readAsBytes();

      if (!mounted) return;
      final Uint8List? croppedBytes = await showDialog<Uint8List>(
        context: context,
        barrierDismissible: false,
        builder: (context) => ImageCropDialog(imageBytes: bytes),
      );

      if (croppedBytes == null) return;

      setState(() => _saving = true);
      final base64Image = 'data:image/jpeg;base64,${base64Encode(croppedBytes)}';

      final res = await _apiService.updateProfile({'avatar': base64Image});
      if (res['profile'] != null) {
        final profileObj = res['profile'] is Profile
            ? res['profile'] as Profile
            : Profile.fromJson(res['profile'] as Map<String, dynamic>?);

        setState(() {
          _profile = profileObj;
        });
        widget.onUpdated();
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Avatar updated!'), backgroundColor: Color(0xFF10B981)),
          );
        }
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Avatar upload failed: $e'), backgroundColor: Colors.redAccent),
        );
      }
    } finally {
      if (mounted) setState(() => _saving = false);
    }
  }

  void _addTag() {
    final text = _tagController.text.trim();
    if (text.isEmpty) return;

    final newTag = Tag(id: null, text: text, type: 'role');
    setState(() {
      _profile = Profile(
        id: _profile.id,
        userId: _profile.userId,
        name: _profile.name,
        username: _profile.username,
        tagline: _profile.tagline,
        avatar: _profile.avatar,
        isOnline: _profile.isOnline,
        bio: _profile.bio,
        phone: _profile.phone,
        whatsapp: _profile.whatsapp,
        location: _profile.location,
        diamonds: _profile.diamonds,
        isPremium: _profile.isPremium,
        tapCount: _profile.tapCount,
        tags: [..._profile.tags, newTag],
        socials: _profile.socials,
        theme: _profile.theme,
      );
      _tagController.clear();
    });
    _saveProfile();
  }

  void _removeTag(int index) {
    final updated = List<Tag>.from(_profile.tags)..removeAt(index);
    setState(() {
      _profile = Profile(
        id: _profile.id,
        userId: _profile.userId,
        name: _profile.name,
        username: _profile.username,
        tagline: _profile.tagline,
        avatar: _profile.avatar,
        isOnline: _profile.isOnline,
        bio: _profile.bio,
        phone: _profile.phone,
        whatsapp: _profile.whatsapp,
        location: _profile.location,
        diamonds: _profile.diamonds,
        isPremium: _profile.isPremium,
        tapCount: _profile.tapCount,
        tags: updated,
        socials: _profile.socials,
        theme: _profile.theme,
      );
    });
    _saveProfile();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: _isLight ? const Color(0xFFF8FAFC) : const Color(0xFF070913),
      appBar: AppBar(
        title: Text(
          'Edit Profile',
          style: GoogleFonts.outfit(fontWeight: FontWeight.bold, color: _textColor),
        ),
        backgroundColor: _cardBg,
        elevation: 0,
        leading: IconButton(
          icon: Icon(Icons.arrow_back_ios_new_rounded, color: _textColor, size: 20),
          onPressed: () => Navigator.pop(context),
        ),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 12.0),
            child: TextButton(
              onPressed: _saving ? null : _saveProfile,
              child: _saving
                  ? const SizedBox(
                      width: 16,
                      height: 16,
                      child: CircularProgressIndicator(strokeWidth: 2, color: Color(0xFF0052FF)),
                    )
                  : Text(
                      'Save',
                      style: GoogleFonts.outfit(
                        color: const Color(0xFF0052FF),
                        fontWeight: FontWeight.bold,
                        fontSize: 15,
                      ),
                    ),
            ),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Avatar editor
            Center(
              child: Stack(
                children: [
                  CircleAvatar(
                    radius: 46,
                    backgroundColor: _cardBorder,
                    backgroundImage: getAvatarImage(_profile.avatar, _apiService.baseUrl),
                  ),
                  Positioned(
                    bottom: 0,
                    right: 0,
                    child: GestureDetector(
                      onTap: _saving ? null : _pickAndUploadAvatar,
                      child: Container(
                        padding: const EdgeInsets.all(8),
                        decoration: const BoxDecoration(
                          color: Color(0xFF0052FF),
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(Icons.camera_alt_rounded, size: 16, color: Colors.white),
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Form Fields
            _buildTextField(label: 'Full Name', controller: _nameController),
            const SizedBox(height: 14),
            _buildTextField(label: 'Tagline / Headline', controller: _taglineController),
            const SizedBox(height: 14),
            _buildTextField(label: 'Bio / About', controller: _bioController, maxLines: 3),
            const SizedBox(height: 14),
            _buildTextField(label: 'Phone', controller: _phoneController, keyboardType: TextInputType.phone),
            const SizedBox(height: 14),
            _buildTextField(label: 'WhatsApp', controller: _whatsappController, keyboardType: TextInputType.phone),
            const SizedBox(height: 14),
            _buildTextField(label: 'Location', controller: _locationController),
            const SizedBox(height: 24),

            // Tags section
            Text(
              'Skills & Tags',
              style: GoogleFonts.outfit(fontSize: 15, fontWeight: FontWeight.bold, color: _textColor),
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _tagController,
                    style: GoogleFonts.outfit(color: _textColor, fontSize: 14),
                    decoration: InputDecoration(
                      hintText: 'Add a tag (e.g. Designer, Flutter)',
                      hintStyle: GoogleFonts.outfit(color: _subtitleColor, fontSize: 13),
                      filled: true,
                      fillColor: _inputBg,
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: BorderSide(color: _inputBorder),
                      ),
                      enabledBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: BorderSide(color: _inputBorder),
                      ),
                      contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                    ),
                    onSubmitted: (_) => _addTag(),
                  ),
                ),
                const SizedBox(width: 8),
                ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF0052FF),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                  ),
                  onPressed: _addTag,
                  child: const Text('Add', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: List.generate(_profile.tags.length, (index) {
                final tag = _profile.tags[index];
                return Chip(
                  label: Text(tag.text, style: GoogleFonts.outfit(color: _textColor, fontSize: 12.5)),
                  backgroundColor: _isLight ? const Color(0xFFEEF2F6) : const Color(0xFF1E2235),
                  deleteIcon: const Icon(Icons.close, size: 14),
                  onDeleted: () => _removeTag(index),
                );
              }),
            ),
            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }

  Widget _buildTextField({
    required String label,
    required TextEditingController controller,
    int maxLines = 1,
    TextInputType keyboardType = TextInputType.text,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: GoogleFonts.outfit(fontSize: 13.5, fontWeight: FontWeight.w600, color: _textColor),
        ),
        const SizedBox(height: 6),
        TextField(
          controller: controller,
          maxLines: maxLines,
          keyboardType: keyboardType,
          style: GoogleFonts.outfit(color: _textColor, fontSize: 14),
          decoration: InputDecoration(
            filled: true,
            fillColor: _inputBg,
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide(color: _inputBorder),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide(color: _inputBorder),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(color: Color(0xFF0052FF), width: 1.5),
            ),
            contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
          ),
        ),
      ],
    );
  }
}

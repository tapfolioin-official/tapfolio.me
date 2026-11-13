import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import '../models/profile.dart';
import '../models/card_item.dart';
import '../core/storage/local_storage.dart';
import '../core/utils/image_helper.dart';
import '../services/api_service.dart';
import '../features/card_export/dialog/share_card_dialog.dart';
import '../features/card_export/models/profile_share_data.dart';
import 'theme_studio/theme_studio_screen.dart';

class ManageCardsScreen extends StatefulWidget {
  final Profile? initialProfile;

  const ManageCardsScreen({super.key, this.initialProfile});

  @override
  State<ManageCardsScreen> createState() => _ManageCardsScreenState();
}

class _ManageCardsScreenState extends State<ManageCardsScreen> {
  final ApiService _apiService = ApiService();
  final LocalStorage _storage = LocalStorage();

  Profile? _profile;
  List<CardItem> _cards = [];
  CardItem? _activeCard;
  bool _loading = true;
  String? _activatingCardId;

  bool get _isLight => Theme.of(context).brightness == Brightness.light;
  Color get _textColor => _isLight ? const Color(0xFF0F172A) : Colors.white;
  Color get _subtitleColor =>
      _isLight ? const Color(0xFF64748B) : Colors.white60;
  Color get _cardBg => _isLight ? Colors.white : const Color(0xFF13131F);
  Color get _borderColor => _isLight
      ? const Color(0xFFE2E8F0)
      : Colors.white.withValues(alpha: 0.08);

  @override
  void initState() {
    super.initState();
    _profile = widget.initialProfile;
    _loadCards();
  }

  Future<void> _loadCards({bool forceRefresh = false}) async {
    await _storage.init();

    if (_profile == null) {
      try {
        final res = await _apiService.getProfile();
        if (res != null && res['profile'] != null) {
          _profile = res['profile'] as Profile;
        }
      } catch (e) {
        debugPrint('[MANAGE-CARDS] Profile fetch error: $e');
      }
    }

    try {
      final res = await _apiService.getCards(forceRefresh: forceRefresh);
      if (res != null && res['cards'] != null) {
        final list = res['cards'] as List<CardItem>;
        final active = res['activeCard'] as CardItem?;

        if (mounted) {
          setState(() {
            _cards = list;
            _activeCard = active ?? (_cards.isNotEmpty ? _cards.firstWhere((c) => c.isActive, orElse: () => _cards.first) : null);
            _loading = false;
          });
        }
        return;
      }
    } catch (e) {
      debugPrint('[MANAGE-CARDS] Cards fetch error: $e');
    }

    if (mounted) setState(() => _loading = false);
  }

  Future<void> _handleSetActive(CardItem card) async {
    if (card.isActive) return;

    setState(() {
      _activatingCardId = card.id;
    });
    HapticFeedback.selectionClick();

    final res = await _apiService.setActiveCard(card.id);

    if (mounted) {
      setState(() {
        _activatingCardId = null;
      });

      if (res['success'] == true) {
        final newActive = res['activeCard'] as CardItem;
        setState(() {
          _activeCard = newActive;
          _cards = _cards.map((c) => c.copyWith(isActive: c.id == newActive.id)).toList();
        });
        HapticFeedback.mediumImpact();
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('✓ "${card.title}" is now your Active Card on Home.'),
            backgroundColor: const Color(0xFF0052FF),
            duration: const Duration(seconds: 2),
          ),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(res['error'] ?? 'Unable to activate card. Please try again.'),
            backgroundColor: Colors.redAccent,
          ),
        );
      }
    }
  }

  void _shareSpecificCard(CardItem card) {
    if (_profile == null) return;
    HapticFeedback.lightImpact();

    final shareData = ProfileShareData.fromCardAndProfile(
      card: card,
      profile: _profile!,
      baseUrl: _apiService.baseUrl,
    );

    ShareCardDialog.show(
      context,
      name: shareData.name,
      tagline: shareData.tagline,
      avatar: shareData.avatar,
      profileUrl: shareData.profileUrl,
      baseUrl: shareData.baseUrl,
      isPremium: shareData.isPremium,
      isOnline: shareData.isOnline,
      location: shareData.location,
      bio: shareData.bio,
      tags: shareData.tags,
      socials: shareData.socials,
    );
  }

  Future<void> _handleDeleteCard(CardItem card) async {
    if (_cards.length <= 1) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('You must have at least one card.'),
          backgroundColor: Colors.redAccent,
        ),
      );
      return;
    }

    final confirmed = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: _cardBg,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: Text(
          'Delete "${card.title}"?',
          style: GoogleFonts.outfit(color: _textColor, fontWeight: FontWeight.bold),
        ),
        content: Text(
          card.isActive
              ? 'This is currently your Active Card. Deleting it will automatically switch your active card to your default card.'
              : 'Are you sure you want to permanently delete this digital card?',
          style: GoogleFonts.outfit(color: _subtitleColor, fontSize: 13),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx, false),
            child: Text('Cancel', style: GoogleFonts.outfit(color: _subtitleColor)),
          ),
          ElevatedButton(
            onPressed: () => Navigator.pop(ctx, true),
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.redAccent,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
            child: Text('Delete', style: GoogleFonts.outfit(color: Colors.white, fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );

    if (confirmed != true) return;

    HapticFeedback.mediumImpact();
    final res = await _apiService.deleteCard(card.id);

    if (mounted) {
      if (res['success'] == true) {
        await _loadCards(forceRefresh: true);
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Card deleted successfully.'),
            backgroundColor: Color(0xFF10B981),
          ),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(res['error'] ?? 'Failed to delete card.'),
            backgroundColor: Colors.redAccent,
          ),
        );
      }
    }
  }

  Future<void> _handleDuplicateCard(CardItem card) async {
    HapticFeedback.lightImpact();
    final res = await _apiService.duplicateCard(card);
    if (mounted) {
      if (res['success'] == true) {
        await _loadCards(forceRefresh: true);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('✓ Duplicated "${card.title}".'),
            backgroundColor: const Color(0xFF0052FF),
          ),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(res['error'] ?? 'Failed to duplicate card.'),
            backgroundColor: Colors.redAccent,
          ),
        );
      }
    }
  }

  Future<void> _handleSetDefault(CardItem card) async {
    HapticFeedback.selectionClick();
    final res = await _apiService.updateCard(id: card.id, isDefault: true);
    if (mounted) {
      if (res['success'] == true) {
        await _loadCards(forceRefresh: true);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('✓ "${card.title}" set as default fallback card.'),
            backgroundColor: const Color(0xFF0052FF),
          ),
        );
      }
    }
  }

  void _showCardEditorModal({CardItem? existingCard}) {
    final isEditing = existingCard != null;
    final titleCtrl = TextEditingController(text: existingCard?.title ?? '');
    final desigCtrl = TextEditingController(text: existingCard?.designation ?? '');
    final bioCtrl = TextEditingController(text: existingCard?.bio ?? '');
    final skillCtrl = TextEditingController();
    List<String> skillsList = List.from(existingCard?.skills ?? []);
    String selectedTheme = existingCard?.themeColor ?? '0xFF0052FF';
    bool collectLeads = existingCard?.collectLeads ?? false;

    final themes = [
      {'name': 'Royal Blue', 'color': '0xFF0052FF'},
      {'name': 'Indigo', 'color': '0xFF6366F1'},
      {'name': 'Emerald', 'color': '0xFF10B981'},
      {'name': 'Purple', 'color': '0xFF8B5CF6'},
      {'name': 'Amber', 'color': '0xFFF59E0B'},
      {'name': 'Dark Slate', 'color': '0xFF1E293B'},
    ];

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: _cardBg,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) {
        return StatefulBuilder(
          builder: (ctx, setModalState) {
            return Padding(
              padding: EdgeInsets.only(
                left: 20,
                right: 20,
                top: 20,
                bottom: MediaQuery.of(ctx).viewInsets.bottom + 24,
              ),
              child: SingleChildScrollView(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Modal Header
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          isEditing ? 'Edit Card' : 'Create New Card',
                          style: GoogleFonts.outfit(
                            color: _textColor,
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        IconButton(
                          icon: Icon(Icons.close_rounded, color: _textColor),
                          onPressed: () => Navigator.pop(ctx),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),

                    // Card Title
                    Text(
                      'Card Title',
                      style: GoogleFonts.outfit(
                        color: _textColor,
                        fontSize: 13,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: 6),
                    TextField(
                      controller: titleCtrl,
                      style: GoogleFonts.outfit(color: _textColor),
                      decoration: InputDecoration(
                        hintText: 'e.g. Import & Export Business, Consultant',
                        hintStyle: GoogleFonts.outfit(color: _subtitleColor),
                        filled: true,
                        fillColor: _isLight
                            ? const Color(0xFFF8FAFC)
                            : Colors.white.withValues(alpha: 0.05),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                          borderSide: BorderSide(color: _borderColor),
                        ),
                      ),
                    ),

                    const SizedBox(height: 14),

                    // Designation / Role
                    Text(
                      'Designation / Role',
                      style: GoogleFonts.outfit(
                        color: _textColor,
                        fontSize: 13,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: 6),
                    TextField(
                      controller: desigCtrl,
                      style: GoogleFonts.outfit(color: _textColor),
                      decoration: InputDecoration(
                        hintText: 'e.g. Lead Product Architect, Founder',
                        hintStyle: GoogleFonts.outfit(color: _subtitleColor),
                        filled: true,
                        fillColor: _isLight
                            ? const Color(0xFFF8FAFC)
                            : Colors.white.withValues(alpha: 0.05),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                          borderSide: BorderSide(color: _borderColor),
                        ),
                      ),
                    ),

                    const SizedBox(height: 14),

                    // Short Bio
                    Text(
                      'Short Bio',
                      style: GoogleFonts.outfit(
                        color: _textColor,
                        fontSize: 13,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: 6),
                    TextField(
                      controller: bioCtrl,
                      maxLines: 2,
                      style: GoogleFonts.outfit(color: _textColor),
                      decoration: InputDecoration(
                        hintText: 'e.g. Global trade solutions & logistics partnerships.',
                        hintStyle: GoogleFonts.outfit(color: _subtitleColor),
                        filled: true,
                        fillColor: _isLight
                            ? const Color(0xFFF8FAFC)
                            : Colors.white.withValues(alpha: 0.05),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                          borderSide: BorderSide(color: _borderColor),
                        ),
                      ),
                    ),

                    const SizedBox(height: 14),

                    // Skills / Tags
                    Text(
                      'Skills & Specializations',
                      style: GoogleFonts.outfit(
                        color: _textColor,
                        fontSize: 13,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: 6),
                    Row(
                      children: [
                        Expanded(
                          child: TextField(
                            controller: skillCtrl,
                            style: GoogleFonts.outfit(color: _textColor),
                            decoration: InputDecoration(
                              hintText: 'Add a skill (e.g. Export, SaaS)',
                              hintStyle: GoogleFonts.outfit(color: _subtitleColor),
                              filled: true,
                              fillColor: _isLight
                                  ? const Color(0xFFF8FAFC)
                                  : Colors.white.withValues(alpha: 0.05),
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(12),
                                borderSide: BorderSide(color: _borderColor),
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(width: 8),
                        ElevatedButton(
                          onPressed: () {
                            final text = skillCtrl.text.trim();
                            if (text.isNotEmpty && !skillsList.contains(text)) {
                              setModalState(() {
                                skillsList.add(text);
                                skillCtrl.clear();
                              });
                            }
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFF0052FF),
                            foregroundColor: Colors.white,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                            padding: const EdgeInsets.symmetric(
                                horizontal: 16, vertical: 14),
                          ),
                          child: const Text('+ Add'),
                        ),
                      ],
                    ),
                    if (skillsList.isNotEmpty) ...[
                      const SizedBox(height: 8),
                      Wrap(
                        spacing: 6,
                        runSpacing: 6,
                        children: skillsList.map((skill) {
                          return Chip(
                            label: Text(skill, style: GoogleFonts.outfit(fontSize: 12)),
                            deleteIcon: const Icon(Icons.close, size: 14),
                            onDeleted: () {
                              setModalState(() {
                                skillsList.remove(skill);
                              });
                            },
                          );
                        }).toList(),
                      ),
                    ],

                    const SizedBox(height: 14),

                    // Theme Color Palette
                    Text(
                      'Card Theme Accent',
                      style: GoogleFonts.outfit(
                        color: _textColor,
                        fontSize: 13,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: themes.map((t) {
                        final colorHex = int.parse(t['color']!);
                        final isSelected = selectedTheme == t['color'];
                        return GestureDetector(
                          onTap: () {
                            setModalState(() => selectedTheme = t['color']!);
                          },
                          child: Container(
                            width: 38,
                            height: 38,
                            decoration: BoxDecoration(
                              color: Color(colorHex),
                              shape: BoxShape.circle,
                              border: isSelected
                                  ? Border.all(color: Colors.white, width: 3)
                                  : null,
                              boxShadow: [
                                if (isSelected)
                                  BoxShadow(
                                    color: Color(colorHex).withValues(alpha: 0.5),
                                    blurRadius: 8,
                                    spreadRadius: 2,
                                  ),
                              ],
                            ),
                            child: isSelected
                                ? const Icon(Icons.check,
                                    color: Colors.white, size: 18)
                                : null,
                          ),
                        );
                      }).toList(),
                    ),

                    const SizedBox(height: 14),

                    // Collect Leads Toggle
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Collect Leads on Tap',
                              style: GoogleFonts.outfit(
                                color: _textColor,
                                fontSize: 13,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                            Text(
                              'Prompt visitors for contact details',
                              style: GoogleFonts.outfit(
                                color: _subtitleColor,
                                fontSize: 11.5,
                              ),
                            ),
                          ],
                        ),
                        Switch(
                          value: collectLeads,
                          activeColor: const Color(0xFF0052FF),
                          onChanged: (val) {
                            setModalState(() => collectLeads = val);
                          },
                        ),
                      ],
                    ),

                    const SizedBox(height: 24),

                    // Submit Button
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        onPressed: () async {
                          final title = titleCtrl.text.trim();
                          final desig = desigCtrl.text.trim();
                          if (title.isEmpty) return;

                          Navigator.pop(ctx);
                          HapticFeedback.mediumImpact();

                          if (isEditing) {
                            await _apiService.updateCard(
                              id: existingCard.id,
                              title: title,
                              designation: desig.isNotEmpty ? desig : 'Professional',
                              bio: bioCtrl.text.trim(),
                              skills: skillsList,
                              themeColor: selectedTheme,
                              collectLeads: collectLeads,
                            );
                            await _loadCards(forceRefresh: true);
                            if (mounted) {
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(
                                  content: Text('✓ Saved changes to "$title".'),
                                  backgroundColor: const Color(0xFF0052FF),
                                  duration: const Duration(seconds: 2),
                                ),
                              );
                            }
                          } else {
                            await _apiService.createCard(
                              title: title,
                              designation: desig.isNotEmpty ? desig : 'Professional',
                              bio: bioCtrl.text.trim(),
                              skills: skillsList,
                              themeColor: selectedTheme,
                              collectLeads: collectLeads,
                            );
                            await _loadCards(forceRefresh: true);
                            if (mounted) {
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(
                                  content: Text('✓ Created new card "$title".'),
                                  backgroundColor: const Color(0xFF0052FF),
                                  duration: const Duration(seconds: 2),
                                ),
                              );
                            }
                          }
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF0052FF),
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(vertical: 14),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(14),
                          ),
                        ),
                        child: Text(
                          isEditing ? 'Save Changes' : 'Create Card',
                          style: GoogleFonts.outfit(
                            fontWeight: FontWeight.bold,
                            fontSize: 15,
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
      },
    );
  }

  String _formatTimeAgo(DateTime dt) {
    final diff = DateTime.now().difference(dt);
    if (diff.inMinutes < 60) {
      return 'Updated ${diff.inMinutes.clamp(1, 59)} min ago';
    } else if (diff.inHours < 24) {
      return 'Updated ${diff.inHours} hours ago';
    } else if (diff.inDays < 30) {
      return 'Updated ${diff.inDays} days ago';
    } else {
      return 'Updated ${(diff.inDays / 7).round()} weeks ago';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor:
          _isLight ? const Color(0xFFF8FAFC) : const Color(0xFF0A0A0F),
      body: SafeArea(
        child: Column(
          children: [
            // ── Top Header Navigation Bar ───────────────────────────────────
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  // Back button
                  InkWell(
                    onTap: () {
                      HapticFeedback.lightImpact();
                      Navigator.of(context).pop(_activeCard);
                    },
                    borderRadius: BorderRadius.circular(20),
                    child: Container(
                      width: 38,
                      height: 38,
                      decoration: BoxDecoration(
                        color: _isLight
                            ? Colors.white
                            : Colors.white.withValues(alpha: 0.08),
                        shape: BoxShape.circle,
                        border: Border.all(color: _borderColor),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black
                                .withValues(alpha: _isLight ? 0.03 : 0.20),
                            blurRadius: 10,
                            offset: const Offset(0, 2),
                          ),
                        ],
                      ),
                      child: Icon(
                        Icons.arrow_back_ios_new_rounded,
                        color: _textColor,
                        size: 15,
                      ),
                    ),
                  ),

                  // Center Title
                  Text(
                    'Manage Cards',
                    style: GoogleFonts.outfit(
                      color: _textColor,
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),

                  // Right Plus Button
                  InkWell(
                    onTap: () {
                      HapticFeedback.lightImpact();
                      _showCardEditorModal();
                    },
                    borderRadius: BorderRadius.circular(20),
                    child: Container(
                      width: 38,
                      height: 38,
                      decoration: const BoxDecoration(
                        color: Color(0xFF0052FF),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(
                        Icons.add_rounded,
                        color: Colors.white,
                        size: 22,
                      ),
                    ),
                  ),
                ],
              ),
            ),

            // ── Subtitle Description ────────────────────────────────────────
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 4),
              child: Align(
                alignment: Alignment.centerLeft,
                child: Text(
                  'Switch active card, customize themes, and share digital identities.',
                  style: GoogleFonts.outfit(
                    color: _subtitleColor,
                    fontSize: 13,
                  ),
                ),
              ),
            ),

            const SizedBox(height: 12),

            // ── Scrollable Cards List ───────────────────────────────────────
            Expanded(
              child: _loading
                  ? const Center(
                      child: CircularProgressIndicator(color: Color(0xFF0052FF)),
                    )
                  : SingleChildScrollView(
                      physics: const BouncingScrollPhysics(),
                      padding: const EdgeInsets.symmetric(
                          horizontal: 20, vertical: 6),
                      child: Column(
                        children: [
                          for (final card in _cards) ...[
                            _buildCardTile(card),
                            const SizedBox(height: 16),
                          ],

                          // ── Create New Card Dashed Button ──────────────────
                          _buildCreateNewCardDashedButton(),

                          const SizedBox(height: 36),
                        ],
                      ),
                    ),
            ),
          ],
        ),
      ),
    );
  }

  // ── Card Tile Builder ─────────────────────────────────────────────────────

  Widget _buildCardTile(CardItem card) {
    final isActive = card.isActive;
    final isDefault = card.isDefault;
    final avatarProvider = getAvatarImage(card.avatar ?? _profile?.avatar, _apiService.baseUrl);

    Color themeAccent;
    try {
      themeAccent = Color(int.parse(card.themeColor));
    } catch (_) {
      themeAccent = const Color(0xFF0052FF);
    }

    final isActivating = _activatingCardId == card.id;

    if (isActive) {
      // ── Royal Active Gradient Card ───────────────────────────────────────
      return Container(
        padding: const EdgeInsets.all(18),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(22),
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              themeAccent.withValues(alpha: 0.90),
              themeAccent,
              themeAccent.withValues(alpha: 0.80),
            ],
          ),
          boxShadow: [
            BoxShadow(
              color: themeAccent.withValues(alpha: 0.35),
              blurRadius: 18,
              offset: const Offset(0, 6),
            ),
          ],
        ),
        child: Column(
          children: [
            Row(
              children: [
                // Avatar
                CircleAvatar(
                  radius: 28,
                  backgroundColor: Colors.white24,
                  backgroundImage: avatarProvider,
                ),
                const SizedBox(width: 14),

                // Title, Designation & Time
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Flexible(
                            child: Text(
                              card.title,
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: GoogleFonts.outfit(
                                color: Colors.white,
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                          const SizedBox(width: 8),
                          // ACTIVE Pill
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                            decoration: BoxDecoration(
                              color: Colors.white.withValues(alpha: 0.25),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Container(
                                  width: 6,
                                  height: 6,
                                  decoration: const BoxDecoration(
                                    color: Color(0xFF34D399),
                                    shape: BoxShape.circle,
                                  ),
                                ),
                                const SizedBox(width: 4),
                                Text(
                                  'ACTIVE',
                                  style: GoogleFonts.outfit(
                                    color: Colors.white,
                                    fontSize: 10,
                                    fontWeight: FontWeight.w800,
                                    letterSpacing: 0.4,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 2),
                      Text(
                        card.designation,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: GoogleFonts.outfit(
                          color: Colors.white.withValues(alpha: 0.85),
                          fontSize: 12.5,
                        ),
                      ),
                      const SizedBox(height: 6),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Row(
                            children: [
                              const Icon(
                                Icons.access_time_rounded,
                                color: Colors.white60,
                                size: 12,
                              ),
                              const SizedBox(width: 4),
                              Text(
                                _formatTimeAgo(card.updatedAt),
                                style: GoogleFonts.outfit(
                                  color: Colors.white60,
                                  fontSize: 11,
                                ),
                              ),
                            ],
                          ),
                          if (isDefault)
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2),
                              decoration: BoxDecoration(
                                color: Colors.white.withValues(alpha: 0.15),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Text(
                                'DEFAULT ✓',
                                style: GoogleFonts.outfit(
                                  color: Colors.white70,
                                  fontSize: 9.5,
                                  fontWeight: FontWeight.w700,
                                ),
                              ),
                            ),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),

            const SizedBox(height: 14),
            Divider(color: Colors.white.withValues(alpha: 0.18), height: 1),
            const SizedBox(height: 12),

            // Card Action Buttons
            Row(
              children: [
                // Edit Button
                Expanded(
                  child: InkWell(
                    onTap: () => _showCardEditorModal(existingCard: card),
                    borderRadius: BorderRadius.circular(10),
                    child: Container(
                      padding: const EdgeInsets.symmetric(vertical: 8),
                      decoration: BoxDecoration(
                        color: Colors.white.withValues(alpha: 0.15),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      alignment: Alignment.center,
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Icon(Icons.edit_outlined, size: 14, color: Colors.white),
                          const SizedBox(width: 5),
                          Text(
                            'Edit',
                            style: GoogleFonts.outfit(
                              color: Colors.white,
                              fontSize: 12.5,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 8),

                // Share Button (Card Specific)
                Expanded(
                  child: InkWell(
                    onTap: () => _shareSpecificCard(card),
                    borderRadius: BorderRadius.circular(10),
                    child: Container(
                      padding: const EdgeInsets.symmetric(vertical: 8),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(10),
                      ),
                      alignment: Alignment.center,
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.share_rounded, size: 14, color: themeAccent),
                          const SizedBox(width: 5),
                          Text(
                            'Share',
                            style: GoogleFonts.outfit(
                              color: themeAccent,
                              fontSize: 12.5,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 8),

                // More Options Menu
                _buildMoreMenu(card, isLightText: true),
              ],
            ),
          ],
        ),
      );
    }

    // ── Secondary / Inactive Digital Card Tile ──────────────────────────────
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: _cardBg,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: _borderColor),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: _isLight ? 0.03 : 0.20),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        children: [
          Row(
            children: [
              // Avatar
              CircleAvatar(
                radius: 26,
                backgroundColor: _isLight ? const Color(0xFFF1F5F9) : const Color(0xFF1E293B),
                backgroundImage: avatarProvider,
              ),
              const SizedBox(width: 14),

              // Title, Designation & Time
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Flexible(
                          child: Text(
                            card.title,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: GoogleFonts.outfit(
                              color: _textColor,
                              fontSize: 15.5,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                        if (isDefault) ...[
                          const SizedBox(width: 6),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                            decoration: BoxDecoration(
                              color: const Color(0xFF0052FF).withValues(alpha: 0.10),
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: Text(
                              'DEFAULT',
                              style: GoogleFonts.outfit(
                                color: const Color(0xFF0052FF),
                                fontSize: 9,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                        ],
                      ],
                    ),
                    const SizedBox(height: 2),
                    Text(
                      card.designation,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: GoogleFonts.outfit(
                        color: _subtitleColor,
                        fontSize: 12.5,
                      ),
                    ),
                    const SizedBox(height: 6),
                    Row(
                      children: [
                        Icon(
                          Icons.access_time_rounded,
                          color: _subtitleColor,
                          size: 12,
                        ),
                        const SizedBox(width: 4),
                        Text(
                          _formatTimeAgo(card.updatedAt),
                          style: GoogleFonts.outfit(
                            color: _subtitleColor,
                            fontSize: 11,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),

          const SizedBox(height: 14),
          Divider(color: _borderColor, height: 1),
          const SizedBox(height: 12),

          // Action Buttons
          Row(
            children: [
              // Set Active Button
              Expanded(
                flex: 5,
                child: InkWell(
                  onTap: isActivating ? null : () => _handleSetActive(card),
                  borderRadius: BorderRadius.circular(10),
                  child: Container(
                    padding: const EdgeInsets.symmetric(vertical: 8),
                    decoration: BoxDecoration(
                      color: const Color(0xFF0052FF),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    alignment: Alignment.center,
                    child: isActivating
                        ? const SizedBox(
                            width: 16,
                            height: 16,
                            child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                          )
                        : Text(
                            'Set Active',
                            style: GoogleFonts.outfit(
                              color: Colors.white,
                              fontSize: 12.5,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                  ),
                ),
              ),
              const SizedBox(width: 8),

              // Share Button (Card Specific)
              Expanded(
                flex: 4,
                child: InkWell(
                  onTap: () => _shareSpecificCard(card),
                  borderRadius: BorderRadius.circular(10),
                  child: Container(
                    padding: const EdgeInsets.symmetric(vertical: 8),
                    decoration: BoxDecoration(
                      color: _isLight ? const Color(0xFFF1F5F9) : Colors.white.withValues(alpha: 0.08),
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(color: _borderColor),
                    ),
                    alignment: Alignment.center,
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.share_rounded, size: 14, color: _textColor),
                        const SizedBox(width: 5),
                        Text(
                          'Share',
                          style: GoogleFonts.outfit(
                            color: _textColor,
                            fontSize: 12.5,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 8),

              // More Options Menu
              _buildMoreMenu(card, isLightText: false),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildMoreMenu(CardItem card, {required bool isLightText}) {
    return PopupMenuButton<String>(
      icon: Icon(
        Icons.more_vert_rounded,
        color: isLightText ? Colors.white70 : _subtitleColor,
        size: 20,
      ),
      color: _cardBg,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: BorderSide(color: _borderColor),
      ),
      onSelected: (action) {
        switch (action) {
          case 'edit':
            _showCardEditorModal(existingCard: card);
            break;
          case 'duplicate':
            _handleDuplicateCard(card);
            break;
          case 'default':
            _handleSetDefault(card);
            break;
          case 'delete':
            _handleDeleteCard(card);
            break;
        }
      },
      itemBuilder: (ctx) => [
        PopupMenuItem(
          value: 'edit',
          child: Row(
            children: [
              Icon(Icons.edit_outlined, size: 16, color: _textColor),
              const SizedBox(width: 8),
              Text('Edit Card', style: GoogleFonts.outfit(color: _textColor, fontSize: 13)),
            ],
          ),
        ),
        PopupMenuItem(
          value: 'duplicate',
          child: Row(
            children: [
              Icon(Icons.copy_rounded, size: 16, color: _textColor),
              const SizedBox(width: 8),
              Text('Duplicate', style: GoogleFonts.outfit(color: _textColor, fontSize: 13)),
            ],
          ),
        ),
        if (!card.isDefault)
          PopupMenuItem(
            value: 'default',
            child: Row(
              children: [
                const Icon(Icons.star_outline_rounded, size: 16, color: Color(0xFF0052FF)),
                const SizedBox(width: 8),
                Text('Set as Default', style: GoogleFonts.outfit(color: _textColor, fontSize: 13)),
              ],
            ),
          ),
        PopupMenuItem(
          value: 'delete',
          child: Row(
            children: [
              const Icon(Icons.delete_outline_rounded, size: 16, color: Colors.redAccent),
              const SizedBox(width: 8),
              Text('Delete Card', style: GoogleFonts.outfit(color: Colors.redAccent, fontSize: 13)),
            ],
          ),
        ),
      ],
    );
  }

  // ── Create New Card Dashed Button ─────────────────────────────────────────

  Widget _buildCreateNewCardDashedButton() {
    return GestureDetector(
      onTap: () {
        HapticFeedback.lightImpact();
        _showCardEditorModal();
      },
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.symmetric(vertical: 20),
        decoration: BoxDecoration(
          color: _isLight
              ? const Color(0xFFF1F5F9).withValues(alpha: 0.6)
              : Colors.white.withValues(alpha: 0.03),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: const Color(0xFF0052FF).withValues(alpha: 0.35),
            width: 1.5,
            style: BorderStyle.solid,
          ),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                color: const Color(0xFF0052FF).withValues(alpha: 0.12),
                shape: BoxShape.circle,
              ),
              child: const Icon(
                Icons.add_rounded,
                color: Color(0xFF0052FF),
                size: 26,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Create New Card',
              style: GoogleFonts.outfit(
                color: const Color(0xFF0052FF),
                fontSize: 14.5,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 2),
            Text(
              'Design a new persona, role or business card',
              style: GoogleFonts.outfit(
                color: _subtitleColor,
                fontSize: 11.5,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

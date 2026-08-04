import 'package:flutter/material.dart' hide CardTheme, ButtonTheme;
import 'package:google_fonts/google_fonts.dart';
import 'controller/theme_studio_controller.dart';
import 'widgets/preview/interactive_preview.dart';
import 'services/preset_service.dart';
import '../../models/profile.dart';
import '../../services/api_service.dart';

class ThemeStudioScreen extends StatefulWidget {
  final bool isPremium;
  const ThemeStudioScreen({super.key, required this.isPremium});

  @override
  State<ThemeStudioScreen> createState() => _ThemeStudioScreenState();
}

class _ThemeStudioScreenState extends State<ThemeStudioScreen> {
  final ThemeStudioController _controller = ThemeStudioController();
  late PageController _pageController;
  int _currentPage = 0;
  Profile? _profile;
  bool _loadingProfile = true;

  @override
  void initState() {
    super.initState();
    _pageController = PageController();
    _controller.addListener(_onControllerChanged);
    _controller.loadTheme();
    _fetchProfile();
  }

  Future<void> _fetchProfile() async {
    try {
      final res = await ApiService().getProfile();
      if (res != null && res['profile'] != null) {
        setState(() {
          _profile = res['profile'];
          _loadingProfile = false;
        });
      } else {
        setState(() => _loadingProfile = false);
      }
    } catch (e) {
      debugPrint('[THEME-STUDIO] Fetch profile error: $e');
      setState(() => _loadingProfile = false);
    }
  }

  @override
  void dispose() {
    _pageController.dispose();
    _controller.removeListener(_onControllerChanged);
    _controller.dispose();
    super.dispose();
  }

  void _onControllerChanged() {
    if (mounted) setState(() {});
  }

  void _showPremiumGate(BuildContext context, String title) {
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        backgroundColor: Colors.white,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: Text(
          '🔒 Premium Theme',
          style: GoogleFonts.outfit(color: const Color(0xFF1F2937), fontWeight: FontWeight.bold),
        ),
        content: Text(
          '$title is a Premium member theme. Upgrade your Tapfolio membership to unlock all styles.',
          style: GoogleFonts.outfit(color: const Color(0xFF4B5563)),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text('Cancel', style: GoogleFonts.outfit(fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    if (_controller.loading) {
      return const Scaffold(
        backgroundColor: Color(0xFFF9FAFB),
        body: Center(child: CircularProgressIndicator(color: Color(0xFF0052FF))),
      );
    }

    final presets = PresetService.getPresets();

    return Scaffold(
      backgroundColor: Colors.black,
      body: Stack(
        children: [
          // Full-screen PageView preview background and layout
          Positioned.fill(
            child: PageView.builder(
              controller: _pageController,
              itemCount: presets.length,
              onPageChanged: (page) {
                setState(() {
                  _currentPage = page;
                });
              },
              itemBuilder: (context, idx) {
                final preset = presets[idx];
                return InteractivePreview(settings: preset.settings, profile: _profile);
              },
            ),
          ),

          // Custom floating transparent header bar overlaid at the top
          Positioned(
            top: 0,
            left: 0,
            right: 0,
            child: Container(
              padding: EdgeInsets.only(
                top: MediaQuery.of(context).padding.top + 8,
                bottom: 16,
                left: 16,
                right: 16,
              ),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    Colors.black.withOpacity(0.5),
                    Colors.transparent,
                  ],
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                ),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  // Close button
                  GestureDetector(
                    onTap: () => Navigator.pop(context),
                    child: Container(
                      width: 40,
                      height: 40,
                      decoration: BoxDecoration(
                        color: Colors.black38,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: Colors.white10),
                      ),
                      child: const Icon(Icons.close, color: Colors.white, size: 20),
                    ),
                  ),

                  // Center indicator titles & tracker dots
                  Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        presets[_currentPage].label,
                        style: GoogleFonts.outfit(
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                          fontSize: 14,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        '${_currentPage + 1} of ${presets.length}',
                        style: GoogleFonts.outfit(
                          color: Colors.white70,
                          fontSize: 10,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      const SizedBox(height: 6),
                      // Dot indicators inside header
                      Row(
                        mainAxisSize: MainAxisSize.min,
                        children: List.generate(
                          presets.length > 5 ? 5 : presets.length,
                          (idx) {
                            final displayIdx = _currentPage % 5;
                            final active = displayIdx == idx;
                            return Container(
                              width: active ? 16 : 6,
                              height: 6,
                              margin: const EdgeInsets.symmetric(horizontal: 2),
                              decoration: BoxDecoration(
                                color: active ? const Color(0xFF0052FF) : Colors.white24,
                                borderRadius: BorderRadius.circular(3),
                              ),
                            );
                          },
                        ),
                      ),
                    ],
                  ),

                  // Save / Unlock Premium action button
                  Builder(
                    builder: (context) {
                      final preset = presets[_currentPage];
                      final locked = preset.premium && !widget.isPremium;

                      return SizedBox(
                        height: 38,
                        child: ElevatedButton.icon(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: locked ? Colors.amber[800] : const Color(0xFF0052FF),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(100),
                            ),
                            padding: const EdgeInsets.symmetric(horizontal: 16),
                            elevation: 0,
                          ),
                          onPressed: () {
                            if (locked) {
                              _showPremiumGate(context, preset.label);
                            } else {
                              _controller.updateSettings(preset.settings, 'Applied Preset: ${preset.label}');
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(
                                  content: Text('${preset.label} theme saved successfully!'),
                                  backgroundColor: const Color(0xFF10B981),
                                  behavior: SnackBarBehavior.floating,
                                ),
                              );
                            }
                          },
                          icon: Icon(
                            locked ? Icons.lock : Icons.save_outlined,
                            color: Colors.white,
                            size: 16,
                          ),
                          label: Text(
                            locked ? 'Unlock' : 'Save Theme',
                            style: GoogleFonts.outfit(
                              color: Colors.white,
                              fontWeight: FontWeight.bold,
                              fontSize: 13,
                            ),
                          ),
                        ),
                      );
                    },
                  ),
                ],
              ),
            ),
          ),

          // Down arrow scroll indicator overlay at the bottom
          Positioned(
            bottom: 24,
            left: 0,
            right: 0,
            child: Center(
              child: Container(
                width: 36,
                height: 36,
                decoration: const BoxDecoration(
                  color: Colors.black26,
                  shape: BoxShape.circle,
                ),
                child: const Icon(
                  Icons.keyboard_arrow_down,
                  color: Colors.white60,
                  size: 24,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

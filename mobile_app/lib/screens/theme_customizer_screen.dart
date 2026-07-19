import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../services/api_service.dart';

// ─── Default Theme Settings ────────────────────────────────────────────────────
Map<String, dynamic> _defaultSettings() => {
  'background': {'type': 'solid', 'value': '#f0f2f8'},
  'buttons': {'style': 'solid', 'radius': '100px', 'height': '44px'},
  'layout': {'style': 'default'},
  'avatar': {'shape': 'circle'},
  'sections': {
    'order': ['about', 'contact', 'socials', 'portfolio', 'projects'],
    'visibility': {
      'about': true,
      'contact': true,
      'socials': true,
      'portfolio': true,
      'projects': true,
    },
  },
  'animations': {'style': 'fade', 'cursorGlow': false},
};

// ─── Preset Themes ─────────────────────────────────────────────────────────────
final _presets = [
  {
    'id': 'midnight_pro',
    'label': 'Midnight Pro',
    'colors': [Color(0xFF0f172a), Color(0xFF1e293b)],
    'premium': false,
    'settings': {
      'background': {'type': 'solid', 'value': '#0f172a'},
      'buttons': {'style': 'gradient', 'radius': '12px'},
      'avatar': {'shape': 'circle'},
      'layout': {'style': 'default'},
      'animations': {'style': 'fade'},
    },
  },
  {
    'id': 'aurora_mesh',
    'label': 'Aurora Mesh',
    'colors': [Color(0xFF14b8a6), Color(0xFF6366f1)],
    'premium': true,
    'settings': {
      'background': {'type': 'aurora', 'value': ''},
      'buttons': {'style': 'gradient', 'radius': '100px'},
      'avatar': {'shape': 'circle'},
      'layout': {'style': 'default'},
      'animations': {'style': 'fade'},
    },
  },
  {
    'id': 'clean_slate',
    'label': 'Clean Slate',
    'colors': [Color(0xFFf8fafc), Color(0xFFe2e8f0)],
    'premium': false,
    'settings': {
      'background': {'type': 'solid', 'value': '#f8fafc'},
      'buttons': {'style': 'outlined', 'radius': '8px'},
      'avatar': {'shape': 'rounded'},
      'layout': {'style': 'minimal'},
      'animations': {'style': 'slide'},
    },
  },
  {
    'id': 'ocean_glass',
    'label': 'Ocean Glass',
    'colors': [Color(0xFF0ea5e9), Color(0xFF6366f1)],
    'premium': true,
    'settings': {
      'background': {'type': 'animated_gradient', 'value': ''},
      'buttons': {'style': 'ghost', 'radius': '100px'},
      'avatar': {'shape': 'circle'},
      'layout': {'style': 'default'},
      'animations': {'style': 'scale'},
    },
  },
  {
    'id': 'sunset_vibes',
    'label': 'Sunset Vibes',
    'colors': [Color(0xFFf97316), Color(0xFFec4899)],
    'premium': false,
    'settings': {
      'background': {'type': 'solid', 'value': '#1a0a00'},
      'buttons': {'style': 'gradient', 'radius': '100px'},
      'avatar': {'shape': 'circle'},
      'layout': {'style': 'default'},
      'animations': {'style': 'fade'},
    },
  },
  {
    'id': 'forest_zen',
    'label': 'Forest Zen',
    'colors': [Color(0xFF064e3b), Color(0xFF10b981)],
    'premium': false,
    'settings': {
      'background': {'type': 'solid', 'value': '#064e3b'},
      'buttons': {'style': 'solid', 'radius': '8px'},
      'avatar': {'shape': 'square'},
      'layout': {'style': 'business'},
      'animations': {'style': 'fade'},
    },
  },
];

class ThemeCustomizerScreen extends StatefulWidget {
  final bool isPremium;
  const ThemeCustomizerScreen({super.key, required this.isPremium});

  @override
  State<ThemeCustomizerScreen> createState() => _ThemeCustomizerScreenState();
}

class _ThemeCustomizerScreenState extends State<ThemeCustomizerScreen>
    with SingleTickerProviderStateMixin {
  final ApiService _api = ApiService();
  late TabController _tabController;
  Map<String, dynamic> _settings = _defaultSettings();
  bool _loading = true;
  bool _saving = false;
  String? _successMsg;
  String? _errorMsg;
  List<dynamic> _marketplaceThemes = [];
  bool _loadingMarketplace = false;
  int? _ownUserId;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 8, vsync: this);
    _loadTheme();
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  dynamic _get(String section, String key, dynamic fallback) {
    final sec = _settings[section];
    if (sec is Map && sec.containsKey(key)) return sec[key];
    return fallback;
  }

  void _set(String section, String key, dynamic value) {
    setState(() {
      final sec = Map<String, dynamic>.from(_settings[section] ?? {});
      sec[key] = value;
      _settings = Map<String, dynamic>.from(_settings)..[section] = sec;
    });
  }

  Future<void> _loadTheme() async {
    setState(() => _loading = true);
    try {
      final res = await _api.getTheme();
      if (res['success'] == true && res['theme'] != null) {
        final themeData = res['theme'] as Map<String, dynamic>;
        final raw = themeData['settings'];
        if (raw != null) {
          final decoded = raw is String ? jsonDecode(raw) : raw;
          setState(() => _settings = Map<String, dynamic>.from(decoded));
        }
        _ownUserId = themeData['userId'] as int?;
      }
    } catch (_) {}
    await _fetchMarketplace();
    if (mounted) setState(() => _loading = false);
  }

  Future<void> _fetchMarketplace() async {
    setState(() => _loadingMarketplace = true);
    final res = await _api.getMarketplaceThemes();
    if (mounted) {
      setState(() {
        _marketplaceThemes = res['themes'] ?? [];
        _loadingMarketplace = false;
      });
    }
  }

  Future<void> _save() async {
    setState(() => _saving = true);
    final res = await _api.saveTheme(_settings);
    if (mounted) {
      setState(() {
        _saving = false;
        _successMsg = res['success'] == true ? 'Theme saved!' : (res['error'] ?? 'Failed.');
        _errorMsg = res['success'] == true ? null : _successMsg;
        if (res['success'] == true) {
          _errorMsg = null;
        } else {
          _errorMsg = _successMsg;
          _successMsg = null;
        }
      });
      Future.delayed(const Duration(seconds: 3), () {
        if (mounted) setState(() { _successMsg = null; _errorMsg = null; });
      });
    }
  }

  Future<void> _reset() async {
    final ok = await showDialog<bool>(
      context: context,
      builder: (_) => AlertDialog(
        backgroundColor: const Color(0xFF1a1a2e),
        title: Text('Reset Theme?', style: GoogleFonts.outfit(color: Colors.white, fontWeight: FontWeight.bold)),
        content: Text('Reset all customizations to default?', style: GoogleFonts.outfit(color: Colors.white60)),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('Cancel')),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: Colors.redAccent),
            onPressed: () => Navigator.pop(context, true),
            child: const Text('Reset'),
          ),
        ],
      ),
    );
    if (ok != true || !mounted) return;
    setState(() => _saving = true);
    final res = await _api.resetTheme();
    if (mounted) {
      if (res['success'] == true && res['theme'] != null) {
        final raw = res['theme']['settings'];
        if (raw != null) {
          final decoded = raw is String ? jsonDecode(raw) : raw;
          setState(() { _settings = Map<String, dynamic>.from(decoded); _saving = false; _successMsg = 'Theme reset!'; });
        } else {
          setState(() { _saving = false; _settings = _defaultSettings(); _successMsg = 'Theme reset!'; });
        }
      } else {
        setState(() => _saving = false);
      }
      Future.delayed(const Duration(seconds: 3), () {
        if (mounted) setState(() => _successMsg = null);
      });
    }
  }

  void _applyPreset(Map<String, dynamic> ps) {
    final merged = Map<String, dynamic>.from(_settings);
    ps.forEach((k, v) {
      if (v is Map) {
        merged[k] = Map<String, dynamic>.from(merged[k] ?? {})..addAll(Map<String, dynamic>.from(v));
      } else {
        merged[k] = v;
      }
    });
    setState(() => _settings = merged);
  }

  void _showPremiumGate(String feature) {
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        backgroundColor: const Color(0xFF1a1a2e),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: Text('🔒 Premium Feature', style: GoogleFonts.outfit(color: Colors.white, fontWeight: FontWeight.bold)),
        content: Text('$feature is available for Premium members only. Upgrade to unlock it!', style: GoogleFonts.outfit(color: Colors.white70)),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text('Maybe later')),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: Colors.amber),
            onPressed: () => Navigator.pop(context),
            child: Text('Upgrade', style: GoogleFonts.outfit(color: Colors.black, fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }

  Color _hexColor(String hex) {
    try {
      final h = hex.replaceAll('#', '').padLeft(6, '0');
      return Color(int.parse('FF$h', radix: 16));
    } catch (_) {
      return Colors.grey;
    }
  }

  // ── Shared widgets ──────────────────────────────────────────────────────────

  Widget _glassCard({required Widget child, EdgeInsets? padding}) => Container(
    margin: const EdgeInsets.only(bottom: 14),
    padding: padding ?? const EdgeInsets.all(16),
    decoration: BoxDecoration(
      color: Colors.white.withValues(alpha: 0.04),
      borderRadius: BorderRadius.circular(16),
      border: Border.all(color: Colors.white.withValues(alpha: 0.08)),
    ),
    child: child,
  );

  Widget _label(String text) => Padding(
    padding: const EdgeInsets.only(bottom: 10),
    child: Text(text, style: GoogleFonts.outfit(color: Colors.white70, fontSize: 13, fontWeight: FontWeight.w500)),
  );

  Widget _chip(String label, bool selected, VoidCallback onTap, {bool locked = false}) {
    return GestureDetector(
      onTap: locked ? () => _showPremiumGate(label) : onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 180),
        margin: const EdgeInsets.only(right: 8, bottom: 8),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
        decoration: BoxDecoration(
          color: selected ? const Color(0xFF6366F1) : Colors.white.withValues(alpha: 0.06),
          borderRadius: BorderRadius.circular(30),
          border: Border.all(color: selected ? const Color(0xFF6366F1) : Colors.white.withValues(alpha: 0.12)),
        ),
        child: Row(mainAxisSize: MainAxisSize.min, children: [
          if (locked) const Text('🔒 ', style: TextStyle(fontSize: 11)),
          Text(label, style: GoogleFonts.outfit(color: Colors.white, fontSize: 13, fontWeight: FontWeight.w500)),
        ]),
      ),
    );
  }

  Widget _sectionTitle(String title, String sub) => Padding(
    padding: const EdgeInsets.only(bottom: 16),
    child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Text(title, style: GoogleFonts.outfit(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
      const SizedBox(height: 4),
      Text(sub, style: GoogleFonts.outfit(color: Colors.white60, fontSize: 13)),
    ]),
  );

  // ── PRESETS TAB ─────────────────────────────────────────────────────────────

  Widget _buildPresetsTab() => ListView(
    padding: const EdgeInsets.all(16),
    children: [
      _sectionTitle('Theme Presets', 'One-tap visual styles to transform your profile'),
      ..._presets.map((preset) {
        final isPrem = preset['premium'] == true;
        final locked = isPrem && !widget.isPremium;
        final colors = (preset['colors'] as List).cast<Color>();
        return GestureDetector(
          onTap: () {
            if (locked) { _showPremiumGate(preset['label'] as String); return; }
            _applyPreset(preset['settings'] as Map<String, dynamic>);
            setState(() => _successMsg = '${preset['label']} applied!');
            Future.delayed(const Duration(seconds: 2), () {
              if (mounted) setState(() => _successMsg = null);
            });
          },
          child: Container(
            margin: const EdgeInsets.only(bottom: 12),
            padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 16),
            decoration: BoxDecoration(
              gradient: LinearGradient(colors: colors, begin: Alignment.centerLeft, end: Alignment.centerRight),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: Colors.white.withValues(alpha: 0.1)),
            ),
            child: Row(children: [
              Expanded(child: Row(children: [
                Text(preset['label'] as String, style: GoogleFonts.outfit(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
                if (isPrem) ...[
                  const SizedBox(width: 10),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                    decoration: BoxDecoration(
                      color: Colors.amber.withValues(alpha: 0.25),
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: Colors.amber.withValues(alpha: 0.5)),
                    ),
                    child: Text('PREMIUM', style: GoogleFonts.outfit(color: Colors.amber, fontSize: 10, fontWeight: FontWeight.bold)),
                  ),
                ],
              ])),
              Icon(locked ? Icons.lock_outline : Icons.arrow_forward_ios_rounded, color: Colors.white70, size: 16),
            ]),
          ),
        );
      }),
    ],
  );

  // ── BACKGROUND TAB ──────────────────────────────────────────────────────────

  Widget _buildBackgroundTab() {
    final bgType = _get('background', 'type', 'solid') as String;
    final bgValue = _get('background', 'value', '#f0f2f8') as String;

    final bgOptions = [
      {'value': 'solid', 'label': 'Solid Color', 'icon': Icons.circle, 'premium': false},
      {'value': 'aurora', 'label': 'Aurora Mesh', 'icon': Icons.auto_awesome, 'premium': true},
      {'value': 'animated_gradient', 'label': 'Animated Gradient', 'icon': Icons.gradient, 'premium': true},
      {'value': 'particles', 'label': 'Particles', 'icon': Icons.scatter_plot, 'premium': true},
    ];

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        _sectionTitle('Background', 'Set the background style for your public profile'),
        _glassCard(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          _label('Type'),
          Wrap(children: bgOptions.map((t) {
            final isPrem = t['premium'] as bool;
            final locked = isPrem && !widget.isPremium;
            return _chip(t['label'] as String, bgType == t['value'], () => _set('background', 'type', t['value']), locked: locked);
          }).toList()),
        ])),

        if (bgType == 'solid')
          _glassCard(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            _label('Color'),
            Wrap(spacing: 8, runSpacing: 8, children: [
              '#f0f2f8', '#0f172a', '#1e1b4b', '#064e3b',
              '#1a0a00', '#0a0a0f', '#ffffff', '#111827', '#1e293b', '#0c0c1d',
            ].map((c) {
              final selected = bgValue == c;
              return GestureDetector(
                onTap: () => _set('background', 'value', c),
                child: Container(
                  width: 44, height: 44,
                  decoration: BoxDecoration(
                    color: _hexColor(c),
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(
                      color: selected ? const Color(0xFF6366F1) : Colors.white24,
                      width: selected ? 3 : 1,
                    ),
                  ),
                  child: selected ? const Icon(Icons.check, color: Colors.white, size: 18) : null,
                ),
              );
            }).toList()),
          ])),

        if (bgType != 'solid')
          _glassCard(child: Row(children: [
            const Icon(Icons.check_circle, color: Color(0xFF10B981), size: 20),
            const SizedBox(width: 10),
            Expanded(child: Text(
              '${bgType == 'aurora' ? 'Aurora Mesh' : bgType == 'particles' ? 'Particles' : 'Animated Gradient'} is active on your public profile.',
              style: GoogleFonts.outfit(color: Colors.white70, fontSize: 13),
            )),
          ])),
      ],
    );
  }

  // ── AVATAR TAB ──────────────────────────────────────────────────────────────

  Widget _buildAvatarTab() {
    final shape = _get('avatar', 'shape', 'circle') as String;

    Widget shapeOption(String value, IconData icon, String label) {
      final sel = shape == value;
      return Expanded(child: GestureDetector(
        onTap: () => _set('avatar', 'shape', value),
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 180),
          padding: const EdgeInsets.symmetric(vertical: 14),
          decoration: BoxDecoration(
            color: sel ? const Color(0xFF6366F1).withValues(alpha: 0.15) : Colors.white.withValues(alpha: 0.04),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: sel ? const Color(0xFF6366F1) : Colors.white.withValues(alpha: 0.1)),
          ),
          child: Column(children: [
            Icon(icon, color: sel ? const Color(0xFF6366F1) : Colors.white54, size: 24),
            const SizedBox(height: 6),
            Text(label, style: GoogleFonts.outfit(color: sel ? const Color(0xFF6366F1) : Colors.white54, fontSize: 12)),
          ]),
        ),
      ));
    }

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        _sectionTitle('Avatar Shape', 'Choose how your profile picture is displayed'),
        _glassCard(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          _label('Shape'),
          Row(children: [
            shapeOption('circle', Icons.circle_outlined, 'Circle'),
            const SizedBox(width: 10),
            shapeOption('rounded', Icons.rounded_corner, 'Rounded'),
            const SizedBox(width: 10),
            shapeOption('square', Icons.crop_square, 'Square'),
          ]),
        ])),
        _glassCard(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          _label('Preview'),
          Center(child: Container(
            width: 90, height: 90,
            decoration: BoxDecoration(
              color: const Color(0xFF6366F1).withValues(alpha: 0.25),
              borderRadius: shape == 'circle' ? BorderRadius.circular(45)
                  : shape == 'rounded' ? BorderRadius.circular(18)
                  : BorderRadius.circular(4),
              border: Border.all(color: const Color(0xFF6366F1), width: 2),
            ),
            child: const Icon(Icons.person, color: Colors.white60, size: 44),
          )),
        ])),
      ],
    );
  }

  // ── BUTTONS TAB ─────────────────────────────────────────────────────────────

  Widget _buildButtonsTab() {
    final style = _get('buttons', 'style', 'solid') as String;
    const styles = ['solid', 'outlined', 'ghost', 'gradient', 'pill'];

    Widget previewBtn() {
      const primary = Color(0xFF6366F1);
      switch (style) {
        case 'outlined': return OutlinedButton(
          style: OutlinedButton.styleFrom(foregroundColor: primary, side: const BorderSide(color: primary), shape: const StadiumBorder()),
          onPressed: null, child: Text('Save Contact', style: GoogleFonts.outfit()),
        );
        case 'ghost': return TextButton(
          style: TextButton.styleFrom(foregroundColor: primary),
          onPressed: null, child: Text('Save Contact', style: GoogleFonts.outfit()),
        );
        case 'gradient': return Container(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
          decoration: BoxDecoration(
            gradient: const LinearGradient(colors: [primary, Color(0xFF1D9BF0)]),
            borderRadius: BorderRadius.circular(100),
          ),
          child: Text('Save Contact', style: GoogleFonts.outfit(color: Colors.white, fontWeight: FontWeight.bold)),
        );
        case 'pill': return ElevatedButton(
          style: ElevatedButton.styleFrom(backgroundColor: primary, shape: const StadiumBorder()),
          onPressed: null, child: Text('Save Contact', style: GoogleFonts.outfit(color: Colors.white)),
        );
        default: return ElevatedButton(
          style: ElevatedButton.styleFrom(backgroundColor: primary, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10))),
          onPressed: null, child: Text('Save Contact', style: GoogleFonts.outfit(color: Colors.white)),
        );
      }
    }

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        _sectionTitle('Button Style', 'Customize how action buttons look on your profile'),
        _glassCard(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          _label('Style'),
          Wrap(children: styles.map((s) => _chip(
            s[0].toUpperCase() + s.substring(1), style == s, () => _set('buttons', 'style', s),
          )).toList()),
        ])),
        _glassCard(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          _label('Live Preview'),
          Center(child: previewBtn()),
        ])),
      ],
    );
  }

  // ── LAYOUT TAB ──────────────────────────────────────────────────────────────

  Widget _buildLayoutTab() {
    final style = _get('layout', 'style', 'default') as String;
    const styles = [
      {'value': 'default', 'label': 'Default', 'desc': 'Balanced 640px layout'},
      {'value': 'minimal', 'label': 'Minimal', 'desc': 'Tight 480px, clean & simple'},
      {'value': 'compact', 'label': 'Compact', 'desc': 'Dense 520px, information-rich'},
      {'value': 'business', 'label': 'Business', 'desc': 'Wide 720px, professional look'},
      {'value': 'creative', 'label': 'Creative', 'desc': '600px with asymmetric card radii'},
    ];

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        _sectionTitle('Layout Style', 'Control profile width and overall spacing'),
        ...styles.map((s) {
          final sel = style == s['value'];
          return GestureDetector(
            onTap: () => _set('layout', 'style', s['value']),
            child: Container(
              margin: const EdgeInsets.only(bottom: 10),
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
              decoration: BoxDecoration(
                color: sel ? const Color(0xFF6366F1).withValues(alpha: 0.10) : Colors.white.withValues(alpha: 0.04),
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: sel ? const Color(0xFF6366F1) : Colors.white.withValues(alpha: 0.08)),
              ),
              child: Row(children: [
                Radio<String>(value: s['value']!, groupValue: style, activeColor: const Color(0xFF6366F1), onChanged: (v) => _set('layout', 'style', v)),
                const SizedBox(width: 8),
                Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Text(s['label']!, style: GoogleFonts.outfit(color: Colors.white, fontWeight: FontWeight.w600)),
                  Text(s['desc']!, style: GoogleFonts.outfit(color: Colors.white54, fontSize: 12)),
                ]),
              ]),
            ),
          );
        }),
      ],
    );
  }

  // ── SECTIONS TAB ────────────────────────────────────────────────────────────

  Widget _buildSectionsTab() {
    final sections = _settings['sections'] as Map<String, dynamic>? ?? {};
    final visibility = Map<String, bool>.from(sections['visibility'] ?? {
      'about': true, 'contact': true, 'socials': true, 'portfolio': true, 'projects': true,
    });

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        _sectionTitle('Section Visibility', 'Show or hide sections on your public profile'),
        ...[
          {'key': 'about', 'label': 'About Me', 'icon': Icons.info_outline},
          {'key': 'contact', 'label': 'Contact', 'icon': Icons.contact_mail_outlined},
          {'key': 'socials', 'label': 'Social Links', 'icon': Icons.share_outlined},
          {'key': 'portfolio', 'label': 'Portfolio', 'icon': Icons.work_outline},
          {'key': 'projects', 'label': 'Projects', 'icon': Icons.folder_open_outlined},
        ].map((sec) {
          final key = sec['key'] as String;
          final isVisible = visibility[key] ?? true;
          return _glassCard(child: Row(children: [
            Icon(sec['icon'] as IconData, color: Colors.white54, size: 22),
            const SizedBox(width: 14),
            Expanded(child: Text(sec['label'] as String, style: GoogleFonts.outfit(color: Colors.white, fontWeight: FontWeight.w600))),
            Switch(
              value: isVisible,
              activeColor: const Color(0xFF6366F1),
              onChanged: (v) {
                final updated = Map<String, dynamic>.from(_settings['sections'] ?? {});
                final vis = Map<String, dynamic>.from(updated['visibility'] ?? {});
                vis[key] = v;
                updated['visibility'] = vis;
                setState(() { _settings = Map<String, dynamic>.from(_settings)..['sections'] = updated; });
              },
            ),
          ]));
        }),
      ],
    );
  }

  // ── ANIMATIONS TAB ──────────────────────────────────────────────────────────

  Widget _buildAnimationsTab() {
    final animStyle = _get('animations', 'style', 'fade') as String;
    const opts = ['fade', 'slide', 'scale', 'none'];
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        _sectionTitle('Animations', 'Choose how your profile elements animate in'),
        _glassCard(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          _label('Entrance Animation'),
          Wrap(children: opts.map((a) => _chip(
            a[0].toUpperCase() + a.substring(1), animStyle == a, () => _set('animations', 'style', a),
          )).toList()),
        ])),
      ],
    );
  }

  // ── MARKETPLACE TAB ─────────────────────────────────────────────────────────

  Widget _buildMarketplaceTab() => ListView(
    padding: const EdgeInsets.all(16),
    children: [
      Row(children: [
        Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text('Community Marketplace', style: GoogleFonts.outfit(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
          const SizedBox(height: 4),
          Text('Browse, install & share themes', style: GoogleFonts.outfit(color: Colors.white60, fontSize: 13)),
        ])),
        ElevatedButton.icon(
          style: ElevatedButton.styleFrom(
            backgroundColor: const Color(0xFF6366F1),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
          ),
          icon: const Icon(Icons.upload, size: 16),
          label: Text('Publish', style: GoogleFonts.outfit(fontWeight: FontWeight.bold, fontSize: 13)),
          onPressed: _publishThemeDialog,
        ),
      ]),
      const SizedBox(height: 16),
      if (_loadingMarketplace)
        const Center(child: CircularProgressIndicator(color: Color(0xFF6366F1)))
      else if (_marketplaceThemes.isEmpty)
        Center(child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 40),
          child: Text('No community themes yet. Be the first!', style: GoogleFonts.outfit(color: Colors.white38, fontSize: 14, fontStyle: FontStyle.italic)),
        ))
      else
        ..._marketplaceThemes.map((theme) {
          final id = theme['id'] as int? ?? 0;
          final name = theme['themeName'] as String? ?? 'Untitled';
          final author = (theme['user']?['name'] as String?) ?? 'Tapfolio Creator';
          final likes = theme['likesCount'] as int? ?? 0;
          final isOwner = _ownUserId != null && theme['userId'] == _ownUserId;

          return _glassCard(child: Row(children: [
            Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text(name, style: GoogleFonts.outfit(color: Colors.white, fontWeight: FontWeight.bold)),
              Text('By $author', style: GoogleFonts.outfit(color: Colors.white38, fontSize: 11)),
            ])),
            Row(mainAxisSize: MainAxisSize.min, children: [
              // Like
              GestureDetector(
                onTap: () async { await _api.likeMarketplaceTheme(id); await _fetchMarketplace(); },
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                  decoration: BoxDecoration(color: Colors.red.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(8), border: Border.all(color: Colors.red.withValues(alpha: 0.3))),
                  child: Row(mainAxisSize: MainAxisSize.min, children: [
                    const Icon(Icons.favorite, color: Colors.redAccent, size: 14),
                    const SizedBox(width: 4),
                    Text('$likes', style: GoogleFonts.outfit(color: Colors.white70, fontSize: 12)),
                  ]),
                ),
              ),
              const SizedBox(width: 8),
              // Install
              GestureDetector(
                onTap: () async {
                  final res = await _api.installMarketplaceTheme(id);
                  if (res['success'] == true && res['theme'] != null && mounted) {
                    final raw = res['theme']['settings'];
                    if (raw != null) {
                      final decoded = raw is String ? jsonDecode(raw) : raw;
                      setState(() { _settings = Map<String, dynamic>.from(decoded); _successMsg = '$name installed!'; });
                      Future.delayed(const Duration(seconds: 3), () { if (mounted) setState(() => _successMsg = null); });
                    }
                  }
                },
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(color: Colors.white.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(8), border: Border.all(color: Colors.white.withValues(alpha: 0.15))),
                  child: Text('Install', style: GoogleFonts.outfit(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold)),
                ),
              ),
              // Delete (owner only)
              if (isOwner) ...[
                const SizedBox(width: 6),
                GestureDetector(
                  onTap: () async {
                    final ok = await showDialog<bool>(
                      context: context,
                      builder: (_) => AlertDialog(
                        backgroundColor: const Color(0xFF1a1a2e),
                        title: Text('Delete "$name"?', style: GoogleFonts.outfit(color: Colors.white)),
                        content: Text('This cannot be undone.', style: GoogleFonts.outfit(color: Colors.white60)),
                        actions: [
                          TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('Cancel')),
                          ElevatedButton(style: ElevatedButton.styleFrom(backgroundColor: Colors.redAccent), onPressed: () => Navigator.pop(context, true), child: const Text('Delete')),
                        ],
                      ),
                    );
                    if (ok == true) { await _api.deleteMarketplaceTheme(id); await _fetchMarketplace(); }
                  },
                  child: Container(
                    padding: const EdgeInsets.all(6),
                    decoration: BoxDecoration(color: Colors.red.withValues(alpha: 0.08), borderRadius: BorderRadius.circular(8)),
                    child: const Icon(Icons.delete_outline, color: Colors.redAccent, size: 16),
                  ),
                ),
              ],
            ]),
          ]));
        }),
    ],
  );

  Future<void> _publishThemeDialog() async {
    final ctrl = TextEditingController();
    final name = await showDialog<String>(
      context: context,
      builder: (_) => AlertDialog(
        backgroundColor: const Color(0xFF1a1a2e),
        title: Text('Publish Theme', style: GoogleFonts.outfit(color: Colors.white, fontWeight: FontWeight.bold)),
        content: Column(mainAxisSize: MainAxisSize.min, children: [
          Text('Give your current theme a name:', style: GoogleFonts.outfit(color: Colors.white70)),
          const SizedBox(height: 12),
          TextField(
            controller: ctrl, autofocus: true,
            style: GoogleFonts.outfit(color: Colors.white),
            decoration: InputDecoration(
              hintText: 'e.g. Midnight Blue', hintStyle: GoogleFonts.outfit(color: Colors.white38),
              filled: true, fillColor: Colors.white.withValues(alpha: 0.06),
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
            ),
          ),
        ]),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancel')),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF6366F1)),
            onPressed: () => Navigator.pop(context, ctrl.text.trim()),
            child: Text('Publish', style: GoogleFonts.outfit(color: Colors.white, fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
    if (name == null || name.isEmpty || !mounted) return;
    final res = await _api.publishMarketplaceTheme(name, _settings);
    if (res['success'] == true && mounted) {
      setState(() => _successMsg = '"$name" published!');
      await _fetchMarketplace();
      Future.delayed(const Duration(seconds: 3), () { if (mounted) setState(() => _successMsg = null); });
    }
  }

  // ── MAIN BUILD ──────────────────────────────────────────────────────────────

  @override
  Widget build(BuildContext context) {
    if (_loading) {
      return const Scaffold(
        backgroundColor: Color(0xFF0A0A0F),
        body: Center(child: CircularProgressIndicator(color: Color(0xFF6366F1))),
      );
    }

    return Scaffold(
      backgroundColor: const Color(0xFF0A0A0F),
      appBar: AppBar(
        backgroundColor: const Color(0xFF0F0F1A),
        elevation: 0,
        title: Text('Customize Theme', style: GoogleFonts.outfit(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 18)),
        iconTheme: const IconThemeData(color: Colors.white),
        actions: [
          TextButton.icon(
            onPressed: _saving ? null : _reset,
            icon: const Icon(Icons.refresh_rounded, color: Colors.redAccent, size: 18),
            label: Text('Reset', style: GoogleFonts.outfit(color: Colors.redAccent, fontSize: 13)),
          ),
          Padding(
            padding: const EdgeInsets.only(right: 12, left: 4),
            child: ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF6366F1),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              ),
              onPressed: _saving ? null : _save,
              child: _saving
                ? const SizedBox(width: 16, height: 16, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                : Text('Save', style: GoogleFonts.outfit(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13)),
            ),
          ),
        ],
        bottom: TabBar(
          controller: _tabController,
          isScrollable: true,
          indicatorColor: const Color(0xFF6366F1),
          indicatorWeight: 3,
          labelColor: const Color(0xFF6366F1),
          unselectedLabelColor: Colors.white54,
          labelStyle: GoogleFonts.outfit(fontSize: 12, fontWeight: FontWeight.bold),
          unselectedLabelStyle: GoogleFonts.outfit(fontSize: 12),
          tabs: const [
            Tab(icon: Icon(Icons.auto_awesome, size: 15), text: 'Presets'),
            Tab(icon: Icon(Icons.wallpaper, size: 15), text: 'Background'),
            Tab(icon: Icon(Icons.account_circle, size: 15), text: 'Avatar'),
            Tab(icon: Icon(Icons.smart_button, size: 15), text: 'Buttons'),
            Tab(icon: Icon(Icons.view_quilt, size: 15), text: 'Layout'),
            Tab(icon: Icon(Icons.layers, size: 15), text: 'Sections'),
            Tab(icon: Icon(Icons.animation, size: 15), text: 'Animations'),
            Tab(icon: Icon(Icons.store, size: 15), text: 'Marketplace'),
          ],
        ),
      ),
      body: Column(children: [
        if (_successMsg != null)
          Material(
            color: const Color(0xFF10B981).withValues(alpha: 0.15),
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
              child: Row(children: [
                const Icon(Icons.check_circle, color: Color(0xFF10B981), size: 18),
                const SizedBox(width: 10),
                Text(_successMsg!, style: GoogleFonts.outfit(color: const Color(0xFF10B981), fontWeight: FontWeight.w600)),
              ]),
            ),
          ),
        if (_errorMsg != null)
          Material(
            color: Colors.redAccent.withValues(alpha: 0.12),
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
              child: Row(children: [
                const Icon(Icons.error_outline, color: Colors.redAccent, size: 18),
                const SizedBox(width: 10),
                Text(_errorMsg!, style: GoogleFonts.outfit(color: Colors.redAccent, fontWeight: FontWeight.w600)),
              ]),
            ),
          ),
        Expanded(child: TabBarView(
          controller: _tabController,
          children: [
            _buildPresetsTab(),
            _buildBackgroundTab(),
            _buildAvatarTab(),
            _buildButtonsTab(),
            _buildLayoutTab(),
            _buildSectionsTab(),
            _buildAnimationsTab(),
            _buildMarketplaceTab(),
          ],
        )),
      ]),
    );
  }
}

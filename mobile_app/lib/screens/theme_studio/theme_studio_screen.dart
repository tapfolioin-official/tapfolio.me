import 'package:flutter/material.dart' hide CardTheme, ButtonTheme;
import 'package:google_fonts/google_fonts.dart';
import 'controller/theme_studio_controller.dart';
import 'controller/search_controller.dart';
import 'widgets/preview/interactive_preview.dart';
import 'widgets/navigation/category_selector.dart';
import 'widgets/common/autosave_indicator.dart';
import 'widgets/editors/presets_gallery.dart';
import 'widgets/editors/background_editor.dart';
import 'widgets/editors/color_editor.dart';
import 'widgets/editors/typography_editor.dart';
import 'widgets/editors/button_editor.dart';
import 'widgets/editors/card_editor.dart';
import 'widgets/editors/section_editor.dart';
import 'services/theme_import_export.dart';

class ThemeStudioScreen extends StatefulWidget {
  final bool isPremium;
  const ThemeStudioScreen({super.key, required this.isPremium});

  @override
  State<ThemeStudioScreen> createState() => _ThemeStudioScreenState();
}

class _ThemeStudioScreenState extends State<ThemeStudioScreen> {
  final ThemeStudioController _controller = ThemeStudioController();
  final TextEditingController _searchCtrl = TextEditingController();
  String _searchQuery = '';

  @override
  void initState() {
    super.initState();
    _controller.addListener(_onControllerChanged);
    _controller.loadTheme();
  }

  @override
  void dispose() {
    _controller.removeListener(_onControllerChanged);
    _controller.dispose();
    _searchCtrl.dispose();
    super.dispose();
  }

  void _onControllerChanged() {
    if (mounted) setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    if (_controller.loading) {
      return const Scaffold(
        backgroundColor: Color(0xFF0A0A0F),
        body: Center(child: CircularProgressIndicator(color: Color(0xFF6366F1))),
      );
    }

    return Scaffold(
      backgroundColor: const Color(0xFF0A0A0F),
      appBar: AppBar(
        backgroundColor: const Color(0xFF0F0F1A),
        title: Text(
          'Theme Studio',
          style: GoogleFonts.outfit(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 18),
        ),
        iconTheme: const IconThemeData(color: Colors.white),
        actions: [
          AutosaveIndicator(state: _controller.autosaveState),
          const SizedBox(width: 8),
          IconButton(
            icon: const Icon(Icons.undo, color: Colors.white),
            onPressed: _controller.canUndo ? _controller.undo : null,
          ),
          IconButton(
            icon: const Icon(Icons.redo, color: Colors.white),
            onPressed: _controller.canRedo ? _controller.redo : null,
          ),
          IconButton(
            icon: const Icon(Icons.refresh_rounded, color: Colors.redAccent),
            onPressed: () => _confirmReset(context),
          ),
        ],
      ),
      body: SafeArea(
        child: Column(
          children: [
            // Top Section: Interactive sticky preview
            Expanded(
              flex: 4,
              child: Padding(
                padding: const EdgeInsets.all(12),
                child: InteractivePreview(settings: _controller.settings),
              ),
            ),

            // Middle Section: Primary Categories Navigation Tabs
            CategorySelector(
              activeCategory: _controller.category,
              onSelected: (cat) {
                _controller.setCategory(cat);
                // Auto-set the first sub-editor of the category
                if (cat == 'Appearance') {
                  _controller.setEditor('Presets');
                } else if (cat == 'Layout') {
                  _controller.setEditor('Cards');
                } else if (cat == 'Content') {
                  _controller.setEditor('Sections');
                } else if (cat == 'Advanced') {
                  _controller.setEditor('Import');
                }
              },
            ),

            // Bottom Section: Customizer Options / Editors drawer area
            Expanded(
              flex: 5,
              child: Container(
                color: const Color(0xFF0F0F1A),
                child: Column(
                  children: [
                    // Search and pin headers
                    _buildSubCategoryNavBar(),

                    Expanded(
                      child: SingleChildScrollView(
                        padding: const EdgeInsets.all(16),
                        child: _searchQuery.isNotEmpty
                            ? _buildSearchResults()
                            : _buildActiveEditor(),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSubCategoryNavBar() {
    List<String> subEditors = [];
    if (_controller.category == 'Appearance') {
      subEditors = ['Presets', 'Background', 'Colors', 'Typography', 'Avatar', 'Buttons'];
    } else if (_controller.category == 'Layout') {
      subEditors = ['Cards', 'Sections'];
    } else if (_controller.category == 'Content') {
      subEditors = ['Sections'];
    } else if (_controller.category == 'Advanced') {
      subEditors = ['Import', 'Export'];
    }

    return Container(
      height: 44,
      padding: const EdgeInsets.symmetric(horizontal: 12),
      decoration: const BoxDecoration(
        color: Color(0xFF0C0C14),
        border: Border(bottom: BorderSide(color: Colors.white10)),
      ),
      child: Row(
        children: [
          Expanded(
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              itemCount: subEditors.length,
              itemBuilder: (context, idx) {
                final sub = subEditors[idx];
                final active = _controller.editor == sub;
                return Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: ChoiceChip(
                    label: Text(sub),
                    selected: active,
                    onSelected: (val) {
                      if (val) {
                        _controller.setEditor(sub);
                        setState(() {
                          _searchQuery = '';
                          _searchCtrl.clear();
                        });
                      }
                    },
                    backgroundColor: Colors.transparent,
                    selectedColor: const Color(0xFF6366F1).withValues(alpha: 0.2),
                    side: BorderSide(
                      color: active ? const Color(0xFF6366F1) : Colors.white12,
                    ),
                    labelStyle: GoogleFonts.outfit(
                      color: active ? const Color(0xFF6366F1) : Colors.white60,
                      fontWeight: FontWeight.bold,
                      fontSize: 12,
                    ),
                  ),
                );
              },
            ),
          ),
          const SizedBox(width: 8),
          // Search Icon
          IconButton(
            icon: const Icon(Icons.search, color: Colors.white70, size: 20),
            onPressed: () => _showSearchDialog(context),
          ),
        ],
      ),
    );
  }

  Widget _buildActiveEditor() {
    switch (_controller.editor) {
      case 'Presets':
        return PresetsGallery(controller: _controller, isPremiumUser: widget.isPremium);
      case 'Background':
        return BackgroundEditor(controller: _controller);
      case 'Colors':
        return ColorEditor(controller: _controller);
      case 'Typography':
        return TypographyEditor(controller: _controller);
      case 'Buttons':
        return ButtonEditor(controller: _controller);
      case 'Cards':
        return CardEditor(controller: _controller);
      case 'Sections':
        return SectionEditor(controller: _controller);
      case 'Import':
        return _buildImportTab();
      case 'Export':
        return _buildExportTab();
      default:
        return const SizedBox();
    }
  }

  Widget _buildSearchResults() {
    final results = ThemeSearchController.search(_searchQuery);
    if (results.isEmpty) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Text(
            'No results match your search.',
            style: GoogleFonts.outfit(color: Colors.white38),
          ),
        ),
      );
    }
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: results.map((res) {
        return ListTile(
          title: Text(res.title, style: GoogleFonts.outfit(color: Colors.white, fontWeight: FontWeight.bold)),
          subtitle: Text('${res.category} > ${res.subEditor}', style: GoogleFonts.outfit(color: Colors.white38, fontSize: 11)),
          trailing: const Icon(Icons.arrow_forward_ios_rounded, color: Colors.white30, size: 14),
          onTap: () {
            setState(() {
              _controller.setCategory(res.category);
              _controller.setEditor(res.subEditor);
              _searchQuery = '';
              _searchCtrl.clear();
            });
          },
        );
      }).toList(),
    );
  }

  Widget _buildImportTab() {
    final textController = TextEditingController();
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Import theme.json',
          style: GoogleFonts.outfit(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14),
        ),
        const SizedBox(height: 8),
        TextField(
          controller: textController,
          maxLines: 6,
          style: GoogleFonts.outfit(color: Colors.white, fontSize: 12),
          decoration: InputDecoration(
            hintText: 'Paste theme.json code here...',
            hintStyle: GoogleFonts.outfit(color: Colors.white30),
            filled: true,
            fillColor: Colors.white.withValues(alpha: 0.05),
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
          ),
        ),
        const SizedBox(height: 12),
        ElevatedButton(
          style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF6366F1)),
          onPressed: () {
            final imported = ThemeImportExport.importTheme(textController.text);
            if (imported != null) {
              _controller.updateSettings(imported, 'Imported Custom JSON Theme');
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Theme imported successfully!'), backgroundColor: Colors.green),
              );
            } else {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Invalid JSON formatting.'), backgroundColor: Colors.redAccent),
              );
            }
          },
          child: Text('Import Settings', style: GoogleFonts.outfit(color: Colors.white)),
        ),
      ],
    );
  }

  Widget _buildExportTab() {
    final exported = ThemeImportExport.exportTheme(_controller.settings);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Export Config String',
          style: GoogleFonts.outfit(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14),
        ),
        const SizedBox(height: 8),
        SelectableText(
          exported,
          style: GoogleFonts.outfit(color: Colors.white70, fontSize: 12),
        ),
      ],
    );
  }

  void _showSearchDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          backgroundColor: const Color(0xFF1a1a2e),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          title: TextField(
            controller: _searchCtrl,
            style: GoogleFonts.outfit(color: Colors.white),
            decoration: InputDecoration(
              hintText: 'Search settings...',
              hintStyle: GoogleFonts.outfit(color: Colors.white30),
              prefixIcon: const Icon(Icons.search, color: Colors.white60),
              border: InputBorder.none,
            ),
            onChanged: (val) {
              setState(() {
                _searchQuery = val;
              });
            },
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.pop(context);
              },
              child: const Text('Close'),
            ),
          ],
        );
      },
    );
  }

  void _confirmReset(BuildContext context) {
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        backgroundColor: const Color(0xFF1a1a2e),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: Text('Reset Theme', style: GoogleFonts.outfit(color: Colors.white, fontWeight: FontWeight.bold)),
        content: Text('Are you sure you want to discard all theme settings?', style: GoogleFonts.outfit(color: Colors.white70)),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancel')),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: Colors.redAccent),
            onPressed: () {
              _controller.resetToDefault();
              Navigator.pop(context);
            },
            child: const Text('Reset'),
          ),
        ],
      ),
    );
  }
}

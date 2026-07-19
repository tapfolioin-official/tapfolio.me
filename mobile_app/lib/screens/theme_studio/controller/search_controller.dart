class SearchSettingItem {
  final String title;
  final String category; // Appearance, Layout, Content, Advanced
  final String subEditor; // Presets, Background, Colors, Typography, Avatar, Buttons, Cards, Spacing, Alignment, Radius, Borders, Sections, Animations, Effects
  final List<String> keywords;

  SearchSettingItem({
    required this.title,
    required this.category,
    required this.subEditor,
    required this.keywords,
  });
}

class ThemeSearchController {
  static final List<SearchSettingItem> searchableSettings = [
    SearchSettingItem(
      title: 'Theme Presets',
      category: 'Appearance',
      subEditor: 'Presets',
      keywords: ['presets', 'midnight', 'aurora', 'templates'],
    ),
    SearchSettingItem(
      title: 'Background Style',
      category: 'Appearance',
      subEditor: 'Background',
      keywords: ['background', 'solid', 'color picker', 'gradient', 'image', 'video', 'aurora', 'particles'],
    ),
    SearchSettingItem(
      title: 'Semantic Colors',
      category: 'Appearance',
      subEditor: 'Colors',
      keywords: ['colors', 'primary', 'secondary', 'accent', 'text', 'subtext', 'hex', 'rgb'],
    ),
    SearchSettingItem(
      title: 'Typography & Fonts',
      category: 'Appearance',
      subEditor: 'Typography',
      keywords: ['fonts', 'typography', 'text shadow', 'uppercase', 'heading size', 'body size'],
    ),
    SearchSettingItem(
      title: 'Avatar Shape',
      category: 'Appearance',
      subEditor: 'Avatar',
      keywords: ['avatar', 'shape', 'border', 'glow', 'gradient ring', 'pulse ring'],
    ),
    SearchSettingItem(
      title: 'Button Studio',
      category: 'Appearance',
      subEditor: 'Buttons',
      keywords: ['buttons', 'height', 'style', 'outline', 'ghost', 'gradient buttons'],
    ),
    SearchSettingItem(
      title: 'Card Designing',
      category: 'Layout',
      subEditor: 'Cards',
      keywords: ['cards', 'border radius', 'spacing', 'blur', 'opacity', 'elevation'],
    ),
    SearchSettingItem(
      title: 'Reorder Profile Sections',
      category: 'Layout',
      subEditor: 'Sections',
      keywords: ['sections', 'drag', 'reorder', 'about', 'projects', 'socials'],
    ),
    SearchSettingItem(
      title: 'Motion Animations',
      category: 'Advanced',
      subEditor: 'Animations',
      keywords: ['animations', 'fade', 'slide', 'scale', 'page transition'],
    ),
    SearchSettingItem(
      title: 'Effects Studio',
      category: 'Advanced',
      subEditor: 'Effects',
      keywords: ['effects', 'glass', 'blur', 'glow', 'noise', 'border shine'],
    ),
  ];

  static List<SearchSettingItem> search(String query) {
    if (query.trim().isEmpty) return [];
    final q = query.toLowerCase();
    return searchableSettings.where((item) {
      return item.title.toLowerCase().contains(q) ||
          item.category.toLowerCase().contains(q) ||
          item.subEditor.toLowerCase().contains(q) ||
          item.keywords.any((kw) => kw.toLowerCase().contains(q));
    }).toList();
  }
}

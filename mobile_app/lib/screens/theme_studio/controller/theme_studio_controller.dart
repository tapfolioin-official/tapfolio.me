import 'package:flutter/material.dart' hide CardTheme, ButtonTheme;
import '../models/theme_models.dart';
import '../../../services/api_service.dart';
import '../services/theme_serializer.dart';
import 'undo_manager.dart';
import 'autosave_manager.dart';

class ThemeStudioController extends ChangeNotifier {
  final ApiService _api = ApiService();
  late UndoManager _undoManager;
  late AutosaveManager _autosaveManager;

  ThemeSettings _settings = ThemeSettings.defaultValue();
  String _category = 'Appearance';
  String _editor = 'Presets';
  final Set<String> _favorites = {};
  bool _loading = false;
  String? _error;

  ThemeStudioController() {
    _undoManager = UndoManager();
    _autosaveManager = AutosaveManager(onStateChanged: notifyListeners);
  }

  // Getters
  ThemeSettings get settings => _settings;
  String get category => _category;
  String get editor => _editor;
  Set<String> get favorites => _favorites;
  bool get loading => _loading;
  String? get error => _error;
  AutosaveState get autosaveState => _autosaveManager.state;
  bool get canUndo => _undoManager.canUndo;
  bool get canRedo => _undoManager.canRedo;
  List<UndoHistoryEntry> get historyLog => _undoManager.historyLog;

  // Actions
  void setCategory(String category) {
    _category = category;
    notifyListeners();
  }

  void setEditor(String editor) {
    _editor = editor;
    notifyListeners();
  }

  void toggleFavorite(String item) {
    if (_favorites.contains(item)) {
      _favorites.remove(item);
    } else {
      _favorites.add(item);
    }
    notifyListeners();
  }

  bool isFavorite(String item) => _favorites.contains(item);

  // Initialize
  Future<void> loadTheme() async {
    _loading = true;
    _error = null;
    notifyListeners();

    try {
      final res = await _api.getTheme();
      if (res['success'] == true && res['theme'] != null) {
        _settings = ThemeSerializer.deserialize(res['theme']['settings']);
        _undoManager.clear();
      } else {
        _error = res['error'] ?? 'Failed to load theme settings.';
      }
    } catch (e) {
      _error = e.toString();
    } finally {
      _loading = false;
      notifyListeners();
    }
  }

  // Apply Changes
  void updateSettings(ThemeSettings newSettings, String actionDescription) {
    _undoManager.pushState(_settings, actionDescription);
    _settings = newSettings;
    _autosaveManager.triggerSave(_settings);
    notifyListeners();
  }

  // Sub-theme specific updates
  void updateBackground(BackgroundTheme bg) {
    updateSettings(_settings.copyWith(background: bg), 'Changed Background');
  }

  void updateColors(ColorTheme colors) {
    updateSettings(_settings.copyWith(colors: colors), 'Changed Theme Colors');
  }

  void updateTypography(TypographyTheme typo) {
    updateSettings(_settings.copyWith(typography: typo), 'Changed Typography');
  }

  void updateCards(CardTheme cards) {
    updateSettings(_settings.copyWith(cards: cards), 'Changed Card Styling');
  }

  void updateButtons(ButtonTheme buttons) {
    updateSettings(_settings.copyWith(buttons: buttons), 'Changed Button Style');
  }

  void updateAvatar(AvatarTheme avatar) {
    updateSettings(_settings.copyWith(avatar: avatar), 'Changed Avatar Style');
  }

  void updateLayout(LayoutTheme layout) {
    updateSettings(_settings.copyWith(layout: layout), 'Changed Layout style');
  }

  void updateAnimations(AnimationTheme anim) {
    updateSettings(_settings.copyWith(animations: anim), 'Changed Animations');
  }

  void updateSections(SectionTheme sections) {
    updateSettings(_settings.copyWith(sections: sections), 'Reordered Sections');
  }

  void updateEffects(EffectTheme effects) {
    updateSettings(_settings.copyWith(effects: effects), 'Updated Theme Effects');
  }

  // Undo / Redo
  void undo() {
    final prev = _undoManager.undo(_settings);
    if (prev != null) {
      _settings = prev;
      _autosaveManager.triggerSave(_settings);
      notifyListeners();
    }
  }

  void redo() {
    final next = _undoManager.redo(_settings);
    if (next != null) {
      _settings = next;
      _autosaveManager.triggerSave(_settings);
      notifyListeners();
    }
  }

  // Reset
  Future<void> resetToDefault() async {
    _loading = true;
    notifyListeners();

    try {
      final res = await _api.resetTheme();
      if (res['success'] == true && res['theme'] != null) {
        _undoManager.pushState(_settings, 'Reset Theme to Default');
        _settings = ThemeSerializer.deserialize(res['theme']['settings']);
      }
    } catch (_) {} finally {
      _loading = false;
      notifyListeners();
    }
  }

  @override
  void dispose() {
    _autosaveManager.dispose();
    super.dispose();
  }
}

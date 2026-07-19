import '../models/theme_models.dart';

class UndoHistoryEntry {
  final ThemeSettings settings;
  final String description;

  UndoHistoryEntry(this.settings, this.description);
}

class UndoManager {
  final List<UndoHistoryEntry> _undoStack = [];
  final List<UndoHistoryEntry> _redoStack = [];
  final int maxHistory;

  UndoManager({this.maxHistory = 100});

  bool get canUndo => _undoStack.isNotEmpty;
  bool get canRedo => _redoStack.isNotEmpty;

  List<UndoHistoryEntry> get historyLog => List.unmodifiable(_undoStack);

  void pushState(ThemeSettings settings, String description) {
    if (_undoStack.isNotEmpty && _undoStack.last.settings == settings) {
      return; // Skip duplicates
    }
    _undoStack.add(UndoHistoryEntry(settings, description));
    if (_undoStack.length > maxHistory) {
      _undoStack.removeAt(0);
    }
    _redoStack.clear();
  }

  ThemeSettings? undo(ThemeSettings currentSettings) {
    if (!canUndo) return null;
    final entry = _undoStack.removeLast();
    _redoStack.add(UndoHistoryEntry(currentSettings, entry.description));
    return entry.settings;
  }

  ThemeSettings? redo(ThemeSettings currentSettings) {
    if (!canRedo) return null;
    final entry = _redoStack.removeLast();
    _undoStack.add(UndoHistoryEntry(currentSettings, entry.description));
    return entry.settings;
  }

  void clear() {
    _undoStack.clear();
    _redoStack.clear();
  }
}

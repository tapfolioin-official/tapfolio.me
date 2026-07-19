import 'dart:async';
import 'package:flutter/foundation.dart';
import '../../../services/api_service.dart';
import '../models/theme_models.dart';

enum AutosaveState {
  saved,
  saving,
  unsavedChanges,
}

class AutosaveManager {
  final ApiService _api = ApiService();
  final VoidCallback onStateChanged;

  AutosaveState _state = AutosaveState.saved;
  Timer? _debounceTimer;

  AutosaveManager({required this.onStateChanged});

  AutosaveState get state => _state;

  void triggerSave(ThemeSettings settings) {
    _state = AutosaveState.unsavedChanges;
    onStateChanged();

    _debounceTimer?.cancel();
    _debounceTimer = Timer(const Duration(milliseconds: 500), () async {
      _state = AutosaveState.saving;
      onStateChanged();

      try {
        final res = await _api.saveTheme(settings.toJson());
        if (res['success'] == true) {
          _state = AutosaveState.saved;
        } else {
          _state = AutosaveState.unsavedChanges;
        }
      } catch (_) {
        _state = AutosaveState.unsavedChanges;
      }
      onStateChanged();
    });
  }

  void dispose() {
    _debounceTimer?.cancel();
  }
}

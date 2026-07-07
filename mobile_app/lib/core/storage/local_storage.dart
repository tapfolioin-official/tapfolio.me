import 'package:shared_preferences/shared_preferences.dart';

class LocalStorage {
  static final LocalStorage _instance = LocalStorage._internal();
  factory LocalStorage() => _instance;
  LocalStorage._internal();

  late final SharedPreferences _prefs;
  bool _initialized = false;

  Future<void> init() async {
    if (_initialized) return;
    _prefs = await SharedPreferences.getInstance();
    _initialized = true;
  }

  Future<bool> setString(String key, String value) async {
    return _prefs.setString(key, value);
  }

  String? getString(String key) {
    return _prefs.getString(key);
  }

  Future<bool> remove(String key) async {
    return _prefs.remove(key);
  }

  Future<bool> clear() async {
    return _prefs.clear();
  }

  String? get jwtToken => getString('pertap_jwt');

  Future<bool> setJwtToken(String value) async {
    return setString('pertap_jwt', value);
  }

  Future<bool> clearJwtToken() async {
    return remove('pertap_jwt');
  }

  bool get isAuthenticated => jwtToken != null && jwtToken!.isNotEmpty;
}

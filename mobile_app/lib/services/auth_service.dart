import 'dart:convert';
import '../core/api/api_client.dart';
import '../core/api/api_endpoints.dart';
import '../core/storage/local_storage.dart';
import '../core/utils/logger.dart';
import '../models/user.dart';

class AuthService {
  static final AuthService _instance = AuthService._internal();
  factory AuthService() => _instance;
  AuthService._internal();

  final ApiClient _apiClient = ApiClient();
  final LocalStorage _storage = LocalStorage();

  User? _currentUser;
  User? get currentUser => _currentUser;

  bool get isAuthenticated => _storage.isAuthenticated;

  Future<void> init() async {
    await _storage.init();
    AppLogger.info('AuthService initialized. Authenticated: $isAuthenticated');
  }

  Future<User?> checkAuth() async {
    if (!isAuthenticated) return null;

    try {
      final response = await _apiClient.sendRequest('GET', ApiEndpoints.me);
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data != null && data['success'] == true) {
          _currentUser = User.fromJson(data['user'] as Map<String, dynamic>?);
          return _currentUser;
        }
      }
    } catch (e) {
      AppLogger.error('checkAuth failed', e);
    }
    
    // Auto logout on verification failure
    await logout();
    return null;
  }

  Future<Map<String, dynamic>> login(String email, String password) async {
    try {
      final response = await _apiClient.sendRequest(
        'POST',
        ApiEndpoints.login,
        authenticated: false,
        body: jsonEncode({'email': email, 'password': password}),
      );

      final data = jsonDecode(response.body);
      if (response.statusCode == 200 && data != null && data['success'] == true) {
        _currentUser = User.fromJson(data['user'] as Map<String, dynamic>?);
        return {'success': true, 'user': _currentUser};
      } else {
        return {'success': false, 'error': data?['error'] ?? 'Login failed.'};
      }
    } catch (e) {
      AppLogger.error('login failed', e);
      return {'success': false, 'error': e.toString()};
    }
  }

  Future<Map<String, dynamic>> register(
    String name,
    String username,
    String email,
    String password,
  ) async {
    try {
      final response = await _apiClient.sendRequest(
        'POST',
        ApiEndpoints.register,
        authenticated: false,
        body: jsonEncode({
          'name': name,
          'username': username,
          'email': email,
          'password': password,
        }),
      );

      final data = jsonDecode(response.body);
      if (response.statusCode == 200 && data != null && data['success'] == true) {
        _currentUser = User.fromJson(data['user'] as Map<String, dynamic>?);
        return {'success': true, 'user': _currentUser};
      } else {
        return {'success': false, 'error': data?['error'] ?? 'Registration failed.'};
      }
    } catch (e) {
      AppLogger.error('register failed', e);
      return {'success': false, 'error': e.toString()};
    }
  }

  Future<void> logout() async {
    try {
      if (isAuthenticated) {
        await _apiClient.sendRequest('POST', ApiEndpoints.logout, retryCount: 0);
      }
    } catch (_) {}
    _currentUser = null;
    await _storage.clearJwtToken();
    AppLogger.info('Session cleared. Logged out.');
  }
}

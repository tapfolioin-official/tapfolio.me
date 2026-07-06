import 'dart:convert';
import 'dart:math';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'package:package_info_plus/package_info_plus.dart';
import '../models/profile.dart';
import '../models/notification.dart';
import 'client_stub.dart'
    if (dart.library.html) 'client_web.dart'
    as platform_client;

class ApiService {
  static final ApiService _instance = ApiService._internal();
  factory ApiService() => _instance;
  ApiService._internal();

  final http.Client _client = platform_client.getClient();
  String? _jwtToken;
  VoidCallback? onSessionExpired;

  /// Safely parses JSON response. Returns null if invalid or empty.
  Map<String, dynamic>? _safeJsonDecode(http.Response response) {
    final body = response.body.trim();
    if (body.isEmpty) return null;
    final ct = response.headers['content-type'] ?? '';
    if (!ct.contains('application/json') && !ct.contains('text/json')) {
      debugPrint('[API] Non-JSON content-type: $ct — body prefix: ${body.substring(0, min(200, body.length))}');
      return null;
    }
    try {
      final decoded = jsonDecode(body);
      if (decoded is Map<String, dynamic>) {
        return decoded;
      }
      return null;
    } catch (e) {
      debugPrint('[API] JSON parse error: $e — body prefix: ${body.substring(0, min(200, body.length))}');
      return null;
    }
  }

  /// Converts technical exceptions into user-friendly error messages.
  String _friendlyError(dynamic e) {
    final msg = e.toString();
    if (msg.contains('SocketException') || msg.contains('Failed host lookup')) {
      return 'Unable to connect. Please check your internet connection.';
    }
    if (msg.contains('TimeoutException') || msg.contains('timeout')) {
      return 'Connection timed out. Please try again.';
    }
    if (msg.contains('HandshakeException') || msg.contains('CERTIFICATE')) {
      return 'Secure connection failed. Please try again.';
    }
    return 'Server temporarily unavailable. Please try again.';
  }

  // Set to true for production builds; false routes web through the local CORS proxy.
  // Tapfolio Production API
  static const String productionUrl = 'https://www.tapfolio.me';

  String get baseUrl {
    if (!kDebugMode) return productionUrl;
    if (kIsWeb) return 'http://localhost:3000';
    if (defaultTargetPlatform == TargetPlatform.android) {
      return 'http://10.0.2.2:3000';
    }
    return 'http://localhost:3000';
  }

  Future<void> init() async {
    final prefs = await SharedPreferences.getInstance();
    _jwtToken = prefs.getString('pertap_jwt');

    // For Web, if we successfully logged in before, set a dummy session token
    if (kIsWeb && _jwtToken == null) {
      if (prefs.getBool('pertap_logged_in') == true) {
        _jwtToken = 'web_session';
      }
    }
  }

  bool get isAuthenticated => _jwtToken != null;

  Map<String, String> _getHeaders() {
    final headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    if (_jwtToken != null && _jwtToken != 'web_session') {
      headers['Cookie'] = 'pertap_jwt=$_jwtToken';
    }
    return headers;
  }

  // Extract and persist the JWT from any response.
  // On mobile: reads Set-Cookie header.
  // On web via proxy: reads the X-Pertap-Token echo header.
  Future<void> _updateToken(http.Response response) async {
    String? token;

    // 1. Try to read token from JSON body first (safest for mobile)
    try {
      final body = response.body.trim();
      if (body.isNotEmpty) {
        final decoded = jsonDecode(body);
        if (decoded is Map<String, dynamic> && decoded['token'] != null) {
          token = decoded['token'];
        }
      }
    } catch (_) {}

    // 2. Try the custom proxy echo header (works on web)
    if (token == null || token.isEmpty) {
      token = response.headers['x-pertap-token'];
    }

    // 3. Fall back to parsing Set-Cookie (works on mobile)
    if (token == null || token.isEmpty) {
      final rawCookie =
          response.headers['set-cookie'] ?? response.headers['Set-Cookie'];
      if (rawCookie != null) {
        final match = RegExp(r'pertap_jwt=([^;]+)').firstMatch(rawCookie);
        token = match?.group(1);
      }
    }

    if (token != null && token.isNotEmpty) {
      _jwtToken = token;
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('pertap_jwt', token);
      if (kIsWeb) {
        await prefs.setBool('pertap_logged_in', true);
      }
      debugPrint('[ApiService] JWT stored (len=${token.length})');
    } else {
      debugPrint('[ApiService] Warning: no JWT found in login response');
    }
  }

  // Cross-platform helper to send requests with credentials (cookies) enabled
  Future<http.Response> _sendRequest(
    String method,
    Uri url, {
    bool authenticated = true,
    Map<String, String>? headers,
    Object? body,
  }) async {
    final startTime = DateTime.now();
    final request = http.Request(method, url);

    final finalHeaders = authenticated ? _getHeaders() : <String, String>{};
    if (headers != null) {
      finalHeaders.addAll(headers);
    }
    request.headers.addAll(finalHeaders);

    if (body != null) {
      if (body is String) {
        request.body = body;
      } else if (body is List<int>) {
        request.bodyBytes = body;
      } else if (body is Map<String, String>) {
        request.bodyFields = body;
      }
    }

    if (kDebugMode) {
      debugPrint('[API-REQ] ======= START REQUEST =======');
      debugPrint('[API-REQ] Method: $method');
      debugPrint('[API-REQ] URL: $url');
      debugPrint('[API-REQ] Auth State: ${_jwtToken != null ? "Authenticated (Token len=${_jwtToken!.length})" : "Unauthenticated"}');
      debugPrint('[API-REQ] Request Headers: $finalHeaders');
      if (body != null) {
        debugPrint('[API-REQ] Request Body: $body');
      }
    }

    try {
      final streamedResponse = await _client.send(request).timeout(const Duration(seconds: 15));
      final response = await http.Response.fromStream(streamedResponse);
      final duration = DateTime.now().difference(startTime);

      if (kDebugMode) {
        debugPrint('[API-RESP] URL: $url');
        debugPrint('[API-RESP] Status Code: ${response.statusCode}');
        debugPrint('[API-RESP] Response Headers: ${response.headers}');
        debugPrint('[API-RESP] Response Body: ${response.body}');
        debugPrint('[API-RESP] Response Time: ${duration.inMilliseconds}ms');
        debugPrint('[API-REQ] ======= END REQUEST =======');
      }

      return response;
    } catch (e) {
      final duration = DateTime.now().difference(startTime);
      if (kDebugMode) {
        debugPrint('[API-RESP] ERROR: $e');
        debugPrint('[API-RESP] Response Time: ${duration.inMilliseconds}ms');
        debugPrint('[API-REQ] ======= END REQUEST =======');
      }
      rethrow;
    }
  }

  Future<Map<String, dynamic>> login(String email, String password) async {
    try {
      final url = Uri.parse('$baseUrl/api/auth/login');
      final response = await _sendRequest(
        'POST',
        url,
        authenticated: false,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'email': email, 'password': password}),
      );

      final data = _safeJsonDecode(response);
      if (data == null) {
        return {'success': false, 'error': 'Invalid server response.'};
      }
      if (response.statusCode == 200 && data['success'] == true) {
        // On all platforms: try to extract the JWT from the response.
        // The proxy echoes it in X-Pertap-Token; mobile gets it via Set-Cookie.
        await _updateToken(response);
        return {'success': true, 'user': data['user']};
      } else {
        return {'success': false, 'error': data['error'] ?? 'Login failed'};
      }
    } catch (e) {
      return {'success': false, 'error': _friendlyError(e)};
    }
  }

  Future<Map<String, dynamic>> register(
    String name,
    String username,
    String email,
    String password,
  ) async {
    try {
      final url = Uri.parse('$baseUrl/api/auth/register');
      final response = await _sendRequest(
        'POST',
        url,
        authenticated: false,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'name': name,
          'username': username,
          'email': email,
          'password': password,
        }),
      );

      final data = _safeJsonDecode(response);
      if (data == null) {
        return {'success': false, 'error': 'Invalid server response.'};
      }
      if (response.statusCode == 201 && data['success'] == true) {
        // Capture the JWT set by the server so subsequent authenticated calls work
        await _updateToken(response);
        return {'success': true, 'message': data['message'], 'user': data['user']};
      } else {
        return {
          'success': false,
          'error': data['error'] ?? 'Registration failed',
        };
      }
    } catch (e) {
      return {'success': false, 'error': _friendlyError(e)};
    }
  }

  Future<Map<String, dynamic>> googleLogin(
    String idToken, {
    String? email,
    String? name,
  }) async {
    try {
      final url = Uri.parse('$baseUrl/api/auth/google');
      final response = await _sendRequest(
        'POST',
        url,
        authenticated: false,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'idToken': idToken,
          'email': email,
          'name': name,
        }),
      );

      final data = _safeJsonDecode(response);
      if (data == null) {
        return {'success': false, 'error': 'Invalid server response.'};
      }
      if (response.statusCode == 200 && data['success'] == true) {
        await _updateToken(response);
        return {'success': true, 'user': data['user']};
      } else {
        return {
          'success': false,
          'error': data['error'] ?? 'Google login failed',
        };
      }
    } catch (e) {
      return {'success': false, 'error': _friendlyError(e)};
    }
  }

  Future<Map<String, dynamic>> checkUsernameAvailability(
    String username,
  ) async {
    try {
      final url = Uri.parse(
        '$baseUrl/api/auth/username-check?username=${Uri.encodeComponent(username)}',
      );
      final response = await _sendRequest('GET', url, authenticated: false);

      final data = _safeJsonDecode(response);
      if (data == null) {
        return {'success': false, 'error': 'Invalid server response.'};
      }
      if (response.statusCode == 200) {
        return {
          'success': true,
          'available': data['available'] ?? false,
          'suggestions': List<String>.from(data['suggestions'] ?? []),
        };
      } else {
        return {
          'success': false,
          'error': data['error'] ?? 'Username check failed',
        };
      }
    } catch (e) {
      return {'success': false, 'error': _friendlyError(e)};
    }
  }

  Future<Map<String, dynamic>> submitOnboarding(
    Map<String, dynamic> payload,
  ) async {
    try {
      final url = Uri.parse('$baseUrl/api/profile/onboarding');
      final response = await _sendRequest(
        'PUT',
        url,
        body: jsonEncode(payload),
      );

      final data = _safeJsonDecode(response);
      if (data == null) {
        return {'success': false, 'error': 'Invalid server response.'};
      }
      if (response.statusCode == 200 && data['success'] == true) {
        return {'success': true};
      } else {
        return {
          'success': false,
          'error': data['error'] ?? 'Onboarding failed',
        };
      }
    } catch (e) {
      return {'success': false, 'error': _friendlyError(e)};
    }
  }

  Future<Map<String, dynamic>> initProfile() async {
    try {
      final url = Uri.parse('$baseUrl/api/profile/init');
      final response = await _sendRequest('POST', url);

      final data = _safeJsonDecode(response);
      if (data == null) {
        return {'success': false, 'error': 'Invalid server response.'};
      }
      if (response.statusCode == 200 && data['success'] == true) {
        return {'success': true, 'profile': data['profile']};
      } else {
        return {
          'success': false,
          'error': data['error'] ?? 'Profile initialization failed',
        };
      }
    } catch (e) {
      return {'success': false, 'error': _friendlyError(e)};
    }
  }

  Future<void> logout() async {
    try {
      final url = Uri.parse('$baseUrl/api/auth/logout');
      await _sendRequest('GET', url).timeout(const Duration(seconds: 5));
    } catch (_) {}
    _jwtToken = null;
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('pertap_jwt');
    await prefs.remove('pertap_logged_in');
  }

  Future<User?> getMe() async {
    try {
      final url = Uri.parse('$baseUrl/api/auth/me');
      final response = await _sendRequest('GET', url);

      if (response.statusCode == 200) {
        final data = _safeJsonDecode(response);
        if (data != null && data['success'] == true && data['user'] != null) {
          return User.fromJson(data['user']);
        }
      }
    } catch (e) {
      debugPrint('getMe error: $e');
    }
    return null;
  }

  Future<Map<String, dynamic>?> getProfile({
    int? userId,
    int? profileId,
  }) async {
    try {
      String query = '';
      if (userId != null) {
        query = '?userId=$userId';
      } else if (profileId != null) {
        query = '?profileId=$profileId';
      }
      final url = Uri.parse('$baseUrl/api/profile$query');
      final response = await _sendRequest('GET', url);

      if (response.statusCode == 200) {
        final data = _safeJsonDecode(response);
        if (data != null && data['success'] == true) {
          final profile = Profile.fromJson(data['profile']);
          final score = data['score'] as int? ?? 0;
          final qualifies = data['qualifiesForLeaderboard'] as bool? ?? false;
          var itemsList = data['items'] as List? ?? [];
          final checklist = itemsList
              .map((i) => ChecklistItem.fromJson(i))
              .toList();

          return {
            'profile': profile,
            'score': score,
            'qualifiesForLeaderboard': qualifies,
            'checklist': checklist,
          };
        }
      }
    } catch (e) {
      debugPrint('getProfile error: $e');
    }
    return null;
  }

  Future<Map<String, dynamic>> updateProfile(
    Map<String, dynamic> updateData,
  ) async {
    try {
      final url = Uri.parse('$baseUrl/api/profile');
      final response = await _sendRequest(
        'PUT',
        url,
        body: jsonEncode(updateData),
      );

      final data = _safeJsonDecode(response);
      if (data == null) {
        return {'success': false, 'error': 'Invalid server response.'};
      }
      if (response.statusCode == 200 && data['success'] == true) {
        final profile = Profile.fromJson(data['profile']);
        final score = data['score'] as int? ?? 0;
        final qualifies = data['qualifiesForLeaderboard'] as bool? ?? false;
        var itemsList = data['items'] as List? ?? [];
        final checklist = itemsList
            .map((i) => ChecklistItem.fromJson(i))
            .toList();

        return {
          'success': true,
          'profile': profile,
          'score': score,
          'qualifiesForLeaderboard': qualifies,
          'checklist': checklist,
        };
      } else {
        return {'success': false, 'error': data['error'] ?? 'Update failed'};
      }
    } catch (e) {
      return {'success': false, 'error': _friendlyError(e)};
    }
  }

  Future<Map<String, dynamic>> uploadAvatar(
    String base64Image,
    String mimeType,
  ) async {
    try {
      final url = Uri.parse('$baseUrl/api/upload');

      var request = http.MultipartRequest('POST', url);
      request.headers.addAll(_getHeaders());

      final bytes = base64Decode(base64Image);
      request.files.add(
        http.MultipartFile.fromBytes('file', bytes, filename: 'avatar.png'),
      );

      final streamedResponse = await _client.send(request);
      final response = await http.Response.fromStream(streamedResponse);

      final data = _safeJsonDecode(response);
      if (data == null) {
        return {'success': false, 'error': 'Invalid server response.'};
      }
      if (response.statusCode == 200 && data['success'] == true) {
        return {'success': true, 'url': data['url']};
      } else {
        return {'success': false, 'error': data['error'] ?? 'Upload failed'};
      }
    } catch (e) {
      return {'success': false, 'error': _friendlyError(e)};
    }
  }

  Future<Map<String, dynamic>> tapProfile(int profileId) async {
    try {
      final url = Uri.parse('$baseUrl/api/profile/tap');
      final response = await _sendRequest(
        'POST',
        url,
        authenticated: false,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'profileId': profileId}),
      );

      final data = _safeJsonDecode(response);
      if (data == null) {
        return {'success': false, 'error': 'Invalid server response.'};
      }
      if (response.statusCode == 200 && data['success'] == true) {
        return {
          'success': true,
          'profile': Profile.fromJson(data['profile']),
          'score': data['score'],
        };
      } else {
        return {'success': false, 'error': data['error'] ?? 'Tap failed'};
      }
    } catch (e) {
      return {'success': false, 'error': _friendlyError(e)};
    }
  }

  Future<List<HistoryEvent>> getHistory() async {
    try {
      final url = Uri.parse('$baseUrl/api/history');
      final response = await _sendRequest('GET', url);

      if (response.statusCode == 200) {
        final data = _safeJsonDecode(response);
        if (data != null && data['success'] == true && data['events'] != null) {
          var eventsList = data['events'] as List;
          return eventsList.map((e) => HistoryEvent.fromJson(e)).toList();
        }
      }
    } catch (e) {
      debugPrint('getHistory error: $e');
    }
    return [];
  }

  Future<List<Profile>> getLeaderboard() async {
    try {
      final url = Uri.parse('$baseUrl/api/leaderboard');
      final response = await _sendRequest('GET', url);

      if (response.statusCode == 200) {
        final data = _safeJsonDecode(response);
        if (data != null && data['success'] == true && data['leaderboard'] != null) {
          var leaderboardList = data['leaderboard'] as List;
          return leaderboardList.map((p) => Profile.fromJson(p)).toList();
        }
      }
    } catch (e) {
      debugPrint('getLeaderboard error: $e');
    }
    return [];
  }

  Future<Map<String, dynamic>?> checkLatestVersion() async {
    try {
      final url = Uri.parse('$baseUrl/api/version');
      final response = await _client.get(url).timeout(const Duration(seconds: 5));

      if (response.statusCode == 200) {
        final data = _safeJsonDecode(response);
        if (data != null && data['success'] == true) {
          final serverBuild = data['buildNumber'] as int;

          final packageInfo = await PackageInfo.fromPlatform();
          final localBuildStr = packageInfo.buildNumber;
          final localBuild = int.tryParse(localBuildStr) ?? 0;

          if (serverBuild > localBuild) {
            return {
              'versionName': data['versionName'],
              'buildNumber': serverBuild,
              'forceUpdate': data['forceUpdate'] ?? false,
              'downloadUrl': data['downloadUrl'],
              'changelog': data['changelog'] ?? [],
            };
          }
        }
      }
    } catch (e) {
      debugPrint('checkLatestVersion error: $e');
    }
    return null;
  }

  // ──────────────────────────────────────────────
  // Connection APIs
  // ──────────────────────────────────────────────

  Future<Map<String, dynamic>?> lookupUser(String username) async {
    try {
      final url = Uri.parse(
        '$baseUrl/api/connections/lookup?username=${Uri.encodeComponent(username)}',
      );
      final response = await _sendRequest('GET', url);
      if (response.statusCode == 200) {
        final data = _safeJsonDecode(response);
        if (data != null && data['success'] == true) return data;
      } else if (response.statusCode == 401) {
        return {'success': false, 'error': 'Session expired', 'statusCode': 401};
      }
    } catch (e) {
      debugPrint('lookupUser error: $e');
    }
    return null;
  }

  Future<Map<String, dynamic>> sendConnectionRequest(
    String receiverUsername, {
    String via = 'nfc',
  }) async {
    try {
      final url = Uri.parse('$baseUrl/api/connections/request');
      final response = await _sendRequest(
        'POST',
        url,
        body: jsonEncode({'receiverUsername': receiverUsername, 'via': via}),
      );
      final data = _safeJsonDecode(response);
      if (data == null) {
        return {'success': false, 'error': 'Invalid server response.', 'statusCode': 500};
      }
      if (response.statusCode == 200 && data['success'] == true) {
        return {'success': true};
      }
      return {
        'success': false,
        'error': data['error'] ?? 'Request failed',
        'status': data['status'],
        'statusCode': response.statusCode,
      };
    } catch (e) {
      return {'success': false, 'error': _friendlyError(e), 'statusCode': 503};
    }
  }

  Future<List<PendingRequest>> getPendingRequests() async {
    try {
      final url = Uri.parse('$baseUrl/api/connections/requests');
      final response = await _sendRequest('GET', url);
      if (response.statusCode == 200) {
        final data = _safeJsonDecode(response);
        if (data != null && data['success'] == true) {
          final list = data['requests'] as List? ?? [];
          return list.map((r) => PendingRequest.fromJson(r)).toList();
        }
      }
    } catch (e) {
      debugPrint('getPendingRequests error: $e');
    }
    return [];
  }

  Future<Map<String, dynamic>> acceptRequest(int connectionId) async {
    try {
      final url = Uri.parse('$baseUrl/api/connections/accept');
      final response = await _sendRequest(
        'POST',
        url,
        body: jsonEncode({'connectionId': connectionId}),
      );
      final data = _safeJsonDecode(response);
      if (data == null) {
        return {'success': false, 'error': 'Invalid server response.'};
      }
      if (response.statusCode == 200 && data['success'] == true) {
        return {'success': true};
      }
      return {'success': false, 'error': data['error'] ?? 'Accept failed'};
    } catch (e) {
      return {'success': false, 'error': _friendlyError(e)};
    }
  }

  Future<Map<String, dynamic>> rejectRequest(int connectionId) async {
    try {
      final url = Uri.parse('$baseUrl/api/connections/reject');
      final response = await _sendRequest(
        'POST',
        url,
        body: jsonEncode({'connectionId': connectionId}),
      );
      final data = _safeJsonDecode(response);
      if (data == null) {
        return {'success': false, 'error': 'Invalid server response.'};
      }
      if (response.statusCode == 200 && data['success'] == true) {
        return {'success': true};
      }
      return {'success': false, 'error': data['error'] ?? 'Reject failed'};
    } catch (e) {
      return {'success': false, 'error': _friendlyError(e)};
    }
  }

  Future<List<Connection>> getConnections() async {
    try {
      final url = Uri.parse('$baseUrl/api/connections');
      final response = await _sendRequest('GET', url);
      if (response.statusCode == 200) {
        final data = _safeJsonDecode(response);
        if (data != null && data['success'] == true) {
          final list = data['connections'] as List? ?? [];
          return list.map((c) => Connection.fromJson(c)).toList();
        }
      }
    } catch (e) {
      debugPrint('getConnections error: $e');
    }
    return [];
  }

  Future<ConnectionPermissionData?> getSharingSettings() async {
    try {
      final url = Uri.parse('$baseUrl/api/connections/settings');
      final response = await _sendRequest('GET', url);
      if (response.statusCode == 200) {
        final data = _safeJsonDecode(response);
        if (data != null && data['success'] == true && data['settings'] != null) {
          return ConnectionPermissionData.fromJson(data['settings']);
        }
      }
    } catch (e) {
      debugPrint('getSharingSettings error: $e');
    }
    return null;
  }

  Future<Map<String, dynamic>> updateSharingSettings(
    ConnectionPermissionData settings,
  ) async {
    try {
      final url = Uri.parse('$baseUrl/api/connections/settings');
      final response = await _sendRequest(
        'PUT',
        url,
        body: jsonEncode(settings.toJson()),
      );
      final data = _safeJsonDecode(response);
      if (data == null) {
        return {'success': false, 'error': 'Invalid server response.'};
      }
      if (response.statusCode == 200 && data['success'] == true) {
        return {
          'success': true,
          'settings': ConnectionPermissionData.fromJson(data['settings']),
        };
      }
      return {'success': false, 'error': data['error'] ?? 'Update failed'};
    } catch (e) {
      return {'success': false, 'error': _friendlyError(e)};
    }
  }

  Future<Map<String, dynamic>> updateConnectionVisibility(
    int connectionId,
    ConnectionPermissionData settings,
  ) async {
    try {
      final url = Uri.parse('$baseUrl/api/connections/visibility');
      final response = await _sendRequest(
        'POST',
        url,
        body: jsonEncode({'connectionId': connectionId, ...settings.toJson()}),
      );
      final data = _safeJsonDecode(response);
      if (data == null) {
        return {'success': false, 'error': 'Invalid server response.'};
      }
      if (response.statusCode == 200 && data['success'] == true) {
        return {'success': true};
      }
      return {'success': false, 'error': data['error'] ?? 'Update failed'};
    } catch (e) {
      return {'success': false, 'error': _friendlyError(e)};
    }
  }

  // ──────────────────────────────────────────────
  // Account Deletion (required by Google Play)
  // ──────────────────────────────────────────────

  /// Permanently deletes the user's account and all associated data.
  /// After calling this, clear local storage and navigate to login.
  Future<Map<String, dynamic>> deleteAccount() async {
    try {
      final url = Uri.parse('$baseUrl/api/auth/me');
      final response = await _sendRequest('DELETE', url);

      final data = _safeJsonDecode(response);
      if (data == null) {
        return {'success': false, 'error': 'Invalid server response.'};
      }
      if (response.statusCode == 200 && data['success'] == true) {
        // Clear local credentials
        _jwtToken = null;
        final prefs = await SharedPreferences.getInstance();
        await prefs.clear();
        return {'success': true};
      } else {
        return {
          'success': false,
          'error': data['error'] ?? 'Account deletion failed',
        };
      }
    } catch (e) {
      return {'success': false, 'error': _friendlyError(e)};
    }
  }
  // ──────────────────────────────────────────────
  // Notification APIs
  // ──────────────────────────────────────────────

  Future<List<AppNotification>> getNotifications({bool unreadOnly = false}) async {
    try {
      final query = unreadOnly ? '?unread=true' : '';
      final url = Uri.parse('$baseUrl/api/notifications$query');
      final response = await _sendRequest('GET', url);
      if (response.statusCode == 200) {
        final data = _safeJsonDecode(response);
        if (data != null && data['success'] == true && data['notifications'] != null) {
          final list = data['notifications'] as List? ?? [];
          return list.map((n) => AppNotification.fromJson(n)).toList();
        }
      }
    } catch (e) {
      debugPrint('[ApiService] getNotifications error: $e');
    }
    return [];
  }

  Future<int> getUnreadNotificationCount() async {
    try {
      final url = Uri.parse('$baseUrl/api/notifications/unread-count');
      final response = await _sendRequest('GET', url);
      if (response.statusCode == 200) {
        final data = _safeJsonDecode(response);
        if (data != null && data['success'] == true && data['count'] != null) {
          return data['count'] as int;
        }
      }
    } catch (e) {
      debugPrint('[ApiService] getUnreadNotificationCount error: $e');
    }
    return 0;
  }

  Future<void> markNotificationRead(int id) async {
    try {
      final url = Uri.parse('$baseUrl/api/notifications/read');
      await _sendRequest('POST', url, body: jsonEncode({'id': id}));
    } catch (e) {
      debugPrint('[ApiService] markNotificationRead error: $e');
    }
  }

  Future<void> markAllNotificationsRead() async {
    try {
      final url = Uri.parse('$baseUrl/api/notifications/read');
      await _sendRequest('POST', url, body: jsonEncode({'all': true}));
    } catch (e) {
      debugPrint('[ApiService] markAllNotificationsRead error: $e');
    }
  }

  Future<void> deleteNotification(int id) async {
    try {
      final url = Uri.parse('$baseUrl/api/notifications/$id');
      await _sendRequest('DELETE', url);
    } catch (e) {
      debugPrint('[ApiService] deleteNotification error: $e');
    }
  }

  Future<Map<String, dynamic>> registerFcmToken(String fcmToken) async {
    try {
      final url = Uri.parse('$baseUrl/api/notifications/register-token');
      final response = await _sendRequest(
        'POST',
        url,
        body: jsonEncode({
          'fcmToken': fcmToken,
          'deviceType': defaultTargetPlatform == TargetPlatform.iOS ? 'ios' : 'android',
        }),
      );

      final data = _safeJsonDecode(response);
      if (data == null) {
        return {'success': false, 'error': 'Invalid server response.'};
      }
      if (response.statusCode == 200 && data['success'] == true) {
        return {'success': true};
      }
      return {'success': false, 'error': data['error'] ?? 'Token registration failed'};
    } catch (e) {
      return {'success': false, 'error': _friendlyError(e)};
    }
  }
}

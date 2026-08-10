import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import '../core/api/api_client.dart';
import '../core/api/api_endpoints.dart';
import '../core/storage/local_storage.dart';
import '../core/storage/offline_cache.dart';
import '../core/storage/cache_keys.dart';
import '../core/utils/error_handler.dart';
import '../models/user.dart';
import '../models/profile.dart';
import '../models/checklist_item.dart';
import '../models/history_event.dart';
import '../models/connection.dart';
import '../models/pending_request.dart';
import '../models/notification.dart';

class ApiService {
  static final ApiService _instance = ApiService._internal();
  factory ApiService() => _instance;
  ApiService._internal();

  final ApiClient _apiClient = ApiClient();
  final LocalStorage _storage = LocalStorage();
  final OfflineCache _cache = OfflineCache();

  String get baseUrl => _apiClient.baseUrl;
  bool get isAuthenticated => _storage.isAuthenticated;

  Future<void> init() async {
    await _storage.init();
    await _cache.init();
  }

  /// Returns true if [error] is a network/connectivity issue (the kind
  /// where we should fall back to cache) as opposed to an HTTP-level
  /// error like 401/403/500 where we must NOT serve stale data.
  bool _isNetworkError(dynamic error) {
    if (error is SocketException) return true;
    if (error is TimeoutException) return true;
    if (error is HandshakeException) return true;
    if (error is AppError) {
      // AppError wraps SocketException / HttpException from the error handler
      final details = error.technicalDetails ?? '';
      return details.contains('SocketException') ||
          details.contains('TimeoutException') ||
          details.contains('HandshakeException') ||
          details.contains('Connection failed') ||
          details.contains('Connection refused');
    }
    // Catch-all for other connectivity-related exceptions
    final msg = error.toString().toLowerCase();
    return msg.contains('socketexception') ||
        msg.contains('connection refused') ||
        msg.contains('network is unreachable') ||
        msg.contains('no address associated') ||
        msg.contains('failed host lookup');
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
        return {'success': true, 'user': data['user']};
      }
      return {'success': false, 'error': data?['error'] ?? 'Login failed.'};
    } catch (e) {
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
        return {'success': true, 'user': data['user']};
      }
      return {'success': false, 'error': data?['error'] ?? 'Registration failed.'};
    } catch (e) {
      return {'success': false, 'error': e.toString()};
    }
  }

  Future<Map<String, dynamic>> sendOtp(String email) async {
    try {
      final response = await _apiClient.sendRequest(
        'POST',
        ApiEndpoints.sendOtp,
        authenticated: false,
        body: jsonEncode({'email': email}),
      );
      final data = jsonDecode(response.body);
      if (response.statusCode == 200 && data != null && data['success'] == true) {
        return {'success': true, 'message': data['message']};
      }
      return {'success': false, 'error': data?['error'] ?? 'Failed to send OTP.'};
    } catch (e) {
      return {'success': false, 'error': e.toString()};
    }
  }

  Future<Map<String, dynamic>> resendOtp(String email) async {
    try {
      final response = await _apiClient.sendRequest(
        'POST',
        ApiEndpoints.resendOtp,
        authenticated: false,
        body: jsonEncode({'email': email}),
      );
      final data = jsonDecode(response.body);
      if (response.statusCode == 200 && data != null && data['success'] == true) {
        return {'success': true, 'message': data['message']};
      }
      return {'success': false, 'error': data?['error'] ?? 'Failed to resend OTP.'};
    } catch (e) {
      return {'success': false, 'error': e.toString()};
    }
  }

  Future<Map<String, dynamic>> verifyOtp(String email, String otp) async {
    try {
      final response = await _apiClient.sendRequest(
        'POST',
        ApiEndpoints.verifyOtp,
        authenticated: false,
        body: jsonEncode({'email': email, 'otp': otp}),
      );
      final data = jsonDecode(response.body);
      if (response.statusCode == 200 && data != null && data['success'] == true) {
        return {'success': true, 'message': data['message']};
      }
      return {'success': false, 'error': data?['error'] ?? 'Verification failed.'};
    } catch (e) {
      return {'success': false, 'error': e.toString()};
    }
  }

  Future<Map<String, dynamic>> forgotSendOtp(String email) async {
    try {
      final response = await _apiClient.sendRequest(
        'POST',
        ApiEndpoints.forgotSendOtp,
        authenticated: false,
        body: jsonEncode({'email': email}),
      );
      final data = jsonDecode(response.body);
      if (response.statusCode == 200 && data != null && data['success'] == true) {
        return {'success': true, 'message': data['message']};
      }
      return {'success': false, 'error': data?['error'] ?? 'Failed to send OTP.'};
    } catch (e) {
      return {'success': false, 'error': e.toString()};
    }
  }

  Future<Map<String, dynamic>> forgotVerifyOtp(String email, String otp) async {
    try {
      final response = await _apiClient.sendRequest(
        'POST',
        ApiEndpoints.forgotVerifyOtp,
        authenticated: false,
        body: jsonEncode({'email': email, 'otp': otp}),
      );
      final data = jsonDecode(response.body);
      if (response.statusCode == 200 && data != null && data['success'] == true) {
        return {'success': true, 'message': data['message']};
      }
      return {'success': false, 'error': data?['error'] ?? 'Verification failed.'};
    } catch (e) {
      return {'success': false, 'error': e.toString()};
    }
  }

  Future<Map<String, dynamic>> forgotReset(String email, String password) async {
    try {
      final response = await _apiClient.sendRequest(
        'POST',
        ApiEndpoints.forgotReset,
        authenticated: false,
        body: jsonEncode({'email': email, 'password': password}),
      );
      final data = jsonDecode(response.body);
      if (response.statusCode == 200 && data != null && data['success'] == true) {
        return {'success': true, 'message': data['message']};
      }
      return {'success': false, 'error': data?['error'] ?? 'Reset failed.'};
    } catch (e) {
      return {'success': false, 'error': e.toString()};
    }
  }

  Future<Map<String, dynamic>> googleLogin(
    String idToken, {
    String? email,
    String? name,
  }) async {
    try {
      final response = await _apiClient.sendRequest(
        'POST',
        ApiEndpoints.googleLogin,
        authenticated: false,
        body: jsonEncode({
          'idToken': idToken,
          'email': ?email,
          'displayName': ?name,
        }),
      );

      final data = jsonDecode(response.body);
      if (response.statusCode == 200 && data != null && data['success'] == true) {
        return {'success': true, 'user': data['user']};
      }
      return {'success': false, 'error': data?['error'] ?? 'Google login failed.'};
    } catch (e) {
      return {'success': false, 'error': e.toString()};
    }
  }

  Future<Map<String, dynamic>> checkUsernameAvailability(String username) async {
    try {
      final path = '${ApiEndpoints.usernameCheck}?username=${Uri.encodeComponent(username)}';
      final response = await _apiClient.sendRequest('GET', path, authenticated: false);

      final data = jsonDecode(response.body);
      if (response.statusCode == 200 && data != null) {
        return {
          'success': true,
          'available': data['available'] ?? false,
          'suggestions': List<String>.from(data['suggestions'] ?? []),
        };
      }
      return {'success': false, 'error': data?['error'] ?? 'Username check failed.'};
    } catch (e) {
      return {'success': false, 'error': e.toString()};
    }
  }

  Future<Map<String, dynamic>> submitOnboarding(Map<String, dynamic> payload) async {
    try {
      final response = await _apiClient.sendRequest(
        'PUT',
        ApiEndpoints.onboarding,
        body: jsonEncode(payload),
      );

      final data = jsonDecode(response.body);
      if (response.statusCode == 200 && data != null && data['success'] == true) {
        return {'success': true};
      }
      return {'success': false, 'error': data?['error'] ?? 'Onboarding failed.'};
    } catch (e) {
      return {'success': false, 'error': e.toString()};
    }
  }

  Future<Map<String, dynamic>> initProfile() async {
    try {
      final response = await _apiClient.sendRequest('POST', ApiEndpoints.initProfile);
      final data = jsonDecode(response.body);
      if (response.statusCode == 200 && data != null && data['success'] == true) {
        return {'success': true, 'profile': data['profile']};
      }
      return {'success': false, 'error': data?['error'] ?? 'Profile init failed.'};
    } catch (e) {
      return {'success': false, 'error': e.toString()};
    }
  }

  Future<void> logout() async {
    try {
      if (isAuthenticated) {
        await _apiClient.sendRequest('POST', ApiEndpoints.logout, retryCount: 0);
      }
    } catch (_) {}
    await _storage.clearJwtToken();
    await _cache.clearAll();
  }

  Future<User?> getMe() async {
    try {
      final response = await _apiClient.sendRequest('GET', ApiEndpoints.me);
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data != null && data['success'] == true && data['user'] != null) {
          // Cache the raw user JSON on success
          await _cache.saveJson(CacheKeys.me, data['user']);
          return User.fromJson(data['user'] as Map<String, dynamic>?);
        }
      }
      // Non-200 (e.g. 401) — do NOT serve stale cache
      if (response.statusCode == 401) {
        await _cache.clear(CacheKeys.me);
      }
    } catch (e, stackTrace) {
      debugPrint('[EXCEPTION] getMe error: $e\n$stackTrace');
      // Fall back to cache only on network errors
      if (_isNetworkError(e)) {
        final cached = _cache.loadJson(CacheKeys.me);
        if (cached != null) {
          debugPrint('[OFFLINE-CACHE] Returning cached user (getMe)');
          return User.fromJson(cached as Map<String, dynamic>?);
        }
      }
    }
    return null;
  }

  Future<Map<String, dynamic>?> getProfile({int? userId, int? profileId}) async {
    // Only cache the user's own profile (no userId/profileId params)
    final isOwnProfile = userId == null && profileId == null;
    try {
      String query = '';
      if (userId != null) {
        query = '?userId=$userId';
      } else if (profileId != null) {
        query = '?profileId=$profileId';
      }

      final response = await _apiClient.sendRequest('GET', '${ApiEndpoints.profile}$query');
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data != null && data['success'] == true) {
          // Cache the raw response payload for own profile
          if (isOwnProfile) {
            await _cache.saveJson(CacheKeys.profile, {
              'profile': data['profile'],
              'score': data['score'],
              'qualifiesForLeaderboard': data['qualifiesForLeaderboard'],
              'items': data['items'],
            });
          }

          final profile = Profile.fromJson(data['profile'] as Map<String, dynamic>?);
          final score = data['score'] as int? ?? 0;
          final qualifies = data['qualifiesForLeaderboard'] as bool? ?? false;
          final itemsList = data['items'] as List? ?? [];
          final checklist = itemsList.map((i) => ChecklistItem.fromJson(i as Map<String, dynamic>?)).toList();

          return {
            'profile': profile,
            'score': score,
            'qualifiesForLeaderboard': qualifies,
            'checklist': checklist,
            'connectionStatus': data['connectionStatus'],
            'connectionId': data['connectionId'],
          };
        }
      }
    } catch (e, stackTrace) {
      debugPrint('[EXCEPTION] getProfile error: $e\n$stackTrace');
      if (_isNetworkError(e) && isOwnProfile) {
        final cached = _cache.loadJson(CacheKeys.profile);
        if (cached != null) {
          debugPrint('[OFFLINE-CACHE] Returning cached profile');
          final c = cached as Map<String, dynamic>;
          final profile = Profile.fromJson(c['profile'] as Map<String, dynamic>?);
          final score = c['score'] as int? ?? 0;
          final qualifies = c['qualifiesForLeaderboard'] as bool? ?? false;
          final itemsList = c['items'] as List? ?? [];
          final checklist = itemsList.map((i) => ChecklistItem.fromJson(i as Map<String, dynamic>?)).toList();
          return {
            'profile': profile,
            'score': score,
            'qualifiesForLeaderboard': qualifies,
            'checklist': checklist,
            'connectionStatus': null,
            'connectionId': null,
          };
        }
      }
    }
    return null;
  }

  Future<Map<String, dynamic>?> getPublicProfile(String username) async {
    try {
      final response = await _apiClient.sendRequest('GET', '/api/profile/$username');
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data != null && data['success'] == true) {
          final profile = Profile.fromJson(data['profile'] as Map<String, dynamic>?);
          return {
            'profile': profile,
            'connectionStatus': data['connectionStatus'],
            'connectionId': data['connectionId'],
          };
        }
      }
    } catch (e) {
      debugPrint('[EXCEPTION] getPublicProfile error: $e');
    }
    return null;
  }


  Future<Map<String, dynamic>> updateProfile(Map<String, dynamic> updateData) async {
    try {
      final response = await _apiClient.sendRequest(
        'PUT',
        ApiEndpoints.profile,
        body: jsonEncode(updateData),
      );

      final data = jsonDecode(response.body);
      if (response.statusCode == 200 && data != null && data['success'] == true) {
        final profile = Profile.fromJson(data['profile'] as Map<String, dynamic>?);
        final score = data['score'] as int? ?? 0;
        final qualifies = data['qualifiesForLeaderboard'] as bool? ?? false;
        final itemsList = data['items'] as List? ?? [];
        final checklist = itemsList.map((i) => ChecklistItem.fromJson(i as Map<String, dynamic>?)).toList();

        return {
          'success': true,
          'profile': profile,
          'score': score,
          'qualifiesForLeaderboard': qualifies,
          'checklist': checklist,
        };
      }
      return {'success': false, 'error': data?['error'] ?? 'Profile update failed.'};
    } catch (e) {
      return {'success': false, 'error': e.toString()};
    }
  }

  Future<Map<String, dynamic>> uploadAvatar(String base64Image, String mimeType) async {
    try {
      final url = Uri.parse('$baseUrl${ApiEndpoints.upload}');
      final request = http.MultipartRequest('POST', url);
      
      final headers = <String, String>{};
      final token = _storage.jwtToken;
      if (token != null && token.isNotEmpty) {
        headers['Cookie'] = 'pertap_jwt=$token';
        headers['Authorization'] = 'Bearer $token';
        headers['X-Pertap-Token'] = token;
      }
      request.headers.addAll(headers);

      final bytes = base64Decode(base64Image);
      request.files.add(
        http.MultipartFile.fromBytes('file', bytes, filename: 'avatar.png'),
      );

      final streamedResponse = await request.send();
      final response = await http.Response.fromStream(streamedResponse);

      final data = jsonDecode(response.body);
      if (response.statusCode == 200 && data != null && data['success'] == true) {
        return {'success': true, 'url': data['url']};
      }
      return {'success': false, 'error': data?['error'] ?? 'Avatar upload failed.'};
    } catch (e) {
      return {'success': false, 'error': e.toString()};
    }
  }

  Future<Map<String, dynamic>> tapProfile(int otherProfileId, String via) async {
    try {
      final response = await _apiClient.sendRequest(
        'POST',
        ApiEndpoints.tap,
        body: jsonEncode({
          'otherProfileId': otherProfileId,
          'via': via,
        }),
      );

      final data = jsonDecode(response.body);
      if (response.statusCode == 200 && data != null) {
        return {
          'success': data['success'] ?? false,
          'diamonds': data['diamonds']?.toString() ?? '0',
          'score': data['score'] as int? ?? 0,
        };
      }
      return {'success': false, 'error': data?['error'] ?? 'Tap profile failed.'};
    } catch (e) {
      return {'success': false, 'error': e.toString()};
    }
  }

  Future<List<HistoryEvent>> getHistory() async {
    try {
      final response = await _apiClient.sendRequest('GET', ApiEndpoints.history);
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data != null && data['success'] == true) {
          final list = data['events'] as List? ?? [];
          await _cache.saveJson(CacheKeys.history, list);
          return list.map((h) => HistoryEvent.fromJson(h as Map<String, dynamic>?)).toList();
        }
      }
    } catch (e, stackTrace) {
      debugPrint('[EXCEPTION] getHistory error: $e\n$stackTrace');
      if (_isNetworkError(e)) {
        final cached = _cache.loadJson(CacheKeys.history);
        if (cached != null) {
          debugPrint('[OFFLINE-CACHE] Returning cached history');
          final list = cached as List;
          return list.map((h) => HistoryEvent.fromJson(h as Map<String, dynamic>?)).toList();
        }
      }
    }
    return [];
  }

  Future<List<Profile>> getLeaderboard() async {
    try {
      final response = await _apiClient.sendRequest('GET', ApiEndpoints.leaderboard);
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data != null && data['success'] == true) {
          final list = data['leaderboard'] as List? ?? [];
          await _cache.saveJson(CacheKeys.leaderboard, list);
          return list.map((p) => Profile.fromJson(p as Map<String, dynamic>?)).toList();
        }
      }
    } catch (e, stackTrace) {
      debugPrint('[EXCEPTION] getLeaderboard error: $e\n$stackTrace');
      if (_isNetworkError(e)) {
        final cached = _cache.loadJson(CacheKeys.leaderboard);
        if (cached != null) {
          debugPrint('[OFFLINE-CACHE] Returning cached leaderboard');
          final list = cached as List;
          return list.map((p) => Profile.fromJson(p as Map<String, dynamic>?)).toList();
        }
      }
    }
    return [];
  }

  Future<Map<String, dynamic>?> checkLatestVersion() async {
    try {
      final response = await _apiClient.sendRequest('GET', ApiEndpoints.version, authenticated: false);
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data != null && data['success'] == true) {
          return data;
        }
      }
    } catch (e, stackTrace) {
      debugPrint('[EXCEPTION] checkLatestVersion error: $e\n$stackTrace');
    }
    return null;
  }

  Future<Map<String, dynamic>?> lookupUser(String username) async {
    try {
      final path = '${ApiEndpoints.lookup}?username=${Uri.encodeComponent(username)}';
      final response = await _apiClient.sendRequest('GET', path);
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data != null && data['success'] == true) {
          return {
            'profile': data['profile'] as Map<String, dynamic>?,
            'connectionStatus': data['connectionStatus'],
          };
        }
      }
    } catch (e, stackTrace) {
      debugPrint('[EXCEPTION] lookupUser error: $e\n$stackTrace');
    }
    return null;
  }

  Future<Map<String, dynamic>> sendConnectionRequest(
    String targetUsername, {
    required String via,
  }) async {
    try {
      final response = await _apiClient.sendRequest(
        'POST',
        ApiEndpoints.connectionRequest,
        body: jsonEncode({
          'receiverUsername': targetUsername,
          'via': via,
        }),
      );

      final data = jsonDecode(response.body);
      if (response.statusCode == 200 && data != null) {
        return {
          'success': data['success'] ?? false,
          'status': data['status'],
          'connectionId': data['connectionId'],
        };
      }
      return {'success': false, 'error': data?['error'] ?? 'Connection request failed.'};
    } catch (e) {
      return {'success': false, 'error': e.toString()};
    }
  }

  Future<Map<String, dynamic>> acceptRequest(int requestId, [ConnectionPermissionData? settings]) async {
    return acceptConnection(requestId, settings);
  }

  Future<Map<String, dynamic>> rejectRequest(int requestId) async {
    return rejectConnection(requestId);
  }

  Future<List<PendingRequest>> getPendingRequests() async {
    try {
      final response = await _apiClient.sendRequest('GET', ApiEndpoints.connectionRequests);
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data != null && data['success'] == true) {
          final list = data['requests'] as List? ?? [];
          await _cache.saveJson(CacheKeys.pendingRequests, list);
          return list.map((i) => PendingRequest.fromJson(i as Map<String, dynamic>?)).toList();
        }
      }
    } catch (e) {
      if (_isNetworkError(e)) {
        final cached = _cache.loadJson(CacheKeys.pendingRequests);
        if (cached != null) {
          debugPrint('[OFFLINE-CACHE] Returning cached pending requests');
          final list = cached as List;
          return list.map((i) => PendingRequest.fromJson(i as Map<String, dynamic>?)).toList();
        }
      }
    }
    return [];
  }

  Future<Map<String, dynamic>> acceptConnection(int requestId, [ConnectionPermissionData? settings]) async {
    try {
      final response = await _apiClient.sendRequest(
        'POST',
        ApiEndpoints.connectionAccept,
        body: jsonEncode({
          'connectionId': requestId,
          'settings': (settings ?? ConnectionPermissionData()).toJson(),
        }),
      );

      final data = jsonDecode(response.body);
      if (response.statusCode == 200 && data != null && data['success'] == true) {
        return {'success': true};
      }
      return {'success': false, 'error': data?['error'] ?? 'Accept request failed.'};
    } catch (e) {
      return {'success': false, 'error': e.toString()};
    }
  }

  Future<Map<String, dynamic>> rejectConnection(int requestId) async {
    try {
      final response = await _apiClient.sendRequest(
        'POST',
        ApiEndpoints.connectionReject,
        body: jsonEncode({'connectionId': requestId}),
      );

      final data = jsonDecode(response.body);
      if (response.statusCode == 200 && data != null && data['success'] == true) {
        return {'success': true};
      }
      return {'success': false, 'error': data?['error'] ?? 'Reject request failed.'};
    } catch (e) {
      return {'success': false, 'error': e.toString()};
    }
  }

  Future<List<Connection>> getConnections() async {
    try {
      final response = await _apiClient.sendRequest('GET', ApiEndpoints.connections);
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data != null && data['success'] == true) {
          final list = data['connections'] as List? ?? [];
          await _cache.saveJson(CacheKeys.connections, list);
          return list.map((c) => Connection.fromJson(c as Map<String, dynamic>?)).toList();
        }
      }
    } catch (e) {
      if (_isNetworkError(e)) {
        final cached = _cache.loadJson(CacheKeys.connections);
        if (cached != null) {
          debugPrint('[OFFLINE-CACHE] Returning cached connections');
          final list = cached as List;
          return list.map((c) => Connection.fromJson(c as Map<String, dynamic>?)).toList();
        }
      }
    }
    return [];
  }

  Future<ConnectionPermissionData?> getSharingSettings() async {
    try {
      final response = await _apiClient.sendRequest('GET', ApiEndpoints.connectionSettings);
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data != null && data['success'] == true) {
          await _cache.saveJson(CacheKeys.sharingSettings, data['settings']);
          return ConnectionPermissionData.fromJson(data['settings'] as Map<String, dynamic>?);
        }
      }
    } catch (e) {
      if (_isNetworkError(e)) {
        final cached = _cache.loadJson(CacheKeys.sharingSettings);
        if (cached != null) {
          debugPrint('[OFFLINE-CACHE] Returning cached sharing settings');
          return ConnectionPermissionData.fromJson(cached as Map<String, dynamic>?);
        }
      }
    }
    return null;
  }

  Future<Map<String, dynamic>> saveSharingSettings(ConnectionPermissionData settings) async {
    try {
      final response = await _apiClient.sendRequest(
        'PUT',
        ApiEndpoints.connectionSettings,
        body: jsonEncode({'settings': settings.toJson()}),
      );

      final data = jsonDecode(response.body);
      if (response.statusCode == 200 && data != null && data['success'] == true) {
        // Update cache with newly saved settings
        await _cache.saveJson(CacheKeys.sharingSettings, data['settings']);
        return {
          'success': true,
          'settings': ConnectionPermissionData.fromJson(data['settings'] as Map<String, dynamic>?),
        };
      }
      return {'success': false, 'error': data?['error'] ?? 'Save settings failed.'};
    } catch (e) {
      return {'success': false, 'error': e.toString()};
    }
  }

  Future<Map<String, dynamic>> updateSharingSettings(ConnectionPermissionData settings) async {
    return saveSharingSettings(settings);
  }

  Future<Map<String, dynamic>> updateConnectionVisibility(int connectionId, ConnectionPermissionData settings) async {
    try {
      final response = await _apiClient.sendRequest(
        'POST',
        ApiEndpoints.connectionVisibility,
        body: jsonEncode({
          'connectionId': connectionId,
          ...settings.toJson(),
        }),
      );

      final data = jsonDecode(response.body);
      if (response.statusCode == 200 && data != null && data['success'] == true) {
        return {'success': true};
      }
      return {'success': false, 'error': data?['error'] ?? 'Visibility update failed.'};
    } catch (e) {
      return {'success': false, 'error': e.toString()};
    }
  }

  Future<Map<String, dynamic>> deleteAccount() async {
    try {
      final response = await _apiClient.sendRequest('DELETE', ApiEndpoints.me);
      final data = jsonDecode(response.body);
      if (response.statusCode == 200 && data != null && data['success'] == true) {
        await _storage.clearJwtToken();
        return {'success': true};
      }
      return {'success': false, 'error': data?['error'] ?? 'Account deletion failed.'};
    } catch (e) {
      return {'success': false, 'error': e.toString()};
    }
  }

  Future<List<AppNotification>> getNotifications({bool unreadOnly = false}) async {
    try {
      final query = unreadOnly ? '?unread=true' : '';
      final response = await _apiClient.sendRequest('GET', '${ApiEndpoints.notifications}$query');
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data != null && data['success'] == true && data['notifications'] != null) {
          final list = data['notifications'] as List? ?? [];
          // Only cache the full (non-filtered) notification list
          if (!unreadOnly) {
            await _cache.saveJson(CacheKeys.notifications, list);
          }
          return list.map((n) => AppNotification.fromJson(n as Map<String, dynamic>)).toList();
        }
      }
    } catch (e) {
      if (_isNetworkError(e)) {
        final cached = _cache.loadJson(CacheKeys.notifications);
        if (cached != null) {
          debugPrint('[OFFLINE-CACHE] Returning cached notifications');
          final list = cached as List;
          return list.map((n) => AppNotification.fromJson(n as Map<String, dynamic>)).toList();
        }
      }
    }
    return [];
  }

  Future<int> getUnreadNotificationCount() async {
    try {
      final response = await _apiClient.sendRequest('GET', ApiEndpoints.unreadNotificationCount);
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data != null && data['success'] == true && data['count'] != null) {
          final count = data['count'] as int? ?? 0;
          await _cache.saveJson(CacheKeys.unreadCount, count);
          return count;
        }
      }
    } catch (e) {
      if (_isNetworkError(e)) {
        final cached = _cache.loadJson(CacheKeys.unreadCount);
        if (cached != null) {
          debugPrint('[OFFLINE-CACHE] Returning cached unread count');
          return cached as int;
        }
      }
    }
    return 0;
  }

  Future<void> markNotificationRead(int id) async {
    try {
      await _apiClient.sendRequest('POST', ApiEndpoints.readNotification, body: jsonEncode({'id': id}));
    } catch (_) {}
  }

  Future<void> markAllNotificationsRead() async {
    try {
      await _apiClient.sendRequest('POST', ApiEndpoints.readNotification, body: jsonEncode({'all': true}));
    } catch (_) {}
  }

  Future<void> deleteNotification(int id) async {
    try {
      await _apiClient.sendRequest('DELETE', '${ApiEndpoints.notifications}/$id');
    } catch (_) {}
  }

  Future<Map<String, dynamic>> registerFcmToken(String fcmToken) async {
    try {
      final response = await _apiClient.sendRequest(
        'POST',
        ApiEndpoints.fcmRegisterToken,
        body: jsonEncode({
          'fcmToken': fcmToken,
          'deviceType': defaultTargetPlatform == TargetPlatform.iOS ? 'ios' : 'android',
        }),
      );

      final data = jsonDecode(response.body);
      if (response.statusCode == 200 && data != null && data['success'] == true) {
        return {'success': true};
      }
      return {'success': false, 'error': data?['error'] ?? 'Token registration failed.'};
    } catch (e) {
      return {'success': false, 'error': e.toString()};
    }
  }

  // ─── Theme / Customizer ───────────────────────────────────────────────────

  Future<Map<String, dynamic>> getTheme() async {
    try {
      final response = await _apiClient.sendRequest('GET', ApiEndpoints.theme);
      final data = jsonDecode(response.body);
      if (response.statusCode == 200 && data != null && data['success'] == true) {
        await _cache.saveJson(CacheKeys.theme, data['theme']);
        return {'success': true, 'theme': data['theme']};
      }
      return {'success': false, 'error': data?['error'] ?? 'Failed to load theme.'};
    } catch (e) {
      if (_isNetworkError(e)) {
        final cached = _cache.loadJson(CacheKeys.theme);
        if (cached != null) {
          debugPrint('[OFFLINE-CACHE] Returning cached theme');
          return {'success': true, 'theme': cached};
        }
      }
      return {'success': false, 'error': e.toString()};
    }
  }

  Future<Map<String, dynamic>> saveTheme(Map<String, dynamic> settings) async {
    try {
      final response = await _apiClient.sendRequest(
        'PUT',
        ApiEndpoints.theme,
        body: jsonEncode({'settings': settings}),
      );
      final data = jsonDecode(response.body);
      if (response.statusCode == 200 && data != null && data['success'] == true) {
        return {'success': true, 'theme': data['theme']};
      }
      return {'success': false, 'error': data?['error'] ?? 'Failed to save theme.'};
    } catch (e) {
      return {'success': false, 'error': e.toString()};
    }
  }

  Future<Map<String, dynamic>> resetTheme() async {
    try {
      final response = await _apiClient.sendRequest('POST', ApiEndpoints.themeReset);
      final data = jsonDecode(response.body);
      if (response.statusCode == 200 && data != null && data['success'] == true) {
        return {'success': true, 'theme': data['theme']};
      }
      return {'success': false, 'error': data?['error'] ?? 'Failed to reset theme.'};
    } catch (e) {
      return {'success': false, 'error': e.toString()};
    }
  }

  Future<Map<String, dynamic>> getMarketplaceThemes({String filter = 'trending'}) async {
    try {
      final response = await _apiClient.sendRequest(
        'GET',
        '${ApiEndpoints.themeMarketplace}?filter=$filter',
      );
      final data = jsonDecode(response.body);
      if (response.statusCode == 200 && data != null && data['success'] == true) {
        return {'success': true, 'themes': data['themes']};
      }
      return {'success': false, 'themes': []};
    } catch (e) {
      return {'success': false, 'themes': []};
    }
  }

  Future<Map<String, dynamic>> publishMarketplaceTheme(
    String name,
    Map<String, dynamic> settings,
  ) async {
    try {
      final response = await _apiClient.sendRequest(
        'POST',
        ApiEndpoints.themeMarketplace,
        body: jsonEncode({'action': 'publish', 'themeName': name, 'settings': settings}),
      );
      final data = jsonDecode(response.body);
      if (response.statusCode == 200 && data != null && data['success'] == true) {
        return {'success': true};
      }
      return {'success': false, 'error': data?['error'] ?? 'Failed to publish.'};
    } catch (e) {
      return {'success': false, 'error': e.toString()};
    }
  }

  Future<Map<String, dynamic>> installMarketplaceTheme(int themeId) async {
    try {
      final response = await _apiClient.sendRequest(
        'POST',
        ApiEndpoints.themeMarketplace,
        body: jsonEncode({'action': 'install', 'themeId': themeId}),
      );
      final data = jsonDecode(response.body);
      if (response.statusCode == 200 && data != null && data['success'] == true) {
        return {'success': true, 'theme': data['theme']};
      }
      return {'success': false, 'error': data?['error'] ?? 'Failed to install.'};
    } catch (e) {
      return {'success': false, 'error': e.toString()};
    }
  }

  Future<bool> likeMarketplaceTheme(int themeId) async {
    try {
      final response = await _apiClient.sendRequest(
        'POST',
        ApiEndpoints.themeMarketplace,
        body: jsonEncode({'action': 'like', 'themeId': themeId}),
      );
      return response.statusCode == 200;
    } catch (_) {
      return false;
    }
  }

  Future<bool> deleteMarketplaceTheme(int themeId) async {
    try {
      final response = await _apiClient.sendRequest(
        'DELETE',
        '${ApiEndpoints.themeMarketplace}?themeId=$themeId',
      );
      return response.statusCode == 200;
    } catch (_) {
      return false;
    }
  }
}

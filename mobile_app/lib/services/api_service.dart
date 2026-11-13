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
import '../models/card_item.dart';

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
      if (response.statusCode == 200 &&
          data != null &&
          data['success'] == true) {
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
      if (response.statusCode == 200 &&
          data != null &&
          data['success'] == true) {
        return {'success': true, 'user': data['user']};
      }
      return {
        'success': false,
        'error': data?['error'] ?? 'Registration failed.',
      };
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
      if (response.statusCode == 200 &&
          data != null &&
          data['success'] == true) {
        return {'success': true, 'message': data['message']};
      }
      return {
        'success': false,
        'error': data?['error'] ?? 'Failed to send OTP.',
      };
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
      if (response.statusCode == 200 &&
          data != null &&
          data['success'] == true) {
        return {'success': true, 'message': data['message']};
      }
      return {
        'success': false,
        'error': data?['error'] ?? 'Failed to resend OTP.',
      };
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
      if (response.statusCode == 200 &&
          data != null &&
          data['success'] == true) {
        return {'success': true, 'message': data['message']};
      }
      return {
        'success': false,
        'error': data?['error'] ?? 'Verification failed.',
      };
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
      if (response.statusCode == 200 &&
          data != null &&
          data['success'] == true) {
        return {'success': true, 'message': data['message']};
      }
      return {
        'success': false,
        'error': data?['error'] ?? 'Failed to send OTP.',
      };
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
      if (response.statusCode == 200 &&
          data != null &&
          data['success'] == true) {
        return {'success': true, 'message': data['message']};
      }
      return {
        'success': false,
        'error': data?['error'] ?? 'Verification failed.',
      };
    } catch (e) {
      return {'success': false, 'error': e.toString()};
    }
  }

  Future<Map<String, dynamic>> forgotReset(
    String email,
    String password,
  ) async {
    try {
      final response = await _apiClient.sendRequest(
        'POST',
        ApiEndpoints.forgotReset,
        authenticated: false,
        body: jsonEncode({'email': email, 'password': password}),
      );
      final data = jsonDecode(response.body);
      if (response.statusCode == 200 &&
          data != null &&
          data['success'] == true) {
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
      if (response.statusCode == 200 &&
          data != null &&
          data['success'] == true) {
        return {'success': true, 'user': data['user']};
      }
      return {
        'success': false,
        'error': data?['error'] ?? 'Google login failed.',
      };
    } catch (e) {
      return {'success': false, 'error': e.toString()};
    }
  }

  Future<Map<String, dynamic>> checkUsernameAvailability(
    String username,
  ) async {
    try {
      final path =
          '${ApiEndpoints.usernameCheck}?username=${Uri.encodeComponent(username)}';
      final response = await _apiClient.sendRequest(
        'GET',
        path,
        authenticated: false,
      );

      final data = jsonDecode(response.body);
      if (response.statusCode == 200 && data != null) {
        return {
          'success': true,
          'available': data['available'] ?? false,
          'suggestions': List<String>.from(data['suggestions'] ?? []),
        };
      }
      return {
        'success': false,
        'error': data?['error'] ?? 'Username check failed.',
      };
    } catch (e) {
      return {'success': false, 'error': e.toString()};
    }
  }

  Future<Map<String, dynamic>> submitOnboarding(
    Map<String, dynamic> payload,
  ) async {
    try {
      final response = await _apiClient.sendRequest(
        'PUT',
        ApiEndpoints.onboarding,
        body: jsonEncode(payload),
      );

      final data = jsonDecode(response.body);
      if (response.statusCode == 200 &&
          data != null &&
          data['success'] == true) {
        return {'success': true};
      }
      return {
        'success': false,
        'error': data?['error'] ?? 'Onboarding failed.',
      };
    } catch (e) {
      return {'success': false, 'error': e.toString()};
    }
  }

  Future<Map<String, dynamic>> initProfile() async {
    try {
      final response = await _apiClient.sendRequest(
        'POST',
        ApiEndpoints.initProfile,
      );
      final data = jsonDecode(response.body);
      if (response.statusCode == 200 &&
          data != null &&
          data['success'] == true) {
        return {'success': true, 'profile': data['profile']};
      }
      return {
        'success': false,
        'error': data?['error'] ?? 'Profile init failed.',
      };
    } catch (e) {
      return {'success': false, 'error': e.toString()};
    }
  }

  Future<void> logout() async {
    try {
      if (isAuthenticated) {
        await _apiClient.sendRequest(
          'POST',
          ApiEndpoints.logout,
          retryCount: 0,
        );
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

  Future<Map<String, dynamic>?> getProfile({
    int? userId,
    int? profileId,
  }) async {
    // Only cache the user's own profile (no userId/profileId params)
    final isOwnProfile = userId == null && profileId == null;
    try {
      String query = '';
      if (userId != null) {
        query = '?userId=$userId';
      } else if (profileId != null) {
        query = '?profileId=$profileId';
      }

      final response = await _apiClient.sendRequest(
        'GET',
        '${ApiEndpoints.profile}$query',
      );
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

          final profile = Profile.fromJson(
            data['profile'] as Map<String, dynamic>?,
          );

          if (isOwnProfile && profile.name.isNotEmpty && profile.name != 'My Card') {
            try {
              final localCards = _loadLocalCards();
              bool modified = false;
              final updated = localCards.map((c) {
                if (c.name == 'My Card' || c.name.isEmpty) {
                  modified = true;
                  return c.copyWith(name: profile.name);
                }
                return c;
              }).toList();
              var active = _loadLocalActiveCard();
              if (active != null && (active.name == 'My Card' || active.name.isEmpty)) {
                active = active.copyWith(name: profile.name);
                modified = true;
              }
              if (modified) {
                _saveLocalCards(updated, active);
              }
            } catch (_) {}
          }
          final score = data['score'] as int? ?? 0;
          final qualifies = data['qualifiesForLeaderboard'] as bool? ?? false;
          final itemsList = data['items'] as List? ?? [];
          final checklist = itemsList
              .map((i) => ChecklistItem.fromJson(i as Map<String, dynamic>?))
              .toList();

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
          final profile = Profile.fromJson(
            c['profile'] as Map<String, dynamic>?,
          );
          final score = c['score'] as int? ?? 0;
          final qualifies = c['qualifiesForLeaderboard'] as bool? ?? false;
          final itemsList = c['items'] as List? ?? [];
          final checklist = itemsList
              .map((i) => ChecklistItem.fromJson(i as Map<String, dynamic>?))
              .toList();
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
      final response = await _apiClient.sendRequest(
        'GET',
        '/api/profile/$username',
      );
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data != null && data['success'] == true) {
          final profile = Profile.fromJson(
            data['profile'] as Map<String, dynamic>?,
          );
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

  Future<Map<String, dynamic>> updateProfile(
    Map<String, dynamic> updateData,
  ) async {
    try {
      final response = await _apiClient.sendRequest(
        'PUT',
        ApiEndpoints.profile,
        body: jsonEncode(updateData),
      );

      final data = jsonDecode(response.body);
      if (response.statusCode == 200 &&
          data != null &&
          data['success'] == true) {
        final profile = Profile.fromJson(
          data['profile'] as Map<String, dynamic>?,
        );
        final score = data['score'] as int? ?? 0;
        final qualifies = data['qualifiesForLeaderboard'] as bool? ?? false;
        final itemsList = data['items'] as List? ?? [];
        final checklist = itemsList
            .map((i) => ChecklistItem.fromJson(i as Map<String, dynamic>?))
            .toList();

        return {
          'success': true,
          'profile': profile,
          'score': score,
          'qualifiesForLeaderboard': qualifies,
          'checklist': checklist,
        };
      }
      return {
        'success': false,
        'error': data?['error'] ?? 'Profile update failed.',
      };
    } catch (e) {
      return {'success': false, 'error': e.toString()};
    }
  }

  Future<Map<String, dynamic>> uploadAvatar(
    String base64Image,
    String mimeType,
  ) async {
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
      if (response.statusCode == 200 &&
          data != null &&
          data['success'] == true) {
        return {'success': true, 'url': data['url']};
      }
      return {
        'success': false,
        'error': data?['error'] ?? 'Avatar upload failed.',
      };
    } catch (e) {
      return {'success': false, 'error': e.toString()};
    }
  }

  Future<Map<String, dynamic>> tapProfile(
    int otherProfileId,
    String via,
  ) async {
    try {
      final response = await _apiClient.sendRequest(
        'POST',
        ApiEndpoints.tap,
        body: jsonEncode({'otherProfileId': otherProfileId, 'via': via}),
      );

      final data = jsonDecode(response.body);
      if (response.statusCode == 200 && data != null) {
        return {
          'success': data['success'] ?? false,
          'diamonds': data['diamonds']?.toString() ?? '0',
          'score': data['score'] as int? ?? 0,
        };
      }
      return {
        'success': false,
        'error': data?['error'] ?? 'Tap profile failed.',
      };
    } catch (e) {
      return {'success': false, 'error': e.toString()};
    }
  }

  Future<List<HistoryEvent>> getHistory() async {
    try {
      final response = await _apiClient.sendRequest(
        'GET',
        ApiEndpoints.history,
      );
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data != null && data['success'] == true) {
          final list = data['events'] as List? ?? [];
          await _cache.saveJson(CacheKeys.history, list);
          return list
              .map((h) => HistoryEvent.fromJson(h as Map<String, dynamic>?))
              .toList();
        }
      }
    } catch (e, stackTrace) {
      debugPrint('[EXCEPTION] getHistory error: $e\n$stackTrace');
      if (_isNetworkError(e)) {
        final cached = _cache.loadJson(CacheKeys.history);
        if (cached != null) {
          debugPrint('[OFFLINE-CACHE] Returning cached history');
          final list = cached as List;
          return list
              .map((h) => HistoryEvent.fromJson(h as Map<String, dynamic>?))
              .toList();
        }
      }
    }
    return [];
  }

  Future<List<Profile>> getLeaderboard() async {
    try {
      final response = await _apiClient.sendRequest(
        'GET',
        ApiEndpoints.leaderboard,
      );
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data != null && data['success'] == true) {
          final list = data['leaderboard'] as List? ?? [];
          await _cache.saveJson(CacheKeys.leaderboard, list);
          return list
              .map((p) => Profile.fromJson(p as Map<String, dynamic>?))
              .toList();
        }
      }
    } catch (e, stackTrace) {
      debugPrint('[EXCEPTION] getLeaderboard error: $e\n$stackTrace');
      if (_isNetworkError(e)) {
        final cached = _cache.loadJson(CacheKeys.leaderboard);
        if (cached != null) {
          debugPrint('[OFFLINE-CACHE] Returning cached leaderboard');
          final list = cached as List;
          return list
              .map((p) => Profile.fromJson(p as Map<String, dynamic>?))
              .toList();
        }
      }
    }
    return [];
  }

  Future<Map<String, dynamic>?> checkLatestVersion() async {
    try {
      final response = await _apiClient.sendRequest(
        'GET',
        ApiEndpoints.version,
        authenticated: false,
      );
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
      final path =
          '${ApiEndpoints.lookup}?username=${Uri.encodeComponent(username)}';
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
        body: jsonEncode({'receiverUsername': targetUsername, 'via': via}),
      );

      final data = jsonDecode(response.body);
      if (response.statusCode == 200 && data != null) {
        return {
          'success': data['success'] ?? false,
          'status': data['status'],
          'connectionId': data['connectionId'],
        };
      }
      return {
        'success': false,
        'error': data?['error'] ?? 'Connection request failed.',
      };
    } catch (e) {
      return {'success': false, 'error': e.toString()};
    }
  }

  Future<Map<String, dynamic>> acceptRequest(
    int requestId, [
    ConnectionPermissionData? settings,
  ]) async {
    return acceptConnection(requestId, settings);
  }

  Future<Map<String, dynamic>> rejectRequest(int requestId) async {
    return rejectConnection(requestId);
  }

  Future<List<PendingRequest>> getPendingRequests() async {
    try {
      final response = await _apiClient.sendRequest(
        'GET',
        ApiEndpoints.connectionRequests,
      );
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data != null && data['success'] == true) {
          final list = data['requests'] as List? ?? [];
          await _cache.saveJson(CacheKeys.pendingRequests, list);
          return list
              .map((i) => PendingRequest.fromJson(i as Map<String, dynamic>?))
              .toList();
        }
      }
    } catch (e) {
      if (_isNetworkError(e)) {
        final cached = _cache.loadJson(CacheKeys.pendingRequests);
        if (cached != null) {
          debugPrint('[OFFLINE-CACHE] Returning cached pending requests');
          final list = cached as List;
          return list
              .map((i) => PendingRequest.fromJson(i as Map<String, dynamic>?))
              .toList();
        }
      }
    }
    return [];
  }

  Future<Map<String, dynamic>> acceptConnection(
    int requestId, [
    ConnectionPermissionData? settings,
  ]) async {
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
      if (response.statusCode == 200 &&
          data != null &&
          data['success'] == true) {
        return {'success': true};
      }
      return {
        'success': false,
        'error': data?['error'] ?? 'Accept request failed.',
      };
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
      if (response.statusCode == 200 &&
          data != null &&
          data['success'] == true) {
        return {'success': true};
      }
      return {
        'success': false,
        'error': data?['error'] ?? 'Reject request failed.',
      };
    } catch (e) {
      return {'success': false, 'error': e.toString()};
    }
  }

  Future<Map<String, dynamic>> removeConnection({
    int? connectionId,
    int? targetUserId,
    String? targetUsername,
  }) async {
    try {
      final bodyMap = <String, dynamic>{};
      if (connectionId != null && connectionId > 0) {
        bodyMap['connectionId'] = connectionId;
      }
      if (targetUserId != null && targetUserId > 0) {
        bodyMap['targetUserId'] = targetUserId;
      }
      if (targetUsername != null && targetUsername.isNotEmpty) {
        bodyMap['targetUsername'] = targetUsername;
      }

      final response = await _apiClient.sendRequest(
        'POST',
        ApiEndpoints.connectionRemove,
        body: jsonEncode(bodyMap),
      );

      final data = jsonDecode(response.body);
      if (response.statusCode == 200 &&
          data != null &&
          data['success'] == true) {
        return {'success': true};
      }
      return {
        'success': false,
        'error': data?['error'] ?? 'Remove connection failed.',
      };
    } catch (e) {
      return {'success': false, 'error': e.toString()};
    }
  }

  Future<List<Connection>> getConnections() async {
    try {
      final response = await _apiClient.sendRequest(
        'GET',
        ApiEndpoints.connections,
      );
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data != null && data['success'] == true) {
          final list = data['connections'] as List? ?? [];
          await _cache.saveJson(CacheKeys.connections, list);
          return list
              .map((c) => Connection.fromJson(c as Map<String, dynamic>?))
              .toList();
        }
      }
    } catch (e) {
      if (_isNetworkError(e)) {
        final cached = _cache.loadJson(CacheKeys.connections);
        if (cached != null) {
          debugPrint('[OFFLINE-CACHE] Returning cached connections');
          final list = cached as List;
          return list
              .map((c) => Connection.fromJson(c as Map<String, dynamic>?))
              .toList();
        }
      }
    }
    return [];
  }

  Future<ConnectionPermissionData?> getSharingSettings() async {
    try {
      final response = await _apiClient.sendRequest(
        'GET',
        ApiEndpoints.connectionSettings,
      );
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data != null && data['success'] == true) {
          await _cache.saveJson(CacheKeys.sharingSettings, data['settings']);
          return ConnectionPermissionData.fromJson(
            data['settings'] as Map<String, dynamic>?,
          );
        }
      }
    } catch (e) {
      if (_isNetworkError(e)) {
        final cached = _cache.loadJson(CacheKeys.sharingSettings);
        if (cached != null) {
          debugPrint('[OFFLINE-CACHE] Returning cached sharing settings');
          return ConnectionPermissionData.fromJson(
            cached as Map<String, dynamic>?,
          );
        }
      }
    }
    return null;
  }

  Future<Map<String, dynamic>> saveSharingSettings(
    ConnectionPermissionData settings,
  ) async {
    try {
      final response = await _apiClient.sendRequest(
        'PUT',
        ApiEndpoints.connectionSettings,
        body: jsonEncode({'settings': settings.toJson()}),
      );

      final data = jsonDecode(response.body);
      if (response.statusCode == 200 &&
          data != null &&
          data['success'] == true) {
        // Update cache with newly saved settings
        await _cache.saveJson(CacheKeys.sharingSettings, data['settings']);
        return {
          'success': true,
          'settings': ConnectionPermissionData.fromJson(
            data['settings'] as Map<String, dynamic>?,
          ),
        };
      }
      return {
        'success': false,
        'error': data?['error'] ?? 'Save settings failed.',
      };
    } catch (e) {
      return {'success': false, 'error': e.toString()};
    }
  }

  Future<Map<String, dynamic>> updateSharingSettings(
    ConnectionPermissionData settings,
  ) async {
    return saveSharingSettings(settings);
  }

  Future<Map<String, dynamic>> updateConnectionVisibility(
    int connectionId,
    ConnectionPermissionData settings,
  ) async {
    try {
      final response = await _apiClient.sendRequest(
        'POST',
        ApiEndpoints.connectionVisibility,
        body: jsonEncode({'connectionId': connectionId, ...settings.toJson()}),
      );

      final data = jsonDecode(response.body);
      if (response.statusCode == 200 &&
          data != null &&
          data['success'] == true) {
        return {'success': true};
      }
      return {
        'success': false,
        'error': data?['error'] ?? 'Visibility update failed.',
      };
    } catch (e) {
      return {'success': false, 'error': e.toString()};
    }
  }

  Future<Map<String, dynamic>> deleteAccount() async {
    try {
      final response = await _apiClient.sendRequest('DELETE', ApiEndpoints.me);
      final data = jsonDecode(response.body);
      if (response.statusCode == 200 &&
          data != null &&
          data['success'] == true) {
        await _storage.clearJwtToken();
        return {'success': true};
      }
      return {
        'success': false,
        'error': data?['error'] ?? 'Account deletion failed.',
      };
    } catch (e) {
      return {'success': false, 'error': e.toString()};
    }
  }

  Future<List<AppNotification>> getNotifications({
    bool unreadOnly = false,
  }) async {
    try {
      final query = unreadOnly ? '?unread=true' : '';
      final response = await _apiClient.sendRequest(
        'GET',
        '${ApiEndpoints.notifications}$query',
      );
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data != null &&
            data['success'] == true &&
            data['notifications'] != null) {
          final list = data['notifications'] as List? ?? [];
          // Only cache the full (non-filtered) notification list
          if (!unreadOnly) {
            await _cache.saveJson(CacheKeys.notifications, list);
          }
          return list
              .map((n) => AppNotification.fromJson(n as Map<String, dynamic>))
              .toList();
        }
      }
    } catch (e) {
      if (_isNetworkError(e)) {
        final cached = _cache.loadJson(CacheKeys.notifications);
        if (cached != null) {
          debugPrint('[OFFLINE-CACHE] Returning cached notifications');
          final list = cached as List;
          return list
              .map((n) => AppNotification.fromJson(n as Map<String, dynamic>))
              .toList();
        }
      }
    }
    return [];
  }

  Future<int> getUnreadNotificationCount() async {
    try {
      final response = await _apiClient.sendRequest(
        'GET',
        ApiEndpoints.unreadNotificationCount,
      );
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
      await _apiClient.sendRequest(
        'POST',
        ApiEndpoints.readNotification,
        body: jsonEncode({'id': id}),
      );
    } catch (_) {}
  }

  Future<void> markAllNotificationsRead() async {
    try {
      await _apiClient.sendRequest(
        'POST',
        ApiEndpoints.readNotification,
        body: jsonEncode({'all': true}),
      );
    } catch (_) {}
  }

  Future<void> deleteNotification(int id) async {
    try {
      await _apiClient.sendRequest(
        'DELETE',
        '${ApiEndpoints.notifications}/$id',
      );
    } catch (_) {}
  }

  Future<Map<String, dynamic>> registerFcmToken(String fcmToken) async {
    try {
      final response = await _apiClient.sendRequest(
        'POST',
        ApiEndpoints.fcmRegisterToken,
        body: jsonEncode({
          'fcmToken': fcmToken,
          'deviceType': defaultTargetPlatform == TargetPlatform.iOS
              ? 'ios'
              : 'android',
        }),
      );

      final data = jsonDecode(response.body);
      if (response.statusCode == 200 &&
          data != null &&
          data['success'] == true) {
        return {'success': true};
      }
      return {
        'success': false,
        'error': data?['error'] ?? 'Token registration failed.',
      };
    } catch (e) {
      return {'success': false, 'error': e.toString()};
    }
  }

  // ─── Theme / Customizer ───────────────────────────────────────────────────

  Future<Map<String, dynamic>> getTheme() async {
    try {
      final response = await _apiClient.sendRequest('GET', ApiEndpoints.theme);
      final data = jsonDecode(response.body);
      if (response.statusCode == 200 &&
          data != null &&
          data['success'] == true) {
        await _cache.saveJson(CacheKeys.theme, data['theme']);
        return {'success': true, 'theme': data['theme']};
      }
      return {
        'success': false,
        'error': data?['error'] ?? 'Failed to load theme.',
      };
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
      if (response.statusCode == 200 &&
          data != null &&
          data['success'] == true) {
        return {'success': true, 'theme': data['theme']};
      }
      return {
        'success': false,
        'error': data?['error'] ?? 'Failed to save theme.',
      };
    } catch (e) {
      return {'success': false, 'error': e.toString()};
    }
  }

  Future<Map<String, dynamic>> resetTheme() async {
    try {
      final response = await _apiClient.sendRequest(
        'POST',
        ApiEndpoints.themeReset,
      );
      final data = jsonDecode(response.body);
      if (response.statusCode == 200 &&
          data != null &&
          data['success'] == true) {
        return {'success': true, 'theme': data['theme']};
      }
      return {
        'success': false,
        'error': data?['error'] ?? 'Failed to reset theme.',
      };
    } catch (e) {
      return {'success': false, 'error': e.toString()};
    }
  }

  Future<Map<String, dynamic>> getMarketplaceThemes({
    String filter = 'trending',
  }) async {
    try {
      final response = await _apiClient.sendRequest(
        'GET',
        '${ApiEndpoints.themeMarketplace}?filter=$filter',
      );
      final data = jsonDecode(response.body);
      if (response.statusCode == 200 &&
          data != null &&
          data['success'] == true) {
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
        body: jsonEncode({
          'action': 'publish',
          'themeName': name,
          'settings': settings,
        }),
      );
      final data = jsonDecode(response.body);
      if (response.statusCode == 200 &&
          data != null &&
          data['success'] == true) {
        return {'success': true};
      }
      return {
        'success': false,
        'error': data?['error'] ?? 'Failed to publish.',
      };
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
      if (response.statusCode == 200 &&
          data != null &&
          data['success'] == true) {
        return {'success': true, 'theme': data['theme']};
      }
      return {
        'success': false,
        'error': data?['error'] ?? 'Failed to install.',
      };
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

  // ═══════════════════════════════════════════════════════════════
  // Multi-Card System API Methods (Fail-Safe Local + Server Sync)
  // ═══════════════════════════════════════════════════════════════

  List<CardItem> _loadLocalCards() {
    try {
      final cached = _cache.loadJson(CacheKeys.cards);
      if (cached is List && cached.isNotEmpty) {
        return cached
            .map((c) => CardItem.fromJson(c as Map<String, dynamic>))
            .toList();
      }
      final raw = _storage.getString('user_custom_cards');
      if (raw != null && raw.isNotEmpty) {
        final list = jsonDecode(raw) as List;
        return list
            .map((c) => CardItem.fromJson(c as Map<String, dynamic>))
            .toList();
      }
    } catch (e) {
      debugPrint('[ApiService] _loadLocalCards error: $e');
    }
    return [];
  }

  CardItem? _loadLocalActiveCard() {
    try {
      final cached = _cache.loadJson(CacheKeys.activeCard);
      if (cached is Map<String, dynamic>) {
        return CardItem.fromJson(cached);
      }
    } catch (_) {}
    return null;
  }

  Future<void> _saveLocalCards(
    List<CardItem> cards,
    CardItem? activeCard,
  ) async {
    try {
      await _cache.saveJson(
        CacheKeys.cards,
        cards.map((c) => c.toJson()).toList(),
      );
      await _storage.setString(
        'user_custom_cards',
        jsonEncode(cards.map((c) => c.toJson()).toList()),
      );
      if (activeCard != null) {
        await _cache.saveJson(CacheKeys.activeCard, activeCard.toJson());
      }
    } catch (e) {
      debugPrint('[ApiService] _saveLocalCards error: $e');
    }
  }

  CardItem _synthesizeDefaultCard() {
    String name = '';
    String tagline = '';
    String bio = '';
    String? avatar;
    try {
      final cachedProfile = _cache.loadJson(CacheKeys.profile);
      if (cachedProfile is Map<String, dynamic>) {
        final pMap = cachedProfile['profile'] is Map<String, dynamic>
            ? cachedProfile['profile'] as Map<String, dynamic>
            : cachedProfile;
        name = pMap['name']?.toString() ?? '';
        tagline = pMap['tagline']?.toString() ?? tagline;
        bio = pMap['bio']?.toString() ?? bio;
        avatar = pMap['avatar']?.toString() ?? avatar;
      }
    } catch (_) {}

    return CardItem(
      id: 'card_default',
      userId: 0,
      publicToken: '',
      name: name.isNotEmpty ? name : 'Personal Card',
      title: 'Personal Card',
      designation: tagline,
      tagline: tagline,
      bio: bio,
      avatar: avatar,
      themeColor: '0xFF0052FF',
      skills: const ['Technology & IT', 'Design & Creativity'],
      collectLeads: false,
      isDefault: true,
      isActive: true,
      updatedAt: DateTime.now(),
    );
  }

  /// Fetches all cards for the authenticated user, combining local cache with server sync.
  Future<Map<String, dynamic>> getCards({bool forceRefresh = false}) async {
    // 1. Load local cards first
    var localCards = _loadLocalCards();
    var activeCard =
        _loadLocalActiveCard() ??
        (localCards.isNotEmpty
            ? localCards.firstWhere(
                (c) => c.isActive,
                orElse: () => localCards.first,
              )
            : null);

    // If local is completely empty, synthesize a default card so the app is never empty
    if (localCards.isEmpty) {
      final defaultCard = _synthesizeDefaultCard();
      localCards = [defaultCard];
      activeCard = defaultCard;
      await _saveLocalCards(localCards, activeCard);
    } else {
      // Heal any local cards that have 'My Card' as name using cached profile
      try {
        final cachedProfile = _cache.loadJson(CacheKeys.profile);
        if (cachedProfile is Map<String, dynamic>) {
          final pMap = cachedProfile['profile'] is Map<String, dynamic>
              ? cachedProfile['profile'] as Map<String, dynamic>
              : cachedProfile;
          final realName = pMap['name']?.toString();
          if (realName != null && realName.trim().isNotEmpty && realName != 'My Card') {
            bool modified = false;
            localCards = localCards.map((c) {
              if (c.name == 'My Card' || c.name.isEmpty) {
                modified = true;
                return c.copyWith(name: realName);
              }
              return c;
            }).toList();
            if (activeCard != null && (activeCard.name == 'My Card' || activeCard.name.isEmpty)) {
              activeCard = activeCard.copyWith(name: realName);
              modified = true;
            }
            if (modified) {
              await _saveLocalCards(localCards, activeCard);
            }
          }
        }
      } catch (_) {}
    }

    // 2. Try server sync in background or immediately
    try {
      final response = await _apiClient.sendRequest('GET', ApiEndpoints.cards);
      final data = jsonDecode(response.body);

      if (response.statusCode == 200 &&
          data != null &&
          data['success'] == true) {
        final rawCards = data['cards'] as List<dynamic>? ?? [];
        if (rawCards.isNotEmpty) {
          var serverCards = rawCards
              .map((c) => CardItem.fromJson(c as Map<String, dynamic>))
              .toList();

          CardItem? serverActive;
          if (data['activeCard'] != null) {
            serverActive = CardItem.fromJson(
              data['activeCard'] as Map<String, dynamic>,
            );
          } else {
            serverActive = serverCards.firstWhere(
              (c) => c.isActive,
              orElse: () => serverCards.first,
            );
          }

          // Heal any server cards that have 'My Card' as name using profile
          try {
            final cachedProfile = _cache.loadJson(CacheKeys.profile);
            if (cachedProfile is Map<String, dynamic>) {
              final pMap = cachedProfile['profile'] is Map<String, dynamic>
                  ? cachedProfile['profile'] as Map<String, dynamic>
                  : cachedProfile;
              final realName = pMap['name']?.toString();
              if (realName != null && realName.trim().isNotEmpty && realName != 'My Card') {
                serverCards = serverCards.map((c) {
                  if (c.name == 'My Card' || c.name.isEmpty) {
                    return c.copyWith(name: realName);
                  }
                  return c;
                }).toList();
                if (serverActive != null && (serverActive.name == 'My Card' || serverActive.name.isEmpty)) {
                  serverActive = serverActive.copyWith(name: realName);
                }
              }
            }
          } catch (_) {}

          await _saveLocalCards(serverCards, serverActive);

          return {
            'cards': serverCards,
            'activeCard': serverActive,
            'activeCardId': serverActive?.id,
            'defaultCard': data['defaultCard'] != null
                ? CardItem.fromJson(data['defaultCard'] as Map<String, dynamic>)
                : null,
          };
        }
      }
    } catch (e) {
      debugPrint('[ApiService] getCards server fetch error: $e');
    }

    return {
      'cards': localCards,
      'activeCard': activeCard,
      'activeCardId': activeCard?.id,
      'defaultCard': localCards.firstWhere(
        (c) => c.isDefault,
        orElse: () => localCards.first,
      ),
    };
  }

  /// Retrieves the current active card from server or cache.
  Future<CardItem?> getActiveCard({bool forceRefresh = false}) async {
    final cachedActive = _loadLocalActiveCard();
    if (!forceRefresh && cachedActive != null) {
      return cachedActive;
    }

    try {
      final response = await _apiClient.sendRequest(
        'GET',
        ApiEndpoints.cardsActive,
      );
      final data = jsonDecode(response.body);
      if (response.statusCode == 200 &&
          data != null &&
          data['success'] == true &&
          data['activeCard'] != null) {
        final card = CardItem.fromJson(
          data['activeCard'] as Map<String, dynamic>,
        );
        await _cache.saveJson(CacheKeys.activeCard, card.toJson());
        return card;
      }
    } catch (e) {
      debugPrint('[ApiService] getActiveCard error: $e');
    }

    return cachedActive ?? (await getCards())['activeCard'] as CardItem?;
  }

  /// Creates a new card locally and syncs with server.
  Future<Map<String, dynamic>> createCard({
    required String title,
    required String designation,
    String? tagline,
    String? bio,
    String? avatar,
    List<String> skills = const [],
    String themeColor = '0xFF0052FF',
    bool collectLeads = false,
    String? name,
  }) async {
    final localCards = _loadLocalCards();
    final isFirstCard = localCards.isEmpty;
    final id = 'card_${DateTime.now().millisecondsSinceEpoch}';
    final token =
        'tok_${DateTime.now().millisecondsSinceEpoch}_${(1000 + (DateTime.now().microsecond % 9000))}';

    String resolvedName = name ?? '';
    if (resolvedName.isEmpty || resolvedName == 'My Card') {
      try {
        final cachedProfile = _cache.loadJson(CacheKeys.profile);
        if (cachedProfile is Map<String, dynamic>) {
          final pMap = cachedProfile['profile'] is Map<String, dynamic>
              ? cachedProfile['profile'] as Map<String, dynamic>
              : cachedProfile;
          resolvedName = pMap['name']?.toString() ?? '';
        }
      } catch (_) {}
    }
    if (resolvedName.isEmpty) {
      resolvedName = localCards.isNotEmpty && localCards.first.name != 'My Card'
          ? localCards.first.name
          : 'Personal Card';
    }

    final localCard = CardItem(
      id: id,
      userId: 0,
      publicToken: token,
      name: resolvedName,
      title: title,
      designation: designation,
      tagline: tagline ?? designation,
      bio: bio ?? '',
      avatar:
          avatar ?? (localCards.isNotEmpty ? localCards.first.avatar : null),
      skills: skills,
      themeColor: themeColor,
      collectLeads: collectLeads,
      isDefault: isFirstCard,
      isActive: isFirstCard,
      updatedAt: DateTime.now(),
    );

    // Save locally immediately
    final updatedList = [...localCards, localCard];
    CardItem? activeCard = _loadLocalActiveCard();
    if (isFirstCard || activeCard == null) {
      activeCard = localCard;
    }
    await _saveLocalCards(updatedList, activeCard);

    // Background server sync
    try {
      final response = await _apiClient.sendRequest(
        'POST',
        ApiEndpoints.cards,
        body: jsonEncode({
          'title': title,
          'designation': designation,
          'tagline': tagline ?? designation,
          'bio': bio ?? '',
          'avatar': avatar,
          'skills': skills,
          'themeColor': themeColor,
          'collectLeads': collectLeads,
          if (name != null && name.isNotEmpty) 'name': name,
        }),
      );
      final data = jsonDecode(response.body);
      if (response.statusCode == 200 &&
          data != null &&
          data['success'] == true &&
          data['card'] != null) {
        final serverCard = CardItem.fromJson(
          data['card'] as Map<String, dynamic>,
        );
        final syncedList = updatedList
            .map((c) => c.id == id ? serverCard : c)
            .toList();
        await _saveLocalCards(
          syncedList,
          activeCard.id == id ? serverCard : activeCard,
        );
        return {'success': true, 'card': serverCard};
      }
    } catch (e) {
      debugPrint('[ApiService] createCard server sync error: $e');
    }

    return {'success': true, 'card': localCard};
  }

  /// Updates an existing card locally and syncs with server.
  Future<Map<String, dynamic>> updateCard({
    required String id,
    String? title,
    String? designation,
    String? tagline,
    String? bio,
    String? avatar,
    List<String>? skills,
    String? themeColor,
    bool? collectLeads,
    bool? isDefault,
    String? name,
  }) async {
    final localCards = _loadLocalCards();
    CardItem? updatedCard;
    final updatedList = localCards.map((c) {
      if (c.id == id) {
        updatedCard = c.copyWith(
          title: title ?? c.title,
          designation: designation ?? c.designation,
          tagline: tagline ?? c.tagline,
          bio: bio ?? c.bio,
          avatar: avatar ?? c.avatar,
          skills: skills ?? c.skills,
          themeColor: themeColor ?? c.themeColor,
          collectLeads: collectLeads ?? c.collectLeads,
          isDefault: isDefault ?? c.isDefault,
          name: name ?? c.name,
          updatedAt: DateTime.now(),
        );
        return updatedCard!;
      }
      return c;
    }).toList();

    if (updatedCard != null) {
      CardItem? activeCard = _loadLocalActiveCard();
      if (activeCard?.id == id) {
        activeCard = updatedCard;
      }
      await _saveLocalCards(updatedList, activeCard);
    }

    // Try server sync
    try {
      final Map<String, dynamic> body = {};
      if (title != null) body['title'] = title;
      if (designation != null) body['designation'] = designation;
      if (tagline != null) body['tagline'] = tagline;
      if (bio != null) body['bio'] = bio;
      if (avatar != null) body['avatar'] = avatar;
      if (skills != null) body['skills'] = skills;
      if (themeColor != null) body['themeColor'] = themeColor;
      if (collectLeads != null) body['collectLeads'] = collectLeads;
      if (isDefault != null) body['isDefault'] = isDefault;
      if (name != null) body['name'] = name;

      final response = await _apiClient.sendRequest(
        'PATCH',
        ApiEndpoints.cardById(id),
        body: jsonEncode(body),
      );
      final data = jsonDecode(response.body);
      if (response.statusCode == 200 &&
          data != null &&
          data['success'] == true &&
          data['card'] != null) {
        final serverCard = CardItem.fromJson(
          data['card'] as Map<String, dynamic>,
        );
        return {'success': true, 'card': serverCard};
      }
    } catch (e) {
      debugPrint('[ApiService] updateCard server sync error: $e');
    }

    return {'success': true, 'card': updatedCard};
  }

  /// Atomically activates a card locally and syncs with server.
  Future<Map<String, dynamic>> setActiveCard(String id) async {
    final localCards = _loadLocalCards();
    CardItem? newActive;
    final updatedList = localCards.map((c) {
      final isTarget = c.id == id;
      if (isTarget) {
        newActive = c.copyWith(isActive: true, updatedAt: DateTime.now());
        return newActive!;
      }
      return c.copyWith(isActive: false);
    }).toList();

    if (newActive != null) {
      await _saveLocalCards(updatedList, newActive);
    }

    // Server sync
    try {
      final response = await _apiClient.sendRequest(
        'POST',
        ApiEndpoints.cardActivate(id),
      );
      final data = jsonDecode(response.body);
      if (response.statusCode == 200 &&
          data != null &&
          data['success'] == true &&
          data['activeCard'] != null) {
        final serverActive = CardItem.fromJson(
          data['activeCard'] as Map<String, dynamic>,
        );
        return {'success': true, 'activeCard': serverActive};
      }
    } catch (e) {
      debugPrint('[ApiService] setActiveCard server sync error: $e');
    }

    return {'success': true, 'activeCard': newActive};
  }

  /// Deletes a card locally and syncs with server.
  Future<Map<String, dynamic>> deleteCard(String id) async {
    final localCards = _loadLocalCards();
    final updatedList = localCards.where((c) => c.id != id).toList();

    CardItem? newActive = _loadLocalActiveCard();
    if (newActive?.id == id) {
      newActive = updatedList.isNotEmpty
          ? updatedList.firstWhere(
              (c) => c.isDefault,
              orElse: () => updatedList.first,
            )
          : null;
      if (newActive != null) {
        newActive = newActive.copyWith(isActive: true);
        final finalIdx = updatedList.indexWhere((c) => c.id == newActive!.id);
        if (finalIdx >= 0) {
          updatedList[finalIdx] = newActive;
        }
      }
    }

    await _saveLocalCards(updatedList, newActive);

    // Try server sync
    try {
      final response = await _apiClient.sendRequest(
        'DELETE',
        ApiEndpoints.cardById(id),
      );
      final data = jsonDecode(response.body);
      if (response.statusCode == 200 &&
          data != null &&
          data['success'] == true) {
        return {'success': true, 'activeCard': newActive};
      }
    } catch (e) {
      debugPrint('[ApiService] deleteCard server sync error: $e');
    }

    return {'success': true, 'activeCard': newActive};
  }

  /// Toggles collect leads for a card.
  Future<bool> toggleCardLeadCapture(String cardId, bool enabled) async {
    final res = await updateCard(id: cardId, collectLeads: enabled);
    return res['success'] == true;
  }

  /// Duplicates an existing card with a new title and unique token.
  Future<Map<String, dynamic>> duplicateCard(CardItem original) async {
    return createCard(
      title: '${original.title} Copy',
      designation: original.designation,
      tagline: original.tagline,
      bio: original.bio,
      avatar: original.avatar,
      skills: original.skills,
      themeColor: original.themeColor,
      collectLeads: original.collectLeads,
      name: original.name,
    );
  }
}

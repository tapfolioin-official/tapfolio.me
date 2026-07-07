import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import '../core/api/api_client.dart';
import '../core/api/api_endpoints.dart';
import '../core/storage/local_storage.dart';
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

  String get baseUrl => _apiClient.baseUrl;
  bool get isAuthenticated => _storage.isAuthenticated;

  Future<void> init() async {
    await _storage.init();
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
  }

  Future<User?> getMe() async {
    try {
      final response = await _apiClient.sendRequest('GET', ApiEndpoints.me);
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data != null && data['success'] == true && data['user'] != null) {
          return User.fromJson(data['user'] as Map<String, dynamic>?);
        }
      }
    } catch (e, stackTrace) {
      debugPrint('[EXCEPTION] getMe error: $e\n$stackTrace');
    }
    return null;
  }

  Future<Map<String, dynamic>?> getProfile({int? userId, int? profileId}) async {
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
          };
        }
      }
    } catch (e, stackTrace) {
      debugPrint('[EXCEPTION] getProfile error: $e\n$stackTrace');
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
          return list.map((h) => HistoryEvent.fromJson(h as Map<String, dynamic>?)).toList();
        }
      }
    } catch (e, stackTrace) {
      debugPrint('[EXCEPTION] getHistory error: $e\n$stackTrace');
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
          return list.map((p) => Profile.fromJson(p as Map<String, dynamic>?)).toList();
        }
      }
    } catch (e, stackTrace) {
      debugPrint('[EXCEPTION] getLeaderboard error: $e\n$stackTrace');
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
            'profile': Profile.fromJson(data['profile'] as Map<String, dynamic>?),
            'status': data['status'],
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
          return list.map((i) => PendingRequest.fromJson(i as Map<String, dynamic>?)).toList();
        }
      }
    } catch (_) {}
    return [];
  }

  Future<Map<String, dynamic>> acceptConnection(int requestId, [ConnectionPermissionData? settings]) async {
    try {
      final response = await _apiClient.sendRequest(
        'POST',
        ApiEndpoints.connectionAccept,
        body: jsonEncode({
          'requestId': requestId,
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
        body: jsonEncode({'requestId': requestId}),
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
          return list.map((c) => Connection.fromJson(c as Map<String, dynamic>?)).toList();
        }
      }
    } catch (_) {}
    return [];
  }

  Future<ConnectionPermissionData?> getSharingSettings() async {
    try {
      final response = await _apiClient.sendRequest('GET', ApiEndpoints.connectionSettings);
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data != null && data['success'] == true) {
          return ConnectionPermissionData.fromJson(data['settings'] as Map<String, dynamic>?);
        }
      }
    } catch (_) {}
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
          return list.map((n) => AppNotification.fromJson(n as Map<String, dynamic>)).toList();
        }
      }
    } catch (_) {}
    return [];
  }

  Future<int> getUnreadNotificationCount() async {
    try {
      final response = await _apiClient.sendRequest('GET', ApiEndpoints.unreadNotificationCount);
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data != null && data['success'] == true && data['count'] != null) {
          return data['count'] as int? ?? 0;
        }
      }
    } catch (_) {}
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
}

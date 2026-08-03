import 'dart:convert';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'api_service.dart';

// Background message handler. Must be a top-level function.
@pragma('vm:entry-point')
Future<void> _firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  await Firebase.initializeApp();
  debugPrint('[PUSH] Background message: ${message.messageId}');
}

class PushNotificationService {
  static final PushNotificationService _instance = PushNotificationService._internal();
  factory PushNotificationService() => _instance;
  PushNotificationService._internal();

  FirebaseMessaging get _fcm => FirebaseMessaging.instance;
  final FlutterLocalNotificationsPlugin _localNotifications = FlutterLocalNotificationsPlugin();
  final ApiService _apiService = ApiService();

  bool _initialized = false;

  Future<void> init() async {
    if (_initialized) return;

    try {
      // On iOS, verify GoogleService-Info.plist is configured to prevent crash on launch.
      if (defaultTargetPlatform == TargetPlatform.iOS) {
        const channel = MethodChannel('me.tapfolio.app/config');
        final bool isConfigured = await channel.invokeMethod<bool>('isFirebaseConfigured') ?? false;
        if (!isConfigured) {
          debugPrint('[PUSH] GoogleService-Info.plist not found in bundle. Skipping Firebase initialization.');
          return;
        }
      }

      // 1. Initialize Firebase
      await Firebase.initializeApp();

      // 2. Register background handler
      FirebaseMessaging.onBackgroundMessage(_firebaseMessagingBackgroundHandler);

      // 3. Request permissions (Android 13+ / iOS)
      NotificationSettings settings = await _fcm.requestPermission(
        alert: true,
        badge: true,
        sound: true,
      );
      debugPrint('[PUSH] User permission status: ${settings.authorizationStatus}');

      // 4. Initialize Local Notifications (to display foreground notifications)
      const androidInit = AndroidInitializationSettings('@mipmap/ic_launcher');
      const iosInit = DarwinInitializationSettings(
        requestAlertPermission: true,
        requestBadgePermission: true,
        requestSoundPermission: true,
      );
      const initSettings = InitializationSettings(android: androidInit, iOS: iosInit);

      await _localNotifications.initialize(
        initSettings,
        onDidReceiveNotificationResponse: (NotificationResponse details) {
          debugPrint('[PUSH] Foreground notification clicked: ${details.payload}');
        },
      );

      // 5. Create Android Notification Channel with default sound enabled
      const AndroidNotificationChannel channel = AndroidNotificationChannel(
        'tapfolio_high_importance_channel', // id
        'Tapfolio Notifications', // title
        description: 'This channel is used for Tapfolio notifications.', // description
        importance: Importance.max,
        playSound: true,
        enableVibration: true,
      );

      await _localNotifications
          .resolvePlatformSpecificImplementation<AndroidFlutterLocalNotificationsPlugin>()
          ?.createNotificationChannel(channel);

      // 6. Set FCM presentation options for foreground
      await _fcm.setForegroundNotificationPresentationOptions(
        alert: true,
        badge: true,
        sound: true,
      );

      // 7. Handle foreground messages manually
      FirebaseMessaging.onMessage.listen((RemoteMessage message) {
        debugPrint('[PUSH] Foreground message received: ${message.notification?.title}');
        
        RemoteNotification? notification = message.notification;

        if (notification != null && !kIsWeb) {
          _localNotifications.show(
            notification.hashCode,
            notification.title,
            notification.body,
            NotificationDetails(
              android: AndroidNotificationDetails(
                channel.id,
                channel.name,
                channelDescription: channel.description,
                importance: Importance.max,
                priority: Priority.high,
                playSound: true,
                icon: '@mipmap/ic_launcher',
              ),
              iOS: const DarwinNotificationDetails(
                presentAlert: true,
                presentBadge: true,
                presentSound: true,
              ),
            ),
            payload: jsonEncode(message.data),
          );
        }
      });

      // 8. Handle when app is opened from a terminated state via push notification
      RemoteMessage? initialMessage = await _fcm.getInitialMessage();
      if (initialMessage != null) {
        debugPrint('[PUSH] App opened from terminated state via notification: ${initialMessage.messageId}');
      }

      // 9. Handle when app is opened from background via push notification
      FirebaseMessaging.onMessageOpenedApp.listen((RemoteMessage message) {
        debugPrint('[PUSH] App opened from background via notification: ${message.messageId}');
      });

      // 10. Get FCM token and register it
      await registerToken();

      // Listen for token refreshes
      _fcm.onTokenRefresh.listen((token) async {
        debugPrint('[PUSH] Token refreshed: $token');
        await _apiService.registerFcmToken(token);
      });

      _initialized = true;
      debugPrint('[PUSH] PushNotificationService initialized successfully.');
    } catch (e) {
      debugPrint('[PUSH] Initialization error: $e');
    }
  }

  Future<void> registerToken() async {
    try {
      if (!_apiService.isAuthenticated) {
        debugPrint('[PUSH] User not authenticated. Delaying FCM token registration.');
        return;
      }
      String? token = await _fcm.getToken();
      if (token != null) {
        debugPrint('[PUSH] FCM Token acquired: $token');
        final res = await _apiService.registerFcmToken(token);
        debugPrint('[PUSH] Registration response: $res');
      }
    } catch (e) {
      debugPrint('[PUSH] Error getting/registering token: $e');
    }
  }
}

import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'services/api_service.dart';
import 'services/deep_link_service.dart';
import 'services/push_notification_service.dart';
import 'screens/login_screen.dart';
import 'screens/main_navigation_shell.dart';
import 'screens/connect_screen.dart';
import 'screens/connections_screen.dart';
import 'screens/public_profile_screen.dart';
import 'screens/diagnostics/diagnostics_screen.dart';

final GlobalKey<NavigatorState> navigatorKey = GlobalKey<NavigatorState>();

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Print active API URL
  debugPrint('[MAIN] Active API URL: ${ApiService().baseUrl}');

  // Global Flutter Error Catcher
  FlutterError.onError = (details) {
    debugPrint(
      '[FLUTTER CRITICAL ERROR] Exception: ${details.exceptionAsString()}',
    );
    debugPrint('[FLUTTER CRITICAL ERROR] StackTrace: ${details.stack}');
  };

  // Global Platform Error Catcher
  PlatformDispatcher.instance.onError = (error, stack) {
    debugPrint('[PLATFORM CRITICAL ERROR] Error: ${error.toString()}');
    debugPrint('[PLATFORM CRITICAL ERROR] StackTrace: $stack');
    return true;
  };

  // Load stored JWT from SharedPreferences before anything else
  try {
    final apiService = ApiService();
    await apiService.init();
  } catch (e) {
    debugPrint('[MAIN] ApiService init error: $e');
  }

  // Render the UI immediately — never block on optional services
  runApp(const MyApp());

  // Initialize optional services in the background (non-blocking)
  try {
    PushNotificationService().init();
  } catch (e) {
    debugPrint('[MAIN] PushNotificationService init error: $e');
  }

  try {
    DeepLinkService().captureInitialLink();
  } catch (e) {
    debugPrint('[MAIN] DeepLinkService captureInitialLink error: $e');
  }
}

class MyApp extends StatefulWidget {
  const MyApp({super.key});

  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  final ApiService _apiService = ApiService();
  bool _checkingAuth = true;
  bool _isAuthenticated = false;

  @override
  void initState() {
    super.initState();
    _checkInitialAuth();
  }

  Future<void> _checkInitialAuth() async {
    debugPrint('[TRACE] _checkInitialAuth() started.');
    try {
      // Short-circuit: if no JWT is stored, we're definitely not authenticated
      if (!_apiService.isAuthenticated) {
        debugPrint(
          '[TRACE] _checkInitialAuth: No stored JWT — skipping getMe, showing login.',
        );
        setState(() {
          _isAuthenticated = false;
          _checkingAuth = false;
        });
      } else {
        debugPrint(
          '[TRACE] _checkInitialAuth: JWT present, validating via getMe.',
        );
        // Validate the stored JWT against the server
        final user = await _apiService.getMe();
        debugPrint(
          '[TRACE] _checkInitialAuth: getMe user result = ${user?.email}',
        );
        if (mounted) {
          setState(() {
            _isAuthenticated = user != null;
            _checkingAuth = false;
          });
        }
        if (user != null) {
          debugPrint(
            '[TRACE] _checkInitialAuth: Valid user session found, calling registerToken.',
          );
          PushNotificationService().registerToken();
        } else {
          debugPrint(
            '[TRACE] _checkInitialAuth: getMe returned null — JWT may be expired.',
          );
        }
      }
    } catch (e, stack) {
      debugPrint('[EXCEPTION] Initial check error: $e\n$stack');
      if (mounted) {
        setState(() {
          _isAuthenticated = false;
          _checkingAuth = false;
        });
      }
    }
    // Init deep link service after build so navigator is ready
    WidgetsBinding.instance.addPostFrameCallback((_) {
      DeepLinkService().init(navigatorKey);
    });
  }

  void _handleLoginSuccess() {
    debugPrint(
      '[TRACE] _handleLoginSuccess() triggered. Rebuilding to show MainNavigationShell.',
    );
    setState(() {
      _isAuthenticated = true;
    });
  }

  void _handleLogout() {
    debugPrint(
      '[TRACE] _handleLogout() triggered. Rebuilding to show LoginScreen.',
    );
    setState(() {
      _isAuthenticated = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Tapfolio',
      debugShowCheckedModeBanner: false,
      navigatorKey: navigatorKey,
      themeMode: ThemeMode.system,
      theme: ThemeData(
        brightness: Brightness.light,
        primaryColor: const Color(0xFF6366F1),
        scaffoldBackgroundColor: const Color(0xFFF3F4F6),
        textTheme: GoogleFonts.outfitTextTheme(
          ThemeData.light().textTheme.apply(
            bodyColor: const Color(0xFF1F2937),
            displayColor: const Color(0xFF111827),
          ),
        ),
        colorScheme: const ColorScheme.light(
          primary: Color(0xFF6366F1),
          secondary: Color(0xFFD946EF),
          surface: Colors.white,
          error: Colors.redAccent,
        ),
      ),
      darkTheme: ThemeData(
        brightness: Brightness.dark,
        primaryColor: const Color(0xFF6366F1),
        scaffoldBackgroundColor: const Color(0xFF06070D),
        textTheme: GoogleFonts.outfitTextTheme(
          ThemeData.dark().textTheme.apply(
            bodyColor: Colors.white,
            displayColor: Colors.white,
          ),
        ),
        colorScheme: const ColorScheme.dark(
          primary: Color(0xFF6366F1),
          secondary: Color(0xFFD946EF),
          surface: Color(0xFF0F1122),
          error: Colors.redAccent,
        ),
      ),
      onGenerateRoute: (settings) {
        if (settings.name == '/public-profile') {
          final username = settings.arguments as String? ?? '';
          return MaterialPageRoute(
            builder: (_) => PublicProfileScreen(username: username),
          );
        }
        if (settings.name == '/connect') {
          final username = settings.arguments as String? ?? '';
          return MaterialPageRoute(
            builder: (_) => ConnectScreen(username: username),
          );
        }
        if (settings.name == '/connections') {
          return MaterialPageRoute(builder: (_) => const ConnectionsScreen());
        }
        if (settings.name == '/login') {
          return MaterialPageRoute(
            builder: (_) => LoginScreen(
              onLoginSuccess: () {
                setState(() {
                  _isAuthenticated = true;
                });
                navigatorKey.currentState?.popUntil((r) => r.isFirst);
              },
            ),
          );
        }
        if (settings.name == '/diagnostics') {
          return MaterialPageRoute(builder: (_) => const DiagnosticsScreen());
        }
        return null;
      },
      home: _buildHome(),
    );
  }

  Widget _buildHome() {
    if (_checkingAuth) {
      return const Scaffold(
        backgroundColor: Color(0xFF0F0F16),
        body: Center(
          child: CircularProgressIndicator(color: Color(0xFF6366F1)),
        ),
      );
    }

    if (_isAuthenticated) {
      return MainNavigationShell(onLogout: _handleLogout);
    }

    return LoginScreen(onLoginSuccess: _handleLoginSuccess);
  }
}

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
 
final GlobalKey<NavigatorState> navigatorKey = GlobalKey<NavigatorState>();
 
void main() async {
  WidgetsFlutterBinding.ensureInitialized();

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
    try {
      // Short-circuit: if no JWT is stored, we're definitely not authenticated
      if (!_apiService.isAuthenticated) {
        debugPrint('[AUTH] No stored JWT — skipping getMe, showing login.');
        setState(() {
          _isAuthenticated = false;
          _checkingAuth = false;
        });
      } else {
        // Validate the stored JWT against the server
        final user = await _apiService.getMe();
        if (mounted) {
          setState(() {
            _isAuthenticated = user != null;
            _checkingAuth = false;
          });
        }
        if (user != null) {
          PushNotificationService().registerToken();
        } else {
          debugPrint('[AUTH] getMe returned null — JWT may be expired.');
        }
      }
    } catch (e) {
      debugPrint('[AUTH] Initial check error: $e');
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
    setState(() {
      _isAuthenticated = true;
    });
  }

  void _handleLogout() {
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
      theme: ThemeData(
        brightness: Brightness.dark,
        primaryColor: Colors.indigoAccent,
        scaffoldBackgroundColor: const Color(0xFF0F0F16),
        textTheme: GoogleFonts.outfitTextTheme(
          ThemeData.dark().textTheme,
        ),
        colorScheme: ColorScheme.fromSeed(
          seedColor: Colors.indigoAccent,
          brightness: Brightness.dark,
          surface: const Color(0xFF0F0F16),
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
          return MaterialPageRoute(
            builder: (_) => const ConnectionsScreen(),
          );
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
        // '/' — dashboard entry
        if (settings.name == '/') {
          return MaterialPageRoute(
            builder: (_) => MainNavigationShell(
              onLogout: _handleLogout,
            ),
          );
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
          child: CircularProgressIndicator(color: Colors.indigoAccent),
        ),
      );
    }

    if (_isAuthenticated) {
      return MainNavigationShell(onLogout: _handleLogout);
    }

    return LoginScreen(onLoginSuccess: _handleLoginSuccess);
  }
}

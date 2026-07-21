import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:google_sign_in/google_sign_in.dart';
import '../core/storage/local_storage.dart';
import '../services/api_service.dart';
import 'register_screen.dart';

class LoginScreen extends StatefulWidget {
  final VoidCallback onLoginSuccess;

  const LoginScreen({super.key, required this.onLoginSuccess});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final ApiService _apiService = ApiService();
  final GoogleSignIn _googleSignIn = GoogleSignIn(scopes: ['email']);

  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();

  bool _isLoading = false;
  bool _obscurePassword = true;
  String? _errorMessage;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  // Helper to log key session details upon successful login
  void _logAuthSuccess() {
    try {
      final token = LocalStorage().jwtToken ?? '';
      debugPrint('[TRACE-AUTH] Login successful details:');
      debugPrint('[TRACE-AUTH] - Base URL: ${_apiService.baseUrl}');
      debugPrint('[TRACE-AUTH] - JWT length: ${token.length}');
      debugPrint('[TRACE-AUTH] - Cookie header structure: pertap_jwt=${token.length > 10 ? token.substring(0, 10) + "..." : token}');
    } catch (e) {
      debugPrint('[TRACE-AUTH] Error printing success log: $e');
    }
  }

  // Idempotent login resolver: runs initProfile in background before triggering success
  Future<void> _handlePostLogin() async {
    debugPrint('[TRACE-AUTH] _handlePostLogin() started.');
    try {
      // Trace profile initialization
      debugPrint('[TRACE-AUTH] Calling _apiService.initProfile()...');
      final result = await _apiService.initProfile();
      debugPrint('[TRACE-AUTH] initProfile response: $result');

      // Trace session verification
      debugPrint('[TRACE-AUTH] Calling _apiService.getMe()...');
      final user = await _apiService.getMe();
      debugPrint('[TRACE-AUTH] getMe verification: ${user != null ? "Success (${user.email})" : "Failed"}');
    } catch (e, stack) {
      debugPrint('[EXCEPTION] _handlePostLogin setup failed: $e\n$stack');
    } finally {
      if (mounted) {
        debugPrint('[TRACE-AUTH] Navigation trigger: calling widget.onLoginSuccess().');
        widget.onLoginSuccess();
      } else {
        debugPrint('[TRACE-AUTH] Navigation skipped: LoginScreen widget is unmounted.');
      }
    }
  }

  // Handle native Google Sign-In with development mock fallback
  Future<void> _handleGoogleSignIn() async {
    debugPrint('[TRACE-AUTH] _handleGoogleSignIn() pressed.');
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final GoogleSignInAccount? account = await _googleSignIn.signIn();
      if (account != null) {
        debugPrint('[TRACE-AUTH] Google Sign-In account selected: ${account.email}');
        final GoogleSignInAuthentication auth = await account.authentication;
        debugPrint('[TRACE-AUTH] Sending Google Login API request...');
        final res = await _apiService.googleLogin(
          auth.idToken ?? 'mock_token',
          email: account.email,
          name: account.displayName,
        );

        debugPrint('[TRACE-AUTH] Google Login API response: $res');
        if (res['success'] == true) {
          _logAuthSuccess();
          await _handlePostLogin();
        } else {
          setState(() {
            _isLoading = false;
            _errorMessage = res['error'];
          });
        }
      } else {
        debugPrint('[TRACE-AUTH] Google Sign-In cancelled by user.');
        setState(() {
          _isLoading = false;
        });
      }
    } catch (e, stack) {
      setState(() {
        _isLoading = false;
        _errorMessage = 'Google Sign-In failed: ${e.toString()}';
      });
      debugPrint('[EXCEPTION] Google Sign-In Error: $e\n$stack');
    }
  }

  Future<void> _handleEmailLogin() async {
    debugPrint('[TRACE-AUTH] _handleEmailLogin() pressed.');
    if (!_formKey.currentState!.validate()) return;

    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      debugPrint('[TRACE-AUTH] Sending Email Login API request for: ${_emailController.text.trim()}');
      final res = await _apiService.login(
        _emailController.text.trim(),
        _passwordController.text,
      );

      debugPrint('[TRACE-AUTH] Email Login API response: $res');
      if (res['success'] == true) {
        _logAuthSuccess();
        await _handlePostLogin();
      } else {
        setState(() {
          _isLoading = false;
          _errorMessage = res['error'];
        });
      }
    } catch (e, stack) {
      setState(() {
        _isLoading = false;
        _errorMessage = 'Email login failed: ${e.toString()}';
      });
      debugPrint('[EXCEPTION] Email Login Error: $e\n$stack');
    }
  }

  Widget _buildGlassTextField({
    required TextEditingController controller,
    required String label,
    required IconData icon,
    bool obscureText = false,
    Widget? suffixIcon,
    String? Function(String?)? validator,
  }) {
    final isLight = Theme.of(context).brightness == Brightness.light;
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: isLight ? const Color(0xFFF9FAFB) : Colors.white.withValues(alpha: 0.04),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: isLight ? Colors.black12 : Colors.white.withValues(alpha: 0.08)),
      ),
      child: TextFormField(
        controller: controller,
        obscureText: obscureText,
        style: GoogleFonts.outfit(color: isLight ? const Color(0xFF111827) : Colors.white),
        validator: validator,
        decoration: InputDecoration(
          labelText: label,
          labelStyle: GoogleFonts.outfit(color: isLight ? const Color(0xFF4B5563) : Colors.white60, fontSize: 14),
          prefixIcon: Icon(icon, color: Theme.of(context).primaryColor, size: 20),
          suffixIcon: suffixIcon,
          border: InputBorder.none,
          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isLight = Theme.of(context).brightness == Brightness.light;
    final scaffoldBg = isLight ? const Color(0xFFF3F4F6) : const Color(0xFF06070D);
    final cardBg = isLight ? Colors.white : Colors.white.withValues(alpha: 0.02);
    final cardBorder = isLight ? Colors.black12 : Colors.white.withValues(alpha: 0.06);
    final textColor = isLight ? const Color(0xFF111827) : Colors.white;
    final subtitleColor = isLight ? const Color(0xFF4B5563) : Colors.white60;

    return Scaffold(
      backgroundColor: scaffoldBg,
      body: Stack(
        children: [
          // Radial glow background effects
          Positioned(
            top: -150,
            left: -100,
            child: Container(
              width: 350,
              height: 350,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: Colors.indigo.withValues(alpha: isLight ? 0.08 : 0.15),
              ),
              child: BackdropFilter(
                filter: ImageFilter.blur(sigmaX: 90, sigmaY: 90),
                child: Container(color: Colors.transparent),
              ),
            ),
          ),
          Positioned(
            bottom: -100,
            right: -100,
            child: Container(
              width: 300,
              height: 300,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: Colors.purple.withValues(alpha: isLight ? 0.06 : 0.12),
              ),
              child: BackdropFilter(
                filter: ImageFilter.blur(sigmaX: 90, sigmaY: 90),
                child: Container(color: Colors.transparent),
              ),
            ),
          ),

          Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: SafeArea(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    // Brand Info
                    Text(
                      'Tapfolio',
                      style: GoogleFonts.outfit(
                        fontSize: 44,
                        fontWeight: FontWeight.w800,
                        color: textColor,
                        letterSpacing: -1.5,
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      'Your identity. One tap away.',
                      style: GoogleFonts.outfit(
                        fontSize: 15,
                        color: subtitleColor,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    const SizedBox(height: 48),

                    // Auth Card Container
                    ClipRRect(
                      borderRadius: BorderRadius.circular(20),
                      child: BackdropFilter(
                        filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
                        child: Container(
                          padding: const EdgeInsets.all(24),
                          decoration: BoxDecoration(
                            color: cardBg,
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(color: cardBorder),
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Welcome back',
                                style: GoogleFonts.outfit(
                                  fontSize: 22,
                                  fontWeight: FontWeight.bold,
                                  color: textColor,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                'Sign in to continue your connections',
                                style: GoogleFonts.outfit(
                                  fontSize: 13,
                                  color: subtitleColor,
                                ),
                              ),
                              const SizedBox(height: 24),

                              if (_errorMessage != null) ...[
                                Container(
                                  width: double.infinity,
                                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                                  margin: const EdgeInsets.only(bottom: 16),
                                  decoration: BoxDecoration(
                                    color: Colors.redAccent.withValues(alpha: 0.08),
                                    borderRadius: BorderRadius.circular(8),
                                    border: Border.all(color: Colors.redAccent.withValues(alpha: 0.2)),
                                  ),
                                  child: Text(
                                    _errorMessage!,
                                    style: GoogleFonts.outfit(color: Colors.redAccent, fontSize: 13),
                                    textAlign: TextAlign.center,
                                  ),
                                ),
                              ],

                              // Google button (Primary)
                              SizedBox(
                                width: double.infinity,
                                height: 48,
                                child: ElevatedButton(
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: isLight ? const Color(0xFFF3F4F6) : Colors.white,
                                    foregroundColor: const Color(0xFF1f2937),
                                    shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(10),
                                    ),
                                    elevation: isLight ? 0 : 2,
                                  ),
                                  onPressed: _isLoading ? null : _handleGoogleSignIn,
                                  child: Row(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: [
                                       const FaIcon(
                                         FontAwesomeIcons.google,
                                         color: Color(0xFF4285F4),
                                         size: 18,
                                       ),
                                      const SizedBox(width: 12),
                                      Text(
                                        'Continue with Google',
                                        style: GoogleFonts.outfit(
                                          fontWeight: FontWeight.w700,
                                          fontSize: 14,
                                          color: const Color(0xFF1F2937),
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ),

                              const SizedBox(height: 20),

                              // Divider
                              Row(
                                children: [
                                  Expanded(child: Divider(color: isLight ? Colors.black12 : Colors.white.withValues(alpha: 0.08))),
                                  Padding(
                                    padding: const EdgeInsets.symmetric(horizontal: 12),
                                    child: Text(
                                      'OR EMAIL LOGIN',
                                      style: GoogleFonts.outfit(
                                        fontSize: 10,
                                        color: isLight ? Colors.black26 : Colors.white30,
                                        fontWeight: FontWeight.w700,
                                        letterSpacing: 1.2,
                                      ),
                                    ),
                                  ),
                                  Expanded(child: Divider(color: isLight ? Colors.black12 : Colors.white.withValues(alpha: 0.08))),
                                ],
                              ),

                              const SizedBox(height: 20),

                              // Email Login Form
                              Form(
                                key: _formKey,
                                child: Column(
                                  children: [
                                    _buildGlassTextField(
                                      controller: _emailController,
                                      label: 'Email Address',
                                      icon: Icons.email_outlined,
                                      validator: (val) => val == null || !val.contains('@') ? 'Enter a valid email' : null,
                                    ),
                                    _buildGlassTextField(
                                      controller: _passwordController,
                                      label: 'Password',
                                      icon: Icons.lock_outline,
                                      obscureText: _obscurePassword,
                                      validator: (val) => val == null || val.length < 6 ? 'Password must be 6+ characters' : null,
                                      suffixIcon: IconButton(
                                        icon: Icon(
                                          _obscurePassword ? Icons.visibility_off_outlined : Icons.visibility_outlined,
                                          color: subtitleColor,
                                          size: 20,
                                        ),
                                        onPressed: () {
                                          setState(() {
                                            _obscurePassword = !_obscurePassword;
                                          });
                                        },
                                      ),
                                    ),
                                    const SizedBox(height: 8),

                                    // Sign In Button
                                    SizedBox(
                                      width: double.infinity,
                                      height: 48,
                                      child: Container(
                                        decoration: BoxDecoration(
                                          gradient: const LinearGradient(
                                            colors: [Color(0xFF6366f1), Color(0xFFa855f7)],
                                          ),
                                          borderRadius: BorderRadius.circular(10),
                                        ),
                                        child: ElevatedButton(
                                          style: ElevatedButton.styleFrom(
                                            backgroundColor: Colors.transparent,
                                            shadowColor: Colors.transparent,
                                            shape: RoundedRectangleBorder(
                                              borderRadius: BorderRadius.circular(10),
                                            ),
                                          ),
                                          onPressed: _isLoading ? null : _handleEmailLogin,
                                          child: _isLoading
                                              ? const SizedBox(
                                                  width: 20,
                                                  height: 20,
                                                  child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2.5),
                                                )
                                              : Text(
                                                  'Sign In',
                                                  style: GoogleFonts.outfit(
                                                    fontWeight: FontWeight.bold,
                                                    color: Colors.white,
                                                    fontSize: 15,
                                                  ),
                                                ),
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              ),

                              const SizedBox(height: 24),

                              // Navigation link to signup screen
                              Center(
                                child: GestureDetector(
                                  onTap: () {
                                    Navigator.push(
                                      context,
                                      MaterialPageRoute(
                                        builder: (_) => RegisterScreen(onLoginSuccess: widget.onLoginSuccess),
                                      ),
                                    );
                                  },
                                  child: RichText(
                                    text: TextSpan(
                                      style: GoogleFonts.outfit(color: subtitleColor, fontSize: 13),
                                      children: [
                                        const TextSpan(text: 'New to Tapfolio? '),
                                        TextSpan(
                                          text: 'Create account',
                                          style: GoogleFonts.outfit(
                                            color: const Color(0xFFa855f7),
                                            fontWeight: FontWeight.bold,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

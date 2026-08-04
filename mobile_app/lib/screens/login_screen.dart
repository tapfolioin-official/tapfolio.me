import 'dart:async';
import 'dart:ui';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:google_sign_in/google_sign_in.dart';
import '../core/storage/local_storage.dart';
import '../services/api_service.dart';
import '../services/google_auth_service.dart';
import 'register_screen.dart';

class LoginScreen extends StatefulWidget {
  final VoidCallback onLoginSuccess;

  const LoginScreen({super.key, required this.onLoginSuccess});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final ApiService _apiService = ApiService();

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

  // Handle native Google Sign-In with centralized GoogleAuthService
  Future<void> _handleGoogleSignIn() async {
    debugPrint('[TRACE-AUTH] _handleGoogleSignIn() pressed.');
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    final result = await GoogleAuthService.instance.signInAndAuthenticate(_apiService);

    if (!mounted) return;

    if (result.success) {
      _logAuthSuccess();
      await _handlePostLogin();
    } else if (result.isCancelled) {
      debugPrint('[TRACE-AUTH] Google Sign-In cancelled by user.');
      setState(() {
        _isLoading = false;
      });
    } else {
      setState(() {
        _isLoading = false;
        _errorMessage = result.error ?? 'Google Sign-In failed.';
      });
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

  bool get _isLight => Theme.of(context).brightness == Brightness.light;
  Color get _textColor => _isLight ? const Color(0xFF111827) : Colors.white;
  Color get _subtitleColor => _isLight ? const Color(0xFF4B5563) : Colors.white60;
  Color get _cardBorder => _isLight ? Colors.black12 : Colors.white.withValues(alpha: 0.06);

  Future<void> _handleForgotPassword() async {
    final emailController = TextEditingController(text: _emailController.text);
    final passwordController = TextEditingController();
    final confirmPasswordController = TextEditingController();
    
    int forgotStep = 1;
    String otpCode = '';
    String? forgotError;
    bool isForgotLoading = false;
    int resendCountdown = 60;
    Timer? countdownTimer;

    await showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setModalState) {
            if (forgotStep == 2 && countdownTimer == null) {
              countdownTimer = Timer.periodic(const Duration(seconds: 1), (timer) {
                if (resendCountdown > 0) {
                  setModalState(() {
                    resendCountdown--;
                  });
                } else {
                  timer.cancel();
                }
              });
            }

            return Padding(
              padding: EdgeInsets.only(
                bottom: MediaQuery.of(context).viewInsets.bottom,
              ),
              child: Container(
                decoration: BoxDecoration(
                  color: _isLight ? Colors.white : const Color(0xFF0F1122),
                  borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
                  border: Border.all(color: _cardBorder),
                ),
                padding: const EdgeInsets.all(24),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          forgotStep == 1 ? 'Reset Password' :
                          forgotStep == 2 ? 'Verify Reset Code' :
                          forgotStep == 3 ? 'Choose New Password' : 'Password Reset!',
                          style: GoogleFonts.outfit(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                            color: _textColor,
                          ),
                        ),
                        IconButton(
                          icon: Icon(Icons.close, color: _subtitleColor),
                          onPressed: () {
                            countdownTimer?.cancel();
                            Navigator.pop(context);
                          },
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),

                    if (forgotError != null) ...[
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
                          forgotError!,
                          style: GoogleFonts.outfit(color: Colors.redAccent, fontSize: 13),
                          textAlign: TextAlign.center,
                        ),
                      ),
                    ],

                    if (forgotStep == 1) ...[
                      Text(
                        'Enter the email address associated with your account to receive a reset code.',
                        style: GoogleFonts.outfit(color: _subtitleColor, fontSize: 13),
                      ),
                      const SizedBox(height: 16),
                      _buildModalTextField(
                        controller: emailController,
                        label: 'Email Address',
                        icon: Icons.email_outlined,
                      ),
                      const SizedBox(height: 16),
                      SizedBox(
                        width: double.infinity,
                        height: 48,
                        child: ElevatedButton(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Theme.of(context).primaryColor,
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                          ),
                          onPressed: isForgotLoading
                              ? null
                              : () async {
                                  final emailVal = emailController.text.trim();
                                  if (emailVal.isEmpty || !emailVal.contains('@')) {
                                    setModalState(() {
                                      forgotError = 'Please enter a valid email address.';
                                    });
                                    return;
                                  }
                                  setModalState(() {
                                    isForgotLoading = true;
                                    forgotError = null;
                                  });
                                  final res = await _apiService.forgotSendOtp(emailVal);
                                  setModalState(() {
                                    isForgotLoading = false;
                                  });
                                  if (res['success'] == true) {
                                    setModalState(() {
                                      forgotStep = 2;
                                    });
                                  } else {
                                    setModalState(() {
                                      forgotError = res['error'];
                                    });
                                  }
                                },
                          child: isForgotLoading
                              ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                              : Text('Send Reset Code', style: GoogleFonts.outfit(fontWeight: FontWeight.bold, color: Colors.white)),
                        ),
                      ),
                    ],

                    if (forgotStep == 2) ...[
                      Text(
                        'Enter the 6-digit reset code sent to:',
                        style: GoogleFonts.outfit(color: _subtitleColor, fontSize: 13),
                      ),
                      Text(
                        emailController.text.trim(),
                        style: GoogleFonts.outfit(
                          color: Theme.of(context).primaryColor,
                          fontWeight: FontWeight.bold,
                          fontSize: 14,
                        ),
                      ),
                      const SizedBox(height: 16),
                      Container(
                        decoration: BoxDecoration(
                          color: _isLight ? const Color(0xFFF9FAFB) : Colors.white.withValues(alpha: 0.04),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: _cardBorder),
                        ),
                        child: TextField(
                          keyboardType: TextInputType.number,
                          style: GoogleFonts.outfit(color: _textColor, letterSpacing: 8, fontSize: 18),
                          textAlign: TextAlign.center,
                          maxLength: 6,
                          decoration: InputDecoration(
                            hintText: '000000',
                            hintStyle: GoogleFonts.outfit(color: _subtitleColor.withValues(alpha: 0.3), letterSpacing: 8),
                            counterText: '',
                            border: InputBorder.none,
                            contentPadding: const EdgeInsets.symmetric(vertical: 14),
                          ),
                          onChanged: (val) {
                            otpCode = val.trim();
                          },
                        ),
                      ),
                      const SizedBox(height: 20),
                      SizedBox(
                        width: double.infinity,
                        height: 48,
                        child: ElevatedButton(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Theme.of(context).primaryColor,
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                          ),
                          onPressed: isForgotLoading
                              ? null
                              : () async {
                                  if (otpCode.length != 6) {
                                    setModalState(() {
                                      forgotError = 'Please enter all 6 digits.';
                                    });
                                    return;
                                  }
                                  setModalState(() {
                                    isForgotLoading = true;
                                    forgotError = null;
                                  });
                                  final res = await _apiService.forgotVerifyOtp(
                                    emailController.text.trim(),
                                    otpCode,
                                  );
                                  setModalState(() {
                                    isForgotLoading = false;
                                  });
                                  if (res['success'] == true) {
                                    countdownTimer?.cancel();
                                    setModalState(() {
                                      forgotStep = 3;
                                    });
                                  } else {
                                    setModalState(() {
                                      forgotError = res['error'];
                                    });
                                  }
                                },
                          child: isForgotLoading
                              ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                              : Text('Verify Code', style: GoogleFonts.outfit(fontWeight: FontWeight.bold, color: Colors.white)),
                        ),
                      ),
                      const SizedBox(height: 16),
                      Center(
                        child: resendCountdown > 0
                            ? Text(
                                'Resend code in $resendCountdown seconds',
                                style: GoogleFonts.outfit(color: _subtitleColor, fontSize: 12),
                              )
                            : TextButton(
                                onPressed: () async {
                                  setModalState(() {
                                    resendCountdown = 60;
                                    forgotError = null;
                                  });
                                  countdownTimer?.cancel();
                                  countdownTimer = null;
                                  final res = await _apiService.forgotSendOtp(
                                    emailController.text.trim(),
                                  );
                                  if (res['success'] != true) {
                                    setModalState(() {
                                      forgotError = res['error'] ?? 'Failed to resend code.';
                                    });
                                  }
                                },
                                child: Text(
                                  'Resend Reset Code',
                                  style: GoogleFonts.outfit(
                                    color: Theme.of(context).primaryColor,
                                    fontWeight: FontWeight.bold,
                                    fontSize: 12,
                                  ),
                                ),
                              ),
                      ),
                    ],

                    if (forgotStep == 3) ...[
                      Text(
                        'Enter a secure new password for your account.',
                        style: GoogleFonts.outfit(color: _subtitleColor, fontSize: 13),
                      ),
                      const SizedBox(height: 16),
                      _buildModalTextField(
                        controller: passwordController,
                        label: 'New Password',
                        icon: Icons.lock_outline,
                        obscureText: true,
                      ),
                      _buildModalTextField(
                        controller: confirmPasswordController,
                        label: 'Confirm Password',
                        icon: Icons.lock_clock_outlined,
                        obscureText: true,
                      ),
                      const SizedBox(height: 16),
                      SizedBox(
                        width: double.infinity,
                        height: 48,
                        child: ElevatedButton(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Theme.of(context).primaryColor,
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                          ),
                          onPressed: isForgotLoading
                              ? null
                              : () async {
                                  final pass = passwordController.text;
                                  final conf = confirmPasswordController.text;
                                  if (pass.length < 6) {
                                    setModalState(() {
                                      forgotError = 'Password must be 6+ characters.';
                                    });
                                    return;
                                  }
                                  if (pass != conf) {
                                    setModalState(() {
                                      forgotError = 'Passwords do not match.';
                                    });
                                    return;
                                  }
                                  setModalState(() {
                                    isForgotLoading = true;
                                    forgotError = null;
                                  });
                                  final res = await _apiService.forgotReset(
                                    emailController.text.trim(),
                                    pass,
                                  );
                                  setModalState(() {
                                    isForgotLoading = false;
                                  });
                                  if (res['success'] == true) {
                                    setModalState(() {
                                      forgotStep = 4;
                                    });
                                  } else {
                                    setModalState(() {
                                      forgotError = res['error'];
                                    });
                                  }
                                },
                          child: isForgotLoading
                              ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                              : Text('Reset Password', style: GoogleFonts.outfit(fontWeight: FontWeight.bold, color: Colors.white)),
                        ),
                      ),
                    ],

                    if (forgotStep == 4) ...[
                      const Center(
                        child: Padding(
                          padding: EdgeInsets.symmetric(vertical: 16.0),
                          child: Icon(Icons.check_circle_outline, color: Colors.green, size: 64),
                        ),
                      ),
                      Center(
                        child: Text(
                          'Your password has been successfully reset. You can now use your new password to sign in.',
                          style: GoogleFonts.outfit(color: _textColor, fontSize: 14),
                          textAlign: TextAlign.center,
                        ),
                      ),
                      const SizedBox(height: 24),
                      SizedBox(
                        width: double.infinity,
                        height: 48,
                        child: ElevatedButton(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Theme.of(context).primaryColor,
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                          ),
                          onPressed: () {
                            Navigator.pop(context);
                          },
                          child: Text('Done', style: GoogleFonts.outfit(fontWeight: FontWeight.bold, color: Colors.white)),
                        ),
                      ),
                    ],
                  ],
                ),
              ),
            );
          },
        );
      },
    );
    countdownTimer?.cancel();
  }

  Widget _buildModalTextField({
    required TextEditingController controller,
    required String label,
    required IconData icon,
    bool obscureText = false,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: _isLight ? const Color(0xFFF9FAFB) : Colors.white.withValues(alpha: 0.05),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: _cardBorder),
      ),
      child: TextField(
        controller: controller,
        obscureText: obscureText,
        style: GoogleFonts.outfit(color: _textColor),
        decoration: InputDecoration(
          labelText: label,
          labelStyle: GoogleFonts.outfit(color: _subtitleColor),
          prefixIcon: Icon(icon, color: const Color(0xFF0052FF)),
          border: InputBorder.none,
          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        ),
      ),
    );
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
                                    Align(
                                      alignment: Alignment.centerRight,
                                      child: TextButton(
                                        onPressed: _handleForgotPassword,
                                        style: TextButton.styleFrom(
                                          padding: EdgeInsets.zero,
                                          tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                                        ),
                                        child: Text(
                                          'Forgot Password?',
                                          style: GoogleFonts.outfit(
                                            color: const Color(0xFF6366f1),
                                            fontWeight: FontWeight.w600,
                                            fontSize: 13,
                                          ),
                                        ),
                                      ),
                                    ),
                                    const SizedBox(height: 12),

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

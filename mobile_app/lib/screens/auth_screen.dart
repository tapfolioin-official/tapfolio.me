import 'dart:async';
import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../services/api_service.dart';

class AuthScreen extends StatefulWidget {
  final VoidCallback onLoginSuccess;

  const AuthScreen({super.key, required this.onLoginSuccess});

  @override
  State<AuthScreen> createState() => _AuthScreenState();
}

class _AuthScreenState extends State<AuthScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  final ApiService _apiService = ApiService();

  // Login Form
  final _loginFormKey = GlobalKey<FormState>();
  final _loginEmailController = TextEditingController();
  final _loginPasswordController = TextEditingController();

  // Register Form
  final _registerFormKey = GlobalKey<FormState>();
  final _registerNameController = TextEditingController();
  final _registerUsernameController = TextEditingController();
  final _registerEmailController = TextEditingController();
  final _registerPasswordController = TextEditingController();

  bool _isLoading = false;
  String? _errorMessage;
  bool _obscureLoginPassword = true;
  bool _obscureRegisterPassword = true;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    _tabController.addListener(() {
      if (mounted) {
        setState(() {});
      }
    });
  }

  @override
  void dispose() {
    _tabController.dispose();
    _loginEmailController.dispose();
    _loginPasswordController.dispose();
    _registerNameController.dispose();
    _registerUsernameController.dispose();
    _registerEmailController.dispose();
    _registerPasswordController.dispose();
    super.dispose();
  }

  Future<void> _handleLogin() async {
    if (!_loginFormKey.currentState!.validate()) return;

    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    final email = _loginEmailController.text.trim();
    final password = _loginPasswordController.text;

    final result = await _apiService.login(email, password);

    setState(() {
      _isLoading = false;
    });

    if (result['success'] == true) {
      widget.onLoginSuccess();
    } else {
      setState(() {
        _errorMessage = result['error'];
      });
    }
  }

  Future<void> _handleRegister() async {
    if (!_registerFormKey.currentState!.validate()) return;

    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    final name = _registerNameController.text.trim();
    final username = _registerUsernameController.text.trim().toLowerCase();
    final email = _registerEmailController.text.trim();
    final password = _registerPasswordController.text;

    final result = await _apiService.register(name, username, email, password);

    setState(() {
      _isLoading = false;
    });

    if (result['success'] == true) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Registration successful! Please sign in.'),
          backgroundColor: Color(0xFF10B981),
        ),
      );
      _tabController.animateTo(0); // Switch to Login Tab
      _loginEmailController.text = email;
      _registerNameController.clear();
      _registerUsernameController.clear();
      _registerEmailController.clear();
      _registerPasswordController.clear();
    } else {
      setState(() {
        _errorMessage = result['error'];
      });
    }
  }

  bool get _isLight => Theme.of(context).brightness == Brightness.light;
  Color get _textColor => _isLight ? const Color(0xFF111827) : Colors.white;
  Color get _subtitleColor => _isLight ? const Color(0xFF4B5563) : Colors.white60;
  Color get _cardBorder => _isLight ? Colors.black12 : Colors.white.withValues(alpha: 0.06);

  Future<void> _handleForgotPassword() async {
    final emailController = TextEditingController(text: _loginEmailController.text);
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
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: _isLight ? const Color(0xFFF9FAFB) : Colors.white.withValues(alpha: 0.05),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: _cardBorder),
      ),
      child: TextFormField(
        controller: controller,
        obscureText: obscureText,
        style: GoogleFonts.outfit(color: _textColor),
        validator: validator,
        decoration: InputDecoration(
          labelText: label,
          labelStyle: GoogleFonts.outfit(color: _subtitleColor),
          prefixIcon: Icon(icon, color: const Color(0xFF0052FF)),
          suffixIcon: suffixIcon,
          border: InputBorder.none,
          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: _isLight ? const Color(0xFFF3F4F6) : const Color(0xFF06070D),
      body: Stack(
        children: [
          // Background Glows
          Positioned(
            top: -100,
            left: -100,
            child: Container(
              width: 300,
              height: 300,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: Colors.indigo.withValues(alpha: _isLight ? 0.1 : 0.3),
              ),
              child: BackdropFilter(
                filter: ImageFilter.blur(sigmaX: 80, sigmaY: 80),
                child: Container(color: Colors.transparent),
              ),
            ),
          ),
          Positioned(
            bottom: -50,
            right: -50,
            child: Container(
              width: 250,
              height: 250,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: const Color(0xFF0052FF).withValues(alpha: _isLight ? 0.05 : 0.2),
              ),
              child: BackdropFilter(
                filter: ImageFilter.blur(sigmaX: 80, sigmaY: 80),
                child: Container(color: Colors.transparent),
              ),
            ),
          ),

          // Main Content
          Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  // Logo
                  Text(
                    'Tapfolio',
                    style: GoogleFonts.outfit(
                      fontSize: 42,
                      fontWeight: FontWeight.w800,
                      color: _textColor,
                      letterSpacing: -1,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Smart NFC Portfolios & Connections',
                    style: GoogleFonts.outfit(
                      fontSize: 16,
                      color: _subtitleColor,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 40),

                  // Glassmorphic Auth Panel
                  Container(
                    decoration: BoxDecoration(
                      color: _isLight ? Colors.white : Colors.white.withValues(alpha: 0.04),
                      borderRadius: BorderRadius.circular(24),
                      border: Border.all(color: _cardBorder),
                      boxShadow: _isLight
                          ? [
                              BoxShadow(
                                color: Colors.black.withOpacity(0.03),
                                blurRadius: 15,
                                offset: const Offset(0, 5),
                              )
                            ]
                          : null,
                    ),
                    child: Column(
                      children: [
                        // Tab Bar
                        TabBar(
                          controller: _tabController,
                          indicatorColor: const Color(0xFF0052FF),
                          indicatorWeight: 3,
                          labelColor: _textColor,
                          unselectedLabelColor: _subtitleColor,
                          labelStyle: GoogleFonts.outfit(fontSize: 16, fontWeight: FontWeight.w600),
                          tabs: const [
                            Tab(text: 'Sign In'),
                            Tab(text: 'Sign Up'),
                          ],
                        ),

                        Padding(
                          padding: const EdgeInsets.all(24.0),
                          child: AnimatedSize(
                            duration: const Duration(milliseconds: 300),
                            child: SizedBox(
                              height: _tabController.index == 0 ? 280 : 380,
                              child: TabBarView(
                                controller: _tabController,
                                children: [
                                  // Sign In Form
                                  Form(
                                    key: _loginFormKey,
                                    child: Column(
                                      mainAxisAlignment: MainAxisAlignment.center,
                                      children: [
                                        _buildGlassTextField(
                                          controller: _loginEmailController,
                                          label: 'Email Address',
                                          icon: Icons.email_outlined,
                                          validator: (val) => val == null || !val.contains('@') ? 'Enter a valid email' : null,
                                        ),
                                        _buildGlassTextField(
                                          controller: _loginPasswordController,
                                          label: 'Password',
                                          icon: Icons.lock_outline,
                                          obscureText: _obscureLoginPassword,
                                          validator: (val) => val == null || val.length < 6 ? 'Password must be 6+ characters' : null,
                                          suffixIcon: IconButton(
                                            icon: Icon(
                                              _obscureLoginPassword ? Icons.visibility_off_outlined : Icons.visibility_outlined,
                                              color: _subtitleColor,
                                            ),
                                            onPressed: () {
                                              setState(() {
                                                _obscureLoginPassword = !_obscureLoginPassword;
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
                                                color: const Color(0xFF0052FF),
                                                fontWeight: FontWeight.w600,
                                                fontSize: 13,
                                              ),
                                            ),
                                          ),
                                        ),
                                        const SizedBox(height: 12),
                                        if (_errorMessage != null)
                                          Padding(
                                            padding: const EdgeInsets.only(bottom: 16.0),
                                            child: Text(
                                              _errorMessage!,
                                              style: const TextStyle(color: Colors.redAccent),
                                              textAlign: TextAlign.center,
                                            ),
                                          ),
                                        SizedBox(
                                          width: double.infinity,
                                          height: 50,
                                          child: ElevatedButton(
                                            style: ElevatedButton.styleFrom(
                                              backgroundColor: const Color(0xFF0052FF),
                                              shape: RoundedRectangleBorder(
                                                borderRadius: BorderRadius.circular(12),
                                              ),
                                            ),
                                            onPressed: _isLoading ? null : _handleLogin,
                                            child: _isLoading
                                                ? const CircularProgressIndicator(color: Colors.white)
                                                : Text(
                                                    'Sign In',
                                                    style: GoogleFonts.outfit(
                                                      fontSize: 16,
                                                      fontWeight: FontWeight.bold,
                                                      color: Colors.white,
                                                    ),
                                                  ),
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),

                                  // Sign Up Form
                                  Form(
                                    key: _registerFormKey,
                                    child: Column(
                                      mainAxisAlignment: MainAxisAlignment.center,
                                      children: [
                                        _buildGlassTextField(
                                          controller: _registerNameController,
                                          label: 'Full Name',
                                          icon: Icons.person_outline,
                                          validator: (val) => val == null || val.isEmpty ? 'Enter your name' : null,
                                        ),
                                        _buildGlassTextField(
                                          controller: _registerUsernameController,
                                          label: 'Username',
                                          icon: Icons.alternate_email_outlined,
                                          validator: (val) {
                                            if (val == null || val.trim().isEmpty) return 'Enter a username';
                                            if (val.trim().length < 3 || val.trim().length > 20) {
                                              return 'Username must be 3-20 characters';
                                            }
                                            if (!RegExp(r'^[a-z0-9_-]+$').hasMatch(val.trim().toLowerCase())) {
                                              return 'Only letters, numbers, -, and _ allowed';
                                            }
                                            return null;
                                          },
                                        ),
                                        _buildGlassTextField(
                                          controller: _registerEmailController,
                                          label: 'Email Address',
                                          icon: Icons.email_outlined,
                                          validator: (val) => val == null || !val.contains('@') ? 'Enter a valid email' : null,
                                        ),
                                        _buildGlassTextField(
                                          controller: _registerPasswordController,
                                          label: 'Password',
                                          icon: Icons.lock_outline,
                                          obscureText: _obscureRegisterPassword,
                                          validator: (val) => val == null || val.length < 6 ? 'Password must be 6+ characters' : null,
                                          suffixIcon: IconButton(
                                            icon: Icon(
                                              _obscureRegisterPassword ? Icons.visibility_off_outlined : Icons.visibility_outlined,
                                              color: _subtitleColor,
                                            ),
                                            onPressed: () {
                                              setState(() {
                                                _obscureRegisterPassword = !_obscureRegisterPassword;
                                              });
                                            },
                                          ),
                                        ),
                                        const SizedBox(height: 20),
                                        if (_errorMessage != null)
                                          Padding(
                                            padding: const EdgeInsets.only(bottom: 16.0),
                                            child: Text(
                                              _errorMessage!,
                                              style: const TextStyle(color: Colors.redAccent),
                                              textAlign: TextAlign.center,
                                            ),
                                          ),
                                        SizedBox(
                                          width: double.infinity,
                                          height: 50,
                                          child: ElevatedButton(
                                            style: ElevatedButton.styleFrom(
                                              backgroundColor: const Color(0xFF0052FF),
                                              shape: RoundedRectangleBorder(
                                                borderRadius: BorderRadius.circular(12),
                                              ),
                                            ),
                                            onPressed: _isLoading ? null : _handleRegister,
                                            child: _isLoading
                                                ? const CircularProgressIndicator(color: Colors.white)
                                                : Text(
                                                    'Create Account',
                                                    style: GoogleFonts.outfit(
                                                      fontSize: 16,
                                                      fontWeight: FontWeight.bold,
                                                      color: Colors.white,
                                                    ),
                                                  ),
                                          ),
                                        ),
                                      ],
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
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

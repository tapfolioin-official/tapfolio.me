import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../services/api_service.dart';
import '../services/google_auth_service.dart';

/// DeleteAccountScreen — required by Google Play for apps with user accounts.
///
/// This screen:
///   1. Warns the user about permanent data loss.
///   2. Requires the user to type "DELETE" to confirm.
///   3. Calls DELETE /api/auth/me on the backend.
///   4. Clears all local auth state and signs out Google.
///   5. Navigates back to the login screen on success.
class DeleteAccountScreen extends StatefulWidget {
  final VoidCallback onAccountDeleted;

  const DeleteAccountScreen({super.key, required this.onAccountDeleted});

  @override
  State<DeleteAccountScreen> createState() => _DeleteAccountScreenState();
}

class _DeleteAccountScreenState extends State<DeleteAccountScreen>
    with TickerProviderStateMixin {
  final ApiService _apiService = ApiService();
  final _confirmController = TextEditingController();

  bool _isLoading = false;
  String? _errorMessage;
  bool _confirmed = false;

  bool get _isLight => Theme.of(context).brightness == Brightness.light;
  Color get _textColor => _isLight ? const Color(0xFF1F2937) : Colors.white;
  Color get _subtitleColor => _isLight ? const Color(0xFF4B5563) : Colors.white60;
  Color get _cardBg => _isLight ? Colors.white : Colors.white.withValues(alpha: 0.03);
  Color get _cardBorder => _isLight ? Colors.black12 : Colors.white.withValues(alpha: 0.06);

  late final AnimationController _shakeController;
  late final Animation<double> _shakeAnim;

  @override
  void initState() {
    super.initState();
    _shakeController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 400),
    );
    _shakeAnim = Tween<double>(begin: 0, end: 8).animate(
      CurvedAnimation(parent: _shakeController, curve: Curves.elasticIn),
    );
    _confirmController.addListener(() {
      final val = _confirmController.text.trim().toUpperCase() == 'DELETE';
      if (val != _confirmed) setState(() => _confirmed = val);
    });
  }

  @override
  void dispose() {
    _confirmController.dispose();
    _shakeController.dispose();
    super.dispose();
  }

  Future<void> _handleDeleteAccount() async {
    if (!_confirmed) {
      _shakeController.forward(from: 0);
      setState(() => _errorMessage = 'Type DELETE to confirm account deletion.');
      return;
    }

    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      // Sign out Google first (revoke OAuth tokens)
      try {
        await GoogleAuthService.instance.signOut();
      } catch (_) {
        // Not signed in via Google — safe to ignore
      }

      // Delete account on backend
      final result = await _apiService.deleteAccount();

      if (!mounted) return;

      if (result['success'] == true) {
        // Show success snackbar before navigating away
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              'Your account has been permanently deleted.',
              style: GoogleFonts.outfit(),
            ),
            backgroundColor: Colors.green.shade700,
            duration: const Duration(seconds: 3),
          ),
        );
        widget.onAccountDeleted();
      } else {
        setState(() {
          _errorMessage = result['error'] ?? 'Account deletion failed. Please try again.';
          _isLoading = false;
        });
      }
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _errorMessage = 'An error occurred: ${e.toString()}';
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: _isLight ? const Color(0xFFF3F4F6) : const Color(0xFF06070D),
      appBar: AppBar(
        backgroundColor: _isLight ? Colors.white : const Color(0xFF0F1122),
        elevation: 0,
        leading: IconButton(
          icon: Icon(Icons.arrow_back, color: _textColor),
          onPressed: () => Navigator.of(context).pop(),
        ),
        title: Text(
          'Delete Account',
          style: GoogleFonts.outfit(
            color: _textColor,
            fontWeight: FontWeight.w600,
            fontSize: 18,
          ),
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // ── Warning banner ───────────────────────────────────────────
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: Colors.red.shade900.withValues(alpha: _isLight ? 0.08 : 0.3),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: Colors.red.shade700, width: 1),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Icon(Icons.warning_amber_rounded,
                            color: Colors.red.shade700, size: 24),
                        const SizedBox(width: 10),
                        Text(
                          'Permanent Action',
                          style: GoogleFonts.outfit(
                            color: Colors.red.shade700,
                            fontWeight: FontWeight.bold,
                            fontSize: 17,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    Text(
                      'Deleting your account will permanently remove:',
                      style: GoogleFonts.outfit(
                        color: _isLight ? const Color(0xFF991B1B) : Colors.white70,
                        fontSize: 14,
                      ),
                    ),
                    const SizedBox(height: 8),
                    ...[
                      'Your Tapfolio profile and username',
                      'All your connections and tap history',
                      'Your social links and profile data',
                      'Your leaderboard position and score',
                      'Any premium membership (non-refundable)',
                    ].map(
                      (item) => Padding(
                        padding: const EdgeInsets.only(top: 6),
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Icon(Icons.remove_circle_outline,
                                color: Colors.red.shade700, size: 16),
                            const SizedBox(width: 8),
                            Expanded(
                              child: Text(
                                item,
                                style: GoogleFonts.outfit(
                                  color: _isLight ? const Color(0xFF7F1D1D) : Colors.white60,
                                  fontSize: 13,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 32),

              // ── What happens after deletion ──────────────────────────────
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: _cardBg,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(
                    color: _cardBorder,
                  ),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'What happens next',
                      style: GoogleFonts.outfit(
                        color: _textColor,
                        fontWeight: FontWeight.w600,
                        fontSize: 15,
                      ),
                    ),
                    const SizedBox(height: 10),
                    _InfoRow(
                      icon: Icons.lock_clock_outlined,
                      text: 'Your data will be deleted immediately.',
                      subtitleColor: _subtitleColor,
                    ),
                    _InfoRow(
                      icon: Icons.link_off,
                      text:
                          'Anyone who has your NFC card link will see an error.',
                      subtitleColor: _subtitleColor,
                    ),
                    _InfoRow(
                      icon: Icons.no_accounts_outlined,
                      text: 'You will be signed out of all devices.',
                      subtitleColor: _subtitleColor,
                    ),
                    _InfoRow(
                      icon: Icons.restore_from_trash_outlined,
                      text: 'This action cannot be undone.',
                      subtitleColor: _subtitleColor,
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 36),

              // ── Confirmation input ───────────────────────────────────────
              Text(
                'To confirm, type DELETE below:',
                style: GoogleFonts.outfit(
                  color: _textColor,
                  fontSize: 14,
                  fontWeight: FontWeight.w500,
                ),
              ),
              const SizedBox(height: 10),
              AnimatedBuilder(
                animation: _shakeAnim,
                builder: (context, child) => Transform.translate(
                  offset: Offset(_shakeAnim.value * (_shakeController.value < 0.5 ? 1 : -1), 0),
                  child: child,
                ),
                child: TextField(
                  controller: _confirmController,
                  style: GoogleFonts.outfit(
                    color: _textColor,
                    fontWeight: FontWeight.bold,
                    letterSpacing: 2,
                    fontSize: 16,
                  ),
                  textCapitalization: TextCapitalization.characters,
                  decoration: InputDecoration(
                    hintText: 'DELETE',
                    hintStyle: GoogleFonts.outfit(
                      color: _subtitleColor.withValues(alpha: 0.4),
                      letterSpacing: 2,
                    ),
                    filled: true,
                    fillColor: _isLight ? const Color(0xFFE5E7EB) : const Color(0xFF1A1A2E),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: BorderSide(color: _cardBorder),
                    ),
                    enabledBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: BorderSide(color: _cardBorder),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: BorderSide(
                        color: _confirmed ? Colors.red.shade400 : const Color(0xFF6366F1),
                        width: 1.5,
                      ),
                    ),
                    suffixIcon: _confirmed
                        ? Icon(Icons.check_circle, color: Colors.red.shade400)
                        : null,
                  ),
                ),
              ),

              // ── Error message ────────────────────────────────────────────
              if (_errorMessage != null) ...[
                const SizedBox(height: 12),
                Text(
                  _errorMessage!,
                  style: GoogleFonts.outfit(
                    color: Colors.red.shade400,
                    fontSize: 13,
                  ),
                ),
              ],

              const SizedBox(height: 36),

              // ── Delete button ────────────────────────────────────────────
              SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor:
                        _confirmed ? Colors.red.shade700 : (_isLight ? const Color(0xFFE5E7EB) : const Color(0xFF2A2A3E)),
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(14),
                    ),
                    elevation: 0,
                  ),
                  onPressed: _isLoading ? null : _handleDeleteAccount,
                  child: _isLoading
                      ? const SizedBox(
                          width: 22,
                          height: 22,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                            color: Colors.white,
                          ),
                        )
                      : Text(
                          'Permanently Delete My Account',
                          style: GoogleFonts.outfit(
                            fontWeight: FontWeight.bold,
                            fontSize: 15,
                            color: _confirmed
                                ? Colors.white
                                : (_isLight ? Colors.black38 : Colors.white38),
                          ),
                        ),
                ),
              ),

              const SizedBox(height: 16),

              // ── Cancel button ────────────────────────────────────────────
              SizedBox(
                width: double.infinity,
                height: 48,
                child: TextButton(
                  onPressed: () => Navigator.of(context).pop(),
                  child: Text(
                    'Cancel — Keep My Account',
                    style: GoogleFonts.outfit(
                      color: const Color(0xFF6366F1),
                      fontWeight: FontWeight.w500,
                      fontSize: 14,
                    ),
                  ),
                ),
              ),

              const SizedBox(height: 24),

              // ── Privacy reminder ─────────────────────────────────────────
              Center(
                child: Text(
                  'If you have concerns about your data, contact us at\ntapfolio.in@gmail.com',
                  textAlign: TextAlign.center,
                  style: GoogleFonts.outfit(
                    color: _subtitleColor,
                    fontSize: 12,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _InfoRow extends StatelessWidget {
  final IconData icon;
  final String text;
  final Color subtitleColor;
  const _InfoRow({required this.icon, required this.text, required this.subtitleColor});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(top: 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: subtitleColor.withValues(alpha: 0.5), size: 16),
          const SizedBox(width: 10),
          Expanded(
            child: Text(
              text,
              style: GoogleFonts.outfit(
                color: subtitleColor,
                fontSize: 13,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

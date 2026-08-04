import 'package:flutter/foundation.dart';
import 'package:google_sign_in/google_sign_in.dart';
import '../core/config/app_config.dart';
import 'api_service.dart';

class GoogleAuthResult {
  final bool success;
  final String? error;
  final bool isCancelled;
  final Map<String, dynamic>? data;

  GoogleAuthResult({
    required this.success,
    this.error,
    this.isCancelled = false,
    this.data,
  });
}

class GoogleAuthService {
  GoogleAuthService._internal() {
    _googleSignIn = GoogleSignIn(
      clientId: AppConfig.googleClientId,
      serverClientId: AppConfig.serverClientId,
      scopes: const ['email', 'profile'],
    );
  }

  static final GoogleAuthService instance = GoogleAuthService._internal();

  late final GoogleSignIn _googleSignIn;

  GoogleSignIn get rawInstance => _googleSignIn;

  /// Performs native Google Sign-In and exchanges token with backend
  Future<GoogleAuthResult> signInAndAuthenticate(ApiService apiService) async {
    debugPrint('[GOOGLE-AUTH] Starting Google Sign-In flow...');
    try {
      final GoogleSignInAccount? account = await _googleSignIn.signIn();
      if (account == null) {
        debugPrint('[GOOGLE-AUTH] User cancelled Google Sign-In picker.');
        return GoogleAuthResult(
          success: false,
          isCancelled: true,
        );
      }

      debugPrint('[GOOGLE-AUTH] Account selected: ${account.email}');
      final GoogleSignInAuthentication auth = await account.authentication;

      final idToken = auth.idToken;
      final accessToken = auth.accessToken;

      debugPrint(
        '[GOOGLE-AUTH] Auth token status: idTokenPresent=${idToken != null && idToken.isNotEmpty}, accessTokenPresent=${accessToken != null && accessToken.isNotEmpty}',
      );

      if (idToken == null || idToken.isEmpty) {
        debugPrint(
          '[GOOGLE-AUTH-ERROR] idToken is null or empty. Falling back or reporting configuration error.',
        );
      }

      final res = await apiService.googleLogin(
        idToken ?? 'mock_token',
        email: account.email,
        name: account.displayName ?? account.email.split('@').first,
      );

      debugPrint('[GOOGLE-AUTH] Backend authentication response: success=${res['success']}');

      if (res['success'] == true) {
        return GoogleAuthResult(
          success: true,
          data: res,
        );
      } else {
        return GoogleAuthResult(
          success: false,
          error: res['error'] ?? 'Backend Google authentication failed.',
        );
      }
    } catch (e, stack) {
      debugPrint('[GOOGLE-AUTH-EXCEPTION] Exception during Google Sign-In: $e\n$stack');
      return GoogleAuthResult(
        success: false,
        error: 'Google Sign-In failed: ${e.toString()}',
      );
    }
  }

  /// Signs out from Google Sign-In session
  Future<void> signOut() async {
    try {
      debugPrint('[GOOGLE-AUTH] Signing out Google session...');
      await _googleSignIn.signOut();
      await _googleSignIn.disconnect();
    } catch (e) {
      debugPrint('[GOOGLE-AUTH] Error during sign out (non-fatal): $e');
    }
  }
}

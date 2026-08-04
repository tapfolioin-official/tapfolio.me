class ApiEndpoints {
  static const String login = '/api/auth/login';
  static const String register = '/api/auth/register';
  static const String sendOtp = '/api/auth/send-otp';
  static const String resendOtp = '/api/auth/resend-otp';
  static const String verifyOtp = '/api/auth/verify-otp';
  static const String forgotSendOtp = '/api/auth/forgot-password/send-otp';
  static const String forgotVerifyOtp = '/api/auth/forgot-password/verify-otp';
  static const String forgotReset = '/api/auth/forgot-password/reset';
  static const String googleLogin = '/api/auth/google';
  static const String usernameCheck = '/api/auth/username-check';
  static const String onboarding = '/api/profile/onboarding';
  static const String initProfile = '/api/profile/init';
  static const String logout = '/api/auth/logout';
  static const String me = '/api/auth/me';
  static const String profile = '/api/profile';
  static const String upload = '/api/upload';
  static const String tap = '/api/profile/tap';
  static const String history = '/api/history';
  static const String leaderboard = '/api/leaderboard';
  static const String version = '/api/version';

  // Theme / Customizer
  static const String theme = '/api/profile/theme';
  static const String themeReset = '/api/profile/theme/reset';
  static const String themeMarketplace = '/api/profile/theme/marketplace';

  static const String lookup = '/api/connections/lookup';
  static const String connectionRequest = '/api/connections/request';
  static const String connectionRequests = '/api/connections/requests';
  static const String connectionAccept = '/api/connections/accept';
  static const String connectionReject = '/api/connections/reject';
  static const String connections = '/api/connections';
  static const String connectionSettings = '/api/connections/settings';
  static const String connectionVisibility = '/api/connections/visibility';

  static const String notifications = '/api/notifications';
  static const String unreadNotificationCount = '/api/notifications/unread-count';
  static const String readNotification = '/api/notifications/read';
  static const String fcmRegisterToken = '/api/notifications/register-token';
}

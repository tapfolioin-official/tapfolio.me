/// Centralized cache key constants.
///
/// Every key used by [OfflineCache] is defined here so that we never
/// hard-code a string elsewhere in the codebase.
class CacheKeys {
  CacheKeys._(); // prevent instantiation

  static const String me = 'cache_me';
  static const String profile = 'cache_profile';
  static const String connections = 'cache_connections';
  static const String pendingRequests = 'cache_pending_requests';
  static const String notifications = 'cache_notifications';
  static const String unreadCount = 'cache_unread_count';
  static const String history = 'cache_history';
  static const String leaderboard = 'cache_leaderboard';
  static const String theme = 'cache_theme';
  static const String sharingSettings = 'cache_sharing_settings';
  static const String cards = 'cache_cards';
  static const String activeCard = 'cache_active_card';

  /// The current cache schema version. Bump this when models change
  /// so that stale caches from older app versions are discarded.
  static const int cacheVersion = 2;
  static const String cacheVersionKey = 'cache_version';

  /// All data keys (used for bulk clear on logout).
  static const List<String> allDataKeys = [
    me,
    profile,
    connections,
    pendingRequests,
    notifications,
    unreadCount,
    history,
    leaderboard,
    theme,
    sharingSettings,
    cards,
    activeCard,
  ];
}

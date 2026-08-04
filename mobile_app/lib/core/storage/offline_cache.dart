import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'cache_keys.dart';

/// A lightweight, generic offline cache backed by [SharedPreferences].
///
/// Every entry is stored as a JSON envelope:
/// ```json
/// { "v": 1, "cachedAt": 1754298200000, "data": <payload> }
/// ```
///
/// On startup the cache version is compared to [CacheKeys.cacheVersion].
/// If they differ the entire cache is purged so stale data from older app
/// versions never surfaces.
class OfflineCache {
  static final OfflineCache _instance = OfflineCache._internal();
  factory OfflineCache() => _instance;
  OfflineCache._internal();

  SharedPreferences? _prefs;
  bool _initialized = false;

  /// Initialize once, typically called from [ApiService.init].
  Future<void> init() async {
    if (_initialized) return;
    _prefs = await SharedPreferences.getInstance();
    _initialized = true;
    await _validateVersion();
  }

  // ─── Generic helpers ────────────────────────────────────────────────────

  /// Store an arbitrary JSON-serializable value under [key].
  Future<void> saveJson(String key, dynamic data) async {
    _ensureInitialized();
    final envelope = {
      'v': CacheKeys.cacheVersion,
      'cachedAt': DateTime.now().millisecondsSinceEpoch,
      'data': data,
    };
    await _prefs!.setString(key, jsonEncode(envelope));
    debugPrint('[OFFLINE-CACHE] Saved "$key"');
  }

  /// Load the cached value for [key], or `null` if nothing is cached.
  dynamic loadJson(String key) {
    _ensureInitialized();
    final raw = _prefs!.getString(key);
    if (raw == null) return null;
    try {
      final envelope = jsonDecode(raw) as Map<String, dynamic>;
      // Discard entries written by an older schema version
      final version = envelope['v'] as int? ?? 0;
      if (version != CacheKeys.cacheVersion) {
        debugPrint('[OFFLINE-CACHE] Stale version for "$key" (v$version != v${CacheKeys.cacheVersion}). Discarding.');
        _prefs!.remove(key);
        return null;
      }
      return envelope['data'];
    } catch (e) {
      debugPrint('[OFFLINE-CACHE] Corrupt entry for "$key": $e');
      _prefs!.remove(key);
      return null;
    }
  }

  /// Returns true if a valid cache entry exists for [key].
  bool exists(String key) {
    return loadJson(key) != null;
  }

  /// Remove a single cache entry.
  Future<void> clear(String key) async {
    _ensureInitialized();
    await _prefs!.remove(key);
    debugPrint('[OFFLINE-CACHE] Cleared "$key"');
  }

  /// Remove ALL data cache entries (called on logout).
  /// Does NOT touch the JWT or other non-cache preferences.
  Future<void> clearAll() async {
    _ensureInitialized();
    for (final key in CacheKeys.allDataKeys) {
      await _prefs!.remove(key);
    }
    debugPrint('[OFFLINE-CACHE] All caches cleared (logout).');
  }

  /// Returns the `DateTime` the cache entry for [key] was written,
  /// or `null` if there is no entry.
  DateTime? cachedAt(String key) {
    _ensureInitialized();
    final raw = _prefs!.getString(key);
    if (raw == null) return null;
    try {
      final envelope = jsonDecode(raw) as Map<String, dynamic>;
      final ms = envelope['cachedAt'] as int?;
      return ms != null ? DateTime.fromMillisecondsSinceEpoch(ms) : null;
    } catch (_) {
      return null;
    }
  }

  /// Human-friendly "Last synced X ago" string for a given key.
  String? lastSyncedLabel(String key) {
    final dt = cachedAt(key);
    if (dt == null) return null;
    final diff = DateTime.now().difference(dt);
    if (diff.inSeconds < 60) return 'Synced just now';
    if (diff.inMinutes < 60) return 'Last synced ${diff.inMinutes}m ago';
    if (diff.inHours < 24) return 'Last synced ${diff.inHours}h ago';
    return 'Last synced ${diff.inDays}d ago';
  }

  // ─── Internal ───────────────────────────────────────────────────────────

  void _ensureInitialized() {
    assert(_initialized, 'OfflineCache.init() must be called before use.');
  }

  /// Compare persisted cache version to current code version.
  /// If they differ, wipe everything so stale schemas don't crash parsing.
  Future<void> _validateVersion() async {
    final stored = _prefs!.getInt(CacheKeys.cacheVersionKey) ?? 0;
    if (stored != CacheKeys.cacheVersion) {
      debugPrint('[OFFLINE-CACHE] Cache version mismatch ($stored → ${CacheKeys.cacheVersion}). Purging.');
      await clearAll();
      await _prefs!.setInt(CacheKeys.cacheVersionKey, CacheKeys.cacheVersion);
    }
  }
}

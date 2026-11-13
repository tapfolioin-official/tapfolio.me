import 'package:flutter/material.dart';
import '../../services/api_service.dart';
import '../../models/profile.dart';
import '../../screens/dashboard/widgets/discover_connections_row.dart'; // for DiscoverUserItem

class DiscoverConnectionsController extends ChangeNotifier {
  final ApiService apiService;
  Profile? _profile;

  DiscoverConnectionsController({required this.apiService});

  // Public getters
  List<DiscoverUserItem> get discoverUsers => _discoverUsers;
  Set<int> get connectedUserIds => _connectedUserIds;
  Set<int> get connectingUserIds => _connectingUserIds;

  // Internal state
  List<DiscoverUserItem> _discoverUsers = [];
  Set<int> _connectedUserIds = {};
  final Set<int> _connectingUserIds = {};

  // Called by Dashboard when profile is available
  void setProfile(Profile profile) {
    _profile = profile;
    _loadDiscover();
  }

  // Dashboard updates the set of already connected user IDs
  void updateConnectedUserIds(Set<int> ids) {
    _connectedUserIds = ids;
    notifyListeners();
  }

  // Refresh discover list (e.g., pull‑to‑refresh)
  Future<void> refresh() async {
    await _loadDiscover();
  }

  // Internal: fetch, filter, dedupe, shuffle
  Future<void> _loadDiscover() async {
    try {
      final leaderboard = await apiService.getLeaderboard();
      List<DiscoverUserItem> items = [];
      if (leaderboard.isNotEmpty) {
        items = leaderboard.map((p) => DiscoverUserItem.fromProfile(p)).toList();
      }
      if (items.isEmpty) {
        items = _fallbackDiscoverUsers();
      }

      // Filter out the logged‑in user
      final myUserId = _profile?.userId;
      final myUsername = _profile?.username.toLowerCase();
      items = items.where((u) {
        if (myUserId != null && u.userId == myUserId) return false;
        if (myUsername != null && u.username.toLowerCase() == myUsername) return false;
        return true;
      }).toList();

      // Deduplicate by userId and username
      final seenIds = <int>{};
      final seenUsernames = <String>{};
      final unique = <DiscoverUserItem>[];
      for (final item in items) {
        final uname = item.username.toLowerCase();
        if (!seenIds.contains(item.userId) && !seenUsernames.contains(uname)) {
          seenIds.add(item.userId);
          seenUsernames.add(uname);
          unique.add(item);
        }
      }

      // Random order – shuffle once per load
      unique.shuffle();
      _discoverUsers = unique;
      notifyListeners();
    } catch (e) {
      debugPrint('[DiscoverCtrl] error loading discover users: $e');
      // In case of error, fall back to static list
      _discoverUsers = _fallbackDiscoverUsers()..shuffle();
      notifyListeners();
    }
  }

  // Connection request handling
  Future<void> connectUser(DiscoverUserItem user, BuildContext context) async {
    if (_connectedUserIds.contains(user.userId) || _connectingUserIds.contains(user.userId)) return;
    _connectingUserIds.add(user.userId);
    notifyListeners();
    try {
      final res = await apiService.sendConnectionRequest(user.username, via: 'discover');
      if (res['success'] == true || res['status'] == 'connected' || res['status'] == 'accepted') {
        _connectedUserIds.add(user.userId);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Connected with ${user.name}!'), backgroundColor: const Color(0xFF10B981)),
        );
      } else if (res['status'] == 'pending') {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Connection request sent to ${user.name}.'), backgroundColor: const Color(0xFF0052FF)),
        );
      } else {
        // Fallback for offline/demo mode
        _connectedUserIds.add(user.userId);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Connected with ${user.name}!'), backgroundColor: const Color(0xFF10B981)),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Connection error: $e'), backgroundColor: Colors.redAccent),
      );
    } finally {
      _connectingUserIds.remove(user.userId);
      notifyListeners();
    }
  }

  // Filtering
  List<DiscoverUserItem> _filteredUsers = [];

  List<DiscoverUserItem> get filteredUsers => _filteredUsers.isEmpty ? _discoverUsers : _filteredUsers;

  void filter(String query) {
    if (query.isEmpty) {
      _filteredUsers = [];
    } else {
      final lower = query.toLowerCase();
      _filteredUsers = _discoverUsers.where((u) => u.name.toLowerCase().contains(lower) || u.username.toLowerCase().contains(lower) || u.tagline.toLowerCase().contains(lower)).toList();
    }
    notifyListeners();
  }

  // Static fallback data
  List<DiscoverUserItem> _fallbackDiscoverUsers() => const [
    DiscoverUserItem(
      userId: 101,
      username: 'antony_alex',
      name: 'Antony Alex',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
      tagline: "Let's connect!",
    ),
    DiscoverUserItem(
      userId: 102,
      username: 'nibras_test',
      name: 'Nibras-Test',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
      tagline: "Let's connect!",
    ),
    DiscoverUserItem(
      userId: 103,
      username: 'abhinand',
      name: 'Abhinand',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200',
      tagline: "Let's connect!",
    ),
    DiscoverUserItem(
      userId: 104,
      username: 'mohammed_nibras',
      name: 'Mohammed',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
      tagline: 'Student & Tech',
    ),
    DiscoverUserItem(
      userId: 105,
      username: 'sneha_iyer',
      name: 'Sneha Iyer',
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200',
      tagline: 'Business Analyst',
    ),
  ];
}

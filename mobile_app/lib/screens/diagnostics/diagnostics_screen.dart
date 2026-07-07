import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:package_info_plus/package_info_plus.dart';
import '../../core/api/api_client.dart';
import '../../core/storage/local_storage.dart';
import '../../core/api/api_endpoints.dart';

class DiagnosticsScreen extends StatefulWidget {
  const DiagnosticsScreen({super.key});

  @override
  State<DiagnosticsScreen> createState() => _DiagnosticsScreenState();
}

class _DiagnosticsScreenState extends State<DiagnosticsScreen> {
  final ApiClient _apiClient = ApiClient();
  final LocalStorage _storage = LocalStorage();

  bool _loading = true;
  String _appName = 'Tapfolio';
  String _packageName = 'com.tapfolio.app';
  String _appVersion = '1.0.0';
  String _buildNumber = '1';
  
  bool _apiReachable = false;
  String _serverVersion = 'Unknown';
  String _connectionDetails = 'Testing...';

  @override
  void initState() {
    super.initState();
    _runDiagnostics();
  }

  Future<void> _runDiagnostics() async {
    setState(() {
      _loading = true;
    });

    try {
      final info = await PackageInfo.fromPlatform();
      setState(() {
        _appName = info.appName;
        _packageName = info.packageName;
        _appVersion = info.version;
        _buildNumber = info.buildNumber;
      });
    } catch (_) {}

    try {
      final response = await _apiClient.sendRequest('GET', ApiEndpoints.version, authenticated: false);
      if (response.statusCode == 200) {
        _apiReachable = true;
        _serverVersion = 'Reachable (200)';
        _connectionDetails = 'Endpoint successfully verified!';
      } else {
        _apiReachable = false;
        _serverVersion = 'Error (${response.statusCode})';
        _connectionDetails = 'Server returned error status.';
      }
    } catch (e) {
      _apiReachable = false;
      _serverVersion = 'Offline / Error';
      _connectionDetails = e.toString();
    }

    setState(() {
      _loading = false;
    });
  }

  String get _buildMode {
    if (kReleaseMode) return 'Release';
    if (kProfileMode) return 'Profile';
    return 'Debug';
  }

  @override
  Widget build(BuildContext context) {
    final token = _storage.jwtToken;
    final tokenPreview = token != null && token.isNotEmpty
        ? '${token.substring(0, token.length > 15 ? 15 : token.length)}...'
        : 'None Stored';

    return Scaffold(
      backgroundColor: const Color(0xFF06070D),
      appBar: AppBar(
        backgroundColor: const Color(0xFF0F1122),
        title: Text('Diagnostics Dashboard', style: GoogleFonts.outfit(fontWeight: FontWeight.bold)),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh_rounded),
            onPressed: _runDiagnostics,
          ),
        ],
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator(color: Color(0xFF6366F1)))
          : ListView(
              padding: const EdgeInsets.all(16),
              children: [
                _buildSectionHeader('Application Info'),
                _buildDiagnosticTile('App Name', _appName, Icons.phone_android),
                _buildDiagnosticTile('Package ID', _packageName, Icons.label_outline),
                _buildDiagnosticTile('Version', '$_appVersion ($_buildNumber)', Icons.info_outline),
                _buildDiagnosticTile('Build Mode', _buildMode, Icons.build_circle_outlined),
                
                const SizedBox(height: 16),
                _buildSectionHeader('Environment & Network'),
                _buildDiagnosticTile('API base URL', _apiClient.baseUrl, Icons.link_rounded),
                _buildDiagnosticTile(
                  'API Connection',
                  _apiReachable ? 'CONNECTED' : 'FAILED',
                  Icons.wifi_tethering_rounded,
                  color: _apiReachable ? Colors.green : Colors.red,
                ),
                _buildDiagnosticTile('Server Version Check', _serverVersion, Icons.cloud_done_outlined),
                _buildDiagnosticTile('Test Details', _connectionDetails, Icons.terminal_outlined),

                const SizedBox(height: 16),
                _buildSectionHeader('Authentication & Cache'),
                _buildDiagnosticTile('JWT Exists', _storage.isAuthenticated ? 'YES' : 'NO', Icons.vpn_key_outlined),
                _buildDiagnosticTile('Token Preview', tokenPreview, Icons.security_outlined),
                
                const SizedBox(height: 24),
                ElevatedButton.icon(
                  onPressed: () => Navigator.pop(context),
                  icon: const Icon(Icons.arrow_back_rounded),
                  label: const Text('Back to Profile'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF6366F1),
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                ),
              ],
            ),
    );
  }

  Widget _buildSectionHeader(String title) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8, left: 4),
      child: Text(
        title.toUpperCase(),
        style: GoogleFonts.outfit(
          color: const Color(0xFF6366F1),
          fontWeight: FontWeight.bold,
          fontSize: 12,
          letterSpacing: 1.2,
        ),
      ),
    );
  }

  Widget _buildDiagnosticTile(String title, String value, IconData icon, {Color? color}) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: const Color(0xFF0F1122),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.white.withValues(alpha: 0.05)),
      ),
      child: Row(
        children: [
          Icon(icon, color: color ?? Colors.white70, size: 20),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: GoogleFonts.outfit(color: Colors.white38, fontSize: 11),
                ),
                const SizedBox(height: 2),
                Text(
                  value,
                  style: GoogleFonts.outfit(
                    color: color ?? Colors.white,
                    fontWeight: FontWeight.w500,
                    fontSize: 14,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

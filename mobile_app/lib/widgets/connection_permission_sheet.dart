import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../models/connection.dart';
import '../services/api_service.dart';

class ConnectionPermissionSheet extends StatefulWidget {
  const ConnectionPermissionSheet({super.key});

  @override
  State<ConnectionPermissionSheet> createState() => _ConnectionPermissionSheetState();
}

class _ConnectionPermissionSheetState extends State<ConnectionPermissionSheet> {
  final ApiService _api = ApiService();

  // ── Light-mode design tokens ──────────────────────────────────────────────
  static const _blue = Color(0xFF3B82F6);
  static const _textPrimary = Color(0xFF111827);
  static const _textSecondary = Color(0xFF6B7280);
  static const _borderColor = Color(0xFFE5E7EB);
  static const _iconBgColor = Color(0xFFEFF6FF);

  bool _shareName = true;
  bool _shareEmail = true;
  bool _sharePhone = false;
  bool _shareWhatsapp = true;
  bool _shareLocation = false;
  bool _loading = true;
  bool _saving = false;

  @override
  void initState() {
    super.initState();
    _loadSettings();
  }

  Future<void> _loadSettings() async {
    final settings = await _api.getSharingSettings();
    if (settings != null && mounted) {
      setState(() {
        _shareName = settings.shareName;
        _shareEmail = settings.shareEmail;
        _sharePhone = settings.sharePhone;
        _shareWhatsapp = settings.shareWhatsapp;
        _shareLocation = settings.shareLocation;
        _loading = false;
      });
    } else if (mounted) {
      setState(() => _loading = false);
    }
  }

  Future<void> _confirm() async {
    setState(() => _saving = true);
    final perms = ConnectionPermissionData(
      shareName: _shareName,
      shareEmail: _shareEmail,
      sharePhone: _sharePhone,
      shareWhatsapp: _shareWhatsapp,
      shareLocation: _shareLocation,
    );
    final result = await _api.updateSharingSettings(perms);
    if (mounted) {
      setState(() => _saving = false);
      if (result['success'] == true) {
        Navigator.pop(context);
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Sharing settings saved!'), backgroundColor: Color(0xFF10b981)),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(result['error'] ?? 'Save failed.'), backgroundColor: Colors.redAccent),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      padding: EdgeInsets.only(
        left: 24,
        right: 24,
        top: 24,
        bottom: MediaQuery.of(context).viewInsets.bottom + 24,
      ),
      child: _loading
          ? const SizedBox(
              height: 200,
              child: Center(child: CircularProgressIndicator(color: _blue)),
            )
          : Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Center(
                  child: Container(
                    width: 40, height: 4,
                    decoration: BoxDecoration(
                      color: const Color(0xFFD1D5DB),
                      borderRadius: BorderRadius.circular(2),
                    ),
                  ),
                ),
                const SizedBox(height: 24),

                Text(
                  'Global Sharing Settings',
                  style: GoogleFonts.outfit(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: _textPrimary,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  'Choose what details are visible to your connections.',
                  style: GoogleFonts.outfit(fontSize: 13, color: _textSecondary),
                ),

                const SizedBox(height: 24),
                Divider(color: _borderColor),

                _buildToggle('Name', 'Your display name', Icons.person_outline, _shareName,
                    (v) => setState(() => _shareName = v)),
                _buildToggle('Email', 'Your account email address', Icons.email_outlined, _shareEmail,
                    (v) => setState(() => _shareEmail = v)),
                _buildToggle('Phone', 'Your phone number', Icons.phone_outlined, _sharePhone,
                    (v) => setState(() => _sharePhone = v)),
                _buildToggle('WhatsApp', 'Your WhatsApp link', Icons.chat_outlined, _shareWhatsapp,
                    (v) => setState(() => _shareWhatsapp = v)),
                _buildToggle('Location', 'Your location tag', Icons.location_on_outlined, _shareLocation,
                    (v) => setState(() => _shareLocation = v)),

                const SizedBox(height: 24),

                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: _saving ? null : _confirm,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: _blue,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 15),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                      elevation: 0,
                    ),
                    child: _saving
                        ? const SizedBox(
                            width: 20, height: 20,
                            child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
                          )
                        : Text(
                            'Save Settings',
                            style: GoogleFonts.outfit(fontWeight: FontWeight.w700, fontSize: 16),
                          ),
                  ),
                ),
              ],
            ),
    );
  }

  Widget _buildToggle(
    String label,
    String description,
    IconData icon,
    bool value,
    ValueChanged<bool> onChanged,
  ) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: _iconBgColor,
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(icon, color: _blue, size: 20),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(label, style: GoogleFonts.outfit(color: _textPrimary, fontWeight: FontWeight.w600, fontSize: 14)),
                Text(description, style: GoogleFonts.outfit(color: _textSecondary, fontSize: 12)),
              ],
            ),
          ),
          Switch(
            value: value,
            onChanged: onChanged,
            activeColor: _blue,
            activeTrackColor: _blue.withValues(alpha: 0.30),
            inactiveThumbColor: const Color(0xFFD1D5DB),
            inactiveTrackColor: const Color(0xFFE5E7EB),
          ),
        ],
      ),
    );
  }
}

import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../models/history_event.dart';
import '../core/utils/color_parser.dart';
import '../services/api_service.dart';

class HistoryScreen extends StatefulWidget {
  const HistoryScreen({super.key});

  @override
  State<HistoryScreen> createState() => _HistoryScreenState();
}

class _HistoryScreenState extends State<HistoryScreen> {
  final ApiService _apiService = ApiService();
  List<HistoryEvent> _events = [];
  bool _loading = true;
  String? _error;

  bool get _isLight => Theme.of(context).brightness == Brightness.light;
  Color get _textColor => _isLight ? const Color(0xFF1F2937) : Colors.white;
  Color get _subtitleColor => _isLight ? const Color(0xFF4B5563) : Colors.white60;
  Color get _cardBg => _isLight ? Colors.white : Colors.white.withValues(alpha: 0.03);
  Color get _cardBorder => _isLight ? Colors.black12 : Colors.white.withValues(alpha: 0.06);

  _HistoryScreenState() {
    debugPrint('[TRACE-HISTORY] State constructor called.');
  }

  @override
  void initState() {
    debugPrint('[TRACE-HISTORY] initState() started.');
    super.initState();
    _fetchHistory();
    debugPrint('[TRACE-HISTORY] initState() completed.');
  }

  Future<void> _fetchHistory() async {
    setState(() {
      _loading = true;
      _error = null;
    });

    try {
      final res = await _apiService.getHistory();
      setState(() {
        _events = res;
      });
    } catch (e) {
      setState(() {
        _error = 'Failed to load connection logs';
      });
    } finally {
      setState(() {
        _loading = false;
      });
    }
  }

  String _formatDateTime(String isoString) {
    try {
      final date = DateTime.parse(isoString).toLocal();
      // Simple format: e.g. "June 7, 2026 at 8:40 PM"
      final months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ];
      final month = months[date.month - 1];
      final hour = date.hour > 12 ? date.hour - 12 : (date.hour == 0 ? 12 : date.hour);
      final ampm = date.hour >= 12 ? 'PM' : 'AM';
      final minute = date.minute.toString().padLeft(2, '0');

      return '$month ${date.day}, ${date.year} • $hour:$minute $ampm';
    } catch (_) {
      return isoString;
    }
  }

  Color _getEventColor(String? colorStr) {
    return parseHexColor(colorStr);
  }

  @override
  Widget build(BuildContext context) {
    debugPrint('[TRACE-HISTORY] build() called.');
    return Scaffold(
      backgroundColor: _isLight ? const Color(0xFFF3F4F6) : const Color(0xFF06070D),
      body: RefreshIndicator(
        onRefresh: _fetchHistory,
        color: const Color(0xFF6366F1),
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Connection Logs',
                style: GoogleFonts.outfit(
                  color: _textColor,
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                'Monitor active engagement on your profile. See when and how users connect with your card.',
                style: GoogleFonts.outfit(
                  color: _subtitleColor,
                  fontSize: 14,
                ),
              ),
              const SizedBox(height: 24),
              if (_loading)
                const Center(child: Padding(
                  padding: EdgeInsets.only(top: 40.0),
                  child: CircularProgressIndicator(color: Color(0xFF6366F1)),
                ))
              else if (_error != null)
                Center(
                  child: Padding(
                    padding: const EdgeInsets.only(top: 40.0),
                    child: Text(_error!, style: const TextStyle(color: Colors.redAccent)),
                  ),
                )
              else if (_events.isEmpty)
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    color: _cardBg,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: _cardBorder),
                  ),
                  child: Column(
                    children: [
                      const Icon(Icons.signal_cellular_alt, size: 60, color: Colors.white30),
                      const SizedBox(height: 16),
                      Text(
                        'No Interaction Events',
                        style: GoogleFonts.outfit(color: _textColor, fontSize: 18, fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 6),
                      Text(
                        'Your NFC card has not been scanned or tapped by other users yet.',
                        style: GoogleFonts.outfit(color: _subtitleColor, fontSize: 13),
                        textAlign: TextAlign.center,
                      ),
                    ],
                  ),
                )
              else
                ListView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: _events.length,
                  itemBuilder: (context, index) {
                    final event = _events[index];
                    final eventColor = _getEventColor(event.color);

                    return Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Timeline Connector Visual
                        Column(
                          children: [
                            Container(
                              width: 32,
                              height: 32,
                              decoration: BoxDecoration(
                                color: eventColor.withValues(alpha: 0.15),
                                shape: BoxShape.circle,
                                border: Border.all(color: eventColor.withValues(alpha: 0.4), width: 1.5),
                              ),
                              alignment: Alignment.center,
                              child: Text(
                                event.icon ?? '🔗',
                                style: const TextStyle(fontSize: 14),
                              ),
                            ),
                            if (index < _events.length - 1)
                              Container(
                                width: 2,
                                height: 50,
                                color: _cardBorder,
                              ),
                          ],
                        ),
                        const SizedBox(width: 16),

                        // Timeline Event Details Box
                        Expanded(
                          child: Container(
                            margin: const EdgeInsets.only(bottom: 16),
                            padding: const EdgeInsets.all(14),
                            decoration: BoxDecoration(
                              color: _cardBg,
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(color: _cardBorder),
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    Text(
                                      event.action,
                                      style: GoogleFonts.outfit(
                                        color: _textColor,
                                        fontWeight: FontWeight.bold,
                                        fontSize: 15,
                                      ),
                                    ),
                                    Text(
                                      _formatDateTime(event.createdAt),
                                      style: GoogleFonts.outfit(
                                        color: _subtitleColor.withValues(alpha: 0.6),
                                        fontSize: 10,
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 6),
                                Text(
                                  event.details,
                                  style: GoogleFonts.outfit(
                                    color: _subtitleColor,
                                    fontSize: 13,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ],
                    );
                  },
                ),
            ],
          ),
        ),
      ),
    );
  }
}

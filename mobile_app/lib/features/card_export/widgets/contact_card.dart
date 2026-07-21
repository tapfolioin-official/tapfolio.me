import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class ContactCard extends StatelessWidget {
  final String? phone;
  final String? whatsapp;
  final String? email;
  final String profileUrl;

  const ContactCard({
    super.key,
    this.phone,
    this.whatsapp,
    this.email,
    required this.profileUrl,
  });

  bool get _hasAnyData =>
      (phone != null && phone!.isNotEmpty) ||
      (whatsapp != null &&
          whatsapp!.isNotEmpty &&
          whatsapp != phone) ||
      (email != null && email!.isNotEmpty) ||
      profileUrl.isNotEmpty;

  @override
  Widget build(BuildContext context) {
    if (!_hasAnyData) return const SizedBox.shrink();

    final cleanUrl = profileUrl.replaceFirst(RegExp(r'^https?://'), '');

    final rows = <_Row>[];

    if (phone != null && phone!.isNotEmpty) {
      rows.add(_Row(icon: Icons.phone_rounded, text: phone!));
    }
    if (whatsapp != null &&
        whatsapp!.isNotEmpty &&
        whatsapp != phone) {
      rows.add(_Row(icon: Icons.chat_bubble_rounded, text: whatsapp!));
    }
    if (email != null && email!.isNotEmpty) {
      rows.add(_Row(icon: Icons.mail_rounded, text: email!));
    }
    if (cleanUrl.isNotEmpty) {
      rows.add(_Row(icon: Icons.language_rounded, text: cleanUrl));
    }

    return ClipRRect(
      borderRadius: BorderRadius.circular(20),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 24, sigmaY: 24),
        child: Container(
          width: double.infinity,
          decoration: BoxDecoration(
            color: Colors.white.withOpacity(0.07),
            borderRadius: BorderRadius.circular(20),
            border: Border.all(
              color: Colors.white.withOpacity(0.10),
              width: 1,
            ),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.22),
                blurRadius: 24,
                offset: const Offset(0, 8),
              ),
            ],
          ),
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: rows.indexed.map(((int, _Row) entry) {
              final index = entry.$1;
              final row = entry.$2;
              return Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  _buildRow(row),
                  if (index < rows.length - 1)
                    Divider(
                      color: Colors.white.withOpacity(0.07),
                      height: 10,
                      thickness: 0.5,
                    ),
                ],
              );
            }).toList(),
          ),
        ),
      ),
    );
  }

  Widget _buildRow(_Row row) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 3),
      child: Row(
        children: [
          Container(
            width: 26,
            height: 26,
            decoration: BoxDecoration(
              color: const Color(0xFF6366F1).withOpacity(0.15),
              borderRadius: BorderRadius.circular(7),
            ),
            child: Icon(row.icon, color: const Color(0xFF8B8CF8), size: 13),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Text(
              row.text,
              overflow: TextOverflow.ellipsis,
              maxLines: 1,
              style: GoogleFonts.outfit(
                color: Colors.white70,
                fontSize: 11.5,
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _Row {
  final IconData icon;
  final String text;
  const _Row({required this.icon, required this.text});
}

import 'package:flutter/material.dart';
import '../models/profile_share_data.dart';
import 'share_via_qr_modal.dart';

/// QR Share Dialog wrapper component providing direct QR presentation.
class QrShareDialog {
  /// Presents the direct QR sharing bottom sheet for the given profile data.
  static Future<void> show(BuildContext context, ProfileShareData shareData) {
    return ShareViaQrModal.show(context, shareData);
  }
}

enum ExportSizePreset {
  story,        // 1080x1920  (9:16)
  post,         // 1080x1350  (4:5)
  businessCard, // 1012x638   (credit card)
  square,       // 1080x1080  (1:1)
  landscape,    // 1200x627
  hd,           // 2048x2048
  print,        // 300 DPI
}

class ExportOptions {
  final ExportSizePreset sizePreset;
  final bool removeBranding;

  ExportOptions({
    required this.sizePreset,
    this.removeBranding = false,
  });
}

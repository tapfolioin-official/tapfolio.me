enum ExportSizePreset {
  story,     // 1080x1920
  square,    // 1080x1080
  landscape, // 1200x627
  hd,        // 2048x2048
  print,     // 300 DPI
}

class ExportOptions {
  final ExportSizePreset sizePreset;
  final bool removeBranding;

  ExportOptions({
    required this.sizePreset,
    this.removeBranding = false,
  });
}

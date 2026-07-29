import '../models/export_options.dart';
import '../utils/export_constants.dart';

class ExportFormatService {
  static Map<String, double> getDimensions(ExportSizePreset preset) {
    switch (preset) {
      case ExportSizePreset.story:
        return {'width': ExportConstants.storyWidth, 'height': ExportConstants.storyHeight};
      case ExportSizePreset.post:
        return {'width': ExportConstants.postWidth, 'height': ExportConstants.postHeight};
      case ExportSizePreset.businessCard:
        return {'width': ExportConstants.bizCardWidth, 'height': ExportConstants.bizCardHeight};
      case ExportSizePreset.square:
        return {'width': ExportConstants.squareWidth, 'height': ExportConstants.squareHeight};
      case ExportSizePreset.landscape:
        return {'width': ExportConstants.landscapeWidth, 'height': ExportConstants.landscapeHeight};
      case ExportSizePreset.hd:
        return {'width': ExportConstants.hdWidth, 'height': ExportConstants.hdHeight};
      case ExportSizePreset.print:
        return {'width': 2480, 'height': 3508}; // A4 at 300 DPI mockup
    }
  }
}

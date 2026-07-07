import 'dart:io';

class AppError implements Exception {
  final String message;
  final String? technicalDetails;

  AppError(this.message, {this.technicalDetails});

  @override
  String toString() => message;
}

class ErrorHandler {
  static AppError handle(dynamic error, [StackTrace? stackTrace]) {
    String friendlyMessage = 'An unexpected error occurred. Please try again.';
    String details = error.toString();

    if (error is SocketException) {
      friendlyMessage = 'Connection failed. Please check your internet connection.';
    } else if (error is HttpException) {
      friendlyMessage = 'Unable to reach the server. Please try again later.';
    } else if (error is FormatException) {
      friendlyMessage = 'Invalid data format received from server.';
    } else if (error is AppError) {
      return error;
    }

    return AppError(friendlyMessage, technicalDetails: details);
  }
}

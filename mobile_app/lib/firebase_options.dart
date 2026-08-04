import 'package:firebase_core/firebase_core.dart' show FirebaseOptions;
import 'package:flutter/foundation.dart'
    show defaultTargetPlatform, kIsWeb, TargetPlatform;

/// Default [FirebaseOptions] for use with your Firebase apps.
class DefaultFirebaseOptions {
  static FirebaseOptions get currentPlatform {
    if (kIsWeb) {
      return web;
    }
    switch (defaultTargetPlatform) {
      case TargetPlatform.android:
        return android;
      case TargetPlatform.iOS:
        return ios;
      case TargetPlatform.macOS:
        return macos;
      case TargetPlatform.windows:
        throw UnsupportedError(
          'DefaultFirebaseOptions have not been configured for windows.',
        );
      case TargetPlatform.linux:
        throw UnsupportedError(
          'DefaultFirebaseOptions have not been configured for linux.',
        );
      default:
        throw UnsupportedError(
          'DefaultFirebaseOptions are not supported for this platform.',
        );
    }
  }

  static const FirebaseOptions web = FirebaseOptions(
    apiKey: 'AIzaSyCKHc3Gt5zosmGmTVzc-LLSR42e8Gjbedc',
    appId: '1:533947683458:web:ee2ab6597c85bf5e811a9b',
    messagingSenderId: '533947683458',
    projectId: 'tapfolio-d39fa',
    authDomain: 'tapfolio-d39fa.firebaseapp.com',
    storageBucket: 'tapfolio-d39fa.firebasestorage.app',
    measurementId: 'G-E0MSYNBHWT',
  );

  static const FirebaseOptions android = FirebaseOptions(
    apiKey: 'AIzaSyDvynsis7Msl-nhUhpozb7wMFHDFvGuvg8',
    appId: '1:533947683458:android:c53652a62ebd4708811a9b',
    messagingSenderId: '533947683458',
    projectId: 'tapfolio-d39fa',
    storageBucket: 'tapfolio-d39fa.firebasestorage.app',
  );

  static const FirebaseOptions ios = FirebaseOptions(
    apiKey: 'AIzaSyBvXgOBpNcNkRMUT7xabv-0F05EuRzoSxA',
    appId: '1:533947683458:ios:462a8018f832d4ff811a9b',
    messagingSenderId: '533947683458',
    projectId: 'tapfolio-d39fa',
    storageBucket: 'tapfolio-d39fa.firebasestorage.app',
    iosBundleId: 'com.tapfolio.app',
  );

  static const FirebaseOptions macos = FirebaseOptions(
    apiKey: 'AIzaSyBvXgOBpNcNkRMUT7xabv-0F05EuRzoSxA',
    appId: '1:533947683458:ios:462a8018f832d4ff811a9b',
    messagingSenderId: '533947683458',
    projectId: 'tapfolio-d39fa',
    storageBucket: 'tapfolio-d39fa.firebasestorage.app',
    iosBundleId: 'com.tapfolio.app',
  );
}

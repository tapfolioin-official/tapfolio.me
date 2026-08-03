import Flutter
import UIKit

@main
@objc class AppDelegate: FlutterAppDelegate, FlutterImplicitEngineDelegate {
  override func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
  ) -> Bool {
    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }

  func didInitializeImplicitFlutterEngine(_ engineBridge: FlutterImplicitEngineBridge) {
    GeneratedPluginRegistrant.register(with: engineBridge.pluginRegistry)
    
    let channel = FlutterMethodChannel(
      name: "me.tapfolio.app/config",
      binaryMessenger: engineBridge.applicationRegistrar.messenger()
    )
    channel.setMethodCallHandler { (call, result) in
      if call.method == "isFirebaseConfigured" {
        let plistPath = Bundle.main.path(forResource: "GoogleService-Info", ofType: "plist")
        result(plistPath != nil)
      } else {
        result(FlutterMethodNotImplemented)
      }
    }
  }
}

import 'package:http/http.dart' as http;
import 'package:http/browser_client.dart' as browser;

http.Client getClient() {
  final client = browser.BrowserClient();
  // withCredentials = true works now because the proxy sends a specific
  // Access-Control-Allow-Origin (not wildcard) matching the Flutter dev server.
  client.withCredentials = true;
  return client;
}

import 'dart:convert';
import 'package:flutter_test/flutter_test.dart';
import 'package:app/models/profile.dart';

void main() {
  test('Profile.fromJson test', () {
    print('Starting Profile.fromJson test...');
    final responseBody = '{"success":true,"profile":{"id":1,"userId":1,"name":"Nibras Amin","username":"nibras","tagline":"Skill Let\'s connect!","avatar":"/profile_avatar.png","isOnline":false,"bio":"Initializing profile...","phone":null,"whatsapp":null,"location":null,"diamonds":"0","isPremium":false,"tapCount":0,"createdAt":"2026-07-02T23:09:11.145Z","updatedAt":"2026-07-06T12:04:12.180Z","tags":[],"socials":[]}}';
    
    final data = json.decode(responseBody);
    final profile = Profile.fromJson(data['profile']);
    print('SUCCESS! parsed profile: ${profile.name}');
  });
}

import 'dart:convert';
import 'package:flutter_test/flutter_test.dart';
import 'package:app/models/profile.dart';

void main() {
  test('Profile three calls sequence test', () {
    final responseBody1 = '{"success":true,"user":{"id":1,"name":"Nibras Amin","email":"nibrasulhaqqamini@gmail.com","profile":{"id":1,"userId":1,"name":"Nibras Amin","username":"nibras","tagline":"Skill Let\'s connect!","avatar":"/profile_avatar.png","isOnline":false,"bio":"Initializing profile...","phone":null,"whatsapp":null,"location":null,"diamonds":"0","isPremium":false,"tapCount":0,"createdAt":"2026-07-02T23:09:11.145Z","updatedAt":"2026-07-06T12:04:12.180Z","tags":[],"socials":[]}}}';
    final responseBody2 = responseBody1;
    final responseBody3 = '{"success":true,"profile":{"id":1,"userId":1,"name":"Nibras Amin","username":"nibras","tagline":"Skill Let\'s connect!","avatar":"/profile_avatar.png","isOnline":false,"bio":"Initializing profile...","phone":null,"whatsapp":null,"location":null,"diamonds":"0","isPremium":false,"tapCount":0,"createdAt":"2026-07-02T23:09:11.145Z","updatedAt":"2026-07-06T12:04:12.180Z","tags":[],"socials":[]},"score":35,"items":[{"id":"bio","label":"Professional Bio","description":"Write a bio explaining your expertise (at least 20 characters).","points":20,"completed":false},{"id":"avatar","label":"Custom Avatar","description":"Upload a custom profile image.","points":20,"completed":false},{"id":"tagline","label":"Profile Tagline","description":"Add a catchy professional tagline.","points":15,"completed":false},{"id":"socials","label":"Social Connections","description":"Add at least 3 active social links.","points":20,"completed":false},{"id":"tags","label":"Profile Tags","description":"Add at least 1 role tag and 1 location tag.","points":15,"completed":false},{"id":"tap","label":"First Connection","description":"Get tapped or clicked by someone else (1+ tap count).","points":10,"completed":false}],"qualifiesForLeaderboard":false}';

    final data1 = json.decode(responseBody1);
    final p1 = Profile.fromJson(data1['user']['profile']);
    expect(p1.name, 'Nibras Amin');

    final data2 = json.decode(responseBody2);
    final p2 = Profile.fromJson(data2['user']['profile']);
    expect(p2.name, 'Nibras Amin');

    final data3 = json.decode(responseBody3);
    final p3 = Profile.fromJson(data3['profile']);
    expect(p3.name, 'Nibras Amin');
  });
}

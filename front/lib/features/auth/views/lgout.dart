import 'package:flutter/material.dart';
import 'package:front/features/auth/views/login_screen.dart';
import 'package:shared_preferences/shared_preferences.dart';


class LogoutManager {
  static Future<void> logout(BuildContext context) async {
    await clearUserData();
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (context) => const LoginScreen()), 
    );
  }

  static Future<void> clearUserData() async {
    final preferences = await SharedPreferences.getInstance();
    preferences.clear();
  }
}

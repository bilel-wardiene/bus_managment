import 'dart:async';

import 'package:flutter/material.dart';
import 'package:front/features/auth/views/login_screen.dart';
import 'package:lottie/lottie.dart';

class SplashScreen extends StatefulWidget {
  
  const SplashScreen({super.key});
  

  @override
  State<SplashScreen> createState() => _SplashScreenState();
  
}

class _SplashScreenState extends State<SplashScreen> {
  
  @override
  void initState(){
    super.initState();
    startTimer();
  }

  startTimer(){
    var duration = const Duration(seconds: 3);
    return Timer(duration, route);
  }

  route (){
     Navigator.pushReplacement(context,MaterialPageRoute(builder: (context)=>const LoginScreen()));
  }
  @override
  Widget build(BuildContext context) {
    
    return Scaffold(
      backgroundColor: Colors.black,
       body: Content(),
    );
  }

  Widget Content(){
    var size = MediaQuery.of(context).size;
    return Center(
      child: Container(
        child: Lottie.asset("assets/splash.json",
        height: double.infinity,
        width: size.width * 0.4,
        
        ),
        
      ),
    );
  }
}
import 'package:dio/dio.dart';
import 'package:front/constants/strings.dart';


class SignIn {
  

  Future<dynamic> signin(String email, String password) async {
    final api = "$baseUrl/employe/signin";
    final data = {"email": email, "password": password};
    final dio = Dio();
   return await dio.post(api, data: data);

  }}
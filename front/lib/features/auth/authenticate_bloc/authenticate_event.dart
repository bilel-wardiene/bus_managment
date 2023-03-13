import 'package:equatable/equatable.dart';

abstract class UserEvent extends Equatable{
  @override
  List<Object> get props=>[];
}

class LoginSendData extends UserEvent {
  final String email;
  final String password;

  LoginSendData(this.email, this.password);
}
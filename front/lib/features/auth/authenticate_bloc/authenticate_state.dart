import 'package:equatable/equatable.dart';
import 'package:flutter/cupertino.dart';

@immutable
abstract class UserState extends Equatable {}

class InitialState extends UserState{
  @override
  // TODO: implement props
  List<Object?> get props => [];

}

class UserLoggin extends UserState {
  @override
  List<Object?> get props => [];
}

class UserLogged extends UserState{
  @override
  List<Object?> get props =>[];

}

class LoginError extends UserState {
  final String error;

  LoginError(this.error);

  @override
  List<Object?> get props => [error];
}
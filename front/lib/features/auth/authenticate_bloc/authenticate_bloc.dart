import 'package:dio/dio.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:front/features/auth/authenticate_bloc/authenticate_event.dart';
import 'package:front/features/auth/authenticate_bloc/authenticate_state.dart';
import 'package:front/features/auth/data/user_repository.dart';


class UserBloc extends Bloc<UserEvent, UserState> {
  final SignIn userRepository;
  UserBloc({required this.userRepository}) : super(InitialState()) {
    on<LoginSendData>((event, emit) async {
      emit(UserLoggin());
      await Future.delayed(const Duration(seconds: 1));
      try {
        Response result =
            await userRepository.signin(event.email, event.password);
        if (result.statusCode == 200) {
          emit(UserLogged());
        } else {
          emit(LoginError(result.statusCode.toString()));
        }
      } catch (e) {
        emit(LoginError(e.toString()));
      }
    });
  }
}

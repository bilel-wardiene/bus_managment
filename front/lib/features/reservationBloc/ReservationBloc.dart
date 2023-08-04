import 'package:bloc/bloc.dart';
import 'package:dio/dio.dart';
import 'package:front/constants/strings.dart';
import 'package:front/features/reservationBloc/ReservationEvent.dart';
import 'package:front/features/reservationBloc/ReservationState.dart';
import 'package:front/features/reservationBloc/data/models/ReservationModel.dart';
 // Replace this with your reservation model



class ReservationBloc extends Bloc<ReservationEvent, ReservationState> {
  final Dio dio;

  ReservationBloc(this.dio) : super(ReservationInitial());

  @override
  Stream<ReservationState> mapEventToState(ReservationEvent event) async* {
    if (event is ReservationRequested) {
      yield* _mapReservationRequestedToState(event.requestBody);
    }
  }

  Stream<ReservationState> _mapReservationRequestedToState(
    Map<String, dynamic> requestBody,
  ) async* {
    yield ReservationLoading();

    try {
      final response = await dio.post('$baseUrl:5000/employe/reserve', data: requestBody);

      if (response.statusCode == 200) {
        final reservation = ReservationModel.fromJson(response.data);
        yield ReservationSuccess(reservation);
      } else {
        yield ReservationFailure("Failed to make a reservation");
      }
    } catch (e) {
      yield ReservationFailure("Internal server error");
    }
  }
}

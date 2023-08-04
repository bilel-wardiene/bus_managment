import 'package:equatable/equatable.dart';

abstract class ReservationEvent extends Equatable {
  const ReservationEvent();

  @override
  List<Object> get props => [];
}

class ReservationRequested extends ReservationEvent {
  final Map<String, dynamic> requestBody;

  ReservationRequested(this.requestBody);

  @override
  List<Object> get props => [requestBody];
}

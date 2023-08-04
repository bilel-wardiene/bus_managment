import 'package:equatable/equatable.dart';
abstract class ReservationState extends Equatable {
  const ReservationState();

  @override
  List<Object> get props => [];
}

class ReservationInitial extends ReservationState {}

class ReservationLoading extends ReservationState {}

class ReservationSuccess extends ReservationState {
  final dynamic data;

  ReservationSuccess(this.data);

  @override
  List<Object> get props => [data];
}

class ReservationFailure extends ReservationState {
  final String error;

  ReservationFailure(this.error);

  @override
  List<Object> get props => [error];
}
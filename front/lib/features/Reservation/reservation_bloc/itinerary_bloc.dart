
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:front/features/Reservation/data/models/itinerary_model.dart';
import 'package:front/features/Reservation/data/repositories/itinerary_repository.dart';
import 'package:front/features/auth/data/user_model.dart';


class ItineraryBloc extends Cubit<List<ItineraryModel>> {
  final ItineraryRepository _repository;

  ItineraryBloc(this._repository) : super([]);

  Future<void> getAllItineraries() async {
    try {
      final itineraries = await _repository.getAllItineraries();
      emit(itineraries);
    } catch (error) {
      // Handle error
    }
  }
}

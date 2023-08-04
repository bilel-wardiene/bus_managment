import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:front/features/Reservation/data/models/itinerary_model.dart';
import 'package:front/features/Reservation/data/repositories/itinerary_repository.dart';
import 'package:front/features/auth/data/user_model.dart';

class ItineraryBloc extends Cubit<List<ItineraryModel>> {
  final ItineraryRepository _repository;

  ItineraryBloc(this._repository) : super([]);

//  Future<void> getEmployeeItinerary(String employeeId) async {
//     try {
//       final itineraries = await _repository.getEmployeeItinerary(employeeId);
//       if (itineraries.isNotEmpty) {
//         emit(itineraries);
//       } else {
//         // Handle case when itineraries list is empty
//         // You can emit an empty list or show an error message
//         emit([]);
//       }
//     } catch (error) {
//       // Handle error
//       // You can emit an empty list or show an error message
//       emit([]);
//     }
//   }


  Future<void> getAllItineraries() async {
    try {
      final itineraries = await _repository.getAllItineraries();
      emit(itineraries);
    } catch (error) {
      // Handle error
    }
  }
}


import 'package:dio/dio.dart';
import 'package:front/constants/strings.dart';
import 'package:front/features/Reservation/data/models/itinerary_model.dart';

class ItineraryRepository {
  Dio _dio = Dio();

//   Future<ItineraryModel> getEmployeeItinerary(String employeeId) async {
//   try {
//     final response = await _dio.get('$baseUrl/employe/$employeeId');
//     final data = response.data;
//     final itinerary = ItineraryModel(
//       name: data['name'],
//       stations: List<MarkerModel>.from(data['stations'].map(
//         (station) => MarkerModel(
//           name: station['name'],
//           description: station['description'],
//           latitude: station['latitude'],
//           longitude: station['longitude'],
//         ),
//       )),
//     );
//     return itinerary;
//   } catch (error) {
//     throw Exception('Failed to fetch employee itinerary');
//   }
// }
Future<List<ItineraryModel>> getEmployeeItinerary(String employeeId) async {
    try {
      final response = await _dio.get('$baseUrl/employe/$employeeId');
      final data = response.data;

      if (data is List<dynamic>) {
        final itineraries = data.map((json) {
          final stations = json['stations'] as List<dynamic>;
          final markerModels = stations.map((station) => MarkerModel(
            name: station['name'],
            description: station['description'],
            latitude: station['latitude'],
            longitude: station['longitude'],
          )).toList();
          return ItineraryModel(
            name: json['name'],
            stations: markerModels,
          );
        }).toList();
        return itineraries;
      } else if (data is Map<String, dynamic>) {
        final stations = data['stations'] as List<dynamic>;
        final markerModels = stations.map((station) => MarkerModel(
          name: station['name'],
          description: station['description'],
          latitude: station['latitude'],
          longitude: station['longitude'],
        )).toList();
        final itinerary = ItineraryModel(
          name: data['name'],
          stations: markerModels,
        );
        return [itinerary];
      } else {
        throw Exception('Invalid response format: Expected a List<dynamic> or Map<String, dynamic>');
      }
    } catch (error) {
      print('Error fetching itineraries: $error');
      throw Exception('Failed to fetch itineraries');
    }
  }

  Future<List<ItineraryModel>> getAllItineraries() async {
    try {
      final response = await _dio.get('$baseUrl/itinerary/getAllItinerary');
      final data = response.data as List<dynamic>;
      final itineraries = data
          .map((json) => ItineraryModel(
            name: json['name'],
            stations: List<MarkerModel>.from(json['stations'].map(
              (station) => MarkerModel(
                name: station['name'],
                description: station['description'],
                latitude: station['latitude'],
                longitude: station['longitude'],
              ),
            )),
          ))
          .toList();
      return itineraries;
    } catch (error) {
      throw Exception('Failed to fetch itineraries');
    }
  }
}

  // Future<List<ItineraryModel>> getAllItineraries() async {
  //   try {
  //     final response = await _dio.get('$baseUrl/itinerary/getAllItinerary');
  //     final data = response.data as List<dynamic>;
  //     final itineraries = data
  //         .map((json) => ItineraryModel(
  //               name: json['name'],
  //               stations: List<MarkerModel>.from(json['stations'].map(
  //                 (station) => MarkerModel(
  //                   name: station['name'],
  //                   description: station['description'],
  //                   latitude: station['latitude'],
  //                   longitude: station['longitude'],
  //                 ),
  //               )),
  //             ))
  //         .toList();
  //     return itineraries;
  //   } catch (error) {
  //     throw Exception('Failed to fetch itineraries');
  //   }
  // }
  





import 'package:dio/dio.dart';
import 'package:front/features/Reservation/data/models/itinerary_model.dart';

class ItineraryRepository {
  final Dio _dio;

  ItineraryRepository(this._dio);

  Future<List<ItineraryModel>> getAllItineraries() async {
    try {
      final response = await _dio.get('http://192.168.1.6:5000/itinerary/getAllItinerary');
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

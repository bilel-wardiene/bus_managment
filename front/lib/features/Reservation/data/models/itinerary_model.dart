class ItineraryModel {
  final String name;
  final List<MarkerModel> stations;

  ItineraryModel({required this.name, required this.stations});

  factory ItineraryModel.fromJson(Map<String, dynamic> json) {
    return ItineraryModel(
      name: json['name'],
      stations: List<MarkerModel>.from(
        json['stations'].map((station) => MarkerModel.fromJson(station)),
      ),
    );
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['name'] = this.name;
    data['stations'] = this.stations.map((station) => station.toJson()).toList();
    return data;
  }
}

class MarkerModel {
  final String name;
  final String description;
  final double latitude;
  final double longitude;

  MarkerModel({
    required this.name,
    required this.description,
    required this.latitude,
    required this.longitude,
  });

  factory MarkerModel.fromJson(Map<String, dynamic> json) {
    return MarkerModel(
      name: json['name'],
      description: json['description'],
      latitude: json['latitude'].toDouble(),
      longitude: json['longitude'].toDouble(),
    );
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['name'] = this.name;
    data['description'] = this.description;
    data['latitude'] = this.latitude;
    data['longitude'] = this.longitude;
    return data;
  }
}
class ReservationModel {
  final String time;
  final String itineraryId;
  final List<String> stationIds;

  final String busId;

  ReservationModel({
    required this.time,
    required this.itineraryId,
    required this.stationIds,
    
    required this.busId,
  });
   factory ReservationModel.fromJson(Map<String, dynamic> json) {
    return ReservationModel(
      time: json['Time'],
      itineraryId: json['itineraryId'],
      stationIds: List<String>.from(json['stationIds']),
      
      busId: json['busId'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'Time': time,
      'itineraryId': itineraryId,
      'stationIds': stationIds,
      
      'busId': busId,
    };
  }
}

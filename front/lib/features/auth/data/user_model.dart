import 'package:front/features/Reservation/data/models/itinerary_model.dart';

class User {
  String? token;
  String? id;
  String? firstName;
  String? lastName;
  String? email;
  String? userName;
  String? role;
  String? hashedPassword;
  String? salt;
  String? createdAt;
  String? updatedAt;
  int? V;
  List<ItineraryModel>? itineraries; 

  User({
    this.token,
    this.id,
    this.firstName,
    this.lastName,
    this.email,
    this.userName,
    this.role,
    this.hashedPassword,
    this.salt,
    this.createdAt,
    this.updatedAt,
    this.V,
    this.itineraries,
  });

  User.fromJson(Map<String, dynamic> json) {
    token = json['token'];
    id = json['_id'];
    firstName = json['firstName'];
    lastName = json['lastName'];
    email = json['email'];
    userName = json['userName'];
    role = json['role'];
    hashedPassword = json['hashed_password'];
    salt = json['salt'];
    createdAt = json['createdAt'];
    updatedAt = json['updatedAt'];
    V = json['__v'];
    if (json['itineraries'] != null) {
      itineraries = List<ItineraryModel>.from(
        json['itineraries'].map((itinerary) => ItineraryModel.fromJson(itinerary)),
      );
    }
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['token'] = this.token;
    data['_id'] = this.id;
    data['firstName'] = this.firstName;
    data['lastName'] = this.lastName;
    data['email'] = this.email;
    data['userName'] = this.userName;
    data['role'] = this.role;
    data['hashed_password'] = this.hashedPassword;
    data['salt'] = this.salt;
    data['createdAt'] = this.createdAt;
    data['updatedAt'] = this.updatedAt;
    data['__v'] = this.V;
    if (this.itineraries != null) {
      data['itineraries'] = this.itineraries!.map((itinerary) => itinerary.toJson()).toList();
    }
    return data;
  }
}

import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:front/constants/strings.dart';
import 'package:front/features/Reservation/data/models/itinerary_model.dart';
import 'package:front/features/Reservation/data/repositories/itinerary_repository.dart';
import 'package:front/features/Reservation/reservation_bloc/itinerary_bloc.dart';
import 'package:front/features/auth/data/user_model.dart';
import 'package:table_calendar/table_calendar.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart' as latlong;
import 'package:mapbox_gl/mapbox_gl.dart';
import 'package:flutter_dropdown/flutter_dropdown.dart';

import '../data/user_model.dart';

class Home extends StatefulWidget {
  const Home({Key? key});

  @override
  _HomeState createState() => _HomeState();
}

class _HomeState extends State<Home> with SingleTickerProviderStateMixin {
    final ItineraryRepository itineraryRepository = ItineraryRepository();
  late final ItineraryBloc itineraryBloc;
  bool _isContainerVisible = false;

  DateTime? _selectedDate;
  String? _selectedTrajectory;
  String? _selectedFromStation;
  String? _selectedToStation;
  int _availablePlaces = 10;
  List<String> _availableStations = ['Station A', 'Station B', 'Station C'];
  List<String> _availableTrajectories = [
    'Trajectory 1',
    'Trajectory 2',
    'Trajectory 3'
  ];

  void _toggleContainerVisibility() {
    setState(() {
      _isContainerVisible = !_isContainerVisible;
    });
  }

  List<ItineraryModel> itineraries = [];
  Dio dio = Dio();

  late User userModel;


  @override
  void initState() {
    super.initState();
    String employeeId = getEmployeeId();
      itineraryBloc = ItineraryBloc(itineraryRepository);
    itineraryBloc.getEmployeeItinerary(employeeId);
  }

   @override
  void dispose() {
    itineraryBloc.close();
    super.dispose();
  }

  String getEmployeeId() {
    return '648a1220d3a01e591dff490a';
  }

  Future<void> fetchItineraries(String employeeId) async {
    try {
      final itinerariesResponse = await dio.get('$baseUrl/employe/$employeeId');
      final itinerariesData = itinerariesResponse.data as List<dynamic>;
      List<ItineraryModel> fetchedItineraries = itinerariesData
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
      setState(() {
        itineraries = fetchedItineraries;
      });
    } catch (error) {
      // Handle error
    }
  }

//  Future<void> fetchItineraries() async {
//     try {
//       final itinerariesResponse =
//           await dio.get('$baseUrl/itinerary/getAllItinerary');
//       final itinerariesData = itinerariesResponse.data as List<dynamic>;
//       setState(() {
//         itineraries = itinerariesData
//             .map((json) => ItineraryModel(
//                   name: json['name'],
//                   stations: List<MarkerModel>.from(json['stations'].map(
//                     (station) => MarkerModel(
//                       name: station['name'],
//                       description: station['description'],
//                       latitude: station['latitude'],
//                       longitude: station['longitude'],
//                     ),
//                   )),
//                 ))
//             .toList();
//       });
//     } catch (error) {
//       // Handle error
//     }
//   }

  Future<List<LatLng>> getRouteCoordinates(List<MarkerModel> stations) async {
    List<LatLng> coordinates = [];

    for (int i = 0; i < stations.length - 1; i++) {
      MarkerModel origin = stations[i];
      MarkerModel destination = stations[i + 1];

      final response = await dio.get(
        'https://api.mapbox.com/directions/v5/mapbox/driving/${origin.longitude},${origin.latitude};${destination.longitude},${destination.latitude}',
        queryParameters: {
          'access_token':
              'sk.eyJ1IjoiYmlsZWwtMDIiLCJhIjoiY2xleTU0emxoMDFuNTN4bDVtMDBkbnB3cyJ9.OsaVBEzWh5yexoox8UeDVQ',
          'steps': 'true', // Include detailed steps in the response
          'geometries': 'polyline', // Request polyline geometry
        },
      );

      final routes = response.data['routes'];
      if (routes.isNotEmpty) {
        final route = routes[0];
        final geometry = route['geometry'];

        // Decode the polyline geometry
        List<LatLng> routeCoordinates = decodeEncodedPolyline(geometry);

        coordinates.addAll(routeCoordinates);
      }
    }

    return coordinates;
  }

  List<LatLng> decodeEncodedPolyline(String encodedPolyline) {
    List<LatLng> polyPoints = decodeEncodedPolyline(encodedPolyline);

    return polyPoints;
  }

  Marker createStationMarker(MarkerModel station, String itineraryName) {
    
    return Marker(
      width: 80.0,
      height: 80.0,
      point: latlong.LatLng(station.latitude, station.longitude),
      builder: (ctx) => GestureDetector(
        onTap: () {
          showDialog(
            context: ctx,
            builder: (BuildContext context) {
              return AlertDialog(
                title: Text(itineraryName),
                content: Text('${station.name}: ${station.description}'),
                actions: [
                  TextButton(
                    onPressed: () {
                      Navigator.of(context).pop();
                    },
                    child: Text('Close'),
                  ),
                ],
              );
            },
          );
        },
        child: Icon(
          Icons.location_on,
          color: Colors.red,
          size: 40.0,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: BlocBuilder<ItineraryBloc, List<ItineraryModel>>(
        bloc: itineraryBloc,
        builder: (context, itineraries) {
     return Stack(
        children: [
          FlutterMap(
            options: MapOptions(
              center: latlong.LatLng(
                36.86821934095694,
                10.165226976479506,
              ),
              zoom: 15.0,
            ),
            children: [
              TileLayer(
                urlTemplate:
                    'https://api.mapbox.com/styles/v1/bilel-02/clesrzfu6006p01s5fgkqbk9c/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiYmlsZWwtMDIiLCJhIjoiY2xlc2dsODF0MHduZzN5cDFna3UyMm9tMyJ9.lQXHWjkWEzBchhit1O4CWw',
                additionalOptions: {
                  'accessToken':
                      'sk.eyJ1IjoiYmlsZWwtMDIiLCJhIjoiY2xleTU0emxoMDFuNTN4bDVtMDBkbnB3cyJ9.OsaVBEzWh5yexoox8UeDVQ',
                  'id': 'mapbox.country-boundaries-v1',
                },
              ),
              PolylineLayer(
                polylines: [
                  for (var itinerary in itineraries)
                    Polyline(
                      points: [
                        for (var station in itinerary.stations)
                          latlong.LatLng(station.latitude, station.longitude),
                      ],
                      color: Colors.blue,
                      strokeWidth: 2.0,
                    ),
                ],
              ),
              MarkerLayer(
                markers: [
                  for (var itinerary in itineraries)
                    for (var station in itinerary.stations)
                      createStationMarker(station, itinerary.name),
                ],
              ),
            ],
          ),
          if (_isContainerVisible) // Render the container only when visible
            Align(
              alignment: Alignment.bottomCenter,
              child: AnimatedContainer(
                duration: Duration(milliseconds: 300),
                curve: Curves.easeInOut,
                height: MediaQuery.of(context).size.height / 4,
                decoration: BoxDecoration(
                  color: const Color(0xff192028),
                  boxShadow: const [
                    BoxShadow(
                      color: Color.fromARGB(255, 11, 11, 22),
                      spreadRadius: 1,
                      blurRadius: 15,
                      offset: Offset(5, 5),
                    ),
                  ],
                  borderRadius: BorderRadius.circular(30),
                ),
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: [
                      Column(
                        mainAxisAlignment: MainAxisAlignment.start,
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          ElevatedButton(
                            onPressed: () {
                              _selectDate(context);
                            },
                            style: ButtonStyle(
                              backgroundColor: MaterialStateProperty.all<Color>(
                                  Color(0xff192028)),
                            ),
                            child: Text(
                              _selectedDate?.toString() ?? 'Select a Date',
                              style: TextStyle(
                                fontSize: 17,
                              ),
                            ),
                          ),
                          SizedBox(
                            height: 10.0,
                          ),
                          Text(
                            "Available Places",
                            style: TextStyle(
                              color: Colors.grey,
                              fontSize: 17,
                            ),
                          ),
                          Text(
                            _availablePlaces.toString(),
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          SizedBox(
                            height: 10.0,
                          ),
                          Text(
                            "Itinerary",
                            style: TextStyle(
                              color: Colors.grey,
                              fontSize: 17,
                            ),
                          ),
                          DropdownButton<String>(
                            value: _selectedTrajectory,
                            hint: Text('Select Trajectory'),
                            items: _availableTrajectories
                                .map((trajectory) => DropdownMenuItem<String>(
                                      value: trajectory,
                                      child: Text(trajectory),
                                    ))
                                .toList(),
                            onChanged: (value) {
                              setState(() {
                                _selectedTrajectory = value;
                              });
                            },
                          ),
                        ],
                      ),
                      Column(
                        mainAxisAlignment: MainAxisAlignment.start,
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            "From",
                            style: TextStyle(
                              color: Colors.grey,
                              fontSize: 17,
                            ),
                          ),
                          DropdownButton<String>(
                            value: _selectedFromStation,
                            hint: Text('Select From Station'),
                            items: _availableStations
                                .map((station) => DropdownMenuItem<String>(
                                      value: station,
                                      child: Text(station),
                                    ))
                                .toList(),
                            onChanged: (value) {
                              setState(() {
                                _selectedFromStation = value;
                              });
                            },
                          ),
                          SizedBox(
                            height: 10,
                          ),
                          Text(
                            "To",
                            style: TextStyle(
                              color: Colors.grey,
                              fontSize: 17,
                            ),
                          ),
                          DropdownButton<String>(
                            value: _selectedToStation,
                            hint: Text('Select To Station'),
                            items: _availableStations
                                .map((station) => DropdownMenuItem<String>(
                                      value: station,
                                      child: Text(station),
                                    ))
                                .toList(),
                            onChanged: (value) {
                              setState(() {
                                _selectedToStation = value;
                              });
                            },
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            ),
          Positioned(
            top: 0,
            left: 0,
            right: 0,
            child: Container(
              color: Color(0xff192028),
              child: TableCalendar(
                focusedDay: DateTime.now(),
                firstDay: DateTime.utc(2023, 1, 1),
                lastDay: DateTime.utc(2040, 12, 31),
                calendarFormat: CalendarFormat.week,
                calendarStyle: CalendarStyle(
                  todayDecoration: BoxDecoration(
                    color: Colors.deepPurple,
                    shape: BoxShape.circle,
                  ),
                  selectedDecoration: BoxDecoration(
                    color: Theme.of(context).primaryColor,
                    shape: BoxShape.circle,
                  ),
                  todayTextStyle: TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 12.0,
                    color: Colors.white,
                  ),
                ),
                headerStyle: HeaderStyle(
                  titleCentered: true, // Center align the header title
                  formatButtonVisible: false,
                ),
                startingDayOfWeek: StartingDayOfWeek.sunday,
                calendarBuilders: CalendarBuilders(
                  selectedBuilder: (context, date, _) => Container(
                    margin: const EdgeInsets.fromLTRB(4.0, 0, 4.0, 0),
                    alignment: Alignment.center,
                    decoration: BoxDecoration(
                      color: Theme.of(context).primaryColor,
                      shape: BoxShape.circle,
                    ),
                    child: Text(
                      date.day.toString(),
                      style: TextStyle(
                        color: Colors.white,
                      ),
                    ),
                  ),
                  todayBuilder: (context, date, _) => Container(
                    margin: const EdgeInsets.fromLTRB(4.0, 0, 4.0, 0),
                    alignment: Alignment.center,
                    decoration: BoxDecoration(
                      color: Colors.deepPurple,
                      shape: BoxShape.circle,
                    ),
                    child: Text(
                      date.day.toString(),
                      style: TextStyle(
                        color: Colors.white,
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
          Align(
            alignment: Alignment.bottomRight,
            child: Padding(
              padding: const EdgeInsets.only(bottom: 16.0),
              child: FloatingActionButton(
                onPressed: _toggleContainerVisibility,
                backgroundColor: Color(0xff192028),
                child: Icon(Icons.add),
              ),
            ),
          ),
        ],
      );
        }
          ),
  
    );
  }

  void _selectDate(BuildContext context) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: _selectedDate ?? DateTime.now(),
      firstDate: DateTime.utc(2023, 1, 1),
      lastDate: DateTime.utc(2040, 12, 31),
    );
    if (picked != null && picked != _selectedDate) {
      setState(() {
        _selectedDate = picked;
      });
    }
  }
}

// import 'package:dio/dio.dart';
// import 'package:flutter/material.dart';
// import 'package:front/constants/strings.dart';
// import 'package:table_calendar/table_calendar.dart';
// import 'package:http/http.dart' as http;
// import 'dart:convert';

// void main() {
//   runApp(MyApp());
// }

// class MyApp extends StatelessWidget {
//   @override
//   Widget build(BuildContext context) {
//     return MaterialApp(
//       debugShowCheckedModeBanner: false,
//       home: CalendarPage(),
//     );
//   }
// }

// class CalendarPage extends StatefulWidget {
//   @override
//   _CalendarPageState createState() => _CalendarPageState();
// }

// class _CalendarPageState extends State<CalendarPage> {
//   CalendarFormat _calendarFormat = CalendarFormat.month;
//   DateTime _focusedDay = DateTime.now();
//   DateTime? _selectedDay;
//   Dio dio = Dio();
//   Map<DateTime, List<dynamic>> _events = {}; // Your events data
//   dynamic _selectedEvent; // Variable to store selected event
//   bool _isLoading = true; // Flag to track loading state

//   @override
//   void initState() {
//     super.initState();
//     fetchReservations();
//   }

//   Future<void> fetchReservations() async {
//     try {
//       final response = await dio.get('$baseUrl/user/getAllReservation');

//       if (response.statusCode == 200) {
//         final List<dynamic> reservations = List<dynamic>.from(response.data);
//         for (var reservation in reservations) {
//           final reservationDate = DateTime.parse(reservation['Time']); // Adjust field name as needed
//           if (_events.containsKey(reservationDate)) {
//             _events[reservationDate]!.add({'reserved': true}); // Add point marker
//           } else {
//             _events[reservationDate] = [{'reserved': true}]; // Add point marker
//           }
//         }
//         if (mounted) {
//           setState(() {
//             _isLoading = false; // Set isLoading to false
//           });
//         }
//       } else {
//         throw Exception('Failed to fetch reservations');
//       }
//     } catch (e) {
//       if (mounted) {
//         setState(() {
//           _isLoading = false; // Set isLoading to false even on error
//         });
//       }
//     }
//   }

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       body: Container(
//         color: Color(0xff192028),
//         child: _isLoading
//             ? Center(child: CircularProgressIndicator()) // Show loading indicator while fetching data
//             : TableCalendar(
//                 firstDay: DateTime.utc(2020, 10, 16),
//                 lastDay: DateTime.utc(2060, 3, 14),
//                 focusedDay: _focusedDay,
//                 calendarFormat: _calendarFormat,
//                 selectedDayPredicate: (day) {
//                   return isSameDay(_selectedDay, day);
//                 },
//                 eventLoader: (day) {
//                   return _events[day] ?? [];
//                 },
//                 onDaySelected: (selectedDay, focusedDay) {
//                   setState(() {
//                     _selectedDay = selectedDay;
//                     _focusedDay = focusedDay;
//                     _selectedEvent = _events[selectedDay]?.first; // Store selected event
//                   });
//                 },
//                 onFormatChanged: (format) {
//                   setState(() {
//                     _calendarFormat = format;
//                   });
//                 },
//                 onPageChanged: (focusedDay) {
//                   _focusedDay = focusedDay;
//                 },
//               ),
//       ),
//       bottomSheet: _selectedEvent != null ? ReservationDetails(_selectedEvent) : null,
//     );
//   }
// }

// class ReservationDetails extends StatelessWidget {
//   final dynamic event;

//   ReservationDetails(this.event);

//   @override
//   Widget build(BuildContext context) {
//     // Customize the UI to display the reservation details
//     return Container(
//       height: 100,
//       color: Colors.white,
//       child: Column(
//         mainAxisAlignment: MainAxisAlignment.center,
//         children: [
//           Text('Reservation Details'),
//           SizedBox(height: 10),
//           Text('Date: ${event['Time']}'), // Customize with the correct field name
//           // ... (add more details as needed)
//         ],
//       ),
//     );
//   }
// }

// import 'package:dio/dio.dart';
// import 'package:flutter/material.dart';
// import 'package:front/constants/strings.dart';
// import 'package:table_calendar/table_calendar.dart';
// import 'package:http/http.dart' as http;
// import 'dart:convert';

// void main() {
//   runApp(MyApp());
// }

// class MyApp extends StatelessWidget {
//   @override
//   Widget build(BuildContext context) {
//     return MaterialApp(
//       debugShowCheckedModeBanner: false,
//       home: CalendarPage(),
//     );
//   }
// }

// class CalendarPage extends StatefulWidget {
//   @override
//   _CalendarPageState createState() => _CalendarPageState();
// }

// class _CalendarPageState extends State<CalendarPage> {
//   CalendarFormat _calendarFormat = CalendarFormat.month;
//   DateTime _focusedDay = DateTime.now();
//   dynamic _selectedEvent;
//   DateTime? _selectedDay;
//   Dio dio = Dio();
//   Map<DateTime, List<dynamic>> _events = {};
//   bool _isLoading = true;
//   Color _reservedDayColor = Colors.green;

//   @override
//   void initState() {
//     super.initState();
//     fetchReservations();
//   }

//   Future<void> fetchReservations() async {
//     try {
//       final response = await dio.get('$baseUrl/user/getAllReservation');

//       if (response.statusCode == 200) {
//         final List<dynamic> reservations = List<dynamic>.from(response.data);
//         for (var reservation in reservations) {
//           final reservationDate = DateTime.parse(reservation['Time']);
//           if (_events.containsKey(reservationDate)) {
//             _events[reservationDate]!.add({
//               'reserved': true,
//               'color': _reservedDayColor,
//               'reservationDetails': reservation,
//             });
//           } else {
//             _events[reservationDate] = [
//               {
//                 'reserved': true,
//                 'color': _reservedDayColor,
//                 'reservationDetails': reservation,
//               }
//             ];
//           }
//           print(_events);
//         }
//         if (mounted) {
//           setState(() {
//             _isLoading = false;
//           });
//         }
//       } else {
//         throw Exception('Failed to fetch reservations');
//       }
//     } catch (e) {
//       if (mounted) {
//         setState(() {
//           _isLoading = false;
//         });
//       }
//     }
//   }

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       body: Container(
//         color: Color(0xff192028),
//         child: _isLoading
//             ? Center(child: CircularProgressIndicator())
//             : TableCalendar(
//                 firstDay: DateTime.utc(2020, 10, 16),
//                 lastDay: DateTime.utc(2060, 3, 14),
//                 focusedDay: _focusedDay,
//                 calendarFormat: _calendarFormat,
//                 selectedDayPredicate: (day) {
//                   return isSameDay(_selectedDay, day);
//                 },
//                 eventLoader: (day) {
//                   return _events[day] ?? [];
//                 },
//                 onDaySelected: (selectedDay, focusedDay) {
//                   setState(() {
//                     _selectedDay = selectedDay;
//                     _focusedDay = focusedDay;
//                     _selectedEvent = _events[selectedDay]?.first;
//                   });

//                   if (_selectedEvent != null) {
//                     showDialog(
//                       context: context,
//                       builder: (context) => ReservationDetailsDialog(
//                           _selectedEvent['reservationDetails']),
//                     );
//                   }
//                 },
//                 onFormatChanged: (format) {
//                   setState(() {
//                     _calendarFormat = format;
//                   });
//                 },
//                 onPageChanged: (focusedDay) {
//                   _focusedDay = focusedDay;
//                 },
//               ),
//       ),
//     );
//   }
// }

// class ReservationDetailsDialog extends StatelessWidget {
//   final dynamic reservationDetails;

//   ReservationDetailsDialog(this.reservationDetails);

//   @override
//   Widget build(BuildContext context) {
//     return AlertDialog(
//       title: Text('Reservation Details'),
//       content: Column(
//         crossAxisAlignment: CrossAxisAlignment.start,
//         mainAxisSize: MainAxisSize.min,
//         children: [
//           Text('Date: ${reservationDetails['Time']}'),
//           // Add more reservation details as needed
//         ],
//       ),
//       actions: [
//         TextButton(
//           onPressed: () {
//             Navigator.pop(context);
//           },
//           child: Text('Close'),
//         ),
//       ],
//     );
//   }
// }
import 'package:flutter/material.dart';
import 'package:table_calendar/table_calendar.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      home: CalendarPage(),
    );
  }
}

class CalendarPage extends StatefulWidget {
  @override
  _CalendarPageState createState() => _CalendarPageState();
}

class _CalendarPageState extends State<CalendarPage> {
  CalendarFormat _calendarFormat = CalendarFormat.month;
  DateTime _focusedDay = DateTime.now();
  dynamic _selectedEvent;
  DateTime? _selectedDay;
  Map<DateTime, List<dynamic>> _events = {};
  bool _isLoading = true; // Set initial loading state to true
  Color _reservedDayColor = Colors.green;
  bool _isDayReserved = false; // Track if the day is reserved

  TextEditingController _newDateController = TextEditingController();

  @override
  void initState() {
    super.initState();
    fetchReservations();
  }

  Future<void> fetchReservations() async {
    // Simulating API call delay
    await Future.delayed(Duration(seconds: 2));

    // Add your static reservation data here
    final staticReservationDate = DateTime(2023, 8, 17);
    final staticReservationDetails = {
      'Time': '17/08/2023',
      'Time': '24/08/2023',

      // Add more reservation details as needed
    };

    _events[staticReservationDate] = [staticReservationDetails];

    setState(() {
      _isLoading = false; // Set loading state to false after data is fetched
      _selectedDay = staticReservationDate;
      _selectedEvent = staticReservationDetails;
      _isDayReserved = true;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        color: Color(0xff192028),
        child: _isLoading
            ? Center(child: CircularProgressIndicator())
            : TableCalendar(
                firstDay: DateTime.utc(2020, 10, 16),
                lastDay: DateTime.utc(2060, 3, 14),
                focusedDay: _focusedDay,
                calendarFormat: _calendarFormat,
                selectedDayPredicate: (day) {
                  return isSameDay(_selectedDay, day);
                },
                eventLoader: (day) {
                  return _events[day] ?? [];
                },
                calendarStyle: CalendarStyle(
                  selectedDecoration: BoxDecoration(
                    color:
                        _isDayReserved ? _reservedDayColor : Colors.transparent,
                    shape: BoxShape.circle,
                  ),
                  selectedTextStyle: TextStyle(color: Colors.white),
                ),
                onDaySelected: (selectedDay, focusedDay) {
                  setState(() {
                    _selectedDay = selectedDay;
                    _focusedDay = focusedDay;
                    _selectedEvent = _events[selectedDay]?.first;
                    _isDayReserved = _selectedEvent != null;
                  });

                  if (_selectedEvent != null) {
                    showDialog(
                      context: context,
                      builder: (context) => AlertDialog(
                        title: Text('Update Reservation Time'),
                        content: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Text('Enter new time:'),
                            TextField(
                              controller: _newDateController,
                              keyboardType: TextInputType.text,
                            ),
                          ],
                        ),
                        actions: [
                          TextButton(
                            onPressed: () {
                              // Get the new time from the TextField
                              String newTime = _newDateController.text;

                              // Show the updated time message
                              showDialog(
                                context: context,
                                builder: (context) => AlertDialog(
                                  title: Text('Updated time at $newTime'),
                                  actions: [
                                    TextButton(
                                      onPressed: () {
                                        Navigator.pop(context);
                                      },
                                      child: Text('OK'),
                                    ),
                                  ],
                                ),
                              );

                              // Dismiss the dialog
                              _newDateController.clear();
                              Navigator.pop(context);
                            },
                            child: Text('OK'),
                          ),
                          TextButton(
                            onPressed: () {
                              Navigator.pop(context);
                            },
                            child: Text('Cancel'),
                          ),
                        ],
                      ),
                    );
                  } else {
                    showDialog(
                      context: context,
                      builder: (context) => AlertDialog(
                        title: Text('Reservation Details'),
                        content: Text('Reserved at 06:00'),
                        actions: [
                          TextButton(
                            onPressed: () {
                              // Handle update action
                              showDialog(
                                context: context,
                                builder: (context) => AlertDialog(
                                  title: Text('Update Reservation'),
                                  content: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    mainAxisSize: MainAxisSize.min,
                                    children: [
                                      Text('Enter new time:'),
                                      TextField(
                                        controller: _newDateController,
                                        keyboardType: TextInputType.datetime,
                                      ),
                                    ],
                                  ),
                                  actions: [
                                    TextButton(
                                      onPressed: () {
                                        // Get the new date from the TextField
                                        DateTime newDate = DateTime.parse(
                                            _newDateController.text);

                                        // Update the events map with the new date
                                        _events.remove(_selectedDay);
                                        _events[newDate] = [_selectedEvent];

                                        // Update the selected day and event
                                        _selectedDay = newDate;
                                        _selectedEvent =
                                            _events[newDate]?.first;

                                        // Clear the new date controller and dismiss the dialog
                                        _newDateController.clear();
                                        Navigator.pop(context);
                                        setState(() {}); // Update the UI
                                      },
                                      child: Text('OK'),
                                    ),
                                    TextButton(
                                      onPressed: () {
                                        Navigator.pop(context);
                                      },
                                      child: Text('Cancel'),
                                    ),
                                  ],
                                ),
                              );
                            },
                            child: Text(
                              'Update',
                              style: TextStyle(
                                color: Colors.green, // Set the color to red
                              ),
                            ),
                          ),
                          TextButton(
                            onPressed: () {
                              // Handle delete action
                              _events.remove(_selectedDay);
                              _isDayReserved = false;
                              Navigator.pop(context);
                              setState(() {}); // Update the UI
                            },
                            child: Text(
                              'Delete',
                              style: TextStyle(
                                color: Colors.red, // Set the color to red
                              ),
                            ),
                          ),
                          TextButton(
                            onPressed: () {
                              Navigator.pop(context);
                            },
                            child: Text('Close'),
                          ),
                        ],
                      ),
                    );
                  }
                },
                onFormatChanged: (format) {
                  setState(() {
                    _calendarFormat = format;
                  });
                },
                onPageChanged: (focusedDay) {
                  _focusedDay = focusedDay;
                },
              ),
      ),
    );
  }
}

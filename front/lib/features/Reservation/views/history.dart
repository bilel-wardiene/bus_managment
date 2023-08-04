import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:front/constants/strings.dart';
import 'package:table_calendar/table_calendar.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

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
  DateTime? _selectedDay;
  Dio dio = Dio();
  Map<DateTime, List<dynamic>> _events = {}; // Your events data
  dynamic _selectedEvent; // Variable to store selected event
  bool _isLoading = true; // Flag to track loading state

  @override
  void initState() {
    super.initState();
    fetchReservations();
  }

  Future<void> fetchReservations() async {
    try {
      final response = await dio.get('$baseUrl/user/getAllReservation');

      if (response.statusCode == 200) {
        final List<dynamic> reservations = List<dynamic>.from(response.data);
        for (var reservation in reservations) {
          final reservationDate = DateTime.parse(reservation['Time']); // Adjust field name as needed
          if (_events.containsKey(reservationDate)) {
            _events[reservationDate]!.add({'reserved': true}); // Add point marker
          } else {
            _events[reservationDate] = [{'reserved': true}]; // Add point marker
          }
        }
        if (mounted) {
          setState(() {
            _isLoading = false; // Set isLoading to false
          });
        }
      } else {
        throw Exception('Failed to fetch reservations');
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _isLoading = false; // Set isLoading to false even on error
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        color: Color(0xff192028),
        child: _isLoading
            ? Center(child: CircularProgressIndicator()) // Show loading indicator while fetching data
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
                onDaySelected: (selectedDay, focusedDay) {
                  setState(() {
                    _selectedDay = selectedDay;
                    _focusedDay = focusedDay;
                    _selectedEvent = _events[selectedDay]?.first; // Store selected event
                  });
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
      bottomSheet: _selectedEvent != null ? ReservationDetails(_selectedEvent) : null,
    );
  }
}

class ReservationDetails extends StatelessWidget {
  final dynamic event;

  ReservationDetails(this.event);

  @override
  Widget build(BuildContext context) {
    // Customize the UI to display the reservation details
    return Container(
      height: 100,
      color: Colors.white,
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text('Reservation Details'),
          SizedBox(height: 10),
          Text('Date: ${event['Time']}'), // Customize with the correct field name
          // ... (add more details as needed)
        ],
      ),
    );
  }
}

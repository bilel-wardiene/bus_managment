import 'package:flutter/material.dart';

class BusTicketReservation extends StatefulWidget {
  @override
  _BusTicketReservationState createState() => _BusTicketReservationState();
}

class _BusTicketReservationState extends State<BusTicketReservation> {
  late String _departureLocation;
  late String _arrivalLocation;
  DateTime _departureDate = DateTime.now(); // Initialize with current date
  int _numberOfSeats = 1;
  bool _isRoundTrip = false;

  void _submitForm() {
    // TODO: Add your logic to submit the form
    // You can access the entered values using the respective variables
    print('Departure Location: $_departureLocation');
    print('Arrival Location: $_arrivalLocation');
    print('Departure Date: $_departureDate');
    print('Number of Seats: $_numberOfSeats');
    print('Round Trip: $_isRoundTrip');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Bus Ticket Reservation'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            TextFormField(
              decoration: InputDecoration(labelText: 'Departure Location'),
              onChanged: (value) {
                setState(() {
                  _departureLocation = value;
                });
              },
            ),
            SizedBox(height: 16.0),
            TextFormField(
              decoration: InputDecoration(labelText: 'Arrival Location'),
              onChanged: (value) {
                setState(() {
                  _arrivalLocation = value;
                });
              },
            ),
            SizedBox(height: 16.0),
            TextFormField(
              readOnly: true,
              onTap: () async {
                final selectedDate = await showDatePicker(
                  context: context,
                  initialDate: DateTime.now(),
                  firstDate: DateTime.now(),
                  lastDate: DateTime(2100),
                );

                if (selectedDate != null) {
                  setState(() {
                    _departureDate = selectedDate;
                  });
                }
              },
              decoration: InputDecoration(labelText: 'Departure Date'),
              controller: TextEditingController(
                text: _departureDate != null
                    ? '${_departureDate.day}/${_departureDate.month}/${_departureDate.year}'
                    : '',
              ),
            ),
            SizedBox(height: 16.0),
            Row(
              children: [
                Text('Number of Seats:'),
                SizedBox(width: 8.0),
                DropdownButton<int>(
                  value: _numberOfSeats,
                  items: List.generate(10, (index) => index + 1)
                      .map((int value) => DropdownMenuItem<int>(
                            value: value,
                            child: Text(value.toString()),
                          ))
                      .toList(),
                  onChanged: (value) {
                    setState(() {
                      _numberOfSeats = value!;
                    });
                  },
                ),
              ],
            ),
            SizedBox(height: 16.0),
            Row(
              children: [
                Text('Round Trip:'),
                SizedBox(width: 8.0),
                Checkbox(
                  value: _isRoundTrip,
                  onChanged: (value) {
                    setState(() {
                      _isRoundTrip = value!;
                    });
                  },
                ),
              ],
            ),
            SizedBox(height: 16.0),
            TextButton(
              onPressed: _submitForm,
              child: Text('Submit'),
            ),
          ],
        ),
      ),
    );
  }
}
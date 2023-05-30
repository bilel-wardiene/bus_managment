// ignore_for_file: public_member_api_docs, sort_constructors_first
import 'package:flutter/material.dart';
import 'package:flutter/src/widgets/container.dart';
import 'package:flutter/src/widgets/framework.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';

class Reservation extends StatefulWidget {
  const Reservation({super.key});

  @override
  State<Reservation> createState() => _ReservationState();
}

class _ReservationState extends State<Reservation> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          Container(
            height: 300,
            width: MediaQuery.of(context).size.width,
            decoration: const BoxDecoration(
              borderRadius: BorderRadius.only(
                bottomLeft: Radius.circular(150),
                bottomRight: Radius.circular(20),
              ),
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  Color.fromARGB(255, 200, 171, 228),
                  Color.fromARGB(255, 143, 118, 198),
                  Color.fromARGB(255, 92, 52, 156),
                  Color.fromARGB(255, 91, 19, 172),
                ],
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.only(top: 50),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                IconButton(
                  onPressed: () {
                    Navigator.pop(context);
                  },
                  icon: const Icon(
                    Icons.arrow_back_ios_new,
                    size: 30,
                    color: Colors.white,
                  ),
                ),
                const Padding(
                  padding: EdgeInsets.only(right: 20),
                  child: Icon(
                    Icons.person,
                    size: 40,
                    color: Colors.white,
                  ),
                )
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.only(top: 160),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: const [
              Text(
                "Location 1",
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 30,
                ),
              ),
              Icon(
                Icons.swap_horiz_outlined,
                size: 40,
                color: Colors.white,
              ),
              Text(
                "Location 2",
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 30,
                ),
              ),

            ],
          ),
          ),
          Padding(
            padding: const EdgeInsets.only(
              top: 270,
              right: 20,
              left: 20,
            ),
            child: Column(
              children: const[
                ReservationTime(travelTime: '30Min',departure: '15Min', price: '150',),
                SizedBox(height: 60,),
                ReservationTime(travelTime: '30Min',departure: '15Min', price: '150',),
              ],
            ),

          ),
          Padding(
            padding: EdgeInsets.only(
              top: 240,
              left: 50,

            ),
            child: Column(
              children: [
                BusIcon(),
                SizedBox(height: 200,),
                BusIcon(),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class BusIcon extends StatelessWidget {
  const BusIcon({
    Key? key,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return CircleAvatar(
      radius: 30,
      backgroundColor: Colors.deepPurple[400],
      child: const Icon(
        Icons.directions_bus_filled,
        size: 30,
        color: Colors.white,
      ),
    );
  }
}

class ReservationTime extends StatelessWidget {
  const ReservationTime({
    Key? key,
    required this.travelTime,
    required this.departure,
    required this.price,
  }) : super(key: key);
  final String travelTime;
  final String departure;
  final String price;

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 200,
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            color: Colors.grey.shade600,
            spreadRadius: 1,
            blurRadius: 15,
            offset: Offset(5,5),
          ),
        ],
        borderRadius: BorderRadius.circular(30),

      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: const[
              Text(
                "Location 1",
                style: TextStyle(
                  color: Colors.deepPurple,
                  fontSize: 23,
                ),
              ),
              Text(
                "Date",
                style: TextStyle(
                  color: Colors.grey,
                  fontSize: 15,
                ),
              ),
              SizedBox(height: 30,),
              Text(
                "Location 2",
                style: TextStyle(
                  color: Colors.deepPurple,
                  fontSize: 23,
                ),
              ),
              Text(
                "Date",
                style: TextStyle(
                  color: Colors.grey,
                  fontSize: 15,
                ),
              ),
              


            ],
          ),
          const Icon(
                FontAwesomeIcons.route,
                size: 40,
                color: Colors.deepPurple,
              ),
              Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children:  [
                      const Text(
                        "Travel time : ",
                      style: TextStyle(
                        color: Colors.grey,
                        fontSize: 13,
                        fontWeight: FontWeight.w500,
                      ),
                      ),
                      Text(
                        travelTime,
                      style: const TextStyle(
                        color: Colors.deepPurple,
                        fontSize: 18,
                        fontWeight: FontWeight.w800,
                      ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 15,),
                  Row(
                    children:  [
                      const Text("Departure On : ",
                      style: TextStyle(
                        color: Colors.grey,
                        fontSize: 13,
                        fontWeight: FontWeight.w500,
                      ),
                      ),
                      Text(
                        departure,
                      style: const TextStyle(
                        color: Colors.deepPurple,
                        fontSize: 18,
                        fontWeight: FontWeight.w800,
                      ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 15,),
                  Row(
                    children:  [
                      const Text("price : ",
                      style: TextStyle(
                        color: Colors.grey,
                        fontSize: 18,
                        fontWeight: FontWeight.w500,
                      ),
                      ),
                      Text('\$' + price,
                      style: const TextStyle(
                        color: Colors.deepPurple,
                        fontSize: 25,
                        fontWeight: FontWeight.w800,
                      ),
                      ),
                    ],
                  ),
                ],
              ),
        ],
      ),
    );
  }
}

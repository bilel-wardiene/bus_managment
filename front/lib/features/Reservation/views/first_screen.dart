import 'package:flutter/material.dart';
import 'package:flutter/src/widgets/container.dart';
import 'package:flutter/src/widgets/framework.dart';
import 'package:front/features/Reservation/views/reservation.dart';

class FirstScreen extends StatefulWidget {
  const FirstScreen({super.key});

  @override
  State<FirstScreen> createState() => _FirstScreenState();
}

class _FirstScreenState extends State<FirstScreen> {
  int _itemCount = 0;
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xff192028),
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
                  Color.fromARGB(255, 253, 94, 61),
                  Color.fromARGB(255, 196, 57, 144),
                ],
              ),
            ),
          ),
          Positioned(
            top: 60,
            left: 10,
            right: 10,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    
                    IconButton(
                      onPressed: () {
                       // Navigator.pop(context);
                      },
               
                      icon: const Icon(
                        Icons.arrow_back_ios_new,
                        size: 30,
                        color:  Colors.white,
                      ),
                    ),
                    const Padding(
                      padding: EdgeInsets.only(right: 20),
                      child: Icon(
                        Icons.person,
                        size: 40,
                        color:  Colors.white,
                      ),
                    )
                  ],
                ),
                const Padding(
                  padding: EdgeInsets.only(top: 20, left: 30),
                  child: Text(
                    "Hi, Bilel",
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 20,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ),
                const Padding(
                  padding: EdgeInsets.only(top: 20, left: 30),
                  child: Text(
                    "Where do you want to go ?",
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 25,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ),
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.only(top: 210, left: 20, right: 20),
            child: Container(
              height: 200,
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
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: const [
                      Text(
                        "From",
                        style: TextStyle(
                          color: Colors.grey,
                          fontSize: 17,
                        ),
                      ),
                      Text(
                        "Location 1",
                        style: TextStyle(
                          color: Colors.deepPurple,
                          fontSize: 25,
                        ),
                      ),
                      SizedBox(
                        height: 20,
                      ),
                      Text(
                        "To",
                        style: TextStyle(
                          color: Colors.grey,
                          fontSize: 17,
                        ),
                      ),
                      Text(
                        "Location 2",
                        style: TextStyle(
                          color: Colors.deepPurple,
                          fontSize: 25,
                        ),
                      ),
                      
                    ],
                  ),
                  const Icon(
                    Icons.swap_vert_circle_rounded,
                    size: 60,
                    color: Colors.deepPurple,
                  ),
                ],
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.only(top: 460, left: 20, right: 20),
            child: Container(
              height: 200,
              decoration: BoxDecoration(
                color: const Color(0xff192028),
                boxShadow: const[
                  BoxShadow(
                    color:  Color.fromARGB(255, 11, 11, 22),
                    spreadRadius: 1,
                    blurRadius: 15,
                    offset: Offset(5, 5),
                  ),
                ],
                borderRadius: BorderRadius.circular(30),
              ),
              child: Padding(
                padding: const EdgeInsets.only(top: 20),
                child: Column(
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceAround,
                      children: const [
                        Text(
                          'Ticket',
                          style: TextStyle(
                            color: Colors.grey,
                            fontSize: 17,
                          ),
                        ),
                        Text(
                          'Type',
                          style: TextStyle(
                            color: Colors.grey,
                            fontSize: 17,
                          ),
                        ),
                      ],
                    ),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceAround,
                      children: [
                        Row(
                          children: [
                            IconButton(
                              onPressed: () => setState(() {
                                if (_itemCount > 0) {
                                  _itemCount--;
                                }
                              }),
                              icon: const Icon(Icons.remove),
                            ),
                            Text(
                              _itemCount.toString(),
                              style: const TextStyle(
                                  color: Colors.deepPurple, fontSize: 25),
                            ),
                            IconButton(
                              onPressed: () => setState(() {
                                _itemCount++;
                              }),
                              icon: const Icon(Icons.add),
                            ),
                          ],
                        ),
                        const Text(
                          'Type',
                          style: TextStyle(
                            color: Colors.deepPurple,
                            fontSize: 25,
                          ),
                        ),
                      ],
                    ),
                    Padding(
                      padding: const EdgeInsets.only(top: 20),
                      child: Column(
                        children: const [
                          Text(
                            'Departure',
                            style: TextStyle(
                              color: Colors.grey,
                              fontSize: 17,
                            ),
                          ),
                          Text(
                            '10 june 2023',
                            style: TextStyle(
                              color: Colors.deepPurple,
                              fontSize: 25,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.only(top: 650),
            child: Center(
              child: Container(
                height: 60,
                width: 190,
                 decoration: BoxDecoration(
                color: const Color(0xff192028),
                boxShadow: const[
                  BoxShadow(
                    color:  Color.fromARGB(255, 11, 11, 22),
                    spreadRadius: 1,
                    blurRadius: 15,
                    offset: Offset(5, 5),
                  ),
                ],
                borderRadius: BorderRadius.circular(30),
              ),
                child: TextButton(
                  onPressed: () {
                    Navigator.pushReplacement(
                        context,
                        MaterialPageRoute(
                            builder: ((context) => const Reservation())));
                  },
                  child: const Text(
                    'SEARCH',
                    style: TextStyle(
                      color: Colors.deepPurple,
                      fontSize: 25,
                      
                    ),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

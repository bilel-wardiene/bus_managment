import 'package:badges/badges.dart' as badges;
import 'package:flutter/material.dart';
import 'package:flutter/src/widgets/container.dart';
import 'package:flutter/src/widgets/framework.dart';
import 'package:front/features/Reservation/views/first_screen.dart';
import 'package:front/features/Reservation/views/history.dart';
import 'package:front/features/Reservation/views/reservation.dart';

import 'package:front/features/auth/views/home.dart';


class Contact extends StatefulWidget {
  const Contact({super.key});

  @override
  State<Contact> createState() => _ContactState();
}

class _ContactState extends State<Contact> {
  int _page = 0;
  double bottomBarWidth = 42;
  double bottomBarBorderWidth = 5;
  List<Widget> pages = [
    //const HomeScreen(),
    //const AccountScreen(),
    const Home(),
    const FirstScreen(),
     MyApp(),
    
  ];

  void updatePage(int page) {
    setState(() {
      _page = page;
    });
  }

  @override
  Widget build(BuildContext context) {
   
    return Scaffold(
      body: pages[_page],
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _page,
        selectedItemColor:  Colors.deepPurple,
        unselectedItemColor: Colors.grey,
        backgroundColor: const Color(0xff192028),
        iconSize: 25,
        onTap: updatePage,
        items: [
          // HOME
          BottomNavigationBarItem(
            icon: Container(
              width: bottomBarWidth,
              decoration: BoxDecoration(
                border: Border(
                  top: BorderSide(
                    color: _page == 0 ? Colors.deepPurple : Colors.grey,
                    width: bottomBarBorderWidth,
                  ),
                ),
              ),
              child: const Icon(
                Icons.home_outlined,
              ),
            ),
            label: '',
          ),
          // ACCOUNT
          BottomNavigationBarItem(
            icon: Container(
              width: bottomBarWidth,
              decoration: BoxDecoration(
                border: Border(
                  top: BorderSide(
                    color: _page == 1 ? Colors.deepPurple: Colors.grey,
                    width: bottomBarBorderWidth,
                  ),
                ),
              ),
              child: const Icon(
                Icons.add_task_outlined,
              ),
            ),
            label: '',
          ),
          // CART
          BottomNavigationBarItem(
            icon: Container(
              width: bottomBarWidth,
              decoration: BoxDecoration(
                border: Border(
                  top: BorderSide(
                    color: _page == 2 ? Colors.deepPurple: Colors.grey,
                    width: bottomBarBorderWidth,
                  ),
                ),
              ),
              child: const badges.Badge(
                badgeStyle: badges.BadgeStyle(
                  badgeColor: Colors.grey,
                  elevation: 0,
                ),
                child: Icon(
                  Icons.history,
                ),
              ),
            ),
            label: '',
          ),
        ],
      ),
    );
  }
}

import 'dart:html';

import 'package:flutter/src/widgets/container.dart';
import 'package:flutter/src/widgets/framework.dart';
import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart' as latlong;
import 'package:mapbox_gl/mapbox_gl.dart';

class Home extends StatelessWidget {
  const Home({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
          title: Text(
        "welcome",
        style: TextStyle(
          fontSize: 20.0,
          fontWeight: FontWeight.bold,
        ),
        textAlign: TextAlign.center, // Align the text at the center),
      )),
      body: FlutterMap(
        options: MapOptions(
          center: latlong.LatLng(
            36.86821934095694,
            10.165226976479506,
          ), // Initial map center coordinates
          zoom: 15.0, // Initial zoom level
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
        ],
      ),
    );
  }
}

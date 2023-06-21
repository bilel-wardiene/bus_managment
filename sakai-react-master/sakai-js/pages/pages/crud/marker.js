import React, { useState, useEffect } from "react";
import axios from "axios";
import mapboxgl from "mapbox-gl";
import { useRouter } from 'next/router';


mapboxgl.accessToken = 'pk.eyJ1IjoiYmlsZWwtMDIiLCJhIjoiY2xmc2M5aWR0MDR0bjNubzRjOGN0MHQ2biJ9.NVG_7xuSTS_3D_IbMoZT6w';

const Map = () => {
  const [markers, setMarkers] = useState([]);
  const [mapMarkers, setMapMarkers] = useState([]);


  const router = useRouter();

  useEffect(() => {
      const token = localStorage.getItem('token');

      if (!token) {
          router.push('/');
      }
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:5000/marker/getAllMarker")
      .then((response) => {
        console.log(response.data);
        setMarkers(response.data);
      })
      .catch((error) => {
        console.log(error);
      });

    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v11",
      center: [10.165226976479506, 36.86821934095694],
      zoom: 9,
    });

    map.on("click", (e) => {
      const name = prompt("Enter a name for the marker:");
      const description = prompt("Enter a description for the marker:");

      if (name && description) {
        // Check if a marker with the same coordinates already exists
        const existingMarker = markers.find(
          (marker) =>
            marker.latitude === e.lngLat.lat && marker.longitude === e.lngLat.lng
        );

        if (existingMarker) {
          alert(
            "A marker with the same coordinates already exists. Please choose a different location."
          );
          return;
        }

        axios
          .post("http://localhost:5000/marker/addMarker", {
            name,
            description,
            latitude: e.lngLat.lat,
            longitude: e.lngLat.lng,
          })
          .then((response) => {
            setMarkers([...markers, response.data]);

            const marker = new mapboxgl.Marker({ color: "red" })
              .setLngLat([response.data.longitude, response.data.latitude])
              .addTo(map);
            setMapMarkers([...mapMarkers, marker]);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });

    // Add existing markers to the map
    markers.forEach(marker => {
      const mapMarker = new mapboxgl.Marker({ color: "red" })
        .setLngLat([marker.longitude, marker.latitude])
        .addTo(map);
      setMapMarkers([...mapMarkers, mapMarker]);
    });

    // Cleanup function to remove map markers when component unmounts
    return () => {
      mapMarkers.forEach(marker => marker.remove());
    };

  }, []);

  return (
    <div>
      <div id="map" style={{ width: '100%', height: '470px', borderRadius: '15px' }}></div>
    </div>
  );
};

export default Map;

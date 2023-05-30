import getConfig from 'next/config';
import { Button } from 'primereact/button';
import { Chart } from 'primereact/chart';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from "primereact/dialog";
import { Menu } from 'primereact/menu';
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import mapboxgl, { NavigationControl } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { ProductService } from '../../../demo/service/ProductService'
import { LayoutContext } from '../../../layout/context/layoutcontext';
import Link from 'next/link';
import axios from "axios";


mapboxgl.accessToken = 'pk.eyJ1IjoiYmlsZWwtMDIiLCJhIjoiY2xmc2M5aWR0MDR0bjNubzRjOGN0MHQ2biJ9.NVG_7xuSTS_3D_IbMoZT6w';
const Map = () => {
  const [markers, setMarkers] = useState([]);
  const [mapMarkers, setMapMarkers] = useState([]);
  const map = useRef(null);
  const mapContainer = useRef(null);
  const marker = useRef(null);
  const popup = useRef(null);

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
  }, []);

  useEffect(() => {

    if (map.current) return;
    map.current = new mapboxgl.Map({

      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [10.165226976479506, 36.86821934095694],
      zoom: 9,
    });
    const nav = new NavigationControl({
      showCompass: true,
      showZoom: true
    });

    map.current.addControl(nav, "bottom-right");
  },
    []);

    // Define a new function to handle marker update
    const handleUpdateMarker = (marker, updatedMarker) => {
      // Update the marker in the markers array
      
      // setMarkers(updatedMarkers);
      // Update the marker on the map
      marker.current.setLngLat([updatedMarker.longitude, updatedMarker.latitude]);
      const popupContent = document.createElement('div');
      popupContent.innerHTML = `<h3>${updatedMarker.name}</h3><p>${updatedMarker.description}</p>`;
      popup.current.setDOMContent(popupContent);
      // Update the marker in the database
      axios
        .put(`http://localhost:5000/marker/updateMarker/${marker._id}`, updatedMarker)
        .then((response) => {
          const updatedMarkers = markers.map(m => {
            if (m._id == marker._id) {
              return Object.assign({}, response.data);
            } else {
              return m;
            }
          });

          setMarkers(updatedMarkers);
          console.log("update markers", updatedMarkers);
          console.log(marker);
        });
    };
    // Define a new function to handle marker deletion
    const handleDeleteMarker = (marker) => {
      // Remove the marker from the markers array
      const updatedMarkers = markers.filter(m => m._id !== marker._id);
      setMarkers(updatedMarkers);
      // Remove the marker from the map
      marker.current.remove();
      popup.current.remove();
      // Delete the marker from the database
      axios
        .delete(`http://localhost:5000/marker/deleteMarker/${marker._id}`)
        .then((response) => {
          console.log(response.data);
        })
    };
    useEffect(() =>{
      markers.forEach(marker => {
        if (marker.latitude < -90 || marker.latitude > 90) {

          console.error(`Invalid latitude value ${marker.latitude} for marker ${marker.name}`);
          return;
        }
        const el = document.createElement('div');
        el.id = `marker-${marker.id}`;
        el.className = 'marker';
        el.style.backgroundImage = `https://cdn3.iconfinder.com/data/icons/transport-29/100/14-512.png`;
        el.style.width = `40px`;
        el.style.height = `40px`;
        el.style.backgroundSize = '100%';
        marker.current = new mapboxgl.Marker({ offset: [0, -23] })
          .setLngLat([marker.longitude, marker.latitude])
          .addTo(map.current);
        // marker.current.getElement().addEventListener("mouseenter",() =>{
        // })
        const divElement = document.createElement('div');
        const assignBtn = document.createElement('div');
        const innerHtmlContent = `<div style="min-width: 150px;font-size: large;color : black;">
        <h3>${marker.name}</h3><p>${marker.description}</p>`
        assignBtn.innerHTML = `<button class="btn btn-success btn-simple text-white" > update</button>`;
        divElement.innerHTML = innerHtmlContent;
        divElement.appendChild(assignBtn);
        assignBtn.addEventListener('click', e => {
          // Show a form with input fields for the name, description, latitude, and longitude
          const form = document.createElement('form');
          const nameLabel = document.createElement('label');
          const nameInput = document.createElement('input');
          const descriptionLabel = document.createElement('label');
          const descriptionInput = document.createElement('textarea');
          const latitudeLabel = document.createElement('label');
          const latitudeInput = document.createElement('input');
          const longitudeLabel = document.createElement('label');
          const longitudeInput = document.createElement('input');
          const submitButton = document.createElement('button');
          nameLabel.innerText = 'Name:';
          nameInput.value = marker.name;
          descriptionLabel.innerText = 'Description:';
          descriptionInput.value = marker.description;
          latitudeLabel.innerText = 'Latitude:';
          latitudeInput.value = marker.latitude;
          longitudeLabel.innerText = 'Longitude:';
          longitudeInput.value = marker.longitude;
          submitButton.innerText = 'Update';
          form.appendChild(nameLabel);
          form.appendChild(nameInput);
          form.appendChild(descriptionLabel);
          form.appendChild(descriptionInput);
          form.appendChild(latitudeLabel);
          form.appendChild(latitudeInput);
          form.appendChild(longitudeLabel);
          form.appendChild(longitudeInput);
          form.appendChild(submitButton);
          popup.current.setDOMContent(form);
          submitButton.addEventListener('click', e => {
            e.preventDefault();
            const updatedMarker = {
              name: nameInput.value,
              description: descriptionInput.value,
              latitude: parseFloat(latitudeInput.value),
              longitude: parseFloat(longitudeInput.value)
            };
            handleUpdateMarker(marker, updatedMarker);
            popup.current.remove();
          });
        });
        // Create and append the delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('btn', 'btn-danger', 'btn-simple', 'text-white');
        deleteBtn.innerText = 'Delete';
        deleteBtn.addEventListener('click', e => {
          handleDeleteMarker(marker);
        });
        divElement.appendChild(deleteBtn);
        popup.current = new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false
        });
        marker.current.getElement().addEventListener("mouseenter", () => {
          // Set the popup content and position
          console.log("enter mouse");
          popup.current
            .setLngLat([marker.longitude, marker.latitude])
            .setDOMContent(divElement)
            .addTo(map.current);
        });
        // marker.current.getElement().addEventListener("mouseleave",() =>{
        //   // Set the popup content and position
        //   console.log("leave mouse");
        //   popup.current.remove()

        // });
        setMapMarkers([...mapMarkers, marker.current]);
      });
    },[markers]);

  useEffect(() => {
    console.log("markers bofore",markers);
    map.current.on("load", () => {
      console.log("load map ",markers);
      
      // Add existing markers to the map
      markers.forEach(marker => {
        if (marker.latitude < -90 || marker.latitude > 90) {

          console.error(`Invalid latitude value ${marker.latitude} for marker ${marker.name}`);
          return;
        }
        const el = document.createElement('div');
        el.id = `marker-${marker.id}`;
        el.className = 'marker';
        el.style.backgroundImage = `https://cdn3.iconfinder.com/data/icons/transport-29/100/14-512.png`;
        el.style.width = `40px`;
        el.style.height = `40px`;
        el.style.backgroundSize = '100%';
        marker.current = new mapboxgl.Marker({ offset: [0, -23] })
          .setLngLat([marker.longitude, marker.latitude])
          .addTo(map.current);
        // marker.current.getElement().addEventListener("mouseenter",() =>{
        // })
        const divElement = document.createElement('div');
        const assignBtn = document.createElement('div');
        const innerHtmlContent = `<div style="min-width: 150px;font-size: large;color : black;">
        <h3>${marker.name}</h3><p>${marker.description}</p>`
        assignBtn.innerHTML = `<button class="btn btn-success btn-simple text-white" > update</button>`;
        divElement.innerHTML = innerHtmlContent;
        divElement.appendChild(assignBtn);
        assignBtn.addEventListener('click', e => {
          // Show a form with input fields for the name, description, latitude, and longitude
          const form = document.createElement('form');
          const nameLabel = document.createElement('label');
          const nameInput = document.createElement('input');
          const descriptionLabel = document.createElement('label');
          const descriptionInput = document.createElement('textarea');
          const latitudeLabel = document.createElement('label');
          const latitudeInput = document.createElement('input');
          const longitudeLabel = document.createElement('label');
          const longitudeInput = document.createElement('input');
          const submitButton = document.createElement('button');
          nameLabel.innerText = 'Name:';
          nameInput.value = marker.name;
          descriptionLabel.innerText = 'Description:';
          descriptionInput.value = marker.description;
          latitudeLabel.innerText = 'Latitude:';
          latitudeInput.value = marker.latitude;
          longitudeLabel.innerText = 'Longitude:';
          longitudeInput.value = marker.longitude;
          submitButton.innerText = 'Update';
          form.appendChild(nameLabel);
          form.appendChild(nameInput);
          form.appendChild(descriptionLabel);
          form.appendChild(descriptionInput);
          form.appendChild(latitudeLabel);
          form.appendChild(latitudeInput);
          form.appendChild(longitudeLabel);
          form.appendChild(longitudeInput);
          form.appendChild(submitButton);
          popup.current.setDOMContent(form);
          submitButton.addEventListener('click', e => {
            e.preventDefault();
            const updatedMarker = {
              name: nameInput.value,
              description: descriptionInput.value,
              latitude: parseFloat(latitudeInput.value),
              longitude: parseFloat(longitudeInput.value)
            };
            handleUpdateMarker(marker, updatedMarker);
            popup.current.remove();
          });
        });
        // Create and append the delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('btn', 'btn-danger', 'btn-simple', 'text-white');
        deleteBtn.innerText = 'Delete';
        deleteBtn.addEventListener('click', e => {
          handleDeleteMarker(marker);
        });
        divElement.appendChild(deleteBtn);
        popup.current = new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false
        });
        marker.current.getElement().addEventListener("mouseenter", () => {
          // Set the popup content and position
          console.log("enter mouse");
          popup.current
            .setLngLat([marker.longitude, marker.latitude])
            .setDOMContent(divElement)
            .addTo(map.current);
        });
        // marker.current.getElement().addEventListener("mouseleave",() =>{
        //   // Set the popup content and position
        //   console.log("leave mouse");
        //   popup.current.remove()

        // });
        setMapMarkers([...mapMarkers, marker.current]);
      });
    });
    // Add a click event listener to the map
    map.current.on("click", (e) => {
      // Wait for the style to finish loading before trying to load the marker image
      map.current.loadImage("https://i.imgur.com/mK4djZV.png", (error, image) => {
        if (error) {
          console.log(error);
          return;
        }
        const name = prompt("enter name");
        const description = prompt("enter description");
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
              markers.push(response.data);
              const marker = new mapboxgl.Marker()
                .setLngLat([response.data.longitude, response.data.latitude])
                .addTo(map.current)
                .setPopup(
                  new mapboxgl.Popup().setHTML(
                    `<h3>${response.data.name}</h3><p>${response.data.description}</p>`
                  )
                );
            })
            .catch((error) => {
              console.log(error);
            });
        }
      });
    });
    // Cleanup function to remove map markers when component unmounts
    return () => {
      mapMarkers.forEach(marker => marker.remove());
    };
  }, [map, markers]);

  return (
    <div>
      <div id="map" ref={mapContainer} style={{ width: '100%', height: '470px', borderRadius: '15px' }}></div>
    </div>
  );
};
export default Map;


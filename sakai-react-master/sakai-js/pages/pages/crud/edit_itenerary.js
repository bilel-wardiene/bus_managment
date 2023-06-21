import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

export default function EditItinerary(props) {
  const {
    submitted,
    setName,
    productDialog,
    name,
    stations,
    setStations,
    markers,
    productDialogFooter,
    hideDialog,
    selectedItinerary,
    itineraries,
    setItineraries,
    toast,
  } = props;

  const [selectedStation, setSelectedStation] = useState(null);

  const handleAddStation = () => {
    if (selectedStation) {
      const updatedStations = [...stations, selectedStation];
      setStations(updatedStations);
      setSelectedStation(null);
    }
  };

  const handleDeleteStation = (index) => {
    const updatedStations = [...stations];
    updatedStations.splice(index, 1);
    setStations(updatedStations);
  };



  return (
    <Dialog
      visible={productDialog}
      style={{ width: "450px" }}
      header="Stations Details"
      modal
      className="p-fluid"
      footer={productDialogFooter}
      onHide={hideDialog}
    >
      <div className="field">
        <label htmlFor="name">Name</label>
        <InputText
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoFocus
          className={submitted && !name ? "p-invalid" : ""}
        />
        {submitted && !name && (
          <small className="p-invalid">Name is required.</small>
        )}
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {stations.map((station, index) => (
          <div
            key={index}
            style={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}
          >
            <div style={{ width: "16%", marginRight: "1%" }}>
              Order {index + 1}:
            </div>
            <div style={{ width: "50%", marginRight: "1%" }}>
              <Dropdown
                value={station}
                required
                options={markers}
                optionLabel="name"
                placeholder="Select Station"
                onChange={(e) => {
                  const updatedStations = [...stations];
                  updatedStations[index] = e.value;
                  setStations(updatedStations);
                }}
                className={submitted && !station ? "p-invalid" : ""}
              />
              {submitted && !station && (
                <small className="p-invalid">Station is required.</small>
              )}
            </div>
            <div style={{ width: "20%" }}>
              <Button
                label="Delete"
                icon="pi pi-times"
                className="p-button-text"
                onClick={() => handleDeleteStation(index)}
              />
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <div style={{ width: "16%", marginRight: "1%" }}>
          Order {stations.length + 1}:
        </div>
        <div style={{ width: "50%", marginRight: "1%" }}>
          <Dropdown
            value={selectedStation}
            required
            options={markers}
            optionLabel="name"
            placeholder="Select Station"
            onChange={(e) => setSelectedStation(e.value)}
            className={submitted && !selectedStation ? "p-invalid" : ""}
          />
          {submitted && !selectedStation && (
            <small className="p-invalid">Station is required.</small>
          )}
        </div>
        <div style={{ width: "20%" }}>
          <Button
            label="Add"
            icon="pi pi-check"
            className="p-button-text"
            onClick={handleAddStation}
          />
        </div>
      </div>
    </Dialog>
  );
}

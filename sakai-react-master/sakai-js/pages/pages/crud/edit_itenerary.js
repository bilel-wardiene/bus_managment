import getConfig from "next/config";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { FileUpload } from "primereact/fileupload";
import { InputNumber } from "primereact/inputnumber";
import { MultiSelect } from 'primereact/multiselect';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { RadioButton } from "primereact/radiobutton";
import { Rating } from "primereact/rating";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { classNames } from "primereact/utils";
import { Password } from "primereact/password";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { ProductService } from "../../../demo/service/ProductService";





export default function Edititenerary(props) {
    const { submitted, setName, productDialog, name, stations, setStations, markers, productDialogFooter, hideDialog } = props;


    const [sta, setsta] = useState();

    const handleAddStation = () => {
        const ls = [...stations, sta]
        sta && setStations(ls);
        setsta();
        console.log("button :", ls);
    };

    const handleDeleteStation = (index) => {
        const ls = [...stations];
        ls.splice(index, 1);
        setStations(ls);
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
                    className={classNames({ "p-invalid": submitted && !name })}
                />
                {submitted && !name && (
                    <small className="p-invalid">name is required.</small>
                )}
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
                {stations.map((station, key) => (
                    <div key={key} style={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}>
                        <div style={{ width: "16%", marginRight: "1%" }}>order {key + 1}:</div>
                        <div style={{ width: "50%", marginRight: "1%" }}>
                            <Dropdown
                                value={station}
                                required
                                className={classNames({ "p-invalid": submitted && !sta })}
                                options={markers}
                                optionLabel="name"
                                placeholder="Select Stations"
                            />
                            {submitted && !station && (
                                <small className="p-invalid">Station is required.</small>
                            )}
                        </div>
                        <div style={{ width: "20%" }}>
                            <Button
                                label="delete"
                                icon="pi pi-times"
                                className="p-button-text"
                                onClick={() => handleDeleteStation(key)}
                            />
                        </div>
                    </div>
                ))}
            </div>



            <div style={{ display: "flex", alignItems: "center" }}>
                <div style={{ width: "16%", marginRight: "1%" }}>
                    order {stations.length + 1}
                </div>

                <div style={{ width: "50%", marginRight: "1%" }}>
                    <Dropdown
                        value={sta}
                        onChange={(e) => setsta(e.target.value)}
                        required
                        className={classNames({ "p-invalid": submitted && !sta })}
                        options={markers}
                        optionLabel="name"
                        placeholder="Select Stations"
                    />
                    {submitted && !sta && (
                        <small className="p-invalid">stations is required.</small>
                    )}
                </div>

                <div style={{ width: "20%" }}>
                    <Button
                        label="add"
                        icon="pi pi-check"
                        className="p-button-text"
                        onClick={handleAddStation}
                    />
                </div>
            </div>

        </Dialog>
    )
}



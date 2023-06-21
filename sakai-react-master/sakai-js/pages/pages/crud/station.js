import getConfig from "next/config";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { FileUpload } from "primereact/fileupload";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { useRouter } from 'next/router';

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

const Crud = () => {
    let emptyProduct = {
        _id: "",
        name: "",
        description: "",
        latitude: "",
        longitude: "",
    };
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [markers, setMarkers] = useState([]);
    const [marker, setMarker] = useState(emptyProduct);
    const [products, setProducts] = useState(null);
    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [product, setProduct] = useState(emptyProduct);
    const [selectedEmployees, setSelectedEmployees] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const contextPath = getConfig().publicRuntimeConfig.contextPath;

    const [selectedStation, setSelectedStation] = useState(null);


    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            router.push('/');
        }
    }, []);
    useEffect(() => {
        fetchMarkers();
    }, []);

    const fetchMarkers = async () => {
         await axios.get(
            "http://localhost:5000/marker/getAllMarker",
        ).then(response => {
            setMarkers(response.data)
        })
        .catch(error =>{
            console.log(error);
        })
        // setMarkers(response.data.data);
        // console.log(response);
    };

    const handleAddStation = async () => {
        try {
          setSubmitted(true);
          const newMarker = { name, description, latitude, longitude };
      
          if (selectedStation) {
            // Update station logic
            await axios.put(
              `http://localhost:5000/marker/updateMarker/${selectedStation._id}`,
              newMarker
            );
      
            const updatedMarkers = markers.map((marker) =>
              marker._id === selectedStation._id ? { ...marker, ...newMarker } : marker
            );
            setMarkers(updatedMarkers);
      
            toast.current.show({
              severity: "success",
              summary: "Successful",
              detail: "Station Updated",
              life: 3000,
            });
          } else {
            // Add new station logic
            const response = await axios.post(
              "http://localhost:5000/marker/addMarker",
              newMarker
            );
      
            setMarkers([...markers, response.data.data]);
      
            toast.current.show({
              severity: "success",
              summary: "Successful",
              detail: "Station Created",
              life: 3000,
            });
          }
      
          setProductDialog(false);
          setName("");
          setDescription("");
          setLatitude("");
          setLongitude("");
          setSelectedStation(null);
          setSubmitted(false);
        } catch (error) {
          console.log(error);
          if (
            name === "" ||
            description === "" ||
            latitude === "" ||
            longitude === ""
          ) {
            toast.current.show({
              severity: "error",
              summary: "Error",
              detail: "Please enter all the required data",
              life: 3000,
            });
          } else {
            toast.current.show({
              severity: "error",
              summary: "Error",
              detail: "Station already exists",
              life: 3000,
            });
          }
        }
      };
      
 
    const editEmploye = (marker) => {
        setMarker({ ...marker });
        setProductDialog(true);
    };
  

    const handleUpdateStation = (station) => {
        setSelectedStation(station);
        setName(station.name);
        setDescription(station.description);
        setLatitude(station.latitude);
        setLongitude(station.longitude);
        setProductDialog(true);
      };
      
    useEffect(() => {
        const productService = new ProductService();
        productService.getProducts().then((data) => setProducts(data));
    }, []);

    const openNew = () => {
        setSelectedStation(null);
        setProduct(emptyProduct);
        setSubmitted(false);
        setProductDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
    };

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };

    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    };


    const confirmDeleteProduct = (marker) => {
        console.log('hhlflldld',marker);
        setMarker(marker);
        setDeleteProductDialog(true);
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const confirmDeleteSelected = () => {
      
        setDeleteProductsDialog(true);
    };

    const handleDeleteEmployee = async (id) => {
        try {
            
            await axios.delete(`http://localhost:5000/marker/deleteMarker/${marker._id}`);
            const updatedEmployees = markers.filter(
                (em) => em._id !== marker._id,
            );
            setMarkers(updatedEmployees);
            setDeleteProductDialog(false);
            console.log(updatedEmployees);
            setName("");
            setDescription("");
            setLatitude("");
            setLongitude("");

            toast.current.show({
                severity: "success",
                summary: "Successful",
                detail: "Station Deleted",
                life: 3000,
            });
        } catch (e) {
            toast.current.show({
                severity: "error",
                summary: "error",
                detail: "error ",
                life: 3000,
            });
            setDeleteProductDialog(false);
        }
    };

    
      const deleteSelectedProducts = async () => {

        try {
            const response = await axios.delete('http://localhost:5000/marker/deleteMarkers', {
                data: { stationIds: selectedEmployees },
            });

            if (response.status === 200) {

                const updatedEmployees = markers.filter((em) => !selectedEmployees.includes(em._id));
                setMarkers(updatedEmployees);
                setDeleteProductsDialog(false);
                setSelectedEmployees(null);
                setName("");
                setDescription("");
                setLatitude("");
                setLongitude("");;

                toast.current.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'stations Deleted',
                    life: 3000,
                });
            } else {
                toast.current.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Error deleting stations',
                    life: 3000,
                });
                setDeleteProductsDialog(false);
            }
        } catch (error) {
            
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Error deleting stations',
                life: 3000,
            });
            setDeleteProductsDialog(false);
        }
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button
                        label="New"
                        icon="pi pi-plus"
                        className="p-button-success mr-2"
                        onClick={openNew}
                    />
                    <Button
                        label="Delete"
                        icon="pi pi-trash"
                        className="p-button-danger"
                        onClick={() =>confirmDeleteSelected(markers)}
                        disabled={!selectedEmployees || !selectedEmployees.length}
                    />
                </div>
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <FileUpload
                    mode="basic"
                    accept="image/*"
                    maxFileSize={1000000}
                    label="Import"
                    chooseLabel="Import"
                    className="mr-2 inline-block"
                />
                <Button
                    label="Export"
                    icon="pi pi-upload"
                    className="p-button-help"
                    onClick={exportCSV}
                />
            </React.Fragment>
        );
    };

    const longitudeBodyTemplate = (markers) => {
        if (markers && markers.longitude !== undefined) {
          return (
            <>
              <span className="p-column-title">longitude</span>
              {markers.longitude}
            </>
          );
        } else {
          return null; // Handle the case when markers is undefined or does not have a longitude property
        }
      };
      
    const descriptionBodyTemplate = (markers) => {
        if (markers && markers.description) {
          return (
            <>
              <span className="p-column-title">description</span>
              {markers.description}
            </>
          );
        } else {
          return null; // Handle the case when markers is undefined or does not have a description property
        }
      };
      
      const latitudeBodyTemplate = (markers) => {
        if (markers && markers.latitude !== undefined) {
          return (
            <>
              <span className="p-column-title">latitude</span>
              {markers.latitude}
            </>
          );
        } else {
          return null; // Handle the case when markers is undefined or does not have a latitude property
        }
      };
      

    const nameBodyTemplate = (markers) => {
        if (markers && markers.name) {
          return (
            <>
              <span className="p-column-title">name</span>
              {markers.name}
            </>
          );
        } else {
          return null; // Handle the case when markers is undefined or does not have a name property
        }
      };
      
   
 

    const actionBodyTemplate = (markers) => {
        return (
            <>
                <Button
                    icon="pi pi-pencil"
                    className="p-button-rounded p-button-success mr-2"
                    onClick={() => handleUpdateStation(markers)}
                />
                <Button
                    icon="pi pi-trash"
                    className="p-button-rounded p-button-warning"
                    onClick={() => confirmDeleteProduct(markers)}
                />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Manage Stations</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText
                    type="search"
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    placeholder="Search..."
                />
            </span>
        </div>
    );

    const productDialogFooter = (
        <>
            <Button
                label="Cancel"
                icon="pi pi-times"
                className="p-button-text"
                onClick={hideDialog}
            />
            <Button
                label="Save"
                icon="pi pi-check"
                className="p-button-text"
                onClick={handleAddStation}
            />
        </>
    );
    const deleteProductDialogFooter = 
         (
            <>
                <Button
                    label="No"
                    icon="pi pi-times"
                    className="p-button-text"
                    onClick={hideDeleteProductDialog}
                />
                <Button
                    label="Yes"
                    icon="pi pi-check"
                    className="p-button-text"
                    onClick= {
                        handleDeleteEmployee
                    }
                />
            </>
        );
    

    const deleteProductsDialogFooter = (
        <>
            <Button
                label="No"
                icon="pi pi-times"
                className="p-button-text"
                onClick={hideDeleteProductsDialog}
            />
            <Button
                label="Yes"
                icon="pi pi-check"
                className="p-button-text"
                onClick={deleteSelectedProducts}
            />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar
                        className="mb-4"
                        left={leftToolbarTemplate}
                        right={rightToolbarTemplate}
                    ></Toolbar>

                    <DataTable
                        ref={dt}
                        value={markers}
                        selection={selectedEmployees}
                        onSelectionChange={(e) => setSelectedEmployees(e.value)}
                        dataKey="_id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[10, 20, 30, 40]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} stations"
                        globalFilter={globalFilter}
                        emptyMessage="No stations found."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column
                            selectionMode="multiple"
                            headerStyle={{ width: "4rem" }}
                        ></Column>
                        <Column
                            field="name"
                            header="Name"
                            sortable
                            body={nameBodyTemplate}
                            headerStyle={{ minWidth: "9rem" }}
                        ></Column>
                        <Column
                            field="description"
                            header="Description"
                            sortable
                            body={descriptionBodyTemplate}
                            headerStyle={{ minWidth: "9rem" }}
                        ></Column>
                        <Column
                            field="latitude"
                            header="Latitude"
                            sortable
                            body={latitudeBodyTemplate}
                            headerStyle={{ minWidth: "9rem" }}
                        ></Column>
                        <Column
                            field="longitude"
                            header="Longitude"
                            sortable
                            body={longitudeBodyTemplate}
                            headerStyle={{ minWidth: "9rem" }}
                        ></Column>

                        <Column
                            body={actionBodyTemplate}
                            headerStyle={{ minWidth: "10rem" }}
                        ></Column>
                    </DataTable>

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
                        <div className="field">
                            <label htmlFor="description">Description</label>
                            <InputText
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                                className={classNames({ "p-invalid": submitted && !description })}
                            />
                            {submitted && !description && (
                                <small className="p-invalid">description is required.</small>
                            )}
                        </div>
                        <div className="field">
                            <label htmlFor="latitude">Latitude</label>
                            <InputText
                                id="latitude"
                                value={latitude}
                                onChange={(e) => setLatitude(e.target.value)}
                                required
                                className={classNames({ "p-invalid": submitted && !latitude })}
                            />
                            {submitted && !latitude && (
                                <small className="p-invalid">latitude is required.</small>
                            )}
                        </div>
                        <div className="field">
                            <label htmlFor="latitude">Longitude</label>
                            <InputText
                                id="longitude"
                                value={longitude}
                                onChange={(e) => setLongitude(e.target.value)}
                                required
                                className={classNames({ "p-invalid": submitted && !longitude })}
                            />
                            {submitted && !longitude && (
                                <small className="p-invalid">longitude is required.</small>
                            )}
                        </div>
                    </Dialog>

                    <Dialog
                        visible={deleteProductDialog}
                        style={{ width: "450px" }}
                        header="Confirm"
                        modal
                        footer={deleteProductDialogFooter}
                        onHide={hideDeleteProductDialog}
                    >
                        <div className="flex align-items-center justify-content-center">
                            <i
                                className="pi pi-exclamation-triangle mr-3"
                                style={{ fontSize: "2rem" }}
                            />
                            {product && (
                                <span>
                                    Are you sure you want to delete station?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog
                        visible={deleteProductsDialog}
                        style={{ width: "450px" }}
                        header="Confirm"
                        modal
                        footer={deleteProductsDialogFooter}
                        onHide={hideDeleteProductsDialog}
                    >
                        <div className="flex align-items-center justify-content-center">
                            <i
                                className="pi pi-exclamation-triangle mr-3"
                                style={{ fontSize: "2rem" }}
                            />
                            {product && (
                                <span>
                                    Are you sure you want to delete the selected stations?
                                </span>
                            )}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Crud;

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
        Time: "",
        itinerary: "",
        stations: "",
        employee: "",
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
            "http://localhost:5000/user/getAllReservation",
        ).then(response => {
            setMarkers(response.data)
        })
        .catch(error =>{
            console.log(error);
        })
        // setMarkers(response.data.data);
        // console.log(response);
    };

   
    useEffect(() => {
        const productService = new ProductService();
        productService.getProducts().then((data) => setProducts(data));
    }, []);


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
            
            await axios.delete(`http://localhost:5000/user/deleteReservation/${marker._id}`);
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
                detail: "reservation Deleted",
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

    

    const longitudeBodyTemplate = (markers) => {
        return (
          <>
            <span className="p-column-title">Time</span>
            {markers.Time}
          </>
        );
      };
      
      const descriptionBodyTemplate = (markers) => {
        console.log('Markers:', markers);
        return (
          <>
            <span className="p-column-title">Itinerary</span>
            {markers.itinerary ? markers.itinerary.name : ''}
          </>
        );
      };
      
      const latitudeBodyTemplate = (markers) => {
        return (
          <>
            <span className="p-column-title">Station</span>
            {markers.stations[0].name}
          </>
        );
      };
      
      const nameBodyTemplate = (markers) => {
        if (markers.employee) {
          return (
            <>
              <span className="p-column-title">Employee</span>
              {markers.employee.userName}
            </>
          );
        } else {
          return (
            <>
              <span className="p-column-title">Employee</span>
              N/A
            </>
          );
        }
      };
      
 

    const actionBodyTemplate = (markers) => {
        return (
            <>
               
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
            <h5 className="m-0">Manage Reservations</h5>
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
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} reservations"
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
                            field="employee"
                            header="Employee"
                            sortable
                            body={nameBodyTemplate}
                            headerStyle={{ minWidth: "9rem" }}
                        ></Column>
                        <Column
                            field="itinerary"
                            header="Itinerary"
                            sortable
                            body={descriptionBodyTemplate}
                            headerStyle={{ minWidth: "9rem" }}
                        ></Column>
                        <Column
                            field="stations"
                            header="Station"
                            sortable
                            body={latitudeBodyTemplate}
                            headerStyle={{ minWidth: "9rem" }}
                        ></Column>
                        <Column
                            field="Time"
                            header="Time"
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
                                    Are you sure you want to delete reservation?
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

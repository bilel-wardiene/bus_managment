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
import { useRouter } from 'next/router';

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { ProductService } from "../../../demo/service/ProductService";
import Edititenerary from "./edit_itenerary";

const Crud = () => {
    let emptyProduct = {
        _id: "",
        name: "",
        stations: "",
        order: "",
    };
    const [liststations, setListStations] = useState([]);
    const [markers, setMarkers] = useState([]);
    const [name, setName] = useState("");
    const [stations, setStations] = useState("");
    const [order, setOrder] = useState("");
    const [multiselectValue, setMultiselectValue] = useState(null);
    const [dropdownValue, setDropdownValue] = useState(null);
    const [itineraries, setItineraries] = useState([]);
    const [itinerary, setItinerary] = useState(emptyProduct);
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
    const [selectedItinerary, setSelectedItinerary] = useState(null);
  


    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            router.push('/');
        }
    }, []);

    useEffect(() => {
        fetchItineraries();
    }, []);

    const fetchItineraries = async () => {
        await axios.get(
            "http://localhost:5000/itinerary/getAllItinerary",
        ).then(response => {
            setItineraries(response.data)
        })
            .catch(error => {
                console.log(error);
            })
        // setMarkers(response.data.data);
        // console.log(response);
    };
    useEffect(() => {
        fetchMarkers();
    }, []);

    const fetchMarkers = async () => {
        await axios.get(
            "http://localhost:5000/marker/getAllMarker",
        ).then(response => {
            setMarkers(response.data)
        })
            .catch(error => {
                console.log(error);
            })
        // setMarkers(response.data.data);
        // console.log(response);
    };


    const handleAddItinerary = async () => {
        try {
          setSubmitted(true);
          
          if (selectedItinerary) {
            // Update itinerary logic
            const updatedItinerary = {
              ...selectedItinerary,
              name,
              stations: liststations,
            };
            
            await axios.put(
              `http://localhost:5000/itinerary/updateItinerary/${selectedItinerary._id}`,
              updatedItinerary
            );
            
            const updatedItineraries = itineraries.map((itinerary) =>
              itinerary._id === selectedItinerary._id ? updatedItinerary : itinerary
            );
            
            setItineraries(updatedItineraries);
            setProductDialog(false);
            toast.current.show({
              severity: "success",
              summary: "Successful",
              detail: "Itinerary Updated",
              life: 3000,
            });
          } else {
            // Add new itinerary logic
            const newItinerary = {
              name,
              stations: liststations,
            };
            
            const response = await axios.post(
              "http://localhost:5000/itinerary/addItinerary",
              newItinerary
            );
            
            setItineraries([...itineraries, response.data]);
            setProductDialog(false);
            toast.current.show({
              severity: "success",
              summary: "Successful",
              detail: "Itinerary Created",
              life: 3000,
            });
          }
          
          // Reset form fields
          setName("");
          setListStations([]);
          setSubmitted(false);
          setSelectedItinerary(null);
        } catch (error) {
          console.log(error);
          if (name === "" || liststations.length === 0) {
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
              detail: "Itinerary already exists",
              life: 3000,
            });
          }
        }
      };
      

    

    const editEmploye = (itinerary) => {
        setItinerary({ ...itinerary });
        setProductDialog(true);
    };


    const handleUpdateItinerary = (itinerary) => {
        setSelectedItinerary(itinerary);
        setName(itinerary.name);
        setListStations(itinerary.stations);
        setProductDialog(true);
      };
      
    useEffect(() => {
        const productService = new ProductService();
        productService.getProducts().then((data) => setProducts(data));
    }, []);

    const openNew = () => {
        setSelectedItinerary(null);
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


    const confirmDeleteProduct = (itinerary) => {
        console.log('hhlflldld', itinerary);
        setItinerary(itinerary);
        setDeleteProductDialog(true);
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const confirmDeleteSelected = () => {

        setDeleteProductsDialog(true);
    };

    const handleDeleteItinerary = async (id) => {
        try {

            await axios.delete(`http://localhost:5000/itinerary/deleteItinerary/${itinerary._id}`);
            const updatedItineraries = itineraries.filter(
                (em) => em._id !== itinerary._id,
            );
            setItineraries(updatedItineraries);
            setDeleteProductDialog(false);
            console.log(updatedItineraries);
            setName("");

            setStations("");
            setOrder("");

            toast.current.show({
                severity: "success",
                summary: "Successful",
                detail: "Itinerary Deleted",
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
            const response = await axios.delete('http://localhost:5000/itinerary/deleteItineraries', {
                data: { ItinerariesIds: selectedEmployees },
            });

            if (response.status === 200) {

                const updatedEmployees = itineraries.filter((em) => !selectedEmployees.includes(em._id));
                setItineraries(updatedEmployees);
                setDeleteProductsDialog(false);
                setSelectedEmployees(null);
                setName("");
                setStations("");
                setOrder("");

                toast.current.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'itineraries Deleted',
                    life: 3000,
                });
            } else {
                toast.current.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Error deleting itineraries',
                    life: 3000,
                });
                setDeleteProductsDialog(false);
            }
        } catch (error) {
            
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Error deleting itineraries',
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
                        onClick={() => confirmDeleteSelected(itineraries)}
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

    // const startingPointBodyTemplate = (itineraries) => {
    //     console.log(itineraries.startingPoint);
    //     return (
    //         <>
    //             <span className="p-column-title">startingPoint</span>
    //             {itineraries.startingPoint}
    //         </>
    //     );
    // };
    const orderPointBodyTemplate = (itineraries) => {
        return (
            <>
                <span className="p-column-title">order</span>
                {itineraries.stations?.map((station,key) => (<div key={key}>{key+1}</div>))}
            </>
        );
    };
    const stationsBodyTemplate = (itineraries) => {
        return (
            <>
                <span className="p-column-title">stations</span>
                {itineraries.stations?.map((station,key) => (<div key={key}>-{station.name}</div>))}
            </>
        );
    };

    const nameBodyTemplate = (itineraries) => {
        return (
            <>
                <span className="p-column-title">name</span>
                {itineraries.name}
            </>
        );
    };



    const actionBodyTemplate = (itineraries) => {
        return (
            <>
                <Button
                    icon="pi pi-pencil"
                    className="p-button-rounded p-button-success mr-2"
                    onClick={() => handleUpdateItinerary(itineraries)}
                />
                <Button
                    icon="pi pi-trash"
                    className="p-button-rounded p-button-warning"
                    onClick={() => confirmDeleteProduct(itineraries)}
                />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Manage Itineraries</h5>
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
                onClick={handleAddItinerary}
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
                    onClick={
                        handleDeleteItinerary
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
                        value={itineraries}
                        selection={selectedEmployees}
                        onSelectionChange={(e) => setSelectedEmployees(e.value)}
                        dataKey="_id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[10, 20, 30, 40]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} itineraries"
                        globalFilter={globalFilter}
                        emptyMessage="No itineraries found."
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
                            field="stations"
                            header="Stations"
                            sortable
                            body={stationsBodyTemplate}
                            headerStyle={{ minWidth: "9rem" }}
                        ></Column>
                        <Column
                            field="order"
                            header="Order"
                            sortable
                            body={orderPointBodyTemplate}
                            headerStyle={{ minWidth: "9rem" }}
                        ></Column>
                        <Column
                            body={actionBodyTemplate}
                            headerStyle={{ minWidth: "10rem" }}
                        ></Column>
                    </DataTable>
                    <Edititenerary submitted={submitted} productDialog={productDialog} name={name} setName={setName} setStations={setListStations} stations={liststations} markers={markers} productDialogFooter={productDialogFooter} hideDialog={hideDialog} />

                    {/* <Dialog
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
                            <label htmlFor="stations">stations</label>
                            <Dropdown
                                value={stations}
                                onChange={(e) => setStations(e.target.value)}
                                required
                                className={classNames({ "p-invalid": submitted && !stations })}
                                options={markers}
                                optionLabel="name"
                                placeholder="Select Stations"

                            />
                            {submitted && !stations && (
                                <small className="p-invalid">stations is required.</small>
                            )}
                        </div>


                        <div className="field">
                            <label htmlFor="order">order</label>
                            <InputText
                                id="order"
                                value={order}
                                onChange={(e) => setOrder(e.target.value)}
                                required
                                className={classNames({ "p-invalid": submitted && !order })}
                            />
                            {submitted && !order && (
                                <small className="p-invalid">order is required.</small>
                            )}
                        </div>

                        <div>
                            order 1

                            <div className="field">

                                <Dropdown
                                    value={stations}
                                    onChange={(e) => setStations(e.target.value)}
                                    required
                                    className={classNames({ "p-invalid": submitted && !stations })}
                                    options={markers}
                                    optionLabel="name"
                                    placeholder="Select Stations"

                                />
                                {submitted && !stations && (
                                    <small className="p-invalid">stations is required.</small>
                                )}
                            </div>
                            <Button
                                label="New"
                                icon="pi pi-plus"
                                className="p-button-success mr-2"
                                onClick={openNew}
                            />
                        </div>

                    </Dialog> */}

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
                                    Are you sure you want to delete itinerary ?
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
                                    Are you sure you want to delete the selected itineraries?
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

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

const Crud = () => {
    let emptyProduct = {
        _id: "",
        name: "",
        itinerary: "",
        number_places: "",
        startingTime: "",
        returnTime: "",
    };
    const [itineraries, setItineraries] = useState([]);
    const [markers, setMarkers] = useState([]);
    const [name, setName] = useState("");
    const [itinerary, setitinerary] = useState("");
    const [number_places, setNumber_places] = useState("");
    const [startingTime, setStartingTime] = useState("");
    const [returnTime, setReturnTime] = useState("");
    const [multiselectValue, setMultiselectValue] = useState(null);
    const [dropdownValue, setDropdownValue] = useState(null);
    const [buses, setBuses] = useState([]);
    const [bus, setBus] = useState(emptyProduct);
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

    useEffect(() => {
        fetchBus();
    }, []);

    const fetchBus = async () => {
        await axios.get(
            "http://localhost:5000/bus/getAllBus",
        ).then(response => {
            setBuses(response.data)
        })
            .catch(error => {
                console.log(error);
            })

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

    };

    useEffect(() => {
        fetchItineraries();
    }, []);

    const fetchItineraries = async () => {
        await axios.get(
            "http://localhost:5000/itinerary/getAllItinerary",
        ).then(response => {
            setItineraries(response.data)
            console.log(response);
        })
            .catch(error => {
                console.log(error);
            })

    };


    const handleAddBus = async () => {
        try {
            setSubmitted(true);
            const newBus = { name, itinerary, number_places, startingTime, returnTime };
            const response = await axios.post(
                "http://localhost:5000/bus/addBus",
                newBus,
            );
            setBuses([...buses, response.data]);
            console.log(newBus);
            setProductDialog(false);
            setName("");
            setitinerary("");
            setNumber_places("");

            setStartingTime("");
            setReturnTime("");
            toast.current.show({
                severity: "success",
                summary: "Successful",
                detail: "Bus Created",
                life: 3000,
            });
        } catch (e) {
            console.log(e);
            if (
                name == "" ||
                itinerary == "" ||
                number_places == "" ||

                startingTime == "" ||
                returnTime == ""
            ) {
                toast.current.show({
                    severity: "error",
                    summary: "error",
                    detail: "enter data",
                    life: "3000",
                });
            } else {
                toast.current.show({
                    severity: "error",
                    summary: "error",
                    detail: "itinerary exist",
                    life: "3000",
                });

            }
        }
    };

    const editEmploye = (bus) => {
        setBus({ ...bus });
        setProductDialog(true);
    };


    const handleUpdateItinerary = async (bus) => {
        try {
            const response = await axios.put(
                `http://localhost:5000/itinerary/updateItinerary/${bus._id}`, {
                name,
                itinerary,
                number_places,

                startingTime,
                returnTime,
            }

            );
            setBus({ ...bus });

            setProductDialog(true);
            toast.current.show({
                severity: "success",
                summary: "Successful",
                detail: "Bus Updated",
                life: 3000,
            });
        } catch (e) {
            console.log(e);
            toast.current.show({
                severity: "error",
                summary: "error",
                detail: "Bus not Updated",
                life: 3000,
            });
        }
    };
    useEffect(() => {
        const productService = new ProductService();
        productService.getProducts().then((data) => setProducts(data));
    }, []);

    const openNew = () => {
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


    const confirmDeleteProduct = (bus) => {
        console.log('hhlflldld', bus);
        setBus(bus);
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

            await axios.delete(`http://localhost:5000/bus/deleteBus/${bus._id}`);
            const updatedItineraries = buses.filter(
                (em) => em._id !== bus._id,
            );
            setBuses(updatedItineraries);
            setDeleteProductDialog(false);
            console.log(updatedItineraries);
            setName("");
            setitinerary("");
            setNumber_places("");

            setStartingTime("");
            setReturnTime("");

            toast.current.show({
                severity: "success",
                summary: "Successful",
                detail: "Bus Deleted",
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

    const handleDeleteEmployees = async (ids) => {
        try {
            const response = await axios.delete('http://localhost:5000/user/deleteEmployees', {
                data: { ids: ids },
            });
            if (response.status === 200) {
                const updatedItineraries = buses.filter((bus) => !ids.includes(bus._id));
                setMarkers(updatedItineraries);
                setDeleteProductDialog(false);
                setSelectedEmployees(null);
                setName("");
                setitinerary("");
                setNumber_places("");

                setStartingTime("");
                setReturnTime("");
                toast.current.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Buses Deleted',
                    life: 3000,
                });
            }
        } catch (error) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Error deleting buses',
                life: 3000,
            });
            setDeleteProductDialog(false);
        }
    };


    const deleteSelectedProducts = async () => {

        try {
            const response = await axios.delete('http://localhost:5000/bus/deleteBuses', {
                data: { BusesIds: selectedEmployees },
            });

            if (response.status === 200) {

                const updatedEmployees = buses.filter((em) => !selectedEmployees.includes(em._id));
                setBuses(updatedEmployees);
                setDeleteProductsDialog(false);
                setSelectedEmployees(null);
                setName("");
                setitinerary("");
                setNumber_places("");

                setStartingTime("");
                setReturnTime("");

                toast.current.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Buses Deleted',
                    life: 3000,
                });
            } else {
                toast.current.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Error deleting buses',
                    life: 3000,
                });
                setDeleteProductsDialog(false);
            }
        } catch (error) {
            
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Error deleting buses',
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
                        onClick={() => confirmDeleteSelected(buses)}
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

    const number_placesBodyTemplate = (buses) => {

        return (
            <>
                <span className="p-column-title">Number Of Places</span>
                {buses.number_places}
            </>
        );
    };

    const itineraryBodyTemplate = (buses) => {
        return (
            <>
                <span className="p-column-title">itinerary</span>
                {buses.itinerary.name}

            </>
        );
    };

    const startingTimeBodyTemplate = (buses) => {
        return (
            <>
                <span className="p-column-title">startingTime</span>
                {buses.startingTime}
            </>
        );
    };

    const returnTimeBodyTemplate = (buses) => {
        return (
            <>
                <span className="p-column-title">returnTime</span>
                {buses.returnTime}
            </>
        );
    };

    const nameBodyTemplate = (buses) => {
        return (
            <>
                <span className="p-column-title">name</span>
                {buses.name}
            </>
        );
    };



    const actionBodyTemplate = (buses) => {
        return (
            <>
                <Button
                    icon="pi pi-pencil"
                    className="p-button-rounded p-button-success mr-2"
                    onClick={() => handleUpdateItinerary(buses)}
                />
                <Button
                    icon="pi pi-trash"
                    className="p-button-rounded p-button-warning"
                    onClick={() => confirmDeleteProduct(buses)}
                />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Manage Buses</h5>
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
                onClick={handleAddBus}
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
                        value={buses}
                        selection={selectedEmployees}
                        onSelectionChange={(e) => setSelectedEmployees(e.value)}
                        dataKey="_id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[10, 20, 30, 40]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} buses"
                        globalFilter={globalFilter}
                        emptyMessage="No buses found."
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
                            field="itinerary"
                            header="itinerary"
                            sortable
                            body={itineraryBodyTemplate}
                            headerStyle={{ minWidth: "9rem" }}
                        ></Column>
                        <Column
                            field="number_places"
                            header="Number Of Places"
                            sortable
                            body={number_placesBodyTemplate}
                            headerStyle={{ minWidth: "9rem" }}
                        ></Column>

                        <Column
                            field="startingTime"
                            header="startingTime"
                            sortable
                            body={startingTimeBodyTemplate}
                            headerStyle={{ minWidth: "9rem" }}
                        ></Column>
                        <Column
                            field="returnTime"
                            header="returnTime"
                            sortable
                            body={returnTimeBodyTemplate}
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
                        header="Buses Details"
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
                            <label htmlFor="itinerary">itinerary</label>
                            <Dropdown
                                value={itinerary}
                                onChange={(e) => setitinerary(e.target.value)}
                                required
                                className={classNames({ "p-invalid": submitted && !itinerary })}
                                options={itineraries}
                                optionLabel="name"
                                placeholder="Select itineraries"

                            />
                            {submitted && !itinerary && (
                                <small className="p-invalid">itinerary is required.</small>
                            )}
                        </div>
                        <div className="field">
                            <label htmlFor="name">number of places</label>
                            <InputText
                                id="number_places"
                                value={number_places}
                                onChange={(e) => setNumber_places(e.target.value)}
                                required

                                className={classNames({ "p-invalid": submitted && !number_places })}
                            />
                            {submitted && !number_places && (
                                <small className="p-invalid">number of places is required.</small>
                            )}
                        </div>

                        <div className="field">
                            <label htmlFor="startingTime">startingTime</label>
                            <InputText
                                id="startingTime"
                                value={startingTime}
                                onChange={(e) => setStartingTime(e.target.value)}
                                required
                                className={classNames({ "p-invalid": submitted && !startingTime })}
                            />
                            {submitted && !startingTime && (
                                <small className="p-invalid">startingTime is required.</small>
                            )}
                        </div>
                        <div className="field">
                            <label htmlFor="returnTime">returnTime</label>
                            <InputText
                                id="returnTime"
                                value={returnTime}
                                onChange={(e) => setReturnTime(e.target.value)}
                                required
                                className={classNames({ "p-invalid": submitted && !returnTime })}
                            />
                            {submitted && !returnTime && (
                                <small className="p-invalid">returnTime is required.</small>
                            )}
                        </div>


                        {/* <div className="field">
                            <label htmlFor="stations">stations</label>
                            <InputText
                                id="stations"
                                value={stations}
                                onChange={(e) => setStations(e.target.value)}
                                required
                                className={classNames({ "p-invalid": submitted && !stations })}
                            />
                            {submitted && !stations && (
                                <small className="p-invalid">stations is required.</small>
                            )}
                        </div> */}

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
                                    Are you sure you want to delete bus?
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
                                    Are you sure you want to delete the selected buses?
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

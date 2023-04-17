import getConfig from "next/config";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { FileUpload } from "primereact/fileupload";
import { InputNumber } from "primereact/inputnumber";
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

    useEffect(() => {
        fetchMarkers();
    }, []);

    const fetchMarkers = async () => {
        const response = await axios.get(
            "http://localhost:5000/marker/getAllMarker",
        );
        setMarkers(response.data.data);
    };

    const handleAddEmployee = async () => {
        try {
            setSubmitted(true);
            const newMarker = { name, description, latitude, longitude};
            const response = await axios.post(
                "http://localhost:5000/marker/addMarker",
                newMarker,
            );
            setMarkers([...markers, response.data.data]);

            setProductDialog(false);
            setName("");
            setDescription("");
            setLatitude("");
            setLongitude("");
            toast.current.show({
                severity: "success",
                summary: "Successful",
                detail: "Station Created",
                life: 3000,
            });
        } catch (e) {
            console.log(e);
            if (
                name == "" ||
                description == "" ||
                latitude == "" ||
                longitude == "" 
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
                    detail: "marker exist",
                    life: "3000",
                });
            }
        }
    };
 
    const editEmploye = (marker) => {
        setMarker({ ...marker });
        setProductDialog(true);
    };
  

    const handleUpdateEmployee = async (marker) => {
        try {
            const response = await axios.put(
                `http://localhost:5000/user/updateEmploye/${marker._id}`,{
                    name,
                    description,
                    latitude,
                    longitude,
                  }
                
            );
            setMarker({ ...marker });
            
            setProductDialog(true);
            toast.current.show({
                severity: "success",
                summary: "Successful",
                detail: "Marker Updated",
                life: 3000,
            });
        } catch (e) {
            console.log(e);
            toast.current.show({
                severity: "error",
                summary: "error",
                detail: "Marker not Updated",
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
                detail: "Marker Deleted",
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
            const updatedEmployees = markers.filter((marker) => !ids.includes(marker._id));
            setMarkers(updatedEmployees);
            setDeleteProductDialog(false);
            setSelectedEmployees(null);
            setName("");
            setDescription("");
            setLatitude("");
            setLongitude("");
            toast.current.show({
              severity: 'success',
              summary: 'Successful',
              detail: 'Markers Deleted',
              life: 3000,
            });
          }
        } catch (error) {
          toast.current.show({
            severity: 'error',
            summary: 'Error',
            detail: 'Error deleting markers',
            life: 3000,
          });
          setDeleteProductDialog(false);
        }
      };
      

    const deleteSelectedProducts = () => {
        let em = products.filter((val) => !selectedEmployees.includes(val));
        setEmployees(em);
        setDeleteProductsDialog(false);
        setSelectedEmployees(null);
        toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "Products Deleted",
            life: 3000,
        });
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

    const lastnameBodyTemplate = (markers) => {
        return (
            <>
                <span className="p-column-title">Name</span>
                {markers.name}
            </>
        );
    };
    const usernameBodyTemplate = (markers) => {
        return (
            <>
                <span className="p-column-title">Description</span>
                {markers.description}
            </>
        );
    };
    const emailBodyTemplate = (markers) => {
        return (
            <>
                <span className="p-column-title">Latitude</span>
                {markers.latitude}
            </>
        );
    };

    const firstnameBodyTemplate = (markers) => {
        return (
            <>
                <span className="p-column-title">Longitude</span>
                {markers.longitude}
            </>
        );
    };
   
 

    const actionBodyTemplate = (markers) => {
        return (
            <>
                <Button
                    icon="pi pi-pencil"
                    className="p-button-rounded p-button-success mr-2"
                    onClick={() => handleUpdateEmployee(markers)}
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
                onClick={handleAddEmployee}
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
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} employes"
                        globalFilter={globalFilter}
                        emptyMessage="No markers found."
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
                            body={firstnameBodyTemplate}
                            headerStyle={{ minWidth: "9rem" }}
                        ></Column>
                        <Column
                            field="description"
                            header="Description"
                            sortable
                            body={lastnameBodyTemplate}
                            headerStyle={{ minWidth: "9rem" }}
                        ></Column>
                        <Column
                            field="latitude"
                            header="Latitude"
                            sortable
                            body={usernameBodyTemplate}
                            headerStyle={{ minWidth: "9rem" }}
                        ></Column>
                        <Column
                            field="longitude"
                            header="Longitude"
                            sortable
                            body={emailBodyTemplate}
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
                        header="Employes Details"
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
                                    Are you sure you want to delete ?
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
                                    Are you sure you want to delete the selected products?
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

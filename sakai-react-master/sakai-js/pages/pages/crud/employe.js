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
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        userName: "",
    };
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [userName, setUserName] = useState("");
    const [employees, setEmployees] = useState([]);
    const [employee, setEmployee] = useState(emptyProduct);
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
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        const response = await axios.get(
            "http://localhost:5000/user/getAllEmploye",
        );
        setEmployees(response.data.data);
    };

    const handleAddEmployee = async () => {
        try {
            setSubmitted(true);
            const newEmployee = { firstName, lastName, email, userName, password };
            const response = await axios.post(
                "http://localhost:5000/user/addEmploye",
                newEmployee,
            );
            setEmployees([...employees, response.data.data]);

            setProductDialog(false);
            setLastName("");
            setFirstName("");
            setEmail("");
            setPassword("");
            setUserName("");
            toast.current.show({
                severity: "success",
                summary: "Successful",
                detail: "Employe Created",
                life: 3000,
            });
        } catch (e) {
            console.log(e);
            if (
                userName == "" ||
                firstName == "" ||
                lastName == "" ||
                email == "" ||
                password == ""
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
                    detail: "user exist",
                    life: "3000",
                });
            }
        }
    };
 
    const editEmploye = (employee) => {
        setEmployee({ ...employee });
        setProductDialog(true);
    };
  

    const handleUpdateEmployee = async (employee) => {
        try {
            const response = await axios.put(
                `http://localhost:5000/user/updateEmploye/${employee._id}`,{
                    firstName,
                    lastName,
                    email,
                    password,
                    userName,
                  }
                
            );
            setEmployee({ ...employee });
            
            setProductDialog(true);
            toast.current.show({
                severity: "success",
                summary: "Successful",
                detail: "Employe Updated",
                life: 3000,
            });
        } catch (e) {
            console.log(e);
            toast.current.show({
                severity: "error",
                summary: "error",
                detail: "Employe not Updated",
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


    const confirmDeleteProduct = (employee) => {
        console.log('hhlflldld',employee);
        setEmployee(employee);
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
            
            await axios.delete(`http://localhost:5000/user/deleteEmploye/${employee._id}`);
            const updatedEmployees = employees.filter(
                (em) => em._id !== employee._id,
            );
            setEmployees(updatedEmployees);
            setDeleteProductDialog(false);
            console.log(updatedEmployees);
            setLastName("");
            setFirstName("");
            setEmail("");
            setPassword("");
            setUserName("");

            toast.current.show({
                severity: "success",
                summary: "Successful",
                detail: "Employe Deleted",
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
            const updatedEmployees = employees.filter((employee) => !ids.includes(employee._id));
            setEmployees(updatedEmployees);
            setDeleteProductDialog(false);
            setSelectedEmployees(null);
            setLastName('');
            setFirstName('');
            setEmail('');
            setPassword('');
            setUserName('');
            toast.current.show({
              severity: 'success',
              summary: 'Successful',
              detail: 'Employees Deleted',
              life: 3000,
            });
          }
        } catch (error) {
          toast.current.show({
            severity: 'error',
            summary: 'Error',
            detail: 'Error deleting employees',
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
                        onClick={() =>confirmDeleteSelected(employees)}
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

    const lastnameBodyTemplate = (employees) => {
        return (
            <>
                <span className="p-column-title">Last Name</span>
                {employees.lastName}
            </>
        );
    };
    const usernameBodyTemplate = (employees) => {
        return (
            <>
                <span className="p-column-title">Username</span>
                {employees.userName}
            </>
        );
    };
    const emailBodyTemplate = (employees) => {
        return (
            <>
                <span className="p-column-title">Email</span>
                {employees.email}
            </>
        );
    };

    const firstnameBodyTemplate = (employees) => {
        return (
            <>
                <span className="p-column-title">first name</span>
                {employees.firstName}
            </>
        );
    };
   
 

    const actionBodyTemplate = (employees) => {
        return (
            <>
                <Button
                    icon="pi pi-pencil"
                    className="p-button-rounded p-button-success mr-2"
                    onClick={() => handleUpdateEmployee(employees)}
                />
                <Button
                    icon="pi pi-trash"
                    className="p-button-rounded p-button-warning"
                    onClick={() => confirmDeleteProduct(employees)}
                />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Manage Employes</h5>
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
                        value={employees}
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
                        emptyMessage="No employes found."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column
                            selectionMode="multiple"
                            headerStyle={{ width: "4rem" }}
                        ></Column>
                        <Column
                            field="firstName"
                            header="First Name"
                            sortable
                            body={firstnameBodyTemplate}
                            headerStyle={{ minWidth: "9rem" }}
                        ></Column>
                        <Column
                            field="lastName"
                            header="Last Name"
                            sortable
                            body={lastnameBodyTemplate}
                            headerStyle={{ minWidth: "9rem" }}
                        ></Column>
                        <Column
                            field="usernName"
                            header="Username"
                            sortable
                            body={usernameBodyTemplate}
                            headerStyle={{ minWidth: "9rem" }}
                        ></Column>
                        <Column
                            field="email"
                            header="Email"
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
                            <label htmlFor="firstName">First name</label>
                            <InputText
                                id="firstName"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                                autoFocus
                                className={classNames({ "p-invalid": submitted && !firstName })}
                            />
                            {submitted && !firstName && (
                                <small className="p-invalid">first name is required.</small>
                            )}
                        </div>
                        <div className="field">
                            <label htmlFor="lastName">Last name</label>
                            <InputText
                                id="lastName"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                                className={classNames({ "p-invalid": submitted && !lastName })}
                            />
                            {submitted && !lastName && (
                                <small className="p-invalid">last name is required.</small>
                            )}
                        </div>
                        <div className="field">
                            <label htmlFor="email">Email</label>
                            <InputText
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className={classNames({ "p-invalid": submitted && !email })}
                            />
                            {submitted && !email && (
                                <small className="p-invalid">email is required.</small>
                            )}
                        </div>
                        <div className="field">
                            <label htmlFor="password">Password</label>
                            <Password
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                toggleMask
                                className={classNames({ "p-invalid": submitted && !password })}
                            />
                            {submitted && !password && (
                                <small className="p-invalid">password is required.</small>
                            )}
                        </div>
                        <div className="field">
                            <label htmlFor="userName">Username</label>
                            <InputText
                                id="userName"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                required
                                className={classNames({ "p-invalid": submitted && !userName })}
                            />
                            {submitted && !userName && (
                                <small className="p-invalid">username is required.</small>
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

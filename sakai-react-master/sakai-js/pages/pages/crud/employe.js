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
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { classNames } from "primereact/utils";
import emailjs from "@emailjs/browser";
import { Password } from "primereact/password";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useRouter } from 'next/router';

import { ProductService } from "../../../demo/service/ProductService";

const Crud = () => {
    let emptyProduct = {
        _id: "",
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        userName: "",
        itinerary: "",

    };

    const [dropdownValue, setDropdownValue] = useState(null);
    const [firstName, setFirstName] = useState("");
    const [itineraries, setItineraries] = useState([]);
    const [itinerary, setitinerary] = useState("");
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
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    const toast = useRef(null);
    
    const dt = useRef(null);
    const contextPath = getConfig().publicRuntimeConfig.contextPath;

    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            router.push('/');
        }
    }, []);

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        const response = await axios.get(
            "http://localhost:5000/user/getAllEmploye",
        );
        setEmployees(response.data.data);
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



    const handleAddEmployee = async () => {
        try {
          setSubmitted(true);
          const newEmployee = { firstName, lastName, email, userName, password, itinerary };
          
          if (selectedEmployee) {
            // Update employee logic
            const updatedEmployee = {
              ...selectedEmployee,
              ...newEmployee
            };
      
            await axios.put(
              `http://localhost:5000/user/updateEmploye/${selectedEmployee._id}`,
              updatedEmployee
            );
      
            const updatedEmployees = employees.map((employee) =>
              employee._id === selectedEmployee._id ? updatedEmployee : employee
            );
      
            setEmployees(updatedEmployees);
          } else {
            // Add new employee logic
            const response = await axios.post(
              "http://localhost:5000/user/addEmploye",
              newEmployee
            );
            
            setEmployees([...employees, response.data.data]);
          }
      
          // Send email notification
          sendEmailNotification(newEmployee);
      
          setProductDialog(false);
          setLastName("");
          setFirstName("");
          setEmail("");
          setPassword("");
          setUserName("");
          setitinerary("");
          setSelectedEmployee(null);
      
          toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: selectedEmployee ? "Employee Updated" : "Employee Created",
            life: 3000,
          });
        } catch (e) {
          console.log(e);
          if (
            userName === "" ||
            firstName === "" ||
            lastName === "" ||
            email === "" ||
            password === "" ||
            itinerary === ""
          ) {
            toast.current.show({
              severity: "error",
              summary: "error",
              detail: "Enter data",
              life: "3000",
            });
          } else {
            toast.current.show({
              severity: "error",
              summary: "error",
              detail: "User already exists",
              life: "3000",
            });
          }
        }
      };
      
    const sendEmailNotification = (employee) => {
        const templateParams = {
            firstName: employee.firstName,
            lastName: employee.lastName,
            email: employee.email,
            password: employee.password,
            userName: employee.userName,
        };

        emailjs.send(
            'service_i89uxs8',
            'template_xgzj0to',
            templateParams,
            'yvxNBLg45iiK7wPQl'
        )
            .then((response) => {
                console.log('Email sent successfully:', response.text);
            })
            .catch((error) => {
                console.log('Error sending email:', error.text);
            });
    };


 



    const handleUpdateEmployee = (employee) => {
        setSelectedEmployee(employee);
        setFirstName(employee.firstName);
        setLastName(employee.lastName);
        setEmail(employee.email);
        setUserName(employee.userName);
        setPassword(employee.password);
        setitinerary(employee.itinerary);
        setProductDialog(true);
      };
      
    useEffect(() => {
        const productService = new ProductService();
        productService.getProducts().then((data) => setProducts(data));
    }, []);

    const openNew = () => {
        setSelectedEmployee(null);
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
        console.log('hhlflldld', employee);
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
            setitinerary("");


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

    const deleteSelectedProducts = async () => {

        try {
            const response = await axios.delete('http://localhost:5000/user/deleteEmployees', {
                data: { employeeIds: selectedEmployees },
            });

            if (response.status === 200) {

                const updatedEmployees = employees.filter((em) => !selectedEmployees.includes(em._id));
                setEmployees(updatedEmployees);
                setDeleteProductsDialog(false);
                setSelectedEmployees(null);
                setLastName('');
                setFirstName('');
                setEmail('');
                setPassword('');
                setUserName('');
                setitinerary("");

                toast.current.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Employees Deleted',
                    life: 3000,
                });
            } else {
                toast.current.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Error deleting employees',
                    life: 3000,
                });
                setDeleteProductsDialog(false);
            }
        } catch (error) {

            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Error deleting employees',
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
                        onClick={() => confirmDeleteSelected(employees)}
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

    const descriptionBodyTemplate = (markers) => {
        console.log('Markers:', markers);
        return (
          <>
            <span className="p-column-title">Itinerary</span>
            {markers.itinerary ? markers.itinerary.name : ''}
          </>
        );
      };
    const itineraryBodyTemplate = (employees) => {
        
          return (
            <>
              <span className="p-column-title">Itinerary</span>
              {employees.itinerary ? employees.itinerary.name : ''}
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
                    onClick={
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
                            field="itinerary"
                            header="itinerary"
                            sortable
                            body={itineraryBodyTemplate}
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
                        <div className="field">
                            <label htmlFor="itinerary">itinerary</label>
                            <MultiSelect
                                value={itinerary}
                                onChange={(e) => setitinerary(e.target.value)}
                                options={itineraries}
                                optionLabel="name"
                                placeholder="Select itineraries"
                                filter
                                display="chip"
                                 />
                            {submitted && !itinerary && (
                                <small className="p-invalid">itinerary is required.</small>
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
                                    Are you sure you want to delete employee?
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
                                    Are you sure you want to delete the selected employees?
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

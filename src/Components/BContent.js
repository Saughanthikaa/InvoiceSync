import React, { useEffect, useState } from "react";
import "../Components/Content.css";
import img from "../Components/images/user.png";
import download from "../Components/images/download.png";
import { InputText } from "primereact/inputtext";
import { Dropdown } from 'primereact/dropdown';
import axios from "axios";
import Invoice from "../Components/Invoice";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import Dashboard from '../Components/Dashboard';
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from 'yup';
import { Tag } from 'primereact/tag';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { AutoComplete } from 'primereact/autocomplete';



const validationSchema = Yup.object({
    fname: Yup.string().required('First Name is required'),
    lname: Yup.string().required('Last Name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    phone: Yup.string().required('Phone is required').matches(/^\d+$/, "Phone number must be only digits").min(10, 'Phone number must be at least 10 digits'),
    state: Yup.string().required('State is required'),
    city: Yup.string().required('City is required'),
    pincode: Yup.string().required('Pincode is required').matches(/^\d+$/, "Pincode must be only digits").min(6, 'Pincode must be at least 6 digits'),
    address: Yup.string().required('Address is required'),
});

const statuses = ['Completed', 'In progress', 'Pending'];

const getSeverity = (value) => {
    switch (value) {
        case 'Completed':
            return 'success';
        case 'In progress':
            return 'warning';
        case 'Pending':
            return 'danger';
        default:
            return null;
    }
};

const api = axios.create({
    baseURL: 'http://localhost:8000', // Replace with your API base URL
    timeout: 1000, // Request timeout in milliseconds
    headers: { 'Content-Type': 'application/json' },
});

function BContent(){

    // const customerData = [
    //     { fname: "John", lname: "Doe", city: "New York", state: "NY", pincode: "10001" },
    //     { fname: "Jane", lname: "Smith", city: "Los Angeles", state: "CA", pincode: "90001" },
    //     // Add more customer data as needed
    //   ];
    
      
    const [showpopup, setShowpopup] = useState(false);
    const [prodselection, setProdselection] = useState(true);
    const [expandedRows, setExpandedRows] = useState(null);
    const [customer, setCustomer] = useState({
        fname: '',
        lname: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        phone: '',
        email: '',
        product: []
    });

    const [filteredCustomers, setFilteredCustomers] = useState([]);
        const handleSelect = (e, setFieldValue) => {
        const selectedCustomer = e.value;
        setFieldValue('fname', selectedCustomer.fname);
        setFieldValue('lname', selectedCustomer.lname);
        setFieldValue('address',selectedCustomer.address);
        setFieldValue('phone',selectedCustomer.phone);
        setFieldValue('email',selectedCustomer.email);
        setFieldValue('city', selectedCustomer.city);
        setFieldValue('state', selectedCustomer.state);
        setFieldValue('pincode', selectedCustomer.pincode);
      };
    
      const searchCustomer = (event) => {
        setFilteredCustomers(
          customerData.filter((customer) => {
            return customer.fname.toLowerCase().startsWith(event.query.toLowerCase());
          })
        );
      };

    const [selectedProduct, setSelectedProduct] = useState("");
    const [price, setPrice] = useState();
    const [quantity, setQuantity] = useState(1);
    const [orders, setOrders] = useState([]);
    const [data, setData] = useState([]);
    const [selectedProductsList, setSelectedProductsList] = useState([]);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setCustomer(prevState => ({
            ...prevState,
            [id]: value
        }));
    };

    const handleViewInvoice = (rowData) => {
        navigate('/Invoice', { state: { rowData } });
    };

    const billTemplate = (rowData) => {
        return (
            <img
                src={download}
                alt="Download"
                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                onClick={() => handleViewInvoice(rowData)}
            />
        );
    };

    const products = [
        { name: 'wheat', pp: 50 },
        { name: 'rice', pp: 60 },
        { name: 'milk', pp: 20 },
        { name: 'ghee', pp: 30 },
        { name: 'oil', pp: 60 },
    ];

    const prod=[
        {name:'HDPE',pp:350},
        {name:'0.25',pp:330},
        {name:'1/6',pp:580},
        {name:'1/3',pp:650}
    ]

    const handleChange = (e) => {
        setSelectedProduct(e.target.value);
    };
    const [customerData, setCustomerData] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await axios.get('http://localhost:8000/getOrders');
                setData(res.data.reverse());
                console.log("DATAAAAA =",data)
            } catch (error) {
                console.log("Error fetching the data", error.message);
            }
        };
        fetchOrders();

        const product = products.find((p) => p.name === selectedProduct);
        if (product) {
            setPrice(quantity * product.pp);
        }
    }, [selectedProduct, quantity]);
    useEffect(() => {
        if (data.length > 0) {
            const seen = new Set();
            const uniqueCustomerData = data.filter(order => {
                const identifier = `${order.fname}|${order.lname}|${order.city}|${order.state}|${order.pincode}|${order.address}|${order.phone}|${order.email}`;
                if (seen.has(identifier)) {
                    return false;
                }
                seen.add(identifier);
                return true;
            }).map(order => ({
                fname: order.fname,
                lname: order.lname,
                city: order.city,
                state: order.state,
                pincode: order.pincode,
                address: order.address,
                phone: order.phone,
                email: order.email
            }));

            setCustomerData(uniqueCustomerData);
            console.log("after setting cutomer array = ",customerData)
        }
    }, [data]);

    const getDetails=async()=>{
        try {
            const res = await axios.get('http://localhost:8000/getOrders');
            setData(res.data.reverse());
            console.log("DATAAAAA =",data)
        } catch (error) {
            console.log("Error fetching the data", error.message);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const resLastOrder = await axios.get('http://localhost:8000/getLastOrder');
            const lastOrder = resLastOrder.data;
            let newInvoiceNo;
            if (lastOrder.message && lastOrder.message === "No orders found") {
                newInvoiceNo = 1;
            } else {
                newInvoiceNo = parseInt(lastOrder.invoiceNo) + 1;
            }
            const totalamt = customer.product.reduce((acc, item) => acc + item.subtotal, 0);
            let tax;
            if(customer.state!=='TamilNadu'){
                tax = 0.02+0.02;
            }
            else{
                tax= 0.05
            }
            const total = (totalamt * (1+tax)).toFixed(2)
            const obj = {
                ...customer,
                invoiceNo: newInvoiceNo.toString(),
                orderedDate: new Date().toISOString(),
                total: total,
                status: 'Pending',
                payment: 'Pending'
            };
    
            // Submit the new order
            const res = await axios.put('http://localhost:8000/addOrder', obj);
            console.log("Data stored successfully ", res.data);
    
            // Update the local state with the new order
            setOrders([...orders, obj]);
        } catch (error) {
            console.log("Error in saving the data ", error.message);
        }
        setShowpopup(false);
        getDetails();
    };
    
    

    const handleAddProduct = () => {
        console.log("Add product = ", selectedProduct);
        if (selectedProduct) {
            const product = products.find((p) => p.name === selectedProduct.name);
            if (product) {
                const existingProductIndex = selectedProductsList.findIndex((p) => p.name === selectedProduct.name);
                let updatedProductsList;
    
                if (existingProductIndex !== -1) { // Product already exists
                    updatedProductsList = [...selectedProductsList];
                    const existingProduct = updatedProductsList[existingProductIndex];
                    const updatedProduct = {
                        ...existingProduct,
                        quantity: existingProduct.quantity + quantity,
                        subtotal: (existingProduct.quantity + quantity) * product.pp
                    };
                    updatedProductsList[existingProductIndex] = updatedProduct;
                } else { // Product is new
                    const newProduct = {
                        name: selectedProduct.name,
                        price: product.pp,
                        quantity: quantity,
                        subtotal: product.pp * quantity,
                    };
                    updatedProductsList = [...selectedProductsList, newProduct];
                }
    
                setSelectedProductsList(updatedProductsList);
                console.log("producttt list =", updatedProductsList);
    
                setCustomer(prevState => ({
                    ...prevState,
                    product: updatedProductsList
                }));
    
                setSelectedProduct('');
                setQuantity(1);
            }
        }
    };
    

    const handleOrderClick = () => {
        setShowpopup(!showpopup);
        setProdselection(true);
    };

    const selectProd = () => {
        setProdselection(false);
    };

    const rowExpansionTemplate = (data) => {
        return (
            <div className="p-3">
                <h5>Orders for {data.fname} {data.lname}</h5>
                <DataTable value={data.product}>
                    <Column field="name" header="Name"></Column>
                    <Column field="price" header="Price"></Column>
                    <Column field="quantity" header="Quantity"></Column>
                    <Column field="subtotal" header="Total"></Column>
                </DataTable>
            </div>
        );
    };

    const updateOrderStatus = async (rowData, newStatus) => {
        const updatedOrder = { ...rowData, status: newStatus };
        try {
            const res = await axios.put('http://localhost:8000/addOrder', updatedOrder);
            console.log("Data stored successfully ", res.data);
            // Update local state to reflect the changes
            setData((prevData) => prevData.map(order => order.invoiceNo === updatedOrder.invoiceNo ? updatedOrder : order));
        } catch (error) {
            console.log("Error in saving the data ", error.message);
        }
    };

    const statusEditor = (options) => {
        const onStatusChange = (e) => {
            updateOrderStatus(options.rowData, e.value);
        };

        const statusItemTemplate = (option) => {
            return (
                <Tag value={option.label} severity={getSeverity(option.value)} />
            );
        };

        return (
            <Dropdown
                value={options.value}
                options={statuses.map(status => ({ label: status, value: status }))}
                onChange={onStatusChange}
                placeholder="Select status"
                className="w-full md:w-14rem"
                itemTemplate={statusItemTemplate}
            />
        );
    };

    const formatDate = (isoDate) => {
        const date = new Date(isoDate);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };
    
    return(
        <div>
        <div>
        <button onClick={() => handleOrderClick()} className="btn"> Add order</button>
        <DataTable value={data} paginator rows={10} rowsPerPageOptions={[5, 10, 25, 50]} expandedRows={expandedRows} onRowToggle={(e) => setExpandedRows(e.data)} rowExpansionTemplate={rowExpansionTemplate} dataKey="invoiceNo" showGridlines>
            <Column expander style={{ width: '3em' }} />
            <Column field="invoiceNo" header="Invoice No" style={{ minWidth: '20%' }} />
            <Column field="fname" header="First Name" style={{ minWidth: '20%' }} />
            <Column field="lname" header="Last Name" style={{ minWidth: '20%' }} />
            <Column field={(rowData) => formatDate(rowData.orderedDate)} header="Ordered Date" style={{ minWidth: '30%' }} />
            <Column field="total" header="Total" style={{ minWidth: '25%' }} />
            <Column field="status" header="Status" editor={statusEditor} body={(rowData) => <Tag value={rowData.status} severity={getSeverity(rowData.status)}></Tag>} />
            <Column header="Bill" body={billTemplate} style={{ minWidth: '25%' }} />
        </DataTable>
    </div>
        <Dialog header="Header" visible={showpopup} style={{ width: '50vw' }} onHide={() => {if (!showpopup) return; setShowpopup(false); }}>
        <div className="popupDiv">
                <div style={{ textAlign: 'end', cursor: 'pointer' }} onClick={() => handleOrderClick()}>X</div>
                {prodselection ? (
                    <div className="custDiv">
                        <h2>Add Customer</h2>
                       
                        {/* <Formik
                            initialValues={customer}
                            validationSchema={validationSchema}
                            onSubmit={(values, { setSubmitting }) => {
                                setCustomer(values);
                                selectProd();
                                setSubmitting(false);
                            }}
                        >
                            {({ isSubmitting }) => (
                                <Form>
                                    <div style={{ display: 'flex', gap: '10vh', marginBottom: '4vh' }}>
                                        <div>
                                            <label htmlFor="fname">First Name</label><br />
                                            <Field name="fname" as={InputText} id="fname" style={{ width: '300px' }} />
                                            <ErrorMessage name="fname" component="div" className="error" />
                                        </div>
                                        <div>
                                            <label htmlFor="lname">Last Name</label><br />
                                            <Field name="lname" as={InputText} id="lname" style={{ width: '300px' }} />
                                            <ErrorMessage name="lname" component="div" className="error" />
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '10vh', marginBottom: '4vh' }}>
                                        <div>
                                            <label htmlFor="address">Address</label><br />
                                            <Field name="address" as={InputText} id="address" style={{ width: '300px' }} />
                                            <ErrorMessage name="address" component="div" className="error" />
                                        </div>
                                        <div>
                                            <label htmlFor="city">City</label><br />
                                            <Field name="city" as={InputText} id="city" style={{ width: '300px' }} />
                                            <ErrorMessage name="city" component="div" className="error" />
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '10vh', marginBottom: '4vh' }}>
                                        <div>
                                            <label htmlFor="state">State</label><br />
                                            <Field name="state" as={InputText} id="state" style={{ width: '300px' }} />
                                            <ErrorMessage name="state" component="div" className="error" />
                                        </div>
                                        <div>
                                            <label htmlFor="pincode">Pincode</label><br />
                                            <Field name="pincode" as={InputText} id="pincode" style={{ width: '300px' }} />
                                            <ErrorMessage name="pincode" component="div" className="error" />
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '10vh', marginBottom: '4vh' }}>
                                        <div>
                                            <label htmlFor="phone">Phone</label><br />
                                            <Field name="phone" as={InputText} id="phone" style={{ width: '300px' }} />
                                            <ErrorMessage name="phone" component="div" className="error" />
                                        </div>
                                        <div>
                                            <label htmlFor="email">Email</label><br />
                                            <Field name="email" as={InputText} id="email" style={{ width: '300px' }} />
                                            <ErrorMessage name="email" component="div" className="error" />
                                        </div>
                                    </div>
                                    <div>
                                        <button type="submit" className="btn" disabled={isSubmitting}>Select product</button>
                                    </div>
                                    
                                </Form>
                                
                            )}
                        </Formik> */}
                       <Formik
      initialValues={customer}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => {
        setCustomer(values);
        // selectProd(); // Uncomment this if you have a function to select product
        selectProd();
        setSubmitting(false);
      }}
    >
      {({ isSubmitting, setFieldValue }) => (
        <Form>
          <div style={{ display: 'flex', gap: '10vh', marginBottom: '4vh' }}>
            <div>
              <label htmlFor="fname">First Name</label><br />
              <Field name="fname">
                {({ field }) => (
                  <AutoComplete
                    id="fname"
                    {...field}
                    value={field.value}
                    suggestions={filteredCustomers}
                    completeMethod={searchCustomer}
                    field="fname"
                    dropdown
                    onChange={(e) => setFieldValue('fname', e.value)}
                    onSelect={(e) => handleSelect(e, setFieldValue)}
                    style={{ width: '300px' }}
                  />
                )}
              </Field>
              <ErrorMessage name="fname" component="div" className="error" />
            </div>
            <div>
              <label htmlFor="lname">Last Name</label><br />
              <Field name="lname">
                {({ field }) => (
                  <AutoComplete
                    id="lname"
                    {...field}
                    value={field.value}
                    suggestions={filteredCustomers}
                    completeMethod={searchCustomer}
                    field="lname"
                    dropdown
                    onChange={(e) => setFieldValue('lname', e.value)}
                    onSelect={(e) => handleSelect(e, setFieldValue)}
                    style={{ width: '300px' }}
                  />
                )}
              </Field>
              <ErrorMessage name="lname" component="div" className="error" />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10vh', marginBottom: '4vh' }}>
            <div>
              <label htmlFor="address">Address</label><br />
              <Field name="address" as={InputText} id="address" style={{ width: '300px' }} />
              <ErrorMessage name="address" component="div" className="error" />
            </div>
            <div>
              <label htmlFor="city">City</label><br />
              <Field name="city" as={InputText} id="city" style={{ width: '300px' }} />
              <ErrorMessage name="city" component="div" className="error" />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10vh', marginBottom: '4vh' }}>
            <div>
              <label htmlFor="state">State</label><br />
              <Field name="state" as={InputText} id="state" style={{ width: '300px' }} />
              <ErrorMessage name="state" component="div" className="error" />
            </div>
            <div>
              <label htmlFor="pincode">Pincode</label><br />
              <Field name="pincode" as={InputText} id="pincode" style={{ width: '300px' }} />
              <ErrorMessage name="pincode" component="div" className="error" />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10vh', marginBottom: '4vh' }}>
            <div>
              <label htmlFor="phone">Phone</label><br />
              <Field name="phone" as={InputText} id="phone" style={{ width: '300px' }} />
              <ErrorMessage name="phone" component="div" className="error" />
            </div>
            <div>
              <label htmlFor="email">Email</label><br />
              <Field name="email" as={InputText} id="email" style={{ width: '300px' }} />
              <ErrorMessage name="email" component="div" className="error" />
            </div>
          </div>
          <div>
            <button type="submit" className="btn" disabled={isSubmitting}>Select product</button>
          </div>
        </Form>
      )}
    </Formik>
                    </div>
                ) : (
                    <div>
                        <div className="selectfields">
                            <div>
                                <Dropdown value={selectedProduct} onChange={handleChange} options={products} optionLabel="name" 
                                    placeholder="Select a Product" className="w-full md:w-14rem" style={{width:'200px'}}/>
                            </div>
                            {selectedProduct && (
                                <div>
                                <InputNumber value={quantity} onValueChange={(e) => setQuantity(parseInt(e.target.value))} mode="decimal" showButtons min={0} />
                                </div>
                            )}
                            <button onClick={handleAddProduct}>Add</button>
                        </div>
                        <div>
                            <h2>Selected Products:</h2>
                            <DataTable value={selectedProductsList} tableStyle={{ minWidth: '50rem' }}>
                                <Column field="name" header="Name"></Column>
                                <Column field="price" header="Price"></Column>
                                <Column field="quantity" header="Quantity"></Column>
                                <Column field="subtotal" header="Subtotal"></Column>
                            </DataTable>

                        </div>
                        <div style={{display:'flex',justifyContent:'center',marginTop:'30px'}}>
                            <button onClick={handleSubmit} className="btn">Submit</button>
                        </div>
                    </div>
                )}
            </div>
         </Dialog>
    </div>
    )
}
export default BContent;
import axios from "axios";
import React, { useEffect, useState } from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from "primereact/tag";
import { Dropdown } from "primereact/dropdown";
import "../Components/Payment.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from 'yup';
import view from "../Components/images/viewicon.png";
import { InputText } from "primereact/inputtext";

function Payments() {
    const [data, setData] = useState([]);
    const statuses = ['Pending', 'Partial', 'Paid'];
    const [currRow, setCurrRow] = useState(null);
    const [openPop, setOpenPop] = useState(false);
    const [isFullPayment, setIsFullPayment] = useState(false);
    const [ispartPayment,setIspartPayment] = useState(false);
    const [displayAmt, setDisplayAmt] = useState(false);
    const [remainingAmount, setRemainingAmount] = useState(0);
    const [viewPopup, setViewPopup] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get('http://localhost:8000/getOrders');
                setData(res.data);
            } catch (error) {
                console.log("Error : ", error.message);
            }
        };
        fetchData();
    },[]);
    
    const getDetails=async()=>{
        console.log("get details called")
        try {
            const res = await axios.get('http://localhost:8000/getOrders');
            setData(res.data);
        } catch (error) {
            console.log("Error : ", error.message);
        }
    }

    const getSeverity = (value) => {
        switch (value) {
            case 'Paid':
                return 'success';
            case 'Partial':
                return 'warning';
            case 'Pending':
                return 'danger';
            default:
                return null;
        }
    };

    const validationSchema = Yup.object({
        amountPaid: Yup.number().required('Required').min(0, 'Amount must be greater than or equal to 0'),
        bank: Yup.string().required('Required'),
        datepaid: Yup.date().required('Required').nullable(),
    });

    const handleFormSubmit = async (values) => {
        const totalPaid = currRow.partialPayment ? currRow.partialPayment.reduce((acc, payment) => acc + payment.amountPaid, 0) : 0;
        const newTotalPaid = totalPaid + values.amountPaid;
        

        let updatedOrder = {
            ...currRow,
            partialPayment: [
                ...(currRow.partialPayment || []),
                {
                    amountPaid: values.amountPaid,
                    bankName: values.bank,
                    paidDate: values.datepaid
                }
            ]
        };
        setRemainingAmount(currRow.total - (currRow.partialPayment ? currRow.partialPayment.reduce((acc, payment) => acc + payment.amountPaid, 0) : 0))
        console.log("Rem amount = ",remainingAmount)
        if (newTotalPaid >= currRow.total) {
            updatedOrder.payment = 'Paid';
        } else {
            updatedOrder.payment = 'Partial';
        }
    
        try {
            const res = await axios.put('http://localhost:8000/addOrder', updatedOrder);
            console.log("Data stored successfully ", res.data);
            
            console.log("currr rowwww =",currRow)
            if (currRow) {
                const matchingOrder = res.data.updatedUser;
                // Check if the invoice number matches
                if (matchingOrder.invoiceNo === currRow.invoiceNo) {
                Object.assign(currRow, matchingOrder); // Efficient for objects
                }
            }
            console.log("curRow afterrr updated:", currRow);
            setRemainingAmount(currRow.total - (currRow.partialPayment ? currRow.partialPayment.reduce((acc, payment) => acc + payment.amountPaid, 0) : 0))
            console.log("remainggg mt = ",remainingAmount)
            setData((prevData) => prevData.map(order => order.invoiceNo === updatedOrder.invoiceNo ? updatedOrder : order));
            setOpenPop(false);
            setCurrRow(null);
            setIsFullPayment(false);
            setIspartPayment(false);
            setDisplayAmt(false);
            setShowAddForm(false);
            setViewPopup(false);  // Close viewPopup after submit
            getDetails();
        } catch (error) {
            console.log("Error in saving the data ", error.message);
        }
        getDetails();
    };
    

    const updateOrderPayment = async (rowData, newStatus) => {
        getDetails();
        console.log("update order payment new rowData =",rowData)
        if (newStatus === 'Partial') {
            setCurrRow(rowData);
            setOpenPop(true);
            setIsFullPayment(false);
            setDisplayAmt(true);
        } else if (newStatus === 'Paid') {
            console.log("change to paid = ",rowData)
            if(rowData.partialPayment){
                console.log("row.datapartial payment is there")
                setCurrRow(rowData)
                setRemainingAmount(rowData.total - (rowData.partialPayment ? rowData.partialPayment.reduce((acc, payment) => acc + payment.amountPaid, 0) : 0))
                console.log("set remm amount inside updateOrder currrow=",rowData)
                console.log("set remm amount inside updateOrder =",remainingAmount)
                setIsFullPayment(false);  //assign another var and form la if this var is true na total - sum of pp amt
                setIspartPayment(true);
                console.log("full = ",isFullPayment, "p=",ispartPayment)
                setDisplayAmt(true); 
                setOpenPop(true); 
            }
            else{
                setIsFullPayment(!rowData.partialPayment); 
                // setDisplayAmt(true); 
                setCurrRow(rowData); 
                setOpenPop(true); 
            }
        }
    };
    const statusEditor = (options) => {
        getDetails();
        console.log("Status Editor afetr get details =",data)
        console.log("curr val in status sel = ",currRow)
        console.log("rowDtaa val in drop sel =",options.rowData)
        if (options.rowData && data) {
            const matchingOrder = data.find(order => order.invoiceNo === options.rowData.invoiceNo);
            console.log("curr val in status sel = ", options.rowData);
            console.log("matching order =", matchingOrder);
      
            if (matchingOrder) {
              Object.assign(options.rowData, matchingOrder); 
              console.log("Updated rowData:", options.rowData); 
            } 
        }
        return (
            <Dropdown
                value={options.value}
                options={statuses}
                onChange={(e) => {
                    options.editorCallback(e.value);
                    updateOrderPayment(options.rowData, e.value);
                }}
                placeholder="Select a Status"
                itemTemplate={(option) => {
                    return <Tag value={option} severity={getSeverity(option)}></Tag>;
                }}
            />
        );
    };
   
    const calculateBalance = (rowData) => {
        let balance = 0;
        if (rowData.payment === "Paid") {
            balance = 0;
        } else {
            const totalPaid = rowData.partialPayment ? rowData.partialPayment.reduce((acc, payment) => acc + payment.amountPaid, 0) : 0;
            balance = rowData.total - totalPaid;
        }
        return balance;
    };

    const formatDate = (isoDate) => {
        const date = new Date(isoDate);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const viewTemplate = (rowData) => {
        return (
            <img src={view}
                alt="Download"
                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                onClick={() => {
                    setCurrRow(rowData);
                    setViewPopup(true);
                }}
            />
        );
    };

    return (
        <div>
            <div>
                <h2>Payment Details</h2>
                {data.length > 0 ? (
                    <DataTable value={data} paginator rows={10} rowsPerPageOptions={[5, 10, 25, 50]} dataKey="invoiceNo" showGridlines>
                        <Column field="invoiceNo" header="Invoice No" style={{ minWidth: '20%' }} />
                        <Column field="fname" header="First Name" style={{ minWidth: '20%' }} />
                        <Column field="lname" header="Last Name" style={{ minWidth: '20%' }} />
                        <Column field={(rowData) => formatDate(rowData.orderedDate)} header="Ordered Date" style={{ minWidth: '30%' }} />
                        <Column field="total" header="Total" style={{ minWidth: '25%' }} />
                        <Column field={calculateBalance} header="Balance" style={{ minWidth: '25%' }} />
                        <Column field="payment" header="Payment" editor={statusEditor} body={(rowData) => <Tag value={rowData.payment} severity={getSeverity(rowData.payment)}></Tag>} />
                        <Column body={viewTemplate} header="View" style={{ minWidth: '25%' }} />
                    </DataTable>
                ) : (
                    <div>No data Found</div>
                )}
            </div>
            {openPop && currRow && (
                <>
                    <div className="overlay"></div>
                    <div className="popup">
                        <div onClick={() => setOpenPop(false)}>X</div>
                        <h2>Order Details</h2>
                        Total Amount : {currRow.total}
                        {currRow.partialPayment && currRow.partialPayment.length ? (
                            <DataTable value={currRow.partialPayment} dataKey="invoiceNo" showGridlines>
                            <Column field="amountPaid" header="Amount" style={{ minWidth: '20%' }} />
                            <Column field="bankName" header="Bank" style={{ minWidth: '20%' }} />
                            <Column field="paidDate" header="Paid date" style={{ minWidth: '20%' }} />
                        </DataTable>
                            // currRow.partialPayment.map((item, ind) => (
                            //     <h5 key={ind}>Amount {item.amountPaid} - Bank {item.bankName} - Date {item.paidDate}</h5>
                            // ))
                        ) : (
                            <h5>No previous payments</h5>
                        )}
                        <Formik
                             initialValues={{
                                 amountPaid:  ispartPayment
                                         ? remainingAmount
                                         :isFullPayment? currRow.total
                                         : 0,
                                 bank: '',
                                 datepaid: ''
                             }}
                            validationSchema={validationSchema}
                            onSubmit={handleFormSubmit}
                        >
                        {({ values, setFieldValue }) => (
                            <Form className="form">
                                    <div className="inpDiv">
                                        <label htmlFor="amountPaid">Amount Paid</label>
                                        <Field name="amountPaid"  as={InputText} type='number' />
                                        <ErrorMessage name="amountPaid" component="div" />
                                    </div>
                                <div className="inpDiv">
                                    <label htmlFor="bank">Bank Name</label>
                                    <Field name="bank"  as={InputText} type='text' />
                                    <ErrorMessage name="bank" component="div" />
                                </div>
                                <div className="inpDiv">
                                    <label htmlFor="datepaid">Date</label>
                                    <Field name="datepaid"  as={InputText} type='date' />
                                    <ErrorMessage name="datepaid" component="div" />
                                </div>
                                <div style={{display:'flex',justifyContent:'center',marginTop:'15px'}}>
                                    <button type="submit" className="btn">Submit</button>
                                </div>
                                
                            </Form>
                        )}
                        </Formik>
                    </div>
                </>
            )}
            {viewPopup && currRow && (
                <>
                    <div className="overlay"></div>
                    <div className="popup">
                        <div onClick={() => setViewPopup(false)}>X</div>
                        <h2>Order Details</h2>
                        <h3>Total Amount : {currRow.total}</h3>
                        <h3>Paid :  {currRow.partialPayment?.reduce((acc, payment) => acc + payment.amountPaid, 0)}</h3>
                        <h3>Remaining : {currRow.total - currRow.partialPayment?.reduce((acc, payment) => acc + payment.amountPaid, 0)}</h3>

                        {currRow.fullPayment ? (
                            <h5>Full Amount {currRow.total} - Bank {currRow.fullPayment.bankName} - Date {currRow.fullPayment.paidDate}</h5>
                        ) : (
                            <>
                                {currRow.partialPayment && currRow.partialPayment.length ? (
                                    <DataTable value={currRow.partialPayment}>
                                        <Column field="amountPaid" header="Amount"></Column>
                                        <Column field="bankName" header="Bank"></Column>
                                        <Column field="paidDate" header="Paid date"></Column>
                                    </DataTable>
                                    // currRow.partialPayment.map((item, ind) => (
                                    //     <h5 key={ind}>Amount {item.amountPaid} - Bank {item.bankName} - Date {item.paidDate}</h5>
                                    // ))
                                ) : (
                                    <h2 style={{display:'flex',justifyContent:'center'}}>No previous payments</h2>
                                )}
                                {currRow.partialPayment && currRow.partialPayment.reduce((acc, payment) => acc + payment.amountPaid, 0) < currRow.total && 
                                <div style={{display:'flex',justifyContent:'center',marginTop:'10px'}}>
                                    <button onClick={() => setShowAddForm(true)} className="btn">Add</button>
                                </div>
                                }
                                {showAddForm &&
                                    <Formik
                                        initialValues={{ amountPaid: 0, bank: '', datepaid: '' }}
                                        validationSchema={validationSchema}
                                        onSubmit={handleFormSubmit}
                                    >
                                        {({ values, setFieldValue }) => (
                                            <Form className="form">
                                                <div className="inpDiv">
                                                    <label htmlFor="amountPaid">Amount Paid</label>
                                                    <Field name="amountPaid" as={InputText} type='number' />
                                                    <ErrorMessage name="amountPaid" component="div" />
                                                </div>
                                                <div className="inpDiv">
                                                    <label htmlFor="bank">Bank Name</label>
                                                    <Field name="bank" as={InputText} type='text' />
                                                    <ErrorMessage name="bank" component="div" />
                                                </div>
                                                <div className="inpDiv">
                                                    <label htmlFor="datepaid">Date</label>
                                                    <Field name="datepaid" as={InputText} type='date' />
                                                    <ErrorMessage name="datepaid" component="div" />
                                                </div>
                                                <div style={{display:'flex',justifyContent:'center',marginTop:'15px'}}>
                                                    <button type="submit" className="btn">Submit</button>
                                                </div>
                                            </Form>
                                        )}
                                    </Formik>
                                }
                            </>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

export default Payments;

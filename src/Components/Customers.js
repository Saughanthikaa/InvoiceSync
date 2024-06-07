import axios from 'axios'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import React, { useEffect, useState } from 'react'
import "../Components/Customer.css";
import { Badge } from 'primereact/badge'; // Import Badge component

const Customers = () => {

    const[data, setData] = useState(null);
    const[orders, setOrders] = useState([]);
    const[selectedCust, setSelectedCust] = useState(null);

    useEffect(() => {
        const getData = async() => {
            try {
                const res = await axios.get('http://localhost:8000/getCustomerDetails');
                setData(res.data)
                console.log("Customer data: ", res.data)
            } catch(error) {
                console.log("Error: ", error.message)
            }
        }
        getData();
    }, [])

    const getSeverity = (value) => {
        switch (value) {
          case 'Pending':
            return 'danger';
          case 'In progress':
            return 'warning';
          case 'Completed':
            return 'success';
          default:
            return null;
        }
      };
      const getPaymentSeverity = (value) => {
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

    const onRowSelect = async(e) => {
        const cust = e.data;
        setSelectedCust(cust)
        try {
            const res = await axios.get(`http://localhost:8000/getOrderDetails?phone=${cust.phone}`);
            setOrders(res.data)
            console.log("Order details: ", res.data)
        } catch(error) {
            console.log("Error: ", error.message)
        }
    }

    const handleBack = () => {
        setSelectedCust(null)
        setOrders([])
    }

    return (
        <div>
            {selectedCust ? (
                <div>
                    <button onClick={handleBack} className='btn'>Back</button>
                    <h1>Order Details for: {selectedCust.fname}</h1>
                    <div>
                        {orders.length > 0 ? (
                            orders.map((ord, ind) => (
                                <div key={ind} className='displayOrders'>
                                    <h4>Invoice No: {ord.invoiceNo}</h4>
                                    <div style={{marginLeft:'5vw',gap:'10px',display:'flex',flexDirection:'column'}}>
                                         <div>Order On : <span style={{marginLeft:'20px'}}>{new Date(ord.orderedDate).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })}</span></div>
                                         <div>Status: <span style={{marginLeft:'40px'}}><Badge value={ord.status} severity={getSeverity(ord.status)} /></span></div>
                                         <div>Payment: <span style={{marginLeft:'25px'}}><Badge value={ord.payment} severity={getPaymentSeverity(ord.payment)} /></span></div>
                                         <div>Total: <span style={{marginLeft:'54px'}}>{ord.total}</span></div>
                                       <div> Products:
                                       {/* <table style={{ width: '50%',marginLeft:'4vw',marginTop:'1vw' }}> 
                                        <tbody> 
                                            {ord.product.map((item, index) => (
                                            <tr key={index}> 
                                                <td>{item.name}</td>
                                                <td>{item.quantity} kgs</td>
                                                <td>Rs.{item.price}</td>
                                                <td>Rs.{item.subtotal}</td>
                                            </tr>
                                            ))}
                                        </tbody>
                                        </table> */}
                                            <ul>
                                                {ord.product.map((item, index) => (
                                                    <li key={index}>
                                                        Product: {item.name} - Quantity: {item.quantity} - Price: {item.price} - Subtotal: {item.subtotal}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                    </div>
                            ))
                        ) : (
                            <div>
                                <h1>No products found!</h1>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div>
                    <h2>Customer Details</h2>
                    <DataTable value={data} tableStyle={{ minWidth: '50rem' }} selectionMode="single" onRowSelect={onRowSelect}>
                        <Column field="fname" header="F Name"></Column>
                        <Column field="lname" header="L Name"></Column>
                        <Column field="orderCount" header="Orders"></Column>
                        <Column field="phone" header="Phone"></Column>
                        <Column field="email" header="Email"></Column>
                    </DataTable>
                </div>
            )}
        </div>
    )
}

export default Customers

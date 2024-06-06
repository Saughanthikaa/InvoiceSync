import axios from 'axios'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import React, { useEffect, useState } from 'react'
import "../Components/Customer.css";
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
                    <button onClick={handleBack}>Back</button>
                    <h1>Order Details for: {selectedCust.fname}</h1>
                    <div>
                        {orders.length > 0 ? (
                            orders.map((ord, ind) => (
                                <div key={ind} className='displayOrders'>
                                    <h4>Invoice No: {ord.invoiceNo}</h4>
                                    <ul>
                                        {ord.product.map((item, index) => (
                                            <li key={index}>
                                                {item.name} - Quantity: {item.quantity} - Price: {item.price} - Subtotal: {item.subtotal}
                                            </li>
                                        ))}
                                    </ul>
                                    <h5>Total Amount: {ord.total}</h5>
                                    <h5>Status: {ord.status}</h5>
                                    <h5>Payment: {ord.payment}</h5>
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

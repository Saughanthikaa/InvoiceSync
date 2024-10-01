import React, { useEffect, useState } from "react";
import Summary from "./Summary";
import axios from "axios";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import "../Components/Dashboard.css";
import { ProgressBar } from 'primereact/progressbar';

function Dashboard() {
    const [totalOrders, setTotalOrders] = useState(null);
    const [pendingOrders ,setPendingOrders]=useState(null);
    const [inprogressOrders , setInprogressOrders] = useState(null);
    const [completedOrders , setCompletedOrders] = useState(null);
    const [recentOrders,setRecentOrders] = useState(null);
    const [bestSelling , setbestSelling] = useState(null)
    useEffect(() => {
        const getTotalOrders = async () => {
            try {
                const response = await axios.get('http://localhost:8000/getOrdersSummary');
                setTotalOrders(response.data.totalOrders);
                setPendingOrders(response.data.pendingOrders)
                setInprogressOrders(response.data.inProgressOrders)
                setCompletedOrders(response.data.completedOrders)
                console.log("Total Orders = ", response.data.totalOrders);
            } catch (error) {
                console.error("Error fetching total orders:", error.message);
            }
        };
    
        const getRecentOrders=async()=>{
            try{
                const orders = await axios.get('http://localhost:8000/getRecentOrders');
                console.log("recent orders res = ",orders.data)
                setRecentOrders(orders.data)
            }catch(error){
                console.log("Error in getting recent orders : ",error.message)
            }
        }
        const bstSelling = async()=>{
            try{
                const bstSelling = await axios.get('http://localhost:8000/bestSelling');
                setbestSelling(bstSelling.data);
                
            }catch(error){
                console.log("Error in getting best selling :",error.message)
            }
        }
        getTotalOrders();
        getRecentOrders();
        bstSelling();
    }, []); 

    const formatDate = (isoDate) => {
        const date = new Date(isoDate);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const percentageBodyTemplate = (rowData) => {
        return  <ProgressBar 
        value={rowData.percentage} 
        style={{ height: '15px', fontSize: '11px',border:'1px solid blue',borderRadius:'10px'  }} // Adjust height and font size
    />
    };

    return (
        <div>
            <div style={{ display: 'flex', flexDirection: 'row' , justifyContent:'space-evenly',marginTop:'60px'}}>
                {totalOrders !== null && (
                    <Summary label="Total Orders" value={totalOrders} color="white" />
                )}
                {pendingOrders !== null && (
                    <Summary label="Pending Orders" value={pendingOrders} color="white" />
                )}
                {totalOrders !== null && (
                    <Summary label="In-progress" value={inprogressOrders} color="white" />
                )}
                {pendingOrders !== null && (
                    <Summary label="Completed " value={completedOrders} color="white" />
                )}
            </div>
            <div className="subDiv">
                <div style={{width:'50%',padding:'10px'}}>
                <h4>Recent Orders</h4>
                <DataTable value={recentOrders}>
                        <Column field="invoiceNo" header="InvoiceNo" headerStyle={{ backgroundColor: 'transparent' }}></Column>
                        <Column field="fname" header="Name" headerStyle={{ backgroundColor: 'transparent' }}></Column>
                        <Column field={(rowData) => formatDate(rowData.orderedDate)} header="Ordered Date" headerStyle={{ backgroundColor: 'transparent' }}></Column>
                        <Column field="total" header="Total" headerStyle={{ backgroundColor: 'transparent' }}></Column>
                </DataTable>
                </div>
                <div style={{width:'40%',padding:'10px'}}>
                <h4>Best Selling</h4>
                <div style={{marginTop:'5vh'}}>
                {bestSelling && bestSelling.map((prod) => (
                    <div key={prod.id} style={{display:'flex',height:'45px'}}>
                        <div style={{width:'30%'}}>{prod.name}</div>
                        <div style={{width:'50%'}}>{percentageBodyTemplate(prod)}</div>
                    </div>
                ))}
                </div>

                {/* <DataTable value={bestSelling} header={null}>
                    <Column field="name" style={{width:"30%"}}></Column>
                    <Column field="totalSold" style={{width:"30%"}}></Column>
                    <Column field="percentage" body={percentageBodyTemplate}></Column>
                </DataTable> */}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;

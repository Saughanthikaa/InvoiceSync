import React, { useEffect, useState } from "react";
import Summary from "./Summary";
import axios from "axios";

function Dashboard() {
    const [totalOrders, setTotalOrders] = useState(null);
    const [pendingOrders ,setPendingOrders]=useState(null);

    useEffect(() => {
        const getTotalOrders = async () => {
            try {
                const response = await axios.get('http://localhost:8000/getMonthyOrders');
                setTotalOrders(response.data.totalOrders);
                console.log("Total Orders = ", response.data.totalOrders);
            } catch (error) {
                console.error("Error fetching total orders:", error.message);
            }
        };
        const getPendingOrders =async()=>{
            try{
                const response = await axios.get('http://localhost:8000/getPendingOrders');
                setPendingOrders(response.data.pendingOrders)
                console.log("pending api res = ",pendingOrders)
            }catch(error){
                console.log("Error : ",error.message)
            }
        }
        getTotalOrders();
        getPendingOrders();
    }, []); 


    return (
        <div>
            {totalOrders !== null && (
                <Summary label="Total Orders" value={totalOrders} color="green" />
            )}
            {pendingOrders!==null && (
                <Summary label="Pending Orders" value={pendingOrders} color="pink" />
            )}
        </div>
    );
}

export default Dashboard;

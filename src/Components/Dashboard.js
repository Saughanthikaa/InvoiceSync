import React, { useEffect, useState } from "react";
import Summary from "./Summary";
import axios from "axios";

function Dashboard() {
    const [totalOrders, setTotalOrders] = useState(null);
    const [pendingOrders ,setPendingOrders]=useState(null);
    const [inprogressOrders , setInprogressOrders] = useState(null);
    const [completedOrders , setCompletedOrders] = useState(null);

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
    
        getTotalOrders();

    }, []); 

    return (
        <div style={{ display: 'flex', flexDirection: 'row' ,gap:'30px'}}>
            {totalOrders !== null && (
                <Summary label="Total Orders" value={totalOrders} color="white" />
            )}
            {pendingOrders !== null && (
                <Summary label="Pending Orders" value={pendingOrders} color="white" />
            )}
            {totalOrders !== null && (
                <Summary label="In-progress Orders" value={inprogressOrders} color="white" />
            )}
            {pendingOrders !== null && (
                <Summary label="Completed Orders" value={completedOrders} color="white" />
            )}
        </div>
    );
}

export default Dashboard;

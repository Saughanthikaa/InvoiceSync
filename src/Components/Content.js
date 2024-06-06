import React, { useEffect, useState } from "react";
import "../Components/Content.css";
import img from "../Components/images/user.png";
import Dashboard from './Dashboard';
import BContent from './BContent';
import Payment from './Payment'
import Customers from "./Customers";
function Content() {
    const [content, setContent] = useState('Dashboard');
    return (
        <div className="container">
            <div className="headerDiv">
                <div><b>InvoiceSync</b></div>
                <div><img src={img} style={{ width: '43px', height: '43px' }} /></div>
            </div>
            <div className="mainDiv">
                <div className="dashboardDiv">
                    <div style={{ marginTop: '3vh', padding: '3vh' }}><span style={{ cursor: 'pointer' }} onClick={() => setContent('Dashboard')}>Dashboard</span></div>
                    <div style={{ marginTop: '3vh', padding: '3vh' }}><span style={{ cursor: 'pointer' }} onClick={() => setContent('Billing')}>Billing</span></div>
                    <div style={{ marginTop: '3vh', padding: '3vh' }}><span style={{ cursor: 'pointer' }} onClick={() => setContent('Payment')}>Payments</span></div>
                    <div style={{ marginTop: '3vh', padding: '3vh' }}><span style={{ cursor: 'pointer' }} onClick={() => setContent('Customers')}>Customers</span></div>
                </div>
                <div className="contentDiv">
                    {content === 'Dashboard' ? (
                        <div>
                            <Dashboard />
                        </div>
                    ) : content === 'Payment' ? (
                        <div>
                            <Payment />
                        </div>
                    ) : content=="Billing" ?(
                        <div>
                            <BContent />
                        </div>
                    ):(
                        <Customers></Customers>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Content;

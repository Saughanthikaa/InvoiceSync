import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../Components/Content.css";
import img from "../Components/images/user.png";
import Dashboard from './Dashboard';
import BContent from './BContent';
import Payment from './Payment'
import Customers from "./Customers";
import { Menu } from 'primereact/menu'; 
import 'primereact/resources/themes/saga-blue/theme.css'; 
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import "./Dashboard.css"; 
function Content() {
    const [content, setContent] = useState('Dashboard');
    const navigate = useNavigate(); // For navigation
    const menuRef = useRef(null); 
    const storedUsername = localStorage.getItem('username')
    const items = [
        {
            label: 'Logout',
            icon: 'pi pi-sign-out',
            command: () => {
                localStorage.removeItem('token')
                localStorage.removeItem('username')
                navigate('/');
            }
        }
    ];
    return (
        <div className="container">
            <div className="headerDiv">
                <div><b>InvoiceSync</b></div>
                {/* <div><img src={img} style={{ width: '43px', height: '43px' }} /></div> */}
                <div style={{ position: 'relative',display:'flex',alignItems:'center',gap:'10px' }}>
                    {storedUsername}
                    <img 
                        src={img} 
                        alt="Profile" 
                        style={{ width: '43px', height: '43px', cursor: 'pointer' }} 
                        onClick={(e) => menuRef.current.toggle(e)}
                    />
                    <Menu model={items} popup ref={menuRef} />
                </div>
            </div>
            <div className="mainDiv">
                <div className="dashboardDiv">
                    <div style={{ marginTop: '3vh', padding: '3vh' }}><span style={{ cursor: 'pointer' }} onClick={() => setContent('Dashboard')}><div className={content==='Dashboard'?'active':''}>Dashboard</div></span></div>
                    <div style={{ marginTop: '3vh', padding: '3vh' }}><span style={{ cursor: 'pointer' }} onClick={() => setContent('Billing')}><div className={content==='Billing'?'active':''}>Billing</div></span></div>
                    <div style={{ marginTop: '3vh', padding: '3vh' }}><span style={{ cursor: 'pointer' }} onClick={() => setContent('Payment')}><div className={content==='Payment'?'active':''}>Payments</div></span></div>
                    <div style={{ marginTop: '3vh', padding: '3vh' }}><span style={{ cursor: 'pointer' }} onClick={() => setContent('Customers')}><div className={content==='Customers'?'active':''}>Customers</div></span></div>
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

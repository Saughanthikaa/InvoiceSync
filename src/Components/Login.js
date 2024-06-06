import React, { useState } from "react";
import '../Components/Login.css';
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { Password } from 'primereact/password';
import axios from 'axios'; // Add axios for making HTTP requests

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:8000/login', { username, password }); // Ensure this URL matches your backend's URL
            if (response.status === 200) {
                localStorage.setItem('token', response.data.token); // Store the JWT token
                window.location.href = '/Content';
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="container">
            <div className="card">
                <div>
                    <h1>Welcome Back!</h1>
                </div>
                <div className="fields">
                    <FloatLabel>
                        <InputText id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                        <label htmlFor="username">Username</label>
                    </FloatLabel>
                    <FloatLabel>
                        <Password inputId="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        <label htmlFor="password">Password</label>
                    </FloatLabel>
                    <div className="forgetpass">
                        Forgot password
                    </div>
                    {error && <div className="error">{error}</div>}
                    <button className="loginbtn" onClick={handleLogin}>Login</button>
                </div>
            </div>
        </div>
    );
}

export default Login;

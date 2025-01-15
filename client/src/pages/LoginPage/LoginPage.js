import React, { useState } from 'react';
import Login from '@react-login-page/page3';
import defaultBannerImage from '@react-login-page/page3/bg.jpeg';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Hook `useNavigate` do nawigacji

    const handleLogin = async () => {
        try {
            console.log("Attempting to log in with:", { email, password }); // Logowanie wysyłanych danych
            // Wywołanie API logowania
            const response = await axios.post('http://localhost:5000/api/login', { email, password });
            console.log("Response:", response);

            const { token } = response.data;

            // Zapisanie tokenu w localStorage
            localStorage.setItem('token', token);

            // Przekierowanie na stronę Dashboard
            navigate("DashboardPage");
        } catch (err) {
            console.error("Login error:", err);
            setError('Invalid email or password');
        }
    };

    return (
        <Login style={{ height: 900 }}>
            <Login.Banner style={{ backgroundImage: `url(${defaultBannerImage})` }} />

            {/* Obsługa wprowadzania danych użytkownika */}
            <Login.Email
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
            />
            <Login.Password
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
            />

            {/* Obsługa błędów */}
            {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

            {/* Obsługa przycisku logowania */}
            <Login.Submit button onClick={handleLogin}>
                Log in
            </Login.Submit>
        </Login>
    );
};

export default LoginPage;

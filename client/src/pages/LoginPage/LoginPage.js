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

    const loginHandler = async (credentials) => {
        try {
            const response = await axios.post('http://192.168.0.101:5000/api/login', credentials, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            console.log('Status odpowiedzi:', response.status);
            console.log('Dane odpowiedzi:', response.data);

            const { token } = response.data;
            localStorage.setItem('token', token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            return response.data;
        } catch (error) {
            console.error('Błąd podczas logowania:', error);
            throw error;
        }
    };

    const handleLogin = async () => {
        try {
            console.log("Próba logowania:", { email, password });

            const credentials = {
                email: email.trim(),
                password: password
            };

            await loginHandler(credentials);
            navigate("DashboardPage");
        } catch (err) {
            console.error("Błąd logowania:", err);
            setError('Nieprawidłowy email lub hasło');
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

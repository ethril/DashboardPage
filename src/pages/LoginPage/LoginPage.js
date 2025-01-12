import React from 'react';
import Login from '@react-login-page/page3';
import defaultBannerImage from '@react-login-page/page3/bg.jpeg';
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
    const navigate = useNavigate(); // Hook `useNavigate` wewnątrz komponentu funkcyjnego

    const goToDashboard = () => {
        navigate("DashboardPage"); // Nawigacja do "DashboardPage"
    };

    return (
        <Login style={{ height: 900 }}>
            <Login.Banner style={{ backgroundImage: `url(${defaultBannerImage})` }} />
            <Login.Password>
                <div>xx</div>
            </Login.Password>
            {/* Dodajemy onClick do komponentu Login.Submit */}
            <Login.Submit button onClick={goToDashboard}></Login.Submit>
        </Login>
    );
};

export default LoginPage;

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, useLocation, Link } from "react-router-dom";
import { IconButton } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import LoginPage from "./pages/LoginPage/LoginPage";
import Dashboard from "./pages/DashboardPage/DashboardPage";
import PrivateRoute from "./components/PrivateRoute";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import FamilyPage from "./pages/FamilyPage/FamilyPage";
import SettingsPage from "./pages/SettingsPage/SettingsPage";
import Sidebar from "./components/Sidebar";

const App = () => {
    const location = useLocation();
    const isLoginPage = location.pathname === '/';

    return (
        <div style={{ display: 'flex' }}>
            {!isLoginPage && <Sidebar />}
            <div style={{ flexGrow: 1, position: 'relative' }}>
                {!isLoginPage && (
                    <IconButton
                        style={{ position: 'absolute', top: 10, right: 10 }}
                        component={Link}
                        to="/settings"
                    >
                        <SettingsIcon />
                    </IconButton>
                )}
                <Routes>
                    <Route index element={<LoginPage />} />
                    <Route path="RegisterPage" element={<RegisterPage />} />
                    <Route
                        path="DashboardPage"
                        element={
                            <PrivateRoute>
                                <Dashboard />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="FamilyPage"
                        element={
                            <PrivateRoute>
                                <FamilyPage />
                            </PrivateRoute>
                        }
                    />
                    <Route path="settings" element={<SettingsPage />} />
                </Routes>
            </div>
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>
);
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage/LoginPage";
import Dashboard from "./pages/DashboardPage/DashboardPage";
import PrivateRoute from "./components/PrivateRoute";
import RegisterPage from "./pages/RegisterPage/RegisterPage";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Publiczna strona logowania */}
                <Route index element={<LoginPage />} />
                <Route path="RegisterPage" element={<RegisterPage />} />
                {/* Zabezpieczona trasa Dashboard */}
                <Route
                    path="DashboardPage"
                    element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

// Komponent root renderujący aplikację
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

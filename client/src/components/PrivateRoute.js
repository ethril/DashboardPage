import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    if (!token) {
        // Jeśli brak tokenu, przekieruj na stronę logowania
        return <Navigate to="/" />;
    }

    // Jeśli token istnieje, renderuj zabezpieczoną stronę
    return children;
};

export default PrivateRoute;

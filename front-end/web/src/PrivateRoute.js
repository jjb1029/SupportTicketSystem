// PrivateRoute checks for token before allowing access to param children
// This protects a page from being accessed without being logged in

import React from 'react';
import { Navigate } from 'react-router-dom';

function PrivateRoute({ children }) {
    const token = localStorage.getItem('token');

    // if no token exists, redirect to login page
    if(!token) {
        return <Navigate to = "/" replace />;
    }

    // if token exists, show the protected component
    return children;
}

export default PrivateRoute;
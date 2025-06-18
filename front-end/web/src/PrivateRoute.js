// PrivateRoute checks for token before allowing access to param children
// This protects a page from being accessed without being logged in

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

function PrivateRoute({ children, requiredRole }) {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const location = useLocation();

    // if no token exists, redirect to login page
    if(!token) {
        return <Navigate to = "/" state={{ from: location }} replace />;
    }

    if(requiredRole && role != requiredRole) {
        // send to right dashboard if wrong one
        return <Navigate to = {role === 'tech' ? '/Dashboard' : '/UserDashboard'} replace />;
    }

    // if token exists, show the protected component
    return children;
}

export default PrivateRoute;
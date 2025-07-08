import React from 'react';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './LoginPage';
import Dashboard from './Dashboard';
import TechDashboard from './TechDashboard';
import UserDashboard from './UserDashboard';
import PrivateRoute from './PrivateRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path = "/" element  = {<LoginPage />} />
        <Route path = "/TechDashboard" 
          element = {
            <PrivateRoute requiredRole='tech'>
              <TechDashboard />
            </PrivateRoute>
          }
        />
        <Route path ="/UserDashboard"
        element = {
          <PrivateRoute requiredRole='user'>
            <UserDashboard />
          </PrivateRoute>
        }
        />
      </Routes>
      <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
    </Router>
  );
}

export default App;
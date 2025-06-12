import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './LoginPage';
import Dashboard from './Dashboard';
import UserDashboard from './UserDashboard';
import PrivateRoute from './PrivateRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path = "/" element  = {<LoginPage />} />
        <Route path = "/Dashboard" 
          element = {
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route path ="/UserDashboard"
        element = {
          <PrivateRoute>
            <UserDashboard />
          </PrivateRoute>
        }
        />
      </Routes>
    </Router>
  );
}

export default App;
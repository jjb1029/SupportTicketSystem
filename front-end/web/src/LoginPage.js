// The login page
// We fetch the login page and enter credentials
// If the credentials are correct, we navigate to the dashboard
// If the credentials fail, we let the user know

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  // create state to hold username and password
  const [form, setForm] = useState({ username: '', password: '' });
  const [isHovered, setIsHovered] = useState(false);
  const [error, setError] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault(); // preventDefault stops the page from reloading, which breaks the flow

    // sends a post request to backend, await is used so we wait for a response before continuing
    // post tells the backend we are trying to create or validate something (our login)
    // header tells the backend we are sending json data
    // stringify converts the form object into a JSON string
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      // if the login credentials are incorrect, we let them know
      if (!response.ok) {
        setError('Login failed. Please try again.');
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
        }, 4000);
        setForm({username: '', password: ''})
        return;
      }

      // waits for the servers response and parses it from JSON to a JS object
      // the catch will catch an error, let us know, and log the error
      const data = await response.json();
      localStorage.setItem('token', data.token); // store JWT
      localStorage.setItem('role', data.role);
      localStorage.setItem('username', data.username);

      if(localStorage.getItem('role') === 'user') {
        console.log("Loading user dashboard");
        navigate('/UserDashboard');
      }
      else {
        console.log("Loading tech dashboard");
        navigate('/Dashboard');
      }
    } catch (error) {
      alert('Error connecting to server');
      console.error(error);
    }
  };

  return (
    <div style = {{
      display: 'flex', 
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#cccccc',
      flexDirection: 'column' 
    }}>
      <h2>Work Scheduler Login</h2>
      <div style = {{
        padding: '20px',
        borderRadius: '8px',
        backgroundColor: 'white',
        boxShadow: '10px 5px 5px grey'
      }}>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label> Username: </label><br />
            <input
              name = "username"
              value = {form.username}
              onChange = {e => setForm({ ...form, username: e.target.value})}
              required
              style = {{
                width: '91%',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                marginTop: '5px'
              }}
            />
          </div>

          <div style={{ marginTop: '10' }}>
            <label> Password: </label><br />
            <input
              name = "password"
              type = "password"
              value = {form.password}
              onChange = {e => setForm({ ...form, password: e.target.value})}
              required
              style = {{
                width: '91%',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                marginTop: '5px'
              }}
            />
          </div>

          <button 
          type = "submit"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style = {{ 
            marginTop: '20px',
            width: '100%',
            padding: '10px',
            backgroundColor: isHovered ? '#0056b3' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            Login
          </button>
          <p style={{ marginTop: '10px' }}>
            Don't have an account? <a href="#">Sign up here</a>
          </p>
        </form>
        {showPopup && (
          <div style={{
            position: 'fixed',
            top: '40%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#ff4d4f',
            color: 'white',
            padding: '16px 24px',
            borderRadius: '8px',
            boxShadow: '0px 0px 10px rgba(0,0,0,0.3)',
            zIndex: 1000,
            transition: 'opacity 0.5s ease-in-out',
            textAlign: 'center',
            }}>
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

export default LoginPage;
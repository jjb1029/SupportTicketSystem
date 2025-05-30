// The login page
// We fetch the login page and enter credentials
// If the credentials are correct, we navigate to the dashboard
// If the credentials fail, we let the user know

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  // create state to hold username and password
  const [form, setForm] = useState({ username: '', password: '' });
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
        alert('Login failed. Check your credentials.');
        return;
      }

      // waits for the servers response and parses it from JSON to a JS object
      // the catch will catch an error, let us know, and log the error
      const data = await response.json();
      localStorage.setItem('token', data.token); // store JWT
      localStorage.setItem('role', data.role);
      localStorage.setItem('username', data.username);
      console.log(localStorage.getItem('username'));
      console.log(localStorage.getItem('role'));
      alert(`Welcome, ${data.username}!`);
      navigate('/Dashboard'); // after successful login, route to dashboard
    } catch (error) {
      alert('Error connecting to server');
      console.error(error);
    }
  };

  return (
    <div style = {{maxWidth: 300, margin: 'auto', marginTop: 50}}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label> Username: </label><br />
          <input
            name = "username"
            value = {form.username}
            onChange = {e => setForm({ ...form, username: e.target.value})}
            required
          />
        </div>

        <div style={{ marginTop: 10 }}>
          <label> Password: </label><br />
          <input
            name = "password"
            type = "password"
            value = {form.password}
            onChange = {e => setForm({ ...form, password: e.target.value})}
            required
          />
        </div>

        <button type = "submit" style = {{ marginTop: 15 }}>
          Login
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
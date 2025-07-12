import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Signup.css';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:8080/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password, role, firstName, lastName }),
            });

            if(!response.ok) {
                const data = await response.text();
                setError(data || 'Signup failed.');
                return;
            }

            setSuccessMessage("Account created successfully! Redirecting to login...");
            setTimeout(() => {
                // successful response, go to login page
                navigate('/');
            }, 3000);
        } catch (err) {
            setError('Something went wrong. Please try again.');
            console.error(err);
        }
    };

    return (
        <div className="auth-container">
            {successMessage && (
                <div className="success-message">
                    {successMessage}
                </div>
            )}
            
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                />
                <div className="role-selection">
                    <label>
                        <input
                            type="radio"
                            name="role"
                            value="user"
                            checked={role === 'user'}
                            onChange={(e) => setRole(e.target.value)}
                        />
                        User
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="role"
                            value="tech"
                            checked={role === 'tech'}
                            onChange={(e) => setRole(e.target.value)}
                        />
                        Tech
                    </label>
                </div>

                {role === 'user' && (
                    <div className="role-description">
                        <p><strong>Users</strong> can create new support tickets, comment on their tickets, and view the statuses of their own tickets.</p>
                    </div>
                )}

                {role === 'tech' && (
                    <div className="role-description">
                        <p><strong>Techs</strong> can view all tickets, comment on all tickets, assign themselves to tickets, and mark them as completed.</p>
                    </div>
                )}

                {error && <p className="auth-error">{error}</p>}
                <button type="submit" className="signup-submit">Create Account</button>
            </form>
        </div>
    );
};

export default Signup;
import React, { useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        const payload = { username, email, password };

        try {
            const response = await axiosInstance.post('/register', payload);

            // Extract tokens from response
            const { access_token, refresh_token } = response.data;

            // Save tokens to localStorage
            localStorage.setItem('access_token', access_token);
            localStorage.setItem('refresh_token', refresh_token);

            // Set success message and navigate to home
            setMessage('Registration successful!');
            navigate('/home');
        } catch (error) {
            console.error('Error during registration:', error.response?.data || error.message);
            setMessage(
                error.response?.data?.message || 'Registration failed. Please try again.'
            );
        }
    };

    return (
        <div className="form-container">
            <h2>Sign Up</h2>
            <form onSubmit={handleSignup}>
                <label>
                    Username:
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Email:
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Password:
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </label>
                <button type="submit" className="btn btn-primary">Sign Up</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default SignupPage;

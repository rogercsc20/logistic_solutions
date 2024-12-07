import React, { useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';

const LoginPage = ({ setIsLoggedIn }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axiosInstance.post('/login', {
                username,
                password,
            });

            // Extract tokens from the response
            const { access_token, refresh_token } = response.data;

            // Store tokens in localStorage
            localStorage.setItem('access_token', access_token);
            localStorage.setItem('refresh_token', refresh_token);

            // Set the logged-in state and navigate to home
            setMessage('Login successful!');
            setIsLoggedIn(true);
            navigate('/home');
        } catch (error) {
            console.error('Login failed:', error.response?.data || error.message);
            setMessage(
                error.response?.data?.message || 'Login failed. Please check your credentials and try again.'
            );
        }
    };

    return (
        <div className="form-container">
            <h2>Log In</h2>
            <form onSubmit={handleLogin}>
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
                    Password:
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </label>
                <button type="submit" className="btn btn-primary">Log In</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default LoginPage;

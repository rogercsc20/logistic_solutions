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
        setMessage(''); // Clear any previous message

        try {
            const response = await axiosInstance.post('/login', {
                username,
                password,
            });

            const access_token = response.data["access token"];
            const refresh_token = response.data["refresh token"];
            console.log('Response data:', response.data);


            if (access_token && refresh_token) {
                // Store tokens in localStorage
                localStorage.setItem('access_token', access_token);
                localStorage.setItem('refresh_token', refresh_token);

                // Update login state and navigate
                setIsLoggedIn(true);
                navigate('/home');
            } else {
                throw new Error('Tokens not returned from the server.');
            }
        } catch (error) {
            console.error('Login failed:', error.response?.data || error.message);
            setMessage('Login failed. Please check your credentials.');
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
            {message && <p className="error-message">{message}</p>}
        </div>
    );
};

export default LoginPage;

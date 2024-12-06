import React, { useState } from 'react';
import axios from 'axios';

const SignupPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSignup = async (e) => {
        e.preventDefault();
        const payload = { username, email, password };
        console.log('Payload:', payload);
        try {
            const response = await axios.post('http://127.0.0.1:5000/register', payload);
            setMessage('Registration successful! Please log in.');
            console.log(response.data);
        } catch (error) {
            setMessage('Registration failed. Please try again.');
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

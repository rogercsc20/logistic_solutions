import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';

const CreateClientPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');
    const [clientName, setClientName] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(''); // Clear previous messages

        try {
            const response = await axiosInstance.post(
                '/clients',
                { name, email, phone },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                    },
                }
            );

            setClientName(response.data.name);
            setMessage('Client created successfully');
            setName('');
            setEmail('');
            setPhone('');
        } catch (error) {
            console.error('Error creating client:', error.response?.data || error.message);
            setMessage('Failed to create client. Please check the inputs and try again.');
        }
    };

    return (
        <div className="create-client-container">
            <h1>Create Client</h1>
            <form onSubmit={handleSubmit} className="create-client-form">
                <label>
                    Name:
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
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
                    Phone Number:
                    <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                </label>
                <button type="submit" className="btn btn-primary">
                    Create Client
                </button>
            </form>
            {message && (
                <div className="success-message">
                    {message}
                    {clientName && (
                        <p>
                            Do you want to{' '}
                            <span
                                className="add-button"
                                onClick={() => navigate('/warehouses/create')}
                            >
                                add a warehouse
                            </span>{' '}
                            for <strong>{clientName}</strong>?
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default CreateClientPage;

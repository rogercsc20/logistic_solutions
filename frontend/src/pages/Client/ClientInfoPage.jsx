import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';

const ClientInfoPage = () => {
    const [clients, setClients] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    // Fetch all clients
    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await axiosInstance.get('/clients', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                    },
                });

                // Sort clients by ID in ascending order
                const sortedClients = response.data.sort((a, b) => a.id - b.id);
                setClients(sortedClients);
                setMessage('');
            } catch (error) {
                console.error('Error fetching clients:', error.response?.data || error.message);
                setMessage('Failed to load clients. Please try again later.');
            }
        };

        fetchClients();
    }, []);

    // Filter clients by search query
    const filteredClients = clients.filter(client =>
        client.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Navigate to /warehouses/info with client_id as query parameter
    const handleSeeWarehouses = (clientId) => {
        navigate(`/warehouses/info?client_id=${clientId}`);
    };

    return (
        <div className="client-info-container">
            <h1>Client Info</h1>
            <div className="search-bar-container">
                <input
                    type="text"
                    placeholder="Search by name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-bar"
                />
            </div>
            {message && <p className="error-message">{message}</p>}
            <div className="client-table-container">
                <table className="client-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Warehouses</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredClients.map(client => (
                            <tr key={client.id}>
                                <td>{client.id}</td>
                                <td>{client.name}</td>
                                <td>{client.email}</td>
                                <td>{client.phone || 'N/A'}</td>
                                <td>
                                    <button
                                        className="see-warehouses-btn"
                                        onClick={() => handleSeeWarehouses(client.id)}
                                    >
                                        See Warehouses
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ClientInfoPage;

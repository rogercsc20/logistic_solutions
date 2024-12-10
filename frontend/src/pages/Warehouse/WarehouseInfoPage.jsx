import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import '../../styles/Clients.css'; // Reusing the same styles for consistent look

const WarehousesInfoPage = () => {
    const [clients, setClients] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
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

                // Ensure the clients are sorted by id in ascending order
                const sortedClients = response.data.sort((a, b) => a.id - b.id);

                setClients(sortedClients);
                setMessage('');
            } catch (error) {
                console.error('Error fetching clients:', error.response?.data || error.message);
                setMessage('Failed to load clients. Please try again later.');
                setMessageType('error');
            }
        };

        fetchClients();
    }, []);

    // Filter clients by search query
    const filteredClients = clients.filter(client =>
        client.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Navigate to a route showing warehouses for a specific client
    const handleSeeWarehouses = (clientId) => {
        navigate(`/warehouses/info/${clientId}`);
    };

    return (
        <div className="client-info-container">
            <h1>Warehouses Info</h1>
            <div className="search-bar-container">
                <input
                    type="text"
                    placeholder="Search by name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-bar"
                />
            </div>
            {message && <p className={`message ${messageType}`}>{message}</p>}
            <div className="client-table-container">
                <table className="client-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Warehouses</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredClients.map((client) => (
                            <tr key={client.id}>
                                <td>{client.id}</td>
                                <td>{client.name}</td>
                                <td>
                                    <button
                                        className="btn edit-btn"
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

export default WarehousesInfoPage;

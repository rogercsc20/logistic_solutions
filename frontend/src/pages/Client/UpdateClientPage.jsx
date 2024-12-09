import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';

const UpdateClientPage = () => {
    const [clients, setClients] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [editingClientId, setEditingClientId] = useState(null);
    const [editedClient, setEditedClient] = useState({});
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState(''); // 'success' or 'error'

    // Fetch all clients
    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await axiosInstance.get('/clients', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                    },
                });

                const sortedClients = response.data.sort((a, b) => a.id - b.id);
                setClients(sortedClients);
                setMessage('');
                setMessageType(''); // Reset messageType on successful fetch
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

    // Start editing a client
    const handleEditClick = (client) => {
        setEditingClientId(client.id);
        setEditedClient({ ...client });
    };

    // Save the edited client
    const handleSaveClick = async (clientId) => {
        try {
            const payload = {};
            if (editedClient.name?.trim()) payload.name = editedClient.name.trim();
            if (editedClient.email?.trim()) payload.email = editedClient.email.trim();
            if (editedClient.phone?.trim()) payload.phone = editedClient.phone.trim();

            if (Object.keys(payload).length === 0) {
                setMessage('No changes to update.');
                setMessageType('error');
                return;
            }

            await axiosInstance.put(
                `/clients/${clientId}`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                    },
                }
            );

            const response = await axiosInstance.get('/clients', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                },
            });

            const sortedClients = response.data.sort((a, b) => a.id - b.id);
            setClients(sortedClients);
            setEditingClientId(null);
            setMessage('Client updated successfully!');
            setMessageType('success');
        } catch (error) {
            console.error('Error updating client:', error.response?.data || error.message);
            setMessage('Failed to update client. Please try again.');
            setMessageType('error');
        }
    };

    const handleInputChange = (e, field) => {
        setEditedClient({ ...editedClient, [field]: e.target.value });
    };

    return (
        <div className="update-client-container">
            <h1>Update Clients</h1>
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
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Edit Client</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredClients.map(client => (
                            <tr key={client.id}>
                                <td>{client.id}</td>
                                <td>
                                    {editingClientId === client.id ? (
                                        <input
                                            type="text"
                                            value={editedClient.name || ''}
                                            onChange={(e) => handleInputChange(e, 'name')}
                                        />
                                    ) : (
                                        client.name
                                    )}
                                </td>
                                <td>
                                    {editingClientId === client.id ? (
                                        <input
                                            type="email"
                                            value={editedClient.email || ''}
                                            onChange={(e) => handleInputChange(e, 'email')}
                                        />
                                    ) : (
                                        client.email
                                    )}
                                </td>
                                <td>
                                    {editingClientId === client.id ? (
                                        <input
                                            type="tel"
                                            value={editedClient.phone || ''}
                                            onChange={(e) => handleInputChange(e, 'phone')}
                                        />
                                    ) : (
                                        client.phone || 'N/A'
                                    )}
                                </td>
                                <td>
                                    {editingClientId === client.id ? (
                                        <button
                                            className="btn save-btn"
                                            onClick={() => handleSaveClick(client.id)}
                                        >
                                            Save
                                        </button>
                                    ) : (
                                        <button
                                            className="btn edit-btn"
                                            onClick={() => handleEditClick(client)}
                                        >
                                            Edit
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UpdateClientPage;

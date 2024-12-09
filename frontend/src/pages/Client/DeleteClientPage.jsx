import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import '../../styles/Clients.css';

const DeleteClientPage = () => {
    const [clients, setClients] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [clientToDelete, setClientToDelete] = useState(null); // Stores the client being deleted
    const [showConfirmation, setShowConfirmation] = useState(false); // Controls the confirmation popup

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
                setMessageType('');
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

    // Show confirmation popup
    const handleDeleteClick = (client) => {
        setClientToDelete(client);
        setShowConfirmation(true);
    };

    // Confirm deletion
    const confirmDelete = async () => {
        if (!clientToDelete) return;

        try {
            await axiosInstance.delete(`/clients/${clientToDelete.id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                },
            });

            setClients(clients.filter(client => client.id !== clientToDelete.id));
            setMessage(`Client ${clientToDelete.name} deleted successfully!`);
            setMessageType('success');
        } catch (error) {
            console.error('Error deleting client:', error.response?.data || error.message);
            setMessage('Failed to delete client. Please try again.');
            setMessageType('error');
        } finally {
            setClientToDelete(null);
            setShowConfirmation(false);
        }
    };

    // Cancel deletion
    const cancelDelete = () => {
        setClientToDelete(null);
        setShowConfirmation(false);
    };

    return (
        <div className="delete-client-container">
            <h1>Delete Clients</h1>
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
                            <th>Delete Client</th>
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
                                        className="btn delete-btn"
                                        onClick={() => handleDeleteClick(client)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Confirmation Popup */}
            {showConfirmation && clientToDelete && (
                <div className="confirmation-popup">
                    <p>Are you sure you want to delete {clientToDelete.name}?</p>
                    <div className="popup-actions">
                        <button className="btn cancel-btn" onClick={cancelDelete}>
                            Cancel
                        </button>
                        <button className="btn confirm-delete-btn" onClick={confirmDelete}>
                            Delete
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DeleteClientPage;

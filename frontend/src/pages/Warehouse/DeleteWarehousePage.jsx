import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import '../../styles/Clients.css'; // Reuse the same styles for consistency

const DeleteWarehousePage = () => {
    const [warehouses, setWarehouses] = useState([]);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [selectedWarehouse, setSelectedWarehouse] = useState(null);

    // Fetch all warehouses
    useEffect(() => {
        const fetchWarehouses = async () => {
            try {
                const response = await axiosInstance.get('/warehouses', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                    },
                });

                setWarehouses(response.data);
                setMessage('');
            } catch (error) {
                console.error('Error fetching warehouses:', error.response?.data || error.message);
                setMessage('Failed to load warehouses. Please try again later.');
                setMessageType('error');
            }
        };

        fetchWarehouses();
    }, []);

    // Handle delete confirmation
    const handleDeleteClick = (warehouse) => {
        setSelectedWarehouse(warehouse);
    };

    // Confirm delete warehouse
    const confirmDelete = async () => {
        if (!selectedWarehouse) return;

        try {
            await axiosInstance.delete(`/warehouses/${selectedWarehouse.id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                },
            });

            // Update warehouse list after deletion
            const updatedWarehouses = warehouses.filter(
                (warehouse) => warehouse.id !== selectedWarehouse.id
            );
            setWarehouses(updatedWarehouses);
            setMessage('Warehouse deleted successfully.');
            setMessageType('success');
        } catch (error) {
            console.error('Error deleting warehouse:', error.response?.data || error.message);
            setMessage('Failed to delete warehouse. Please try again.');
            setMessageType('error');
        } finally {
            setSelectedWarehouse(null); // Close the popup
        }
    };

    return (
        <div className="client-container">
            <h1 className="client-title">Delete Warehouses</h1>
            {message && <p className={`message ${messageType}`}>{message}</p>}

            {/* Warehouses Table */}
            <div className="client-table-container">
                <table className="client-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Address</th>
                            <th>Manager Name</th>
                            <th>Client ID</th>
                            <th>Delete Warehouse</th>
                        </tr>
                    </thead>
                    <tbody>
                        {warehouses.map((warehouse) => (
                            <tr key={warehouse.id}>
                                <td>{warehouse.id}</td>
                                <td>{warehouse.address}</td>
                                <td>{warehouse.manager_name || 'N/A'}</td>
                                <td>{warehouse.client_id}</td>
                                <td>
                                    <button
                                        className="btn delete-btn"
                                        onClick={() => handleDeleteClick(warehouse)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Delete Confirmation Popup */}
            {selectedWarehouse && (
                <div className="popup-overlay">
                    <div className="popup">
                        <p>
                            Are you sure you want to delete the warehouse at{' '}
                            <strong>{selectedWarehouse.address}</strong>?
                        </p>
                        <div className="popup-buttons">
                            <button className="btn cancel-btn" onClick={() => setSelectedWarehouse(null)}>
                                Cancel
                            </button>
                            <button className="btn delete-btn" onClick={confirmDelete}>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DeleteWarehousePage;

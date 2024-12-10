import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import '../../styles/Clients.css'; // Reusing consistent styles

const WarehousesInfoClientPage = () => {
    const { id } = useParams(); // Get client_id from the URL
    const [warehouses, setWarehouses] = useState([]);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    // Fetch warehouses for the specific client
    useEffect(() => {
        const fetchWarehouses = async () => {
            try {
                const response = await axiosInstance.get(`/warehouses/info`, {
                    params: { client_id: id }, // Pass client_id as a query parameter
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
    }, [id]);

    return (
        <div className="client-container">
            <h1>Warehouses for Client ID {id}</h1>
            {message && <p className={`message ${messageType}`}>{message}</p>}

            <div className="client-table-container">
                <table className="client-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Address</th>
                            <th>Phone</th>
                            <th>Manager Name</th>
                            <th>Manager Email</th>
                            <th>Manager Phone</th>
                            <th>Invoice Details</th>
                            <th>Inventory Status</th>
                            <th>Client ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {warehouses.map((warehouse) => (
                            <tr key={warehouse.id}>
                                <td>{warehouse.id}</td>
                                <td>{warehouse.address}</td>
                                <td>{warehouse.phone}</td>
                                <td>{warehouse.manager_name || 'N/A'}</td>
                                <td>{warehouse.manager_email || 'N/A'}</td>
                                <td>{warehouse.manager_phone || 'N/A'}</td>
                                <td>{warehouse.invoice_details || 'N/A'}</td>
                                <td>{warehouse.inventory_status}</td>
                                <td>{warehouse.client_id}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default WarehousesInfoClientPage;

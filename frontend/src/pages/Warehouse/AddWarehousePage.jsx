import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import '../../styles/Clients.css'; // Reusing the same styles for consistency

const AddWarehousePage = () => {
    const [clients, setClients] = useState([]);
    const [formData, setFormData] = useState({
        address: '',
        phone: '',
        manager_name: '',
        manager_email: '',
        manager_phone: '',
        invoice_details: '',
        inventory_status: '',
        client_id: '',
    });
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    // Fetch clients for the dropdown
    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await axiosInstance.get('/clients', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                    },
                });
                setClients(response.data);
                setMessage('');
            } catch (error) {
                console.error('Error fetching clients:', error.response?.data || error.message);
                setMessage('Failed to load clients for the dropdown. Please try again later.');
                setMessageType('error');
            }
        };

        fetchClients();
    }, []);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.post(
                '/warehouses',
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                    },
                }
            );

            setMessage('Warehouse created successfully!');
            setMessageType('success');
            // Reset form after success
            setFormData({
                address: '',
                phone: '',
                manager_name: '',
                manager_email: '',
                manager_phone: '',
                invoice_details: '',
                inventory_status: '',
                client_id: '',
            });
        } catch (error) {
            console.error('Error creating warehouse:', error.response?.data || error.message);
            setMessage('Failed to create warehouse. Please check your inputs and try again.');
            setMessageType('error');
        }
    };

    return (
        <div className="client-container">
            <h1 className="client-title">Create Warehouse</h1>
            {message && <p className={`message ${messageType}`}>{message}</p>}
            <form onSubmit={handleSubmit} className="form-container">
                <label>
                    Address:
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <label>
                    Phone:
                    <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                    />
                </label>
                <label>
                    Manager Name:
                    <input
                        type="text"
                        name="manager_name"
                        value={formData.manager_name}
                        onChange={handleInputChange}
                    />
                </label>
                <label>
                    Manager Email:
                    <input
                        type="email"
                        name="manager_email"
                        value={formData.manager_email}
                        onChange={handleInputChange}
                    />
                </label>
                <label>
                    Manager Phone:
                    <input
                        type="text"
                        name="manager_phone"
                        value={formData.manager_phone}
                        onChange={handleInputChange}
                    />
                </label>
                <label>
                    Invoice Details:
                    <input
                        type="text"
                        name="invoice_details"
                        value={formData.invoice_details}
                        onChange={handleInputChange}
                    />
                </label>
                <label>
                    Inventory Status:
                    <input
                        type="number"
                        name="inventory_status"
                        value={formData.inventory_status}
                        onChange={handleInputChange}
                        min="0"
                    />
                </label>
                <label>
                    Client:
                    <select
                        name="client_id"
                        value={formData.client_id}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="" disabled>
                            Select a client
                        </option>
                        {clients.map((client) => (
                            <option key={client.id} value={client.id}>
                                {client.name} (ID: {client.id})
                            </option>
                        ))}
                    </select>
                </label>
                <button type="submit" className="btn edit-btn">
                    Create Warehouse
                </button>
            </form>
        </div>
    );
};

export default AddWarehousePage;

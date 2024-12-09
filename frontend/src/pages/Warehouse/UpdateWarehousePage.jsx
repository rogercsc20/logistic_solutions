import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import '../../styles/Clients.css'; // Reusing the same styles for consistency

const UpdateWarehousePage = () => {
    const [warehouses, setWarehouses] = useState([]);
    const [filters, setFilters] = useState({
        client_id: '',
        manager_name: '',
        location: '',
        search: '',
    });
    const [editingWarehouseId, setEditingWarehouseId] = useState(null);
    const [editedWarehouse, setEditedWarehouse] = useState({});
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    // Fetch all warehouses with filters
    useEffect(() => {
        const fetchWarehouses = async () => {
            try {
                const response = await axiosInstance.get('/warehouses', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                    },
                    params: { ...filters }, // Send filters as query params
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
    }, [filters]);

    // Handle input changes for filters
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
    };

    // Start editing a warehouse
    const handleEditClick = (warehouse) => {
        setEditingWarehouseId(warehouse.id);
        setEditedWarehouse({ ...warehouse }); // Pre-fill with the warehouse's current data
    };

    // Save the edited warehouse
    const handleSaveClick = async (warehouseId) => {
        try {
            const payload = {};
            if (editedWarehouse.address?.trim()) payload.address = editedWarehouse.address.trim();
            if (editedWarehouse.phone?.trim()) payload.phone = editedWarehouse.phone.trim();
            if (editedWarehouse.manager_name?.trim()) payload.manager_name = editedWarehouse.manager_name.trim();
            if (editedWarehouse.manager_email?.trim()) payload.manager_email = editedWarehouse.manager_email.trim();
            if (editedWarehouse.manager_phone?.trim()) payload.manager_phone = editedWarehouse.manager_phone.trim();
            if (editedWarehouse.invoice_details?.trim()) payload.invoice_details = editedWarehouse.invoice_details.trim();
            if (editedWarehouse.inventory_status !== undefined) payload.inventory_status = editedWarehouse.inventory_status;

            if (Object.keys(payload).length === 0) {
                setMessage('No changes to update.');
                setMessageType('error');
                return;
            }

            await axiosInstance.put(
                `/warehouses/${warehouseId}`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                    },
                }
            );

            // Update the warehouses state
            const updatedWarehouses = warehouses.map((warehouse) =>
                warehouse.id === warehouseId ? { ...warehouse, ...payload } : warehouse
            );
            setWarehouses(updatedWarehouses);
            setEditingWarehouseId(null);
            setMessage('Warehouse updated successfully!');
            setMessageType('success');
        } catch (error) {
            console.error('Error updating warehouse:', error.response?.data || error.message);
            setMessage('Failed to update warehouse. Please try again.');
            setMessageType('error');
        }
    };

    // Handle input changes while editing
    const handleInputChange = (e, field) => {
        setEditedWarehouse({ ...editedWarehouse, [field]: e.target.value });
    };

    return (
        <div className="client-container">
            <h1 className="client-title">Update Warehouses</h1>
            {message && <p className={`message ${messageType}`}>{message}</p>}

            {/* Filter inputs */}
            <div className="search-bar-container">
                <input
                    type="text"
                    name="search"
                    placeholder="Search..."
                    value={filters.search}
                    onChange={handleFilterChange}
                    className="search-bar"
                />
                <input
                    type="text"
                    name="manager_name"
                    placeholder="Filter by manager name..."
                    value={filters.manager_name}
                    onChange={handleFilterChange}
                    className="search-bar"
                />
                <input
                    type="text"
                    name="location"
                    placeholder="Filter by location..."
                    value={filters.location}
                    onChange={handleFilterChange}
                    className="search-bar"
                />
                <input
                    type="text"
                    name="client_id"
                    placeholder="Filter by client ID..."
                    value={filters.client_id}
                    onChange={handleFilterChange}
                    className="search-bar"
                />
            </div>

            {/* Warehouses Table */}
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
                            <th>Edit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {warehouses.map((warehouse) => (
                            <tr key={warehouse.id}>
                                <td>{warehouse.id}</td>
                                <td>
                                    {editingWarehouseId === warehouse.id ? (
                                        <input
                                            type="text"
                                            value={editedWarehouse.address || ''}
                                            onChange={(e) => handleInputChange(e, 'address')}
                                        />
                                    ) : (
                                        warehouse.address
                                    )}
                                </td>
                                <td>
                                    {editingWarehouseId === warehouse.id ? (
                                        <input
                                            type="text"
                                            value={editedWarehouse.phone || ''}
                                            onChange={(e) => handleInputChange(e, 'phone')}
                                        />
                                    ) : (
                                        warehouse.phone || 'N/A'
                                    )}
                                </td>
                                <td>
                                    {editingWarehouseId === warehouse.id ? (
                                        <input
                                            type="text"
                                            value={editedWarehouse.manager_name || ''}
                                            onChange={(e) => handleInputChange(e, 'manager_name')}
                                        />
                                    ) : (
                                        warehouse.manager_name || 'N/A'
                                    )}
                                </td>
                                <td>
                                    {editingWarehouseId === warehouse.id ? (
                                        <input
                                            type="email"
                                            value={editedWarehouse.manager_email || ''}
                                            onChange={(e) => handleInputChange(e, 'manager_email')}
                                        />
                                    ) : (
                                        warehouse.manager_email || 'N/A'
                                    )}
                                </td>
                                <td>
                                    {editingWarehouseId === warehouse.id ? (
                                        <input
                                            type="text"
                                            value={editedWarehouse.manager_phone || ''}
                                            onChange={(e) => handleInputChange(e, 'manager_phone')}
                                        />
                                    ) : (
                                        warehouse.manager_phone || 'N/A'
                                    )}
                                </td>
                                <td>
                                    {editingWarehouseId === warehouse.id ? (
                                        <input
                                            value={editedWarehouse.invoice_details || ''}
                                            onChange={(e) => handleInputChange(e, 'invoice_details')}
                                        />
                                    ) : (
                                        warehouse.invoice_details || 'N/A'
                                    )}
                                </td>
                                <td>
                                    {editingWarehouseId === warehouse.id ? (
                                        <input
                                            type="number"
                                            value={editedWarehouse.inventory_status || 0}
                                            onChange={(e) => handleInputChange(e, 'inventory_status')}
                                        />
                                    ) : (
                                        warehouse.inventory_status
                                    )}
                                </td>
                                <td>{warehouse.client_id}</td>
                                <td>
                                    {editingWarehouseId === warehouse.id ? (
                                        <button
                                            className="btn save-btn"
                                            onClick={() => handleSaveClick(warehouse.id)}
                                        >
                                            Save
                                        </button>
                                    ) : (
                                        <button
                                            className="btn edit-btn"
                                            onClick={() => handleEditClick(warehouse)}
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

export default UpdateWarehousePage;

import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';

const UpdateOrderPage = () => {
    const [orders, setOrders] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [editingOrderId, setEditingOrderId] = useState(null);
    const [editedOrder, setEditedOrder] = useState({});
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState(''); // 'success' or 'error'

    const numberFormatter = new Intl.NumberFormat('en-US'); // For formatting numbers

    // Fetch all orders
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axiosInstance.get('/orders', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                    },
                });

                const sortedOrders = response.data.sort((a, b) => a.id - b.id);
                setOrders(sortedOrders);
                setMessage('');
                setMessageType(''); // Reset messageType on successful fetch
            } catch (error) {
                console.error('Error fetching orders:', error.response?.data || error.message);
                setMessage('Failed to load orders. Please try again later.');
                setMessageType('error');
            }
        };

        fetchOrders();
    }, []);

    // Filter orders by search query
    const filteredOrders = orders.filter(
        (order) =>
            order.id.toString().includes(searchQuery) ||
            order.warehouse_id.toString().includes(searchQuery)
    );

    // Format dates for display
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD
    };

    // Start editing an order
    const handleEditClick = (order) => {
        setEditingOrderId(order.id);
        setEditedOrder({ ...order });
    };

    // Save the edited order
    const handleSaveClick = async (orderId) => {
        try {
            const payload = { ...editedOrder };
            delete payload.id; // Ensure ID is not sent in payload

            // Send dates in ISO 8601 format if updated
            if (editedOrder.delivery_date) {
                payload.delivery_date = new Date(editedOrder.delivery_date).toISOString();
            }
            if (editedOrder.schedule_payment_date) {
                payload.schedule_payment_date = new Date(editedOrder.schedule_payment_date).toISOString();
            }

            await axiosInstance.put(
                `/orders/${orderId}`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                    },
                }
            );

            const response = await axiosInstance.get('/orders', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                },
            });

            const sortedOrders = response.data.sort((a, b) => a.id - b.id);
            setOrders(sortedOrders);
            setEditingOrderId(null);
            setMessage('Order updated successfully!');
            setMessageType('success');
        } catch (error) {
            console.error('Error updating order:', error.response?.data || error.message);
            setMessage('Failed to update order. Please try again.');
            setMessageType('error');
        }
    };

    const handleInputChange = (e, field) => {
        setEditedOrder({ ...editedOrder, [field]: e.target.value });
    };

    return (
        <div className="delete-order-container">
            <h1>Update Orders</h1>
            <div className="search-bar-container">
                <input
                    type="text"
                    placeholder="Search by Order ID or Warehouse ID..."
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
                            <th>Delivery Status</th>
                            <th>Bottles Ordered</th>
                            <th>Delivery Date</th>
                            <th>Schedule Payment Date</th>
                            <th>Freight Cost</th>
                            <th>Maneuver Cost</th>
                            <th>Discount</th>
                            <th>Bottle Cost</th>
                            <th>Price Per Bottle</th>
                            <th>Payment Status</th>
                            <th>Warehouse ID</th>
                            <th>Edit Order</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.map((order) => (
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>
                                    {editingOrderId === order.id ? (
                                        <select
                                            value={editedOrder.delivery_status || ''}
                                            onChange={(e) => handleInputChange(e, 'delivery_status')}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="On_route">On_route</option>
                                            <option value="Delivered">Delivered</option>
                                        </select>
                                    ) : (
                                        order.delivery_status
                                    )}
                                </td>
                                <td>
                                    {editingOrderId === order.id ? (
                                        <input
                                            type="number"
                                            value={editedOrder.bottles_ordered || ''}
                                            onChange={(e) => handleInputChange(e, 'bottles_ordered')}
                                        />
                                    ) : (
                                        numberFormatter.format(order.bottles_ordered)
                                    )}
                                </td>
                                <td>
                                    {editingOrderId === order.id ? (
                                        <input
                                            type="date"
                                            value={formatDate(editedOrder.delivery_date) || ''}
                                            onChange={(e) => handleInputChange(e, 'delivery_date')}
                                        />
                                    ) : (
                                        formatDate(order.delivery_date)
                                    )}
                                </td>
                                <td>
                                    {editingOrderId === order.id ? (
                                        <input
                                            type="date"
                                            value={formatDate(editedOrder.schedule_payment_date) || ''}
                                            onChange={(e) =>
                                                handleInputChange(e, 'schedule_payment_date')
                                            }
                                        />
                                    ) : (
                                        formatDate(order.schedule_payment_date)
                                    )}
                                </td>
                                <td>
                                    {editingOrderId === order.id ? (
                                        <input
                                            type="number"
                                            value={editedOrder.freight_cost || ''}
                                            onChange={(e) => handleInputChange(e, 'freight_cost')}
                                        />
                                    ) : (
                                        `$${numberFormatter.format(order.freight_cost)}`
                                    )}
                                </td>
                                <td>
                                    {editingOrderId === order.id ? (
                                        <input
                                            type="number"
                                            value={editedOrder.maneuver_cost || ''}
                                            onChange={(e) => handleInputChange(e, 'maneuver_cost')}
                                        />
                                    ) : (
                                        `$${numberFormatter.format(order.maneuver_cost)}`
                                    )}
                                </td>
                                <td>
                                    {editingOrderId === order.id ? (
                                        <input
                                            type="number"
                                            value={editedOrder.discount || ''}
                                            onChange={(e) => handleInputChange(e, 'discount')}
                                        />
                                    ) : (
                                        `$${numberFormatter.format(order.discount)}`
                                    )}
                                </td>
                                <td>
                                    {editingOrderId === order.id ? (
                                        <input
                                            type="number"
                                            value={editedOrder.bottle_cost || ''}
                                            onChange={(e) => handleInputChange(e, 'bottle_cost')}
                                        />
                                    ) : (
                                        `$${numberFormatter.format(order.bottle_cost)}`
                                    )}
                                </td>
                                <td>
                                    {editingOrderId === order.id ? (
                                        <input
                                            type="number"
                                            value={editedOrder.price_per_bottle || ''}
                                            onChange={(e) => handleInputChange(e, 'price_per_bottle')}
                                        />
                                    ) : (
                                        `$${numberFormatter.format(order.price_per_bottle)}`
                                    )}
                                </td>
                                <td>
                                    {editingOrderId === order.id ? (
                                        <select
                                            value={editedOrder.payment_status || ''}
                                            onChange={(e) => handleInputChange(e, 'payment_status')}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Overdue">Overdue</option>
                                            <option value="Paid">Paid</option>
                                        </select>
                                    ) : (
                                        order.payment_status
                                    )}
                                </td>
                                <td>
                                    {editingOrderId === order.id ? (
                                        <input
                                            type="number"
                                            value={editedOrder.warehouse_id || ''}
                                            onChange={(e) => handleInputChange(e, 'warehouse_id')}
                                        />
                                    ) : (
                                        order.warehouse_id
                                    )}
                                </td>
                                <td>
                                    {editingOrderId === order.id ? (
                                        <button
                                            className="btn save-btn"
                                            onClick={() => handleSaveClick(order.id)}
                                        >
                                            Save
                                        </button>
                                    ) : (
                                        <button
                                            className="btn edit-btn"
                                            onClick={() => handleEditClick(order)}
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

export default UpdateOrderPage;

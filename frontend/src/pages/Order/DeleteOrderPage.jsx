import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";

const DeleteOrderPage = () => {
    const [orders, setOrders] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedOrderId, setSelectedOrderId] = useState(null); // For confirmation popup
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");

    const numberFormatter = new Intl.NumberFormat("en-US");

    // Fetch all orders
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axiosInstance.get("/orders", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                    },
                });

                const sortedOrders = response.data.sort((a, b) => a.id - b.id);
                setOrders(sortedOrders);
                setMessage("");
                setMessageType(""); // Reset messageType on successful fetch
            } catch (error) {
                console.error("Error fetching orders:", error.response?.data || error.message);
                setMessage("Failed to load orders. Please try again later.");
                setMessageType("error");
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

    // Handle delete order
    const handleDeleteOrder = async () => {
        try {
            await axiosInstance.delete(`/orders/${selectedOrderId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                },
            });

            const updatedOrders = orders.filter((order) => order.id !== selectedOrderId);
            setOrders(updatedOrders);
            setSelectedOrderId(null);
            setMessage("Order deleted successfully!");
            setMessageType("success");
        } catch (error) {
            console.error("Error deleting order:", error.response?.data || error.message);
            setMessage("Failed to delete order. Please try again.");
            setMessageType("error");
            setSelectedOrderId(null);
        }
    };

    return (
        <div className="delete-order-container">
            <h1>Delete Orders</h1>
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
                            <th>Delete Order</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.map((order) => (
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>{order.delivery_status}</td>
                                <td>{numberFormatter.format(order.bottles_ordered)}</td>
                                <td>{new Date(order.delivery_date).toISOString().split("T")[0]}</td>
                                <td>
                                    {new Date(order.schedule_payment_date)
                                        .toISOString()
                                        .split("T")[0]}
                                </td>
                                <td>${numberFormatter.format(order.freight_cost)}</td>
                                <td>${numberFormatter.format(order.maneuver_cost)}</td>
                                <td>${numberFormatter.format(order.discount)}</td>
                                <td>${numberFormatter.format(order.bottle_cost)}</td>
                                <td>${numberFormatter.format(order.price_per_bottle)}</td>
                                <td>{order.payment_status}</td>
                                <td>{order.warehouse_id}</td>
                                <td>
                                    <button
                                        className="btn delete-btn"
                                        onClick={() => setSelectedOrderId(order.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Confirmation popup */}
            {selectedOrderId && (
                <div className="popup-overlay">
                    <div className="popup">
                        <p>
                            Are you sure you want to delete order ID {selectedOrderId}?
                        </p>
                        <div className="popup-buttons">
                            <button
                                className="btn cancel-btn"
                                onClick={() => setSelectedOrderId(null)}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn delete-btn"
                                onClick={handleDeleteOrder}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DeleteOrderPage;

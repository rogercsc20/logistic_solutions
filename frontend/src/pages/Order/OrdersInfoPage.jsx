import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import "../../styles/Clients.css";

const OrdersInfoPage = () => {
    const [orders, setOrders] = useState([]);
    const [message, setMessage] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    const numberFormatter = new Intl.NumberFormat("en-US");

    // Fetch orders
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axiosInstance.get("/orders", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                    },
                });

                setOrders(response.data);
                setMessage("");
            } catch (error) {
                console.error("Error fetching orders:", error.response?.data || error.message);
                setMessage("Failed to load orders. Please try again later.");
            }
        };

        fetchOrders();
    }, []);

    // Calculate totals
    const totals = orders.reduce(
        (acc, order) => {
            acc.bottles_ordered += order.bottles_ordered || 0;
            acc.boxes_ordered += order.boxes_ordered || 0;
            acc.freight_cost += order.freight_cost || 0;
            acc.maneuver_cost += order.maneuver_cost || 0;
            acc.discount += order.discount || 0;
            acc.total_price += order.total_price || 0;
            acc.profit += order.profit || 0;
            return acc;
        },
        {
            bottles_ordered: 0,
            boxes_ordered: 0,
            freight_cost: 0,
            maneuver_cost: 0,
            discount: 0,
            total_price: 0,
            profit: 0,
        }
    );

    // Filtered orders based on search
    const filteredOrders = orders.filter((order) => {
        const searchLower = searchQuery.toLowerCase();
        return (
            order.id.toString().includes(searchLower) ||
            order.warehouse_id.toString().includes(searchLower)
        );
    });

    return (
        <div className="delete-order-container">
            <h1 className="client-title">Orders Info</h1>
            <input
                type="text"
                placeholder="Search by Order ID or Warehouse ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-bar"
            />
            <div className="client-container">
                <table className="client-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Order Date</th>
                            <th>Delivery Status</th>
                            <th>Bottles Ordered</th>
                            <th>Boxes Ordered</th>
                            <th>Delivery Date</th>
                            <th>Schedule Payment Date</th>
                            <th>Freight Cost</th>
                            <th>Maneuver Cost</th>
                            <th>Discount</th>
                            <th>Bottle Cost</th>
                            <th>Price Per Bottle</th>
                            <th>Total Price</th>
                            <th>Profit</th>
                            <th>Payment Status</th>
                            <th>Warehouse ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.map((order) => (
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>{new Date(order.order_date).toLocaleDateString()}</td>
                                <td className={`status-${order.delivery_status.toLowerCase()}`}>
                                    {order.delivery_status}
                                </td>
                                <td>{numberFormatter.format(order.bottles_ordered)}</td>
                                <td>{numberFormatter.format(order.boxes_ordered)}</td>
                                <td>
                                    {order.delivery_date
                                        ? new Date(order.delivery_date).toLocaleDateString()
                                        : "N/A"}
                                </td>
                                <td>
                                    {order.schedule_payment_date
                                        ? new Date(order.schedule_payment_date).toLocaleDateString()
                                        : "N/A"}
                                </td>
                                <td>${numberFormatter.format(order.freight_cost)}</td>
                                <td>${numberFormatter.format(order.maneuver_cost)}</td>
                                <td>${numberFormatter.format(order.discount)}</td>
                                <td>${numberFormatter.format(order.bottle_cost)}</td>
                                <td>${numberFormatter.format(order.price_per_bottle)}</td>
                                <td>${numberFormatter.format(order.total_price)}</td>
                                <td>${numberFormatter.format(order.profit)}</td>
                                <td className={`status-${order.payment_status.toLowerCase()}`}>
                                    {order.payment_status}
                                </td>
                                <td>{order.warehouse_id}</td>
                            </tr>
                        ))}
                        <tr className="total-row">
                            <td colSpan="3">TOTAL</td>
                            <td>{numberFormatter.format(totals.bottles_ordered)}</td>
                            <td>{numberFormatter.format(totals.boxes_ordered)}</td>
                            <td colSpan="3"></td>
                            <td>${numberFormatter.format(totals.freight_cost)}</td>
                            <td>${numberFormatter.format(totals.maneuver_cost)}</td>
                            <td>${numberFormatter.format(totals.discount)}</td>
                            <td></td>
                            <td>${numberFormatter.format(totals.total_price)}</td>
                            <td>${numberFormatter.format(totals.profit)}</td>
                            <td colSpan="2"></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrdersInfoPage;

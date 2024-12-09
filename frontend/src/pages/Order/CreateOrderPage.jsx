import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import "../../styles/Clients.css"; // Reusing the same styles for consistency

const CreateOrderPage = () => {
    const [formData, setFormData] = useState({
        order_date: new Date().toISOString().slice(0, 10), // Default to today
        delivery_status: "Pending",
        bottles_ordered: "",
        delivery_date: "",
        schedule_payment_date: "",
        freight_cost: "",
        maneuver_cost: "",
        discount: 0.0,
        bottle_cost: 200.0,
        price_per_bottle: 245.0,
        payment_status: "Pending",
        warehouse_id: "",
    });

    const [warehouses, setWarehouses] = useState([]);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");

    // Fetch all warehouses
    useEffect(() => {
        const fetchWarehouses = async () => {
            try {
                const response = await axiosInstance.get("/warehouses", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                    },
                });

                setWarehouses(response.data);
                setMessage("");
            } catch (error) {
                console.error("Error fetching warehouses:", error.response?.data || error.message);
                setMessage("Failed to load warehouses. Please try again later.");
                setMessageType("error");
            }
        };

        fetchWarehouses();
    }, []);

    // Handle form submission
    // Handle form submission
const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // Clear previous messages

    // Format the date fields to include time (if required by the backend)
    const formattedFormData = {
        ...formData,
        order_date: new Date(formData.order_date).toISOString(),
        delivery_date: formData.delivery_date
            ? new Date(formData.delivery_date).toISOString()
            : null,
        schedule_payment_date: formData.schedule_payment_date
            ? new Date(formData.schedule_payment_date).toISOString()
            : null,
    };

        try {
            const response = await axiosInstance.post("/orders", formattedFormData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                },
            });

            setMessage("Order placed successfully!");
            setMessageType("success");
            setFormData({
                order_date: new Date().toISOString().slice(0, 10),
                delivery_status: "Pending",
                bottles_ordered: "",
                delivery_date: new Date().toISOString().slice(0, 10),
                schedule_payment_date: new Date().toISOString().slice(0, 10),
                freight_cost: "",
                maneuver_cost: "",
                discount: 0.0,
                bottle_cost: 200.0,
                price_per_bottle: 245.0,
                payment_status: "Pending",
                warehouse_id: "",
            });
        } catch (error) {
            console.error("Error placing order:", error.response?.data || error.message);
            setMessage("Failed to place order. Please check the inputs and try again.");
            setMessageType("error");
        }
    };


    // Handle input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    return (
        <div className="client-container">
            <h1 className="client-title">Place Order</h1>
            {message && <p className={`message ${messageType}`}>{message}</p>}
            <form className="form-container" onSubmit={handleSubmit}>
                {/* Order Date */}
                <label className="form-label">
                    Order Date:
                    <input
                        type="date"
                        name="order_date"
                        value={formData.order_date}
                        onChange={handleInputChange}
                        className="form-input"
                    />
                </label>

                {/* Delivery Status */}
                <label className="form-label">
                    Delivery Status:
                    <select
                        name="delivery_status"
                        value={formData.delivery_status}
                        onChange={handleInputChange}
                        className="form-select"
                    >
                        <option value="Pending">Pending</option>
                        <option value="On_route">On_route</option>
                        <option value="Delivered">Delivered</option>
                    </select>
                </label>

                {/* Bottles Ordered */}
                <label className="form-label">
                    Bottles Ordered:
                    <input
                        type="number"
                        name="bottles_ordered"
                        value={formData.bottles_ordered}
                        onChange={handleInputChange}
                        className="form-input"
                        required
                    />
                </label>

                {/* Delivery Date */}
                <label className="form-label">
                    Delivery Date:
                    <input
                        type="date"
                        name="delivery_date"
                        value={formData.delivery_date}
                        onChange={handleInputChange}
                        className="form-input"
                    />
                </label>

                {/* Schedule Payment Date */}
                <label className="form-label">
                    Schedule Payment Date:
                    <input
                        type="date"
                        name="schedule_payment_date"
                        value={formData.schedule_payment_date}
                        onChange={handleInputChange}
                        className="form-input"
                    />
                </label>

                {/* Freight Cost */}
                <label className="form-label">
                    Freight Cost:
                    <input
                        type="number"
                        name="freight_cost"
                        value={formData.freight_cost}
                        onChange={handleInputChange}
                        className="form-input"
                        required
                    />
                </label>

                {/* Maneuver Cost */}
                <label className="form-label">
                    Maneuver Cost:
                    <input
                        type="number"
                        name="maneuver_cost"
                        value={formData.maneuver_cost}
                        onChange={handleInputChange}
                        className="form-input"
                        required
                    />
                </label>

                {/* Discount */}
                <label className="form-label">
                    Discount:
                    <input
                        type="number"
                        name="discount"
                        value={formData.discount}
                        onChange={handleInputChange}
                        className="form-input"
                    />
                </label>

                {/* Bottle Cost */}
                <label className="form-label">
                    Bottle Cost:
                    <input
                        type="number"
                        name="bottle_cost"
                        value={formData.bottle_cost}
                        onChange={handleInputChange}
                        className="form-input"
                    />
                </label>

                {/* Price Per Bottle */}
                <label className="form-label">
                    Price Per Bottle:
                    <input
                        type="number"
                        name="price_per_bottle"
                        value={formData.price_per_bottle}
                        onChange={handleInputChange}
                        className="form-input"
                    />
                </label>

                {/* Payment Status */}
                <label className="form-label">
                    Payment Status:
                    <select
                        name="payment_status"
                        value={formData.payment_status}
                        onChange={handleInputChange}
                        className="form-select"
                    >
                        <option value="Pending">Pending</option>
                        <option value="Overdue">Overdue</option>
                        <option value="Paid">Paid</option>
                    </select>
                </label>

                {/* Warehouse */}
                <label className="form-label">
                    Warehouse:
                    <select
                        name="warehouse_id"
                        value={formData.warehouse_id}
                        onChange={handleInputChange}
                        className="form-select"
                        required
                    >
                        <option value="">Select Warehouse</option>
                        {warehouses.map((warehouse) => (
                            <option key={warehouse.id} value={warehouse.id}>
                                {warehouse.address} (ID: {warehouse.id})
                            </option>
                        ))}
                    </select>
                </label>

                <button type="submit" className="btn btn-primary">
                    Place Order
                </button>
            </form>
        </div>
    );
};

export default CreateOrderPage;

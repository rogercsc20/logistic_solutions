import React, { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import "./Dashboard.css";

const Dashboard = () => {
    const [ordersSummary, setOrdersSummary] = useState(null);
    const [costsSummary, setCostsSummary] = useState(null);
    const [profitsSummary, setProfitsSummary] = useState(null);
    const [salesPerformance, setSalesPerformance] = useState(null);
    const [inventorySummary, setInventorySummary] = useState([]);
    const [filters, setFilters] = useState({
        startDate: "",
        endDate: "",
    });

    const numberFormatter = new Intl.NumberFormat("en-US");

    // Format the dates to ISO 8601 with time
    const formatDate = (date) => {
        return new Date(date).toISOString().split("T")[0] + "T00:00:00";
    };

    // Fetch dashboard data based on filters
    const fetchData = async () => {
        try {
            const headers = {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            };

            // Format dates for the backend
            const formattedFilters = {
                start_date: filters.startDate ? formatDate(filters.startDate) : "",
                end_date: filters.endDate ? formatDate(filters.endDate) : "",
            };

            const [orders, costs, profits, sales, inventory] = await Promise.all([
                axiosInstance.get("/orders/summary", { headers, params: formattedFilters }),
                axiosInstance.get("/costs/summary", { headers, params: formattedFilters }),
                axiosInstance.get("/profits/summary", { headers, params: formattedFilters }),
                axiosInstance.get("/sales/performance", { headers, params: formattedFilters }),
                axiosInstance.get("/inventory/summary", { headers }),
            ]);

            setOrdersSummary(orders.data);
            setCostsSummary(costs.data);
            setProfitsSummary(profits.data);
            setSalesPerformance(sales.data);
            setInventorySummary(inventory.data);
        } catch (error) {
            console.error("Error fetching dashboard data:", error.response?.data || error.message);
        }
    };

    // Handle filter changes
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
    };

    // Handle "Filter" button click
    const handleFilterSubmit = (e) => {
        e.preventDefault(); // Prevent form submission
        fetchData(); // Fetch data based on filters
    };

    return (
        <div className="dashboard">
            {/* Header */}
            <div className="dashboard-header">
                <h1>BCL Management Dashboard</h1>
                <form className="filters" onSubmit={handleFilterSubmit}>
                    <label>
                        Start Date:
                        <input
                            type="date"
                            name="startDate"
                            value={filters.startDate}
                            onChange={handleFilterChange}
                        />
                    </label>
                    <label>
                        End Date:
                        <input
                            type="date"
                            name="endDate"
                            value={filters.endDate}
                            onChange={handleFilterChange}
                        />
                    </label>
                    <button type="submit">Filter</button>
                </form>
            </div>

            {/* Dashboard Content */}
            <div className="dashboard-content">
                {/* Orders Summary */}
                {ordersSummary && (
                    <div className="dashboard-box">
                        <h3>Active Orders</h3>
                        <p>Total Orders: {numberFormatter.format(ordersSummary.total_orders)}</p>
                        <ul>
                            <li>Pending: {numberFormatter.format(ordersSummary.statuses.pending)}</li>
                            <li>On Route: {numberFormatter.format(ordersSummary.statuses.on_route)}</li>
                            <li>Delivered: {numberFormatter.format(ordersSummary.statuses.delivered)}</li>
                        </ul>
                    </div>
                )}

                {/* Costs Summary */}
                {costsSummary && (
                    <div className="dashboard-box">
                        <h3>Total Costs</h3>
                        <ul>
                            <li>Total Costs: ${numberFormatter.format(costsSummary.total_costs)}</li>
                            <li>Freight Costs: ${numberFormatter.format(costsSummary.freight_costs)}</li>
                            <li>Maneuver Costs: ${numberFormatter.format(costsSummary.maneuver_costs)}</li>
                            <li>Discounts: ${numberFormatter.format(costsSummary.discounts)}</li>
                        </ul>
                    </div>
                )}

                {/* Profits Summary */}
                {profitsSummary && (
                    <div className="dashboard-box">
                        <h3>Profit Summary</h3>
                        <p>Total Revenue: ${numberFormatter.format(profitsSummary.total_revenue)}</p>
                        <p>Total Profits: ${numberFormatter.format(profitsSummary.total_profits)}</p>
                    </div>
                )}

                {/* Sales Performance */}
                {salesPerformance && (
                    <div className="dashboard-box">
                        <h3>Sales Performance</h3>
                        <p>Bottles Sold: {numberFormatter.format(salesPerformance.bottles_sold)}</p>
                        <p>Boxes Sold: {numberFormatter.format(salesPerformance.boxes_sold)}</p>
                    </div>
                )}

                {/* Inventory Summary */}
                {inventorySummary.length > 0 && (
                    <div className="dashboard-box">
                        <h3>Inventory Summary</h3>
                        <ul>
                            {inventorySummary.map((warehouse) => (
                                <li key={warehouse.warehouse_id}>
                                    {warehouse.address}: {numberFormatter.format(warehouse.inventory_status)} items
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;

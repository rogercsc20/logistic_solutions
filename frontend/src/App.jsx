import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import './styles/global.css';
import NavBar from './components/NavBar';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import HomePage from './pages/HomePage';
import ClientPage from './pages/Client/ClientPage';
import ProtectedRoute from './components/ProtectedRoute';
import ClientInfoPage from './pages/Client/ClientInfoPage';
import CreateClientPage from './pages/Client/CreateClientPage';
import UpdateClientPage from './pages/Client/UpdateClientPage';
import DeleteClientPage from './pages/Client/DeleteClientPage';
import WarehousePage from './pages/Warehouse/WarehousePage';
import WarehouseInfoPage from './pages/Warehouse/WarehouseInfoPage';
import AddWarehousePage from './pages/Warehouse/AddWarehousePage';
import UpdateWarehousePage from './pages/Warehouse/UpdateWarehousePage';
import DeleteWarehousePage from './pages/Warehouse/DeleteWarehousePage';
import OrdersPage from './pages/Order/OrdersPage';
import OrdersInfoPage from './pages/Order/OrdersInfoPage';
import CreateOrderPage from './pages/Order/CreateOrderPage';
import UpdateOrderPage from './pages/Order/UpdateOrderPage';
import DeleteOrderPage from './pages/Order/DeleteOrderPage';
import WarehousesInfoClientPage from './pages/Warehouse/WarehousesInfoClientPage';
import Dashboard from './pages/Dashboard';
import { isTokenExpired } from './utils/tokenUtils'; //

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    // Check authentication status on mount
    useEffect(() => {
        const token = localStorage.getItem('access_token');
        setIsLoggedIn(token && !isTokenExpired(token));
    }, []);

    // Redirect logged-in users away from login/signup pages
    useEffect(() => {
        if (isLoggedIn && (location.pathname === '/login' || location.pathname === '/signup')) {
            navigate('/home');
        }
    }, [isLoggedIn, location.pathname, navigate]);

    const showHomeButton = location.pathname === '/login' || location.pathname === '/signup';

    return (
        <div>
            {/* NavBar with isLoggedIn state */}
            <NavBar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} showHomeButton={showHomeButton} />

            {/* Routes */}
            <Routes>
                <Route
                    path="/"
                    element={
                        <div className="container">
                            <img src="/logo.png" alt="BCL Management Logo" className="logo" />
                            <h1>BCL Management</h1>
                            <p>
                                Welcome to BCL management system. Keep track of all your <strong>clients</strong>, <strong>orders</strong>, and <strong>warehouses</strong> effortlessly.
                            </p>
                            <div className="button-group">
                                <button className="btn" onClick={() => navigate("/login")}>
                                    Log In
                                </button>
                                <button className="btn btn-primary" onClick={() => navigate("/signup")}>
                                    Sign Up
                                </button>
                            </div>
                        </div>
                    }
                />
                <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/clients" element={<ProtectedRoute><ClientPage /></ProtectedRoute>} />
                <Route path="/clients/info" element={<ProtectedRoute><ClientInfoPage /></ProtectedRoute>} />
                <Route path="/clients/create" element={<ProtectedRoute><CreateClientPage /></ProtectedRoute>} />
                <Route path="/clients/update" element={<ProtectedRoute><UpdateClientPage /></ProtectedRoute>} />
                <Route path="/clients/delete" element={<ProtectedRoute><DeleteClientPage /></ProtectedRoute>} />
                <Route path="/warehouses" element={<ProtectedRoute><WarehousePage /></ProtectedRoute>} />
                <Route path="/warehouses/info" element={<ProtectedRoute><WarehouseInfoPage /></ProtectedRoute>} />
                <Route path="/warehouses/create" element={<ProtectedRoute><AddWarehousePage /></ProtectedRoute>} />
                <Route path="/warehouses/update" element={<ProtectedRoute><UpdateWarehousePage /></ProtectedRoute>} />
                <Route path="/warehouses/delete" element={<ProtectedRoute><DeleteWarehousePage /></ProtectedRoute>} />
                <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
                <Route path="/orders/info" element={<ProtectedRoute><OrdersInfoPage /></ProtectedRoute>} />
                <Route path="/orders/create" element={<ProtectedRoute><CreateOrderPage /></ProtectedRoute>} />
                <Route path="/orders/update" element={<ProtectedRoute><UpdateOrderPage /></ProtectedRoute>} />
                <Route path="/orders/delete" element={<ProtectedRoute><DeleteOrderPage /></ProtectedRoute>} />
                <Route path="/warehouses/info/:id" element={<WarehousesInfoClientPage />} />
                <Route path="/dashboard" element={<Dashboard />} />

                <Route
                    path="/home"
                    element={
                        <ProtectedRoute>
                            <HomePage />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </div>
    );
};

export default App;

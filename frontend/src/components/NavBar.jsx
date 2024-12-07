import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import './NavBar.css';

const NavBar = ({ isLoggedIn, setIsLoggedIn, showHomeButton = false }) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            // Call the backend /logout route
            await axiosInstance.post('/logout');

            // Clear tokens from localStorage
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');

            // Update login state and redirect to the landing page
            setIsLoggedIn(false);
            console.log("Logged out");
            navigate('/');
        } catch (error) {
            console.error('Logout failed:', error.response?.data || error.message);
        }
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/home" className="navbar-logo">
                    <img src="/logo.png" alt="BCL Logo" className="navbar-logo-image" />
                </Link>
                <div className="navbar-links">
                    {showHomeButton && (
                        <button
                            onClick={() => navigate('/')}
                            className="btn btn-home"
                        >
                            Back to Home
                        </button>
                    )}
                    {isLoggedIn && <Link to="/home">Home</Link>}
                    {isLoggedIn && <Link to="/clients">Clients</Link>}
                    {isLoggedIn && <Link to="/warehouses">Warehouses</Link>}
                    {isLoggedIn && <Link to="/orders">Orders</Link>}
                    {isLoggedIn && <Link to="/dashboard">Dashboard</Link>}
                    {isLoggedIn && (
                        <button onClick={handleLogout} className="logout-button">
                            Log Out
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default NavBar;

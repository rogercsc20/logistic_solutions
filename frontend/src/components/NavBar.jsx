import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';

const NavBar = ({ isLoggedIn }) => {
    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    <img src="/logo.png" alt="BCL Logo" className="navbar-logo-image" />
                </Link>
                <div className="navbar-links">
                    <Link to="/home">Home</Link>
                    {isLoggedIn && <Link to="/clients">Clients</Link>}
                    {isLoggedIn && <Link to="/warehouses">Warehouses</Link>}
                    {isLoggedIn && <Link to="/orders">Orders</Link>}
                    {isLoggedIn && <Link to="/dashboard">Dashboard</Link>}
                    {isLoggedIn && <Link to="/logout">Log Out</Link>}
                </div>
            </div>
        </nav>
    );
};

export default NavBar;

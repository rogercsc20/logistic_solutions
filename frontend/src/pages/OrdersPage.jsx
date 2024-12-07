import React from 'react';
import { useNavigate } from 'react-router-dom';
import './OrdersPage.css'; // Custom styles

const OrdersPage = () => {
    const navigate = useNavigate();

    return (
        <div className="orders-page-container">
            <h1>Order Management</h1>
            <div className="grid-container">
                {/* Button for Orders Info */}
                <div className="grid-item">
                    <button className="orders-btn" onClick={() => navigate('/orders/info')}>
                        Orders Info
                    </button>
                </div>

                {/* Button for Place an Order */}
                <div className="grid-item">
                    <button className="orders-btn" onClick={() => navigate('/orders/create')}>
                        Place an Order
                    </button>
                </div>

                {/* Button for Update Order */}
                <div className="grid-item">
                    <button className="orders-btn" onClick={() => navigate('/orders/update')}>
                        Update Order
                    </button>
                </div>

                {/* Button for Delete Order */}
                <div className="grid-item">
                    <button className="orders-btn" onClick={() => navigate('/orders/delete')}>
                        Delete Order
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrdersPage;

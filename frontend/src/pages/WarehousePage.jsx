import React from 'react';
import { useNavigate } from 'react-router-dom';
import './WarehousePage.css'; // Custom styles

const WarehousePage = () => {
    const navigate = useNavigate();

    return (
        <div className="warehouse-page-container">
            <h1>Warehouse Management</h1>
            <div className="grid-container">
                {/* Button for Warehouse Info */}
                <div className="grid-item">
                    <button className="warehouse-btn" onClick={() => navigate('/warehouses/info')}>
                        Warehouses Info
                    </button>
                </div>

                {/* Button for Add a New Warehouse */}
                <div className="grid-item">
                    <button className="warehouse-btn" onClick={() => navigate('/warehouses/create')}>
                        Add a New Warehouse
                    </button>
                </div>

                {/* Button for Update Existing Warehouse */}
                <div className="grid-item">
                    <button className="warehouse-btn" onClick={() => navigate('/warehouses/update')}>
                        Update a Warehouse
                    </button>
                </div>

                {/* Button for Delete a Warehouse */}
                <div className="grid-item">
                    <button className="warehouse-btn" onClick={() => navigate('/warehouses/delete')}>
                        Delete a Warehouse
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WarehousePage;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ClientPage.css';

const ClientPage = () => {
    const navigate = useNavigate();

    return (
        <div className="client-page-container">
            <h1>Client Management</h1>
            <div className="grid-container">
                {/* Button for Client Info */}
                <div className="grid-item">
                    <button className="client-btn" onClick={() => navigate('/clients/info')}>
                        Client Info
                    </button>
                </div>

                {/* Button for Create a New Client */}
                <div className="grid-item">
                    <button className="client-btn" onClick={() => navigate('/clients/create')}>
                        Create a New Client
                    </button>
                </div>

                {/* Button for Update Existing Clients */}
                <div className="grid-item">
                    <button className="client-btn" onClick={() => navigate('/clients/update')}>
                        Update Existing Clients
                    </button>
                </div>

                {/* Button for Delete a Client */}
                <div className="grid-item">
                    <button className="client-btn" onClick={() => navigate('/clients/delete')}>
                        Delete a Client
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ClientPage;

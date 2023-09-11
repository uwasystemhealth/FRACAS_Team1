import React from 'react';
import '../styles/UserDashboard.scss';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
    const navigate = useNavigate();

    const handleSearchReportsClick = () => {
        navigate("/search");
    }

    const handleClosedClick = () => {
        navigate("/report");
    }

    return (
        <div>
            <div className="usertopimg">
                <h1>UWAM <br/>FRACAS<br/>DASHBOARD</h1>
            </div>

            <h1 className="w" style={{ marginTop: '40px', textAlign: 'center' }}>Manage Your Reports</h1>

            <div className="usermainbox">
                <p style={{ height: '10px' }}></p>
                <div style={{ cursor: 'pointer' }} onClick={handleClosedClick}>Submit & Modify Reports</div>
                <div style={{ cursor: 'pointer' }} id="myDiv2" onClick={handleSearchReportsClick}>Search Reports</div>
                <div style={{ cursor: 'pointer' }}>Save and Log out</div>
            </div>
        </div>
    );
}

export default UserDashboard;

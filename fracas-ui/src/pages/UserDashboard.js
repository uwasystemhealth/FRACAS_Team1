import React from 'react';
import '../styles/UserDashboard.scss';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/useAuth';
import * as api from "../api";

const UserDashboard = () => {
    const navigate = useNavigate();

    const handleSearchReportsClick = () => {
        navigate("/search");
    }

    const handleClosedClick = () => {
        navigate("/report");
    }

    const auth = useAuth();
    const handleLogout = async () => {
        try {
            await api.logoutUser();
            auth.signout();
            navigate('/');  // Navigate to the root upon successful logout.
        } catch (error) {
            console.error("Error during logout:", error);
            alert("An error occurred while logging out. Please try again.");
        }
    };

    return (
        <div>
            <div className="usertopimg">
                <h1>UWAM <br/>FRACAS<br/>DASHBOARD</h1>
            </div>

            <h1 className="w" style={{ marginTop: '40px', textAlign: 'center' }}>Manage Your Reports</h1>

            <div className="usermainbox">
                <p style={{ height: '10px' }}></p>
                <div style={{ cursor: 'pointer' }} onClick={handleClosedClick}>Submit Report</div>
                <div style={{ cursor: 'pointer' }} id="myDiv2" onClick={handleSearchReportsClick}>Search Reports</div>
                <div style={{ cursor: 'pointer' }} onClick={handleLogout}>Log out</div>
            </div>
        </div>
    );
}

export default UserDashboard;

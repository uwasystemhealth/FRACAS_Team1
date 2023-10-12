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
    const handleLogout = async (e) => {
        e.preventDefault();
        try {
          const token = localStorage.getItem("token");
          const response = await api.logoutUser(token)
          localStorage.removeItem("is_admin"); // Remove the is_admin from localStorage
          localStorage.removeItem("token"); // Remove the token from localStorage
          if (response.message === "Logged out successfully") {
            navigate("/"); // Navigate to the root upon successful logout.
          } else {
            const data = await response.json();
            alert(data.message || "Error logging out. Please try again.");
          }
        } catch (error) {
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

import React from 'react';
import '../styles/AdminDashboard.scss';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/useAuth';

const AdminDashboard = () => {
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
            const token = localStorage.getItem('token');
            const response = await fetch("http://127.0.0.1:8000/api/logout", {
                method: "POST", // Assuming it's a POST request. Adjust if necessary.
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Token ${token}`,
                },
            });
    
            if (response.status === 200) {
                auth.signout();
                navigate('/');  // Navigate to the root upon successful logout.
            } else {
                // Optionally, handle other status codes or display an error message.
                const data = await response.json();
                alert(data.message || "Error logging out. Please try again.");
            }
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

export default AdminDashboard;

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
    // Check if the user is authenticated.
    const isAuthenticated = localStorage.getItem('token') !== null;
    const isAdmin = localStorage.getItem('is_admin') === 'true';
    const navigate = useNavigate();
    const goBackHandler = () => {
        navigate(-1); // This will navigate back to the previous page.
    };

    const handleLogout = async () => {
        try {
        const token = localStorage.getItem('token');
        const response = await fetch("http://127.0.0.1:8000/api/logout", {
            method: "POST", 
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${token}`,
            },
        });
        localStorage.removeItem('is_admin'); // Remove the is_admin from localStorage
        localStorage.removeItem('token'); // Remove the token from localStorage
        if (response.status === 200) {
            navigate('/'); // Navigate to the root upon successful logout.
        } else {
            const data = await response.json();
            alert(data.message || "Error logging out. Please try again.");
        }
        } catch (error) {
            alert("An error occurred while logging out. Please try again.");
        }
    };

    return (
        <div className="topnav">
            <header>
                <nav>
                    <div className="nav-left">
                        {/* {isAuthenticated && (
                            <button onClick={goBackHandler}>Back</button>
                        )} */}
                        <img src="/images/UWAM-Logo-2023-(colour).png" alt="UWAM Logo" />
                    </div>
                    <div className="nav-right">
                        <ul>
                            <li><Link to="/">Home</Link></li>
                            {/* Conditionally render Log in and Sign up links */}
                            {!isAuthenticated && (
                                <>
                                    <li><Link to="/login">Log in</Link></li>
                                    <li><Link to="/signup">Sign up</Link></li>
                                </>
                            )}
                            {isAuthenticated && (
                                <>
                                    <li><Link to="/userdashboard">User Dashboard</Link></li>
                                    <li>
                                        <div 
                                            role="button" 
                                            tabIndex={0} // to make the div focusable
                                            onClick={handleLogout} 
                                            style={{ cursor: 'pointer', color: 'black', textDecoration: 'underline', fontSize: '20px' }}
                                        >
                                            Logout
                                        </div>
                                    </li>
                                </>
                            )}
                            {isAdmin && (
                                <>
                                    <li>
                                        <a href="http://127.0.0.1:8000/admin/">
                                            Admin Dashboard (External)
                                        </a>
                                    </li>
                                </>
                            )}
                            
                        </ul>
                        <div className="topright">
                            <a href="https://www.instagram.com/uwamotorsport/">
                                <img src="/images/instagram-fill.png" alt="Instagram Icon" />
                            </a>
                            <a href="https://www.facebook.com/uwamotorsport/">
                                <img src="/images/Facebook.png" alt="Facebook Icon" />
                            </a>
                        </div>
                    </div>
                </nav>
            </header>
        </div>
    );
};

export default Header;

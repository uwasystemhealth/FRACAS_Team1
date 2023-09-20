import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <div className="topnav">
            <header>
                <nav>
                    <div className="nav-left">
                        <img src="/images/UWAM-Logo-2023-(colour).png" alt="UWAM Logo" />
                    </div>
                    {/* <input type="checkbox" id="nav-checkbox" />
                    <label htmlFor="nav-checkbox">&#9776;</label> */}
                    <div className="nav-right">
                        <ul>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/login">Log in</Link></li>
                            <li><Link to="/signup">Sign up</Link></li>
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

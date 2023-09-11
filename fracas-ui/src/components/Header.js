import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/main.scss';

function Header() {
    return (
        <div className='topnav'>
            <div className='nav w'>
                <img src='/images/UWAM-Logo-2023-(colour).png' alt='' />
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/login">Log in</Link></li>
                    <li><Link to="/signup">Sign up</Link></li>
                </ul>
                <div className='topright'>
                    <a href='https://www.instagram.com/uwamotorsport/'>
                        <img src='/images/instagram-fill.png' alt='' />
                    </a>    
                    <a href='https://www.facebook.com/uwamotorsport/'>
                        <img src='/images/Facebook.png' alt='' />
                    </a>
                </div>
            </div>
        </div>
    );
}

export default Header;

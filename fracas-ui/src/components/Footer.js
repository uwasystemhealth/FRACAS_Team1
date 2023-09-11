import React from 'react';
import '../styles/main.scss';

const Footer = () => {
    return (
        <div className='endnav'>
            <span className="p">© UWA Motorsport 2023. All Rights Reserved.</span>
            <ul>
                <li>
                    <a href='https://uwam.team/contact-us.html'>Our Team</a>
                </li>
                <li>
                    <a href="123">Our Cars</a>
                </li>
            </ul>
            <ul>
                <li>
                    <a href="">Licenses</a>
                </li>
                <li>
                    <a href="https://uwam.team/about-us.html">About Us</a>
                </li>
            </ul>
            <div className='right'>
                <img src='/images/emi.png' alt='Emi Logo' />
                <span className='p1'>Email</span>
                <span className='p2'>motorsport@uwa.edu.au.</span>
            </div>
        </div>
    );
}

export default Footer;

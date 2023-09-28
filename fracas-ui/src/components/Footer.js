import React from 'react';
import '../styles/main.scss';

const Footer = () => {
    return (
        <div className="endnav">
            <div className="endNav_lef">
                <ul>
                    <li> <a href="https://uwam.team/contact-us.html">Our Team</a></li>
                    <li><a href="123">Our Cars</a></li>
                </ul>
                <ul>
                    <li><a href="#">Licenses</a></li>
                    <li><a href="https://uwam.team/about-us.html">About Us</a></li>
                </ul>
            </div>
            <div className="p">© UWA Motorsport 2023. All Rights Reserved.</div>
            <div className="right">
                <img src="/images/emi.png" alt="icon" />
                <div className="right_txt">
                    <span className="p1">Email</span>
                    <span className="p2">motorsport@uwa.edu.au.</span>
                </div>
            </div>
        </div>
    );
}

export default Footer;

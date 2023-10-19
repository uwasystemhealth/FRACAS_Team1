import React from "react";
import "../styles/main.scss";

const Footer = () => {
  return (
    <div className="endnav">
      <div className="flex justify-between items-center">
        <div className="endNav_lef">
          <ul>
            <li>
              {" "}
              <a href="https://uwam.team/contact-us.html">Our Team</a>
            </li>
            <li>
              <a href="https://uwam.team/">Our Cars</a>
            </li>
          </ul>
          <ul>
            <li>
              <a href="https://github.com/uwasystemhealth/FRACAS_Team1/blob/main/LICENSE">Licenses</a>
            </li>
            <li>
              <a href="https://uwam.team/about-us.html">About Us</a>
            </li>
          </ul>
        </div>
        <div className="right flex items-center">
          <img src="/images/emi.png" alt="icon" />
          <div className="right_txt text-white  ml-md">
            <span className="p1">Email: </span>
            <span className="p2">motorsport@uwa.edu.au.</span>
          </div>
        </div>
      </div>

      <div className="mt-md text-white text-center">© UWA Motorsport 2023. All Rights Reserved.</div>
    </div>
  );
};

export default Footer;

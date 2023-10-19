import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as api from "../api";

const Header = () => {
  // Check if the user is authenticated.
  const isAuthenticated = localStorage.getItem("token") !== null;
  const isAdmin = localStorage.getItem("is_admin") === "true";
  const [show, setShow] = useState(false);
  const [isPhone, setIsPhone] = useState(false);
  const navigate = useNavigate();
  const goBackHandler = () => {
    navigate(-1); // This will navigate back to the previous page.
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    setShow(false);
    try {
      const token = localStorage.getItem("token");
      localStorage.removeItem("is_admin"); // Remove the is_admin from localStorage
      localStorage.removeItem("token"); // Remove the token from localStorage
      const response = await api.logoutUser(token)
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

  const handleMenu = () => {
    setShow(!show);
  };

  useEffect(() => {
    const recalc = function () {
      setIsPhone(window.innerWidth <= 920);
    };
    setIsPhone(window.innerWidth <= 920);
    window.addEventListener("resize", recalc, false);
    return () => {
      window.removeEventListener("resize", recalc, false);
    };
  }, []);

  return (
    <div className="topnav">
      <header>
        <nav>
          <div className="nav-left">
            {/* {isAuthenticated && (
                            <button onClick={goBackHandler}>Back</button>
                        )} */}
            <img style={{marginLeft: '16px'}} src="/images/UWAM-Logo-2023-(colour).png" alt="UWAM Logo" />
          </div>
          <div onClick={handleMenu} className=" mr-md">
            <img className="nav-menu-img" src="/images/menu-more.png" alt="" />
          </div>
          <div className="nav-right" style={{ display: show & isPhone ? "block" : isPhone ? "none" : "flex" }}>
            <ul>
              <li>
                <Link to="/" onClick={() => setShow(false)}>
                  Home
                </Link>
              </li>
              {/* Conditionally render Log in and Sign up links */}
              {!isAuthenticated && (
                <>
                  <li>
                    <Link to="/login" onClick={() => setShow(false)}>Log in</Link>
                  </li>
                  <li>
                    <Link to="/signup" onClick={() => setShow(false)}>Sign up</Link>
                  </li>
                </>
              )}
              {isAuthenticated && (
                <>
                  <li>
                    <Link to="/userdashboard" onClick={() => setShow(false)}>
                      Menu
                    </Link>
                  </li>
                </>
              )}
              {isAuthenticated && (
                <>
                  <li>
                    <Link to="/report" onClick={() => setShow(false)}>
                      New Report
                    </Link>
                  </li>
                </>
              )}
              {isAuthenticated && (
                <>
                  <li>
                    <Link to="/search" onClick={() => setShow(false)}>
                      Search & View Reports
                    </Link>
                  </li>
                </>
              )}
              {isAdmin && (
                <>
                  <li>
                    <a href={`${api.BASE_URL_NEW}/admin`}>Admin</a>
                  </li>
                </>
              )}
              {isAuthenticated && (
                <>
                  <li>
                    <a href="#" onClick={handleLogout} style={{ cursor: "pointer", color: "black", textDecoration: "underline", fontSize: "20px" }}>
                      Logout
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

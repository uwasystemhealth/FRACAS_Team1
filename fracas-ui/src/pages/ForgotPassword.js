import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TailSpin } from "react-loader-spinner";
import * as api from "../api";
import "../styles/ForgotPassword.scss";


const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    if (!email) {
        alert('Please enter your email.');
        setIsLoading(false);
        return;
    }

    try {
      await api.resetPasswordEmail(email); // Use the function from api.js
      alert("Supplied email will be sent a reset link if it is associated with an account.");
      navigate("/");
    } catch (error) {
      console.error("Error while sending reset email:", error);
      alert("An error occurred. Please try again.");
    }
    setIsLoading(false);
  };

  return (
    <div className="fp-container">
      <div className="top-img">
        <h1>
          FRACAS <br /> FORGOT PASSWORD
        </h1>
      </div>
      <h1 className="fp-w fp-heading">Forgot Password</h1>
      <div className="fp-box fp-w">
        <div className="inpbox fp-w">
          <form onSubmit={handleSubmit}>
            <div className="inp">
              <span>Email</span>
              <input
                type="text"
                placeholder="Please enter your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {isLoading ? (
              <div className="spinner-container">
                <TailSpin
                  height="80"
                  width="80"
                  color="#501acf"
                  ariaLabel="tail-spin-loading"
                  radius="1"
                  wrapperStyle={{}}
                  wrapperClass=""
                  visible={true}
                />
              </div>
            ) : (
              <button type="submit" disabled={isLoading}>
                Submit
              </button>
            )}
          </form>
          <div className="create">
            Don't have an account?{" "}
            <Link className="link" to="/signup">
              Create account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

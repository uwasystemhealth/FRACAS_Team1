import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/ForgotPassword.scss";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!email) {
        alert('Please enter your email.');
        return;
      }
    try {
      const response = fetch("http://127.0.0.1:8000/auth/users/reset_email/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
        }),
      });

      if (response.status === 204) {
        console.log("enter");
      }
      alert(
        "Supplied email will be sent a reset link if it is associated with an account."
      );
      navigate("/");
    } catch (error) {
      console.error("Error while registering:", error);
      alert("An error occurred. Please try again.");
    }
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
            <button type="submit">
              Submit
            </button>
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

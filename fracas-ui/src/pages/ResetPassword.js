import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { TailSpin } from "react-loader-spinner";
import axios from "axios";
import "../styles/Signup.scss";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { uid, token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    if (!password || !confirmPassword) {
      alert("Please fill in the registration information");
    } else if (password !== confirmPassword) {
      alert("Passwords do not match");
    } else {
      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/auth/users/reset_password_confirm/",
          {
            uid: uid,
            token: token,
            new_password: password,
            re_new_password: confirmPassword,
          }
        );

        const data = await response.data;

        if (response.status === 204) {
          alert("Password successfully reset.");
          navigate("/login");
        } else {
          alert(data.error || "An error occurred while registering.");
        }
      } catch (error) {
        console.error("Error while reseting password:", error);
        alert("An error occurred. Please try again.");
      }
    }
    setIsLoading(false);
  };

  return (
    <div style={{ marginBottom: "150px" }}>
      <div className="topimg">
        <h1>
          RESET
          <br />
          PASSWORD
        </h1>
      </div>
      <h1
        className="signup-w"
        style={{ marginTop: "40px", textAlign: "center" }}
      >
        Reset Password
      </h1>
      <div className="signupbox signup-w">
        <span className="icon">
          <img src="/images/register.png" alt="icon" />
        </span>
        <p
          style={{
            color: "rgb(119, 119, 119)",
            textAlign: "center",
            fontSize: "17px",
          }}
        >
          Create a new password
        </p>
        <div className="inpbox signup-w">
          <form onSubmit={handleSubmit}>
            <div className="inp">
              <span>Password</span>
              <input
                type="password"
                placeholder="Please enter your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="inp">
              <span>Confirm Password</span>
              <input
                type="password"
                placeholder="Please re-enter your Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
                Reset Password
              </button>
            )}
          </form>
          <span className="s1">
            <Link to="/forgotpassword">Forgot password?</Link>
          </span>
          <span className="s2">
            <Link to="/login">Already have an account? Sign In</Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;

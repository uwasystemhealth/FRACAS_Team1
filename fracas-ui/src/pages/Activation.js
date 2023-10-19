import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TailSpin } from "react-loader-spinner";
import * as api from "../api";
import "../styles/Activation.scss";

const ActivateAccount = () => {
  const { uid, token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    api.activateAccount(uid, token)  // Use the function from api.js
      .then(() => {
        navigate("/");
        alert("Email verification successful!\nYou can login once your account has been approved by an admin.");
      })
      .catch((error) => {
        if (error.message.includes("403")) {
          alert("Account already activated.");
        } else {
          alert("Failed to activate account: " + error.message);
        }
        navigate("/login");
      });
  }, [navigate, token, uid]);

  return (
    <div style={{ marginBottom: "150px" }}>
      <div className="topimg">
        <h1>
          ACCOUNT
          <br />
          ACTIVATION
        </h1>
      </div>
      <h1
        className="account-activation"
        style={{ marginTop: "40px", textAlign: "center" }}
      >
        Verifying your email...
      </h1>
      <br />
      <br />
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
    </div>
  );
};

export default ActivateAccount;

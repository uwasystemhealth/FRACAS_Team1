import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { TailSpin } from "react-loader-spinner";
import axios from "axios";
import "../styles/Activation.scss";

const ActivateAccount = () => {
  const { uid, token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .post("http://127.0.0.1:8000/auth/users/activation/", {
        uid: uid,
        token: token,
      })
      .then(() => {
        navigate("/login");
        alert("Activation successful!");
      })
      .catch((err) => {
        if (err.response) {
          alert("Failed to activate account: " + err.response.data);
        } else {
          alert("Failed to activate account: " + err.message);
        }
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

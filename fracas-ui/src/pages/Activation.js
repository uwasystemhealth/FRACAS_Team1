import { useParams, useNavigate } from "react-router-dom";
import { TailSpin } from "react-loader-spinner";
import "../styles/Activation.scss";

const ActivateAccount = () => {
  const { uid, token } = useParams();
  const navigate = useNavigate();
  
    const activateAccount = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/auth/users/activation/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ uid: uid, token: token }),
        });
  
        if (!response.ok) {
          if (response.status === 403) {
            alert("Account already activated");
          } else {
            throw new Error("Failed to activate account");
          }
        } else {
          alert("Activation successful!");
        }
        navigate("/login");
      } catch (err) {
        alert("Failed to activate account: " + err.message);
      }
    };
  
    activateAccount();
  

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

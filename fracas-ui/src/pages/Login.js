import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../components/useAuth';
import '../styles/Login.scss';

const Login = () => {
  const [email, setEmail] = useState(''); // Change username to email
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const auth = useAuth();
  const handleLogin = async () => {
    try {
        const response = await fetch("http://127.0.0.1:8000/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: email,
                password: password,
            }),
        });

        if (response.status === 200) {
            // If the response status code is 200, navigate to the dashboard
            const data = await response.json();
            auth.authenticate(data.token);
            
            // Determine admin privilege
            const token = localStorage.getItem('token')
            const identityResponse = await fetch("http://127.0.0.1:8000/api/users/me/", {
              method: "GET",
              headers: {
                  'Authorization': `Token ${token}`
              }
            });

            if (identityResponse.status === 200) {
              const identityData = await identityResponse.json(); // Wait for the JSON data
              if (identityData.is_admin) {
                localStorage.setItem('is_admin', true);
                navigate('/admindashboard');
              } else {
                localStorage.setItem('is_admin', false);
                navigate('/userdashboard');
              }
            } else {
              // Handle error cases if needed
              console.error("Error getting user identity:", identityResponse.status);
              // ...
            }
        } else {
            // Optionally, you can handle other status codes or get more detail from the response
            const data = await response.json();
            alert(data.message || "Incorrect email or password.");
        }
    } catch (error) {
        console.error("Error during login:", error);
        alert("An error occurred. Please try again.");
    }
};


  return (
    <div style={{ marginBottom: '150px' }}>
      <div className="topimg">
        <h1>FRACAS<br />LOG IN</h1>
      </div>
      <h1 className="loginw" style={{ marginTop: '40px', textAlign: 'center' }}>Log in</h1>
      <div className="loginpagebox loginw">
        <span className="icon">
          <img src="/images/log-in-fill.png" alt="Login Icon" />
        </span>
        <h4 style={{ color: 'rgba(20, 137, 233,0.6)', textAlign: 'center', fontSize: '30px' }}>Welcome!</h4>
        <p style={{ color: 'rgb(119, 119, 119)', textAlign: 'center', fontSize: '17px' }}>Sign in to your account</p>
        <div className="inpbox loginw">
          <div className="inp">
          <span>Email</span>
        <br />
          <input 
            type="text" 
            placeholder="Please enter your email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
          </div>
          <div className="inp">
            <span>Password</span>
            <br />
            <input 
              type="password" 
              placeholder="Please enter your Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          <button onClick={handleLogin}>Log in</button>
          <span className="s1">forgot password?</span>
          <span className="s2"><Link to="/signup">Create account</Link></span>
        </div>
      </div>
    </div>
  );
};

export default Login;

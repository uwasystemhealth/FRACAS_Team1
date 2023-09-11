import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Login.scss';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (username === "putong" && password === "pt123123") {
      window.location.href = 'userdashboard.html';
    } else if (username === "admin" && password === "123123") {
      window.location.href = 'admin.html';
    } else {
      alert("Incorrect username or password");
    }
  };

  return (
    <div style={{ marginBottom: '150px' }}>
      <div className="topimg">
        <h1>FRACAS<br />LOG IN</h1>
      </div>
      <h1 className="w" style={{ marginTop: '40px', textAlign: 'center' }}>Log in</h1>
      <div className="loginbox w">
        <span className="icon">
          <img src="/images/log-in-fill.png" alt="Login Icon" />
        </span>
        <h4 style={{ color: 'rgba(20, 137, 233,0.6)', textAlign: 'center', fontSize: '30px' }}>Welcome!</h4>
        <p style={{ color: 'rgb(119, 119, 119)', textAlign: 'center', fontSize: '17px' }}>Sign in to your account</p>
        <div className="inpbox w">
          <div className="inp">
            <span>*Name</span>
            <br />
            <input 
              type="text" 
              placeholder="Please enter your name" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
            />
          </div>
          <div className="inp">
            <span>*Password</span>
            <br />
            <input 
              type="password" 
              placeholder="Please enter your Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
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

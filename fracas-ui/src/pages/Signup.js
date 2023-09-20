import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Signup.scss';

const SignUpPage = () => {
    const [username, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async () => {
        if (!username || !email || !password) {
            alert("Please fill in the registration information");
        } else {
            try {
                const response = await fetch("http://127.0.0.1:8000/api/register", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        username: username,
                        email: email,
                        password: password,
                    }),
                });

                const data = await response.json();

                if (response.status === 201) { // Assuming 201 is a successful registration status
                    alert("Registration successful! Please login.");
                    navigate('/login');
                } else {
                    // Handle any potential errors received from the server
                    alert(data.error || "An error occurred while registering.");
                }
            } catch (error) {
                console.error("Error while registering:", error);
                alert("An error occurred. Please try again.");
            }
        }
    };

    return (
        <div style={{ marginBottom: '150px' }}>
            <div className="topimg">
                <h1>FRACAS<br />SIGN UP</h1>
            </div>
            <h1 className="w" style={{ marginTop: '40px', textAlign: 'center' }}>Sign Up</h1>
            <div className="loginbox w">
                <span className="icon">
                    <img src="/images/register.png" alt="icon" />
                </span>
                <h4 style={{ color: 'rgba(20, 137, 233, 0.6)', textAlign: 'center', fontSize: '30px' }}>Welcome!</h4>
                <p style={{ color: 'rgb(119, 119, 119)', textAlign: 'center', fontSize: '17px' }}>Create a new account</p>
                <div className="inpbox w">
                    <div className="inp">
                        <span>User Name</span>
                        <br />
                        <input type="text" placeholder="Please enter your username" value={username} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="inp">
                        <span>E-mail</span>
                        <br />
                        <input type="text" placeholder="Please enter your Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="inp">
                        <span>Password</span>
                        <br />
                        <input type="password" placeholder="Please enter your Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <button onClick={handleSubmit}>Register</button>
                    <span className="s1">Forgot password?</span>
                    <span className="s2">
                        <Link to="/login">Already have an account? Sign In</Link> 
                    </span>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;

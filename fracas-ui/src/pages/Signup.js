import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Signup.scss';

const SignUpPage = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [team, setTeam] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async () => {
        if (!firstName || !lastName || !team || !email || !password || !confirmPassword) {
            alert("Please fill in the registration information");
        } else if (password !== confirmPassword) {
            alert("Passwords do not match");
        } else {
            try {
                const response = await fetch("http://127.0.0.1:8000/api/register", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        first_name: firstName,
                        last_name: lastName,
                        email: email,
                        team: team,
                        password1: password,
                        password2: confirmPassword,
                    }),
                });

                const data = await response.json();

                if (response.status === 201) {
                    alert("Registration successful! Please login.");
                    navigate('/login');
                } else {
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
                        <span>First Name</span>
                        <input type="text" placeholder="Please enter your First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                    </div>
                    <div className="inp">
                        <span>Last Name</span>
                        <input type="text" placeholder="Please enter your Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                    </div>
                    <div className="inp">
                        <span>Team</span>
                        <input type="text" placeholder="Please enter your Team" value={team} onChange={(e) => setTeam(e.target.value)} />
                    </div>
                    <div className="inp">
                        <span>Email</span>
                        <input type="text" placeholder="Please enter your Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="inp">
                        <span>Password</span>
                        <input type="password" placeholder="Please enter your Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div className="inp">
                        <span>Confirm Password</span>
                        <input type="password" placeholder="Please re-enter your Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
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

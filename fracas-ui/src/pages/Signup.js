import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Signup.scss';

const SignUpPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const handleSubmit = () => {
        if (!name || !email || !password) {
            alert("Please fill in the registration information");
        } else {
            // For the sake of this example, we'll just log the name.
            console.log(name);
            // Redirecting using React Router's history
            navigate('/userdashboard');
        }
    };

    return (
        <div style={{ marginBottom: '150px' }}>
            <div className="topimg">
                <h1>FRACAS<br />SIGN IN</h1>
            </div>
            <h1 className="w" style={{ marginTop: '40px', textAlign: 'center' }}>Sign in</h1>
            <div className="loginbox w">
                <span className="icon">
                    <img src="/images/register.png" alt="icon" />
                </span>
                <h4 style={{ color: 'rgba(20, 137, 233, 0.6)', textAlign: 'center', fontSize: '30px' }}>Welcome!</h4>
                <p style={{ color: 'rgb(119, 119, 119)', textAlign: 'center', fontSize: '17px' }}>Sign in to your account</p>
                <div className="inpbox w">
                    <div className="inp">
                        <span>*Name</span>
                        <br />
                        <input type="text" placeholder="Please enter your name" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="inp">
                        <span>*E-mail</span>
                        <br />
                        <input type="text" placeholder="Please enter your Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="inp">
                        <span>*Password</span>
                        <br />
                        <input type="password" placeholder="Please enter your Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <button onClick={handleSubmit}>Log in</button>
                    <span className="s1">forgot password?</span>
                    <span className="s2">
                        <Link to="/login">Have an account</Link> 
                    </span>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/ForgotPassword.scss';

const ForgotPassword = () => {

    const [email, setEmail] = useState('');
    const [confirmMessage, setConfirmMessage] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async () => {
        try {
            const response = await fetch("http://127.0.0.1:8000/auth/users/reset_email/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                }),
            });

            if (response.status === 204) {
                console.log("enter")
                setConfirmMessage(true)
            } else {
                alert("An error occurred while sending the email.");
            }
        } catch (error) {
            console.error("Error while registering:", error);
            alert("An error occurred. Please try again.");
        }
    }
    return (
        <div className='fp-container'>
            <div className='top-img'>
                <h1>FRACAS <br /> FORGOT PASSWORD</h1>
            </div>
            <h1 className='fp-w fp-heading'>Forgot Password</h1>
            <div className='fp-box fp-w'>
                <div className='inpbox fp-w'>
                    <div className="inp">
                        <span>Email</span>
                        <input type="text" placeholder="Please enter your Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <button onClick={handleSubmit}>Submit</button>
                    {confirmMessage === true && (
                        <div className='confirm'>
                            <span>An email to reset your password has been sent to your registered email id.</span>
                        </div>
                    )}
                    <div className='create'>
                        Don't have an account? <Link className='link' to="/signup">Create account</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword;
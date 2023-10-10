import React from 'react';
import '../styles/HomePage.scss';

const HomePage = () => {
    return (
        <div>
            <div className="topbox">
            </div>
            <div className="main w">
                <div className="left">
                    <span>What We Do</span>
                    <h4>Failure, Reporting, Analysis and Corrective Action System</h4>
                </div>
                <div className="center">
                    <div className="top">
                        <p>Transfer experience and technical knowledge</p>
                    </div>
                    <div className="bot">
                        <p>Speed up the training of new members.</p>
                    </div>
                </div>
                <div className="right">
                    <div className="top">
                        <p>Proper system for knowledge management and transfer</p>
                    </div>
                    <div className="bot">
                        <p>Reveal annually repeating failures</p>
                    </div>
                </div>
            </div>
            <div className="imgbox">
                {/* <img src="/images/team.png" alt="" /> */}
            </div>
        </div>
    );
}

export default HomePage;

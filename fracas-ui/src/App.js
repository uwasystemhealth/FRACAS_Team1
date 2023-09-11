import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from './pages/HomePage';
import Login from "./pages/Login";
import SignUpPage from "./pages/Signup";
import UserDashboard from "./pages/UserDashboard";
import Report from "./pages/Report";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/userdashboard" element={<UserDashboard />} />
        <Route path="/report" element={<Report />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;

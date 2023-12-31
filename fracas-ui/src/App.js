import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from './pages/HomePage';
import Login from "./pages/Login";
import SignUpPage from "./pages/Signup";
import Activation from "./pages/Activation";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Report from "./pages/Report";
import SearchReports from "./pages/SearchReports";
import ViewEdit from "./pages/ViewEdit";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import { AuthProvider } from "./components/useAuth";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <AuthProvider> {/* Wrap your Router with AuthProvider */}
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/activate/:uid/:token" element={<Activation />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/password/reset/confirm/:uid/:token" element={<ResetPassword />} />
          <Route path="/userdashboard" element={<ProtectedRoute element={<UserDashboard />} />} />
          <Route path="/admindashboard" element={<ProtectedRoute element={<AdminDashboard />} />} />
          <Route path="/report" element={<ProtectedRoute element={<Report />} />} />
          <Route path="/search" element={<ProtectedRoute element={<SearchReports />} />} />
          <Route path="/view" element={<ProtectedRoute element={<ViewEdit />} />} />
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;

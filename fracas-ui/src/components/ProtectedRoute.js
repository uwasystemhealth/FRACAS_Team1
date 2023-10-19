// ProtectedRoute.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth'; 

const ProtectedRoute = ({ element }) => {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.isAuthenticated) {
      navigate("/login");
    }
  }, [auth.isAuthenticated, navigate]);

  return (
    <>
      {auth.isAuthenticated && element}
    </>
  );
};

export default ProtectedRoute;

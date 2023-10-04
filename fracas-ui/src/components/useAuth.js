// useAuth.js
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const auth = useProvideAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

function useProvideAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  const authenticate = (token) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
  };

  const signout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return {
    isAuthenticated,
    authenticate,
    signout
  };
}

export const useAuth = () => {
  return useContext(AuthContext);
};

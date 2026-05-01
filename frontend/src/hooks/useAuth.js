import { useState } from 'react';

export const useAuth = () => {
  const [token, setToken] = useState(null);
  const [isExpired, setIsExpired] = useState(false);

  const setAuth = (token) => {
    setToken(token);
    localStorage.setItem('token', token);
  };

  const clearAuth = () => {
    localStorage.removeItem('token');
  };

  const isAuthenticated = () => {
    return !!token && !isExpired;
  };

  return { token, setAuth, clearAuth, isAuthenticated };
};
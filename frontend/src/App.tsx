import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
export function App() {
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (location.pathname === '/' && isAuthenticated) {
      navigate('/dashboard');
    } else if (location.pathname === '/' && !isAuthenticated) {
      navigate('/login');
    }
  }, [navigate, location]);
  return null;
}
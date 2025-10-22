import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { App } from './App';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
function ProtectedRoute({
  children
}: {
  children: React.ReactNode;
}) {
  const isAuthenticated = localStorage.getItem('isAuthenticated');
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}
export function AppRouter() {
  return <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>} />
      </Routes>
    </BrowserRouter>;
}
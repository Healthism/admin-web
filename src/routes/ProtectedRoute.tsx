import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const reduxToken = useSelector((state: any) => state.auth?.token);
  const token = reduxToken || localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

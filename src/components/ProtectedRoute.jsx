import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const ProtectedRoute = ({ children, roles }) => {
  const { user } = useContext(AuthContext);
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (roles && !roles.includes(user.role) && user.role !== 'admin') {
    // optional: redirect to a "not authorized" page or login
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;

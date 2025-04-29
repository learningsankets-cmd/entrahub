// src/routes/ProtectedRoute.jsx
import { useIsAuthenticated } from '@azure/msal-react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useIsAuthenticated();

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;

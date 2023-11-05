import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element, allowedRoles }) => {
  const isLoggedIn = localStorage.getItem('token') !== null;

  const userRole = localStorage.getItem('role');

  // Check if the user's role is allowed for this route
  const isRoleAllowed = allowedRoles.includes(userRole);

  if (!isLoggedIn) {
    // Redirect to the login page if not logged in
    return <Navigate to="/Log-in" />;
  }

  if (!isRoleAllowed) {
    // Redirect to an unauthorized page if the user's role is not allowed
    return <Navigate to="/unauthorized" />;
  }

  return element;
};

export default ProtectedRoute;

import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const PrivateRoute = ({ element: Element, ...rest }) => {
  const isAuthenticated = localStorage.getItem('token') !== null;

  return (
    <Route
      {...rest}
      element={isAuthenticated ? <Element /> : <Navigate to="/Log-in" replace />}
    />
  );
};

export default PrivateRoute;

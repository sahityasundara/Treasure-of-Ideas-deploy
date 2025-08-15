// client/src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const userInfo = localStorage.getItem('userInfo');
  // If user info exists, render the child component (the protected page).
  // Otherwise, navigate to the login page.
  return userInfo ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
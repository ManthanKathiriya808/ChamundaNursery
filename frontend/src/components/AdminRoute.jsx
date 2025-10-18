import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import LoadingSpinner from './LoadingSpinner';

const AdminRoute = ({ children }) => {
  const { user, isLoaded } = useUser();

  // Show loading while Clerk loads
  if (!isLoaded) {
    return <LoadingSpinner size="large" text="Checking permissions..." />;
  }

  // Check if user is admin
  const isAdmin = user?.publicMetadata?.role === 'admin';
  
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
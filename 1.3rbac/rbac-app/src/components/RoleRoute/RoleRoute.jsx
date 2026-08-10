// RoleRoute
// Wrap any route that requires a specific role (or set of roles).
// If the user's role isn't allowed, redirect to /unauthorized.

import { Navigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const RoleRoute = ({ allowedRoles, children }) => {
  const { role, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div style={{ padding: 24 }}>Loading...</div>;
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles || !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default RoleRoute;

// ProtectedRoute
// Wrap any route that requires the user to be authenticated.
// Unauthenticated users are sent to /login.

import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    // Brief flash while we rehydrate from localStorage.
    return <div style={{ padding: 24 }}>Loading...</div>;
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;

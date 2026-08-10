// App.jsx
// Top-level component that wires up routing, providers, and the navbar.

import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, default as AuthContext } from "./context/AuthContext";
import { useContext } from "react";

import Navbar from "./components/Navbar/Navbar";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import RoleRoute from "./components/RoleRoute/RoleRoute";

import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import Posts from "./pages/Posts/Posts";
import Users from "./pages/Users/Users";
import TokenInspector from "./pages/TokenInspector/TokenInspector";
import Unauthorized from "./pages/Unauthorized/Unauthorized";
import NotFound from "./pages/NotFound/NotFound";

// Layout for authenticated pages — shows navbar only when logged in.
const Shell = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const location = useLocation();

  // Hide navbar on login page
  const isLogin = location.pathname === "/login";
  const showNav = isAuthenticated() && !isLogin;

  return (
    <div className="app-shell">
      {showNav && <Navbar />}
      {children}
    </div>
  );
};

const AppRoutes = () => (
  <Shell>
    <Routes>
      {/* Public route */}
      <Route path="/login" element={<Login />} />

      {/* Protected routes (any authenticated user) */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/posts"
        element={
          <ProtectedRoute>
            <Posts />
          </ProtectedRoute>
        }
      />
      <Route
        path="/token"
        element={
          <ProtectedRoute>
            <TokenInspector />
          </ProtectedRoute>
        }
      />

      {/* Admin-only routes */}
      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["admin"]}>
              <Users />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      {/* Standalone pages */}
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Default + 404 */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Shell>
);

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  </BrowserRouter>
);

export default App;
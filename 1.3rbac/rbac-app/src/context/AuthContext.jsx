// AuthContext
// Provides global auth state and actions to the entire app.
// On mount, we rehydrate from localStorage so the session survives refreshes.

import { createContext, useEffect, useState } from "react";
import { storage } from "../utils/storage";
import { login as loginSvc, logout as logoutSvc, verifyToken } from "../utils/auth";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Rehydrate session on mount
  useEffect(() => {
    const storedToken = storage.getToken();
    const storedUser = storage.getUser();

    if (storedToken && storedUser) {
      const payload = verifyToken(storedToken);
      if (payload) {
        // Token is valid — restore session
        setToken(storedToken);
        setUser(storedUser);
      } else {
        // Token expired or invalid — clear it
        storage.clear();
        setUser(null);
        setToken(null);
      }
    }
    setLoading(false);
  }, []);

  // Periodic expiration check — every 30s, in case the tab stays open.
  useEffect(() => {
    if (!token) return;
    const interval = setInterval(() => {
      const payload = verifyToken(token);
      if (!payload) {
        // Token expired. Auto-logout.
        setUser(null);
        setToken(null);
      }
    }, 30 * 1000);
    return () => clearInterval(interval);
  }, [token]);

  const login = (username, password) => {
    const result = loginSvc(username, password);
    if (result.success) {
      setUser(result.user);
      setToken(result.token);
    }
    return result;
  };

  const logout = () => {
    logoutSvc();
    setUser(null);
    setToken(null);
  };

  const isAuthenticated = () => Boolean(user && token);

  const value = {
    user,
    token,
    role: user?.role || null,
    loading,
    login,
    logout,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;

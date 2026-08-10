// Login page
// Username + password form. On success, redirect to the originally-requested page
// (or /dashboard by default).

import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    const result = login(username.trim(), password);
    if (!result.success) {
      setError(result.error || "Invalid Username or Password.");
      return;
    }
    const dest = location.state?.from?.pathname || "/dashboard";
    navigate(dest, { replace: true });
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>RBAC Login</h1>
        <p className="subtitle">Sign in to continue</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. admin1"
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="admin123 / editor123 / viewer123"
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="btn" style={{ width: "100%" }}>
            Sign In
          </button>

          {error && <div className="error-text">{error}</div>}
        </form>

        <div className="hint">
          <strong>Demo credentials:</strong>
          <div>Admin: <code>admin1</code> / <code>admin123</code></div>
          <div>Editor: <code>editor1</code> / <code>editor123</code></div>
          <div>Viewer: <code>viewer1</code> / <code>viewer123</code></div>
        </div>
      </div>
    </div>
  );
};

export default Login;

// Navbar
// Renders links based on the current user's role.
// Admin sees Users link; Editors/Viewers don't.

import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const NavLink = ({ to, label }) => (
  <Link to={to} style={{ marginRight: 12, color: "#fff" }}>
    {label}
  </Link>
);

const RoleBadge = ({ role }) => {
  const cls = `badge badge-${role || "viewer"}`;
  return <span className={cls}>{role || "guest"}</span>;
};

const Navbar = () => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <nav
      style={{
        background: "#1e293b",
        color: "#fff",
        padding: "10px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <strong style={{ marginRight: 16 }}>RBAC Demo</strong>
        <NavLink to="/dashboard" label="Dashboard" />
        <NavLink to="/posts" label="Posts" />
        {role === "admin" && <NavLink to="/users" label="Users" />}
        <NavLink to="/token" label="Token" />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 13 }}>
          {user?.username}
        </span>
        <RoleBadge role={role} />
        <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

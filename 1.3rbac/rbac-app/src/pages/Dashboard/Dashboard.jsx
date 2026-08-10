// Dashboard
// Shows welcome info, role, auth status, token status, expiration,
// total users, total posts, and a permissions list for the current role.

import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { decodeToken, isTokenExpired } from "../../utils/auth";
import users from "../../data/users";
import { postsStorage } from "../../utils/storage";
import posts from "../../data/posts";

const PERMISSIONS = {
  admin: [
    "View Posts",
    "Create Posts",
    "Edit Posts",
    "Delete Posts",
    "View Users",
    "View Token Inspector",
    "Access every page",
  ],
  editor: [
    "View Posts",
    "Create Posts",
    "Edit Posts (own posts)",
    "View Token Inspector",
    "Cannot delete posts",
    "Cannot view Users",
  ],
  viewer: [
    "View Posts",
    "View Dashboard",
    "View Token Inspector",
    "Cannot create / edit / delete",
    "Cannot view Users",
  ],
};

const formatTs = (seconds) => {
  if (!seconds) return "-";
  try {
    return new Date(seconds * 1000).toLocaleString();
  } catch {
    return "-";
  }
};

const Dashboard = () => {
  const { user, role, token } = useAuth();
  const [postCount, setPostCount] = useState(posts.length);

  // Compute token stats. We recompute on every render so the timer "ticks".
  // Force re-render every second to show the live countdown.
  const [, setTick] = useState(0);
  useEffect(() => {
    const i = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(i);
  }, []);

  const decoded = token ? decodeToken(token) : null;
  const expired = token ? isTokenExpired(token) : true;
  const exp = decoded?.payload?.exp;
  const iat = decoded?.payload?.iat;

  // Hydrate post count from localStorage if present
  useEffect(() => {
    const stored = postsStorage.getAll();
    if (Array.isArray(stored)) setPostCount(stored.length);
  }, []);

  const remainingSeconds = exp ? Math.max(0, exp - Math.floor(Date.now() / 1000)) : 0;
  const perms = PERMISSIONS[role] || [];

  return (
    <div className="page">
      <h2 className="page-title">Dashboard</h2>

      <div className="card-grid">
        <div className="card">
          <div className="label">Welcome</div>
          <div className="value-large">{user?.username || "-"}</div>
        </div>
        <div className="card">
          <div className="label">Role</div>
          <div className="value-large">
            <span className={`badge badge-${role}`}>{role}</span>
          </div>
        </div>
        <div className="card">
          <div className="label">Auth Status</div>
          <div className="value">
            <span
              className={`status-dot ${expired ? "status-expired" : "status-active"}`}
            ></span>
            {expired ? "Expired" : "Authenticated"}
          </div>
        </div>
        <div className="card">
          <div className="label">Token Status</div>
          <div className="value">
            {token ? (
              <span className="badge badge-status">Issued</span>
            ) : (
              <span className="badge badge-expired">Missing</span>
            )}
          </div>
        </div>
        <div className="card">
          <div className="label">Issued At</div>
          <div className="value">{formatTs(iat)}</div>
        </div>
        <div className="card">
          <div className="label">Expires At</div>
          <div className="value">{formatTs(exp)}</div>
        </div>
        <div className="card">
          <div className="label">Time Remaining</div>
          <div className="value">
            {expired ? "0s" : `${remainingSeconds}s`}
          </div>
        </div>
        <div className="card">
          <div className="label">Total Users</div>
          <div className="value-large">{users.length}</div>
        </div>
        <div className="card">
          <div className="label">Total Posts</div>
          <div className="value-large">{postCount}</div>
        </div>
      </div>

      <div className="card mt-16">
        <div className="label mb-8">Permissions for your role</div>
        <ul className="perms-list">
          {perms.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
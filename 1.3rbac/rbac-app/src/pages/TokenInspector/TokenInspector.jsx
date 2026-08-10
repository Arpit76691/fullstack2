// Token Inspector
// Decodes and displays the simulated JWT in a human-readable format.

import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { decodeToken, isTokenExpired } from "../../utils/auth";

const formatTs = (seconds) => {
  if (!seconds) return "-";
  try {
    return new Date(seconds * 1000).toLocaleString();
  } catch {
    return "-";
  }
};

const TokenInspector = () => {
  const { token, user, role } = useAuth();
  const [, setTick] = useState(0);

  // Refresh every second so expiration/remaining time stay current
  useEffect(() => {
    const i = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(i);
  }, []);

  if (!token) {
    return (
      <div className="page">
        <h2 className="page-title">Token Inspector</h2>
        <div className="card">
          <p>No token found. Please log in.</p>
        </div>
      </div>
    );
  }

  const decoded = decodeToken(token);
  const expired = isTokenExpired(token);
  const payload = decoded?.payload || {};
  const header = decoded?.header || {};
  const remaining = payload.exp
    ? Math.max(0, payload.exp - Math.floor(Date.now() / 1000))
    : 0;

  return (
    <div className="page">
      <h2 className="page-title">Token Inspector</h2>

      <div className="card">
        <div className="token-section">
          <h3>Raw Token</h3>
          <div className="token-block">{token}</div>
        </div>

        <div className="token-section">
          <h3>Header</h3>
          <div className="token-block">
            {JSON.stringify(header, null, 2)}
          </div>
        </div>

        <div className="token-section">
          <h3>Payload</h3>
          <div className="token-block">
            {JSON.stringify(payload, null, 2)}
          </div>
        </div>

        <div className="token-section">
          <h3>Signature</h3>
          <div className="token-block">{decoded?.signature || "-"}</div>
          <p className="text-muted" style={{ fontSize: 12, marginTop: 6 }}>
            Note: This JWT is simulated because there is no backend. The signature
            is a static placeholder and is not cryptographically verified.
          </p>
        </div>

        <div className="token-section">
          <h3>Metadata</h3>
          <div className="card-grid">
            <div className="card">
              <div className="label">Issued At</div>
              <div className="value">{formatTs(payload.iat)}</div>
            </div>
            <div className="card">
              <div className="label">Expires At</div>
              <div className="value">{formatTs(payload.exp)}</div>
            </div>
            <div className="card">
              <div className="label">Remaining</div>
              <div className="value">{expired ? "Expired" : `${remaining}s`}</div>
            </div>
            <div className="card">
              <div className="label">Status</div>
              <div className="value">
                <span className={`badge ${expired ? "badge-expired" : "badge-status"}`}>
                  {expired ? "Expired" : "Valid"}
                </span>
              </div>
            </div>
            <div className="card">
              <div className="label">User ID</div>
              <div className="value">{payload.id ?? "-"}</div>
            </div>
            <div className="card">
              <div className="label">Username</div>
              <div className="value">{payload.username || "-"}</div>
            </div>
            <div className="card">
              <div className="label">Role</div>
              <div className="value">
                <span className={`badge badge-${role}`}>{role || "-"}</span>
              </div>
            </div>
            <div className="card">
              <div className="label">Current User</div>
              <div className="value">{user?.username || "-"}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenInspector;
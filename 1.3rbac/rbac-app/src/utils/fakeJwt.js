// Simulated JWT
// This JWT is simulated because there is no backend.
// We don't use the jsonwebtoken package. We only need to:
//   1. Pack the header/payload into Base64.
//   2. Join them with a fake signature: "frontend-demo-signature".
// This is purely for educational purposes — DO NOT use in production.

const FAKE_SIGNATURE = "frontend-demo-signature";

// Base64URL-safe encode (browser-safe).
// We use btoa and then swap +/= for -_ to mimic JWT's URL-safe alphabet.
const base64UrlEncode = (str) => {
  const json = typeof str === "string" ? str : JSON.stringify(str);
  const b64 = btoa(unescape(encodeURIComponent(json)));
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

const base64UrlDecode = (str) => {
  // Add padding back
  let padded = str.replace(/-/g, "+").replace(/_/g, "/");
  const pad = padded.length % 4;
  if (pad) padded += "=".repeat(4 - pad);
  const decoded = decodeURIComponent(escape(atob(padded)));
  try {
    return JSON.parse(decoded);
  } catch {
    return null;
  }
};

// Generate a fake JWT with the given payload.
// The payload should include iat and exp (in seconds).
export const generateFakeJwt = (payload, expiresInSeconds = 3600) => {
  const header = { alg: "HS256", typ: "JWT" };

  const now = Math.floor(Date.now() / 1000);
  const fullPayload = {
    id: payload.id,
    username: payload.username,
    role: payload.role,
    iat: now,
    exp: now + expiresInSeconds,
  };

  const encodedHeader = base64UrlEncode(header);
  const encodedPayload = base64UrlEncode(fullPayload);
  const signature = FAKE_SIGNATURE;

  return `${encodedHeader}.${encodedPayload}.${signature}`;
};

// Decode a fake JWT into its parts without verification.
// Returns { header, payload, signature } or null on malformed input.
export const decodeFakeJwt = (token) => {
  if (!token || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;

  const header = base64UrlDecode(parts[0]);
  const payload = base64UrlDecode(parts[1]);
  const signature = parts[2];

  return { header, payload, signature };
};

// Check whether the token's exp is in the past.
export const isTokenExpired = (token) => {
  const decoded = decodeFakeJwt(token);
  if (!decoded || !decoded.payload || !decoded.payload.exp) return true;
  const now = Math.floor(Date.now() / 1000);
  return decoded.payload.exp < now;
};

export { FAKE_SIGNATURE };

// Authentication helpers
// All authentication is simulated because there is no backend.
// We:
//   1. Look up users in the dummy users database.
//   2. Issue a fake JWT containing user info + exp.
//   3. Persist token + user in localStorage.

import users from "../data/users";
import { storage } from "./storage";
import {
  generateFakeJwt,
  decodeFakeJwt,
  isTokenExpired,
} from "./fakeJwt";

// Re-export so callers can import everything from utils/auth.
export { isTokenExpired };

// Default token lifetime: 1 hour. Stored alongside the token for clarity.
const TOKEN_TTL_SECONDS = 60 * 60;

// Find a user by username + password.
// Returns the user (without password) or null.
const findUser = (username, password) => {
  const match = users.find(
    (u) => u.username === username && u.password === password
  );
  if (!match) return null;
  // Strip the password before returning
  const { password: _pw, ...safe } = match;
  return safe;
};

// Log the user in: create a fake JWT, persist it, return user + token.
export const login = (username, password) => {
  const user = findUser(username, password);
  if (!user) {
    return { success: false, error: "Invalid Username or Password." };
  }

  const token = generateFakeJwt(
    { id: user.id, username: user.username, role: user.role },
    TOKEN_TTL_SECONDS
  );

  storage.setToken(token);
  storage.setUser(user);

  return { success: true, user, token };
};

// Clear session storage and tell the caller to navigate to /login.
export const logout = () => {
  storage.clear();
  return { success: true };
};

// Verify the token: returns decoded payload if valid, otherwise null.
// If expired, clear local session so the user is logged out.
export const verifyToken = (token) => {
  if (!token) return null;
  if (isTokenExpired(token)) {
    storage.clear();
    return null;
  }
  const decoded = decodeFakeJwt(token);
  return decoded?.payload || null;
};

export const decodeToken = (token) => decodeFakeJwt(token);

// Simple boolean check used by routes/components.
export const isAuthenticated = () => {
  const token = storage.getToken();
  if (!token) return false;
  return Boolean(verifyToken(token));
};

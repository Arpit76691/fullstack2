// LocalStorage helpers
// Centralized wrappers so we don't sprinkle raw localStorage calls everywhere.

const TOKEN_KEY = "rbac_token";
const USER_KEY = "rbac_user";

export const storage = {
  // Token
  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: (token) => localStorage.setItem(TOKEN_KEY, token),
  removeToken: () => localStorage.removeItem(TOKEN_KEY),

  // User
  getUser: () => {
    const raw = localStorage.getItem(USER_KEY);
    try {
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
  setUser: (user) => localStorage.setItem(USER_KEY, JSON.stringify(user)),
  removeUser: () => localStorage.removeItem(USER_KEY),

  // Clear everything auth-related
  clear: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};

// Posts persistence (separate from auth)
const POSTS_KEY = "rbac_posts";

export const postsStorage = {
  getAll: () => {
    const raw = localStorage.getItem(POSTS_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },
  setAll: (posts) => localStorage.setItem(POSTS_KEY, JSON.stringify(posts)),
  clear: () => localStorage.removeItem(POSTS_KEY),
};

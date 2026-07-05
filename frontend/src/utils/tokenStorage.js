// Thin wrapper around localStorage for the JWT issued by /api/auth/login
// and /api/auth/signup. Kept isolated so the storage mechanism can change
// (e.g. httpOnly cookie) without touching every consumer.
const TOKEN_KEY = "interviewos_token";

export const tokenStorage = {
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
  },

  clearToken() {
    localStorage.removeItem(TOKEN_KEY);
  },

  isAuthenticated() {
    return Boolean(localStorage.getItem(TOKEN_KEY));
  },
};
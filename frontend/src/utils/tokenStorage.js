// Thin wrapper around localStorage for the JWT + email issued by
// /api/auth/login and /api/auth/signup. Kept isolated so the storage
// mechanism can change (e.g. httpOnly cookie) without touching every
// consumer (axiosClient, AuthContext, ProtectedRoute).
const TOKEN_KEY = "interviewos_token";
const EMAIL_KEY = "interviewos_email";

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

  getEmail() {
    return localStorage.getItem(EMAIL_KEY);
  },

  setEmail(email) {
    localStorage.setItem(EMAIL_KEY, email);
  },

  clearEmail() {
    localStorage.removeItem(EMAIL_KEY);
  },

  // Convenience helpers used by AuthContext so a login/signup/logout is
  // always a single atomic-looking call from the caller's perspective.
  setSession(token, email) {
    this.setToken(token);
    this.setEmail(email);
  },

  clearSession() {
    this.clearToken();
    this.clearEmail();
  },

  isAuthenticated() {
    return Boolean(localStorage.getItem(TOKEN_KEY));
  },
};
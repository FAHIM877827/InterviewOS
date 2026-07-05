import axios from "axios";
import { API_BASE_URL } from "../config/env";
import { tokenStorage } from "../utils/tokenStorage";

// Single axios instance for the whole app. All API modules added in later
// commits (auth, profile, analytics, dashboard) should import this instead
// of creating their own axios instance.
const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach the JWT (if present) to every outgoing request, matching the
// "Authorization: Bearer <token>" scheme read by JwtAuthenticationFilter.
axiosClient.interceptors.request.use((config) => {
  const token = tokenStorage.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// On a 401 (invalid/expired token per JwtUtil.isTokenValid), clear the
// stored token so ProtectedRoute sends the user back to /login on next
// navigation instead of retrying with a dead token.
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      tokenStorage.clearToken();
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
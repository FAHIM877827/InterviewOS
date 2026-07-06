import axios from "axios";
import { API_BASE_URL } from "../config/env";
import { tokenStorage } from "../utils/tokenStorage";

// Single axios instance for the whole app. All API modules (auth, and
// profile/analytics/dashboard in later commits) import this instead of
// creating their own axios instance.
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
// stored session. A custom "auth:logout" event is dispatched so
// AuthContext (which holds React state, not just localStorage) resets
// immediately even within the same tab - the native "storage" event only
// fires for other tabs.
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      tokenStorage.clearSession();
      window.dispatchEvent(new Event("auth:logout"));
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
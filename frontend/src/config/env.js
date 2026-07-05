// Centralized access to build-time environment variables.
// Vite only exposes variables prefixed with VITE_ to client code.
export const API_BASE_URL =
import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";
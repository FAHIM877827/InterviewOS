import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { loginRequest, signupRequest } from "../api/authApi";
import { tokenStorage } from "../utils/tokenStorage";

const AuthContext = createContext(undefined);

// Single source of truth for auth state. Wraps the app once in App.jsx so
// Navbar, ProtectedRoute, Login, and Signup all read/update the same state
// instead of each reaching into localStorage independently.
export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => tokenStorage.getToken());
  const [email, setEmail] = useState(() => tokenStorage.getEmail());

  const isAuthenticated = Boolean(token);

  const login = useCallback(async (credentials) => {
    const response = await loginRequest(credentials);
    const { token: newToken, email: userEmail } = response.data;
    tokenStorage.setSession(newToken, userEmail);
    setToken(newToken);
    setEmail(userEmail);
    return response.data;
  }, []);

  const signup = useCallback(async (credentials) => {
    const response = await signupRequest(credentials);
    const { token: newToken, email: userEmail } = response.data;
    tokenStorage.setSession(newToken, userEmail);
    setToken(newToken);
    setEmail(userEmail);
    return response.data;
  }, []);

  const logout = useCallback(() => {
    tokenStorage.clearSession();
    setToken(null);
    setEmail(null);
  }, []);

  // Stay in sync if the session is cleared elsewhere: axiosClient's 401
  // interceptor (same tab, via the "auth:logout" custom event) or another
  // browser tab logging out (native "storage" event).
  useEffect(() => {
    const syncFromStorage = () => {
      setToken(tokenStorage.getToken());
      setEmail(tokenStorage.getEmail());
    };

    window.addEventListener("auth:logout", syncFromStorage);
    window.addEventListener("storage", syncFromStorage);

    return () => {
      window.removeEventListener("auth:logout", syncFromStorage);
      window.removeEventListener("storage", syncFromStorage);
    };
  }, []);

  const value = useMemo(
    () => ({ token, email, isAuthenticated, login, signup, logout }),
    [token, email, isAuthenticated, login, signup, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
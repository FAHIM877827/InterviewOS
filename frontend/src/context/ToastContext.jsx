import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

const ToastContext = createContext(undefined);

const DEFAULT_DURATION_MS = 4000;
let idCounter = 0;

// Lightweight, dependency-free toast system (no external library) so it
// stays consistent with the rest of the app's hand-rolled state management
// (AuthContext, tokenStorage) instead of pulling in a new npm package for
// something this small. Rendered via <ToastContainer /> in App.jsx.
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Map());

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
    const timeoutId = timers.current.get(id);
    if (timeoutId) {
      clearTimeout(timeoutId);
      timers.current.delete(id);
    }
  }, []);

  const showToast = useCallback(
    (type, message, duration = DEFAULT_DURATION_MS) => {
      const id = ++idCounter;
      setToasts((prev) => [...prev, { id, type, message }]);

      const timeoutId = setTimeout(() => dismissToast(id), duration);
      timers.current.set(id, timeoutId);

      return id;
    },
    [dismissToast]
  );

  const showSuccess = useCallback(
    (message, duration) => showToast("success", message, duration),
    [showToast]
  );
  const showError = useCallback(
    (message, duration) => showToast("error", message, duration),
    [showToast]
  );

  const value = useMemo(
    () => ({ toasts, showSuccess, showError, dismissToast }),
    [toasts, showSuccess, showError, dismissToast]
  );

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
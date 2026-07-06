import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROUTE_PATHS } from "../constants/routePaths";

// Wraps any route element that requires a logged-in user. Redirects to
// /login and remembers the attempted location in router state so Login
// can send the user back after a successful sign-in.
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={ROUTE_PATHS.LOGIN} state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute;
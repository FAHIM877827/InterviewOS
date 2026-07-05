import { Navigate } from "react-router-dom";
import { tokenStorage } from "../utils/tokenStorage";
import { ROUTE_PATHS } from "../constants/routePaths";

// Wraps any route element that requires a logged-in user. Not yet used in
// AppRoutes because no protected pages exist until Commit 9/10, but it's
// wired up now so those commits only need to add:
//   <Route path={ROUTE_PATHS.DASHBOARD} element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
function ProtectedRoute({ children }) {
  if (!tokenStorage.isAuthenticated()) {
    return <Navigate to={ROUTE_PATHS.LOGIN} replace />;
  }

  return children;
}

export default ProtectedRoute;
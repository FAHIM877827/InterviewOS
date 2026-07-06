import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Dashboard from "../pages/Dashboard";
import NotFound from "../pages/NotFound";
import ProtectedRoute from "./ProtectedRoute";
import { ROUTE_PATHS } from "../constants/routePaths";

// Dashboard is a minimal authenticated placeholder for now; the full
// analytics dashboard UI (Commit 10) will replace its contents without
// needing any route changes here.
function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path={ROUTE_PATHS.HOME} element={<Home />} />
        <Route path={ROUTE_PATHS.LOGIN} element={<Login />} />
        <Route path={ROUTE_PATHS.SIGNUP} element={<Signup />} />
        <Route
          path={ROUTE_PATHS.DASHBOARD}
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path={ROUTE_PATHS.NOT_FOUND} element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
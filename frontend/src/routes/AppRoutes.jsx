import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";
import { ROUTE_PATHS } from "../constants/routePaths";

// Only public, placeholder routes exist for now. Login/signup pages
// (Commit 9) and the dashboard page (Commit 10) will be added as children
// here, with the dashboard route wrapped in <ProtectedRoute>.
function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path={ROUTE_PATHS.HOME} element={<Home />} />
        <Route path={ROUTE_PATHS.NOT_FOUND} element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
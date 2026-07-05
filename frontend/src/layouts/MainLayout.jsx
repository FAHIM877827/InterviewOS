import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar";

// Shared shell for every route: navbar + centered content area rendered
// through <Outlet />. AppRoutes nests all page routes under this layout.
function MainLayout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
import { Link } from "react-router-dom";
import { ROUTE_PATHS } from "../constants/routePaths";

function NotFound() {
  return (
    <section className="flex flex-col items-center gap-3 py-16 text-center">
      <h1 className="text-2xl font-bold text-slate-900">404 - Page Not Found</h1>
      <p className="text-slate-600">The page you&apos;re looking for doesn&apos;t exist yet.</p>
      <Link to={ROUTE_PATHS.HOME} className="text-indigo-600 hover:underline">
        Back to Home
      </Link>
    </section>
  );
}

export default NotFound;
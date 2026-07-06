import { Link } from "react-router-dom";
import { ROUTE_PATHS } from "../constants/routePaths";

function NotFound() {
  return (
    <section className="mx-auto flex max-w-md flex-col items-center gap-4 py-20 text-center">
      <p className="text-6xl font-bold text-indigo-600">404</p>
      <h1 className="text-2xl font-bold text-slate-900">Page not found</h1>
      <p className="text-sm text-slate-600">
        The page you&apos;re looking for doesn&apos;t exist or may have been moved.
      </p>
      <Link
        to={ROUTE_PATHS.HOME}
        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
      >
        Back to home
      </Link>
    </section>
  );
}

export default NotFound;
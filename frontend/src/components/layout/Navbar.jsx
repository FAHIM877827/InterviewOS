import { Link } from "react-router-dom";
import { ROUTE_PATHS } from "../../constants/routePaths";

function Navbar() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link to={ROUTE_PATHS.HOME} className="text-lg font-semibold text-slate-900">
          Interview<span className="text-indigo-600">OS</span>
        </Link>

        <div className="flex items-center gap-6 text-sm font-medium text-slate-600">
          <Link to={ROUTE_PATHS.HOME} className="transition-colors hover:text-indigo-600">
            Home
          </Link>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
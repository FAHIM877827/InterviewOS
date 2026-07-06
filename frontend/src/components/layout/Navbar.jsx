import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ROUTE_PATHS } from "../../constants/routePaths";

function Navbar() {
  const { isAuthenticated, email, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate(ROUTE_PATHS.HOME);
  }

  return (
    <header className="border-b border-slate-200 bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link to={ROUTE_PATHS.HOME} className="text-lg font-semibold text-slate-900">
          Interview<span className="text-indigo-600">OS</span>
        </Link>

        <div className="flex items-center gap-4 text-sm font-medium text-slate-600">
          <Link to={ROUTE_PATHS.HOME} className="transition-colors hover:text-indigo-600">
            Home
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to={ROUTE_PATHS.DASHBOARD}
                className="transition-colors hover:text-indigo-600"
              >
                Dashboard
              </Link>
              <span className="hidden text-slate-400 sm:inline">{email}</span>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-slate-700 transition-colors hover:bg-slate-100"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to={ROUTE_PATHS.LOGIN}
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-slate-700 transition-colors hover:bg-slate-100"
              >
                Login
              </Link>
              <Link
                to={ROUTE_PATHS.SIGNUP}
                className="rounded-lg bg-indigo-600 px-3 py-1.5 text-white transition-colors hover:bg-indigo-500"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
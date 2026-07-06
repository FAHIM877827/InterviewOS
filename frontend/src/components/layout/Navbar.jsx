import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ROUTE_PATHS } from "../../constants/routePaths";

function Navbar() {
  const { isAuthenticated, email, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function closeMenu() {
    setIsMenuOpen(false);
  }

  function handleLogout() {
    logout();
    closeMenu();
    navigate(ROUTE_PATHS.HOME);
  }

  return (
    <header className="border-b border-slate-200 bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link
          to={ROUTE_PATHS.HOME}
          onClick={closeMenu}
          className="text-lg font-semibold text-slate-900"
        >
          Interview<span className="text-indigo-600">OS</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-4 text-sm font-medium text-slate-600 sm:flex">
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
              <span className="hidden text-slate-400 lg:inline">{email}</span>
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

        {/* Mobile hamburger toggle */}
        <button
          type="button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 text-slate-700 sm:hidden"
        >
          {isMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile menu panel */}
      {isMenuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-3 sm:hidden">
          <div className="flex flex-col gap-2 text-sm font-medium text-slate-600">
            <Link
              to={ROUTE_PATHS.HOME}
              onClick={closeMenu}
              className="rounded-lg px-2 py-2 transition-colors hover:bg-slate-100 hover:text-indigo-600"
            >
              Home
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to={ROUTE_PATHS.DASHBOARD}
                  onClick={closeMenu}
                  className="rounded-lg px-2 py-2 transition-colors hover:bg-slate-100 hover:text-indigo-600"
                >
                  Dashboard
                </Link>
                <span className="px-2 py-1 text-xs text-slate-400">{email}</span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-left text-slate-700 transition-colors hover:bg-slate-100"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to={ROUTE_PATHS.LOGIN}
                  onClick={closeMenu}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-slate-700 transition-colors hover:bg-slate-100"
                >
                  Login
                </Link>
                <Link
                  to={ROUTE_PATHS.SIGNUP}
                  onClick={closeMenu}
                  className="rounded-lg bg-indigo-600 px-3 py-2 text-center text-white transition-colors hover:bg-indigo-500"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
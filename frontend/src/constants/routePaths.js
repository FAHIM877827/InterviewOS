// Central registry of route paths so components never hardcode raw strings.
// LOGIN and DASHBOARD are reserved here for Commit 9 (auth) and Commit 10
// (dashboard UI); ProtectedRoute already redirects to LOGIN in preparation.
export const ROUTE_PATHS = {
  HOME: "/",
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  NOT_FOUND: "*",
};
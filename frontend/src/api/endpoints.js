// Relative paths appended to axiosClient's baseURL (which already includes
// /api). Mirrors the backend @RequestMapping values exactly:
//   AuthController      -> /api/auth
//   ProfileController    -> /api/profile
//   AnalyticsController  -> /api/analytics
//   DashboardController  -> /api/dashboard
// No request functions are wired up yet - Commit 9 (auth pages) and
// Commit 10 (dashboard UI) will consume these via axiosClient.
export const ENDPOINTS = {
  AUTH: {
    SIGNUP: "/auth/signup",
    LOGIN: "/auth/login",
  },
  PROFILE: {
    LINK: "/profile/link",
  },
  ANALYTICS: {
    READINESS: "/analytics/readiness",
    HISTORY: "/analytics/history",
  },
  DASHBOARD: {
    SUMMARY: "/dashboard/summary",
    HISTORY: "/dashboard/history",
    TOPICS: "/dashboard/topics",
  },
};
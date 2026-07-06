import axiosClient from "./axiosClient";
import { ENDPOINTS } from "./endpoints";

// Thin request functions matching DashboardController exactly:
//   GET /api/dashboard/summary -> DashboardSummaryResponse
//   GET /api/dashboard/history -> ReadinessHistoryResponse
//   GET /api/dashboard/topics  -> DashboardTopicsResponse
// These return the raw axios response; useDashboardData is responsible for
// unwrapping .data and mapping errors to UI state.
export function getDashboardSummary() {
  return axiosClient.get(ENDPOINTS.DASHBOARD.SUMMARY);
}

export function getDashboardHistory() {
  return axiosClient.get(ENDPOINTS.DASHBOARD.HISTORY);
}

export function getDashboardTopics() {
  return axiosClient.get(ENDPOINTS.DASHBOARD.TOPICS);
}
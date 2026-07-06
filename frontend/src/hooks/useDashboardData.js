import { useCallback, useEffect, useState } from "react";
import {
  getDashboardSummary,
  getDashboardHistory,
  getDashboardTopics,
} from "../api/dashboardApi";

// AnalyticsService.getLatestAnalysis/getReadinessHistory throw
// NoProfileDataException when a user has no ProfileSnapshot yet, which
// GlobalExceptionHandler maps to HTTP 404. That's the signal for the
// "no profile linked" empty state, distinct from a real failure.
export const DASHBOARD_STATUS = {
  LOADING: "loading",
  SUCCESS: "success",
  EMPTY: "empty",
  ERROR: "error",
};

const NOT_FOUND_STATUS = 404;

export function useDashboardData() {
  const [status, setStatus] = useState(DASHBOARD_STATUS.LOADING);
  const [summary, setSummary] = useState(null);
  const [history, setHistory] = useState([]);
  const [topics, setTopics] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const loadDashboard = useCallback(async () => {
    setStatus(DASHBOARD_STATUS.LOADING);
    setErrorMessage("");

    try {
      const [summaryRes, historyRes, topicsRes] = await Promise.all([
        getDashboardSummary(),
        getDashboardHistory(),
        getDashboardTopics(),
      ]);

      setSummary(summaryRes.data);
      setHistory(historyRes.data.history || []);
      setTopics(topicsRes.data.topicBreakdown || []);
      setStatus(DASHBOARD_STATUS.SUCCESS);
    } catch (error) {
      if (error.response?.status === NOT_FOUND_STATUS) {
        setStatus(DASHBOARD_STATUS.EMPTY);
      } else {
        setErrorMessage(
          error.response?.data?.message || "Unable to load dashboard data."
        );
        setStatus(DASHBOARD_STATUS.ERROR);
      }
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  return { status, summary, history, topics, errorMessage, refetch: loadDashboard };
}
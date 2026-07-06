import { useAuth } from "../context/AuthContext";
import { useDashboardData, DASHBOARD_STATUS } from "../hooks/useDashboardData";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import StatsCard from "../components/dashboard/StatsCard";
import ReadinessCard from "../components/dashboard/ReadinessCard";
import TopicCard from "../components/dashboard/TopicCard";
import LoadingSkeleton from "../components/dashboard/LoadingSkeleton";
import EmptyState from "../components/dashboard/EmptyState";
import ErrorState from "../components/dashboard/ErrorState";
import ReadinessHistoryChart from "../components/dashboard/ReadinessHistoryChart";
import DifficultyDistributionChart from "../components/dashboard/DifficultyDistributionChart";

// Sits behind ProtectedRoute (see routes/AppRoutes.jsx). Pulls its data
// from DashboardController via useDashboardData, which hits
// /api/dashboard/summary, /history, and /topics in parallel.
function Dashboard() {
  const { email } = useAuth();
  const { status, summary, history, errorMessage, refetch } = useDashboardData();

  if (status === DASHBOARD_STATUS.LOADING) {
    return (
      <DashboardLayout title="Dashboard" subtitle={`Welcome back, ${email}`}>
        <LoadingSkeleton />
      </DashboardLayout>
    );
  }

  if (status === DASHBOARD_STATUS.EMPTY) {
    return (
      <DashboardLayout title="Dashboard" subtitle={`Welcome back, ${email}`}>
        <EmptyState />
      </DashboardLayout>
    );
  }

  if (status === DASHBOARD_STATUS.ERROR) {
    return (
      <DashboardLayout title="Dashboard" subtitle={`Welcome back, ${email}`}>
        <ErrorState message={errorMessage} onRetry={refetch} />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Dashboard"
      subtitle={
        summary.leetcodeUsername
          ? `Tracking @${summary.leetcodeUsername}`
          : `Welcome back, ${email}`
      }
    >
      <ReadinessCard
        readinessScore={summary.readinessScore}
        previousScore={summary.previousScore}
        trend={summary.trend}
        fetchedAt={summary.fetchedAt}
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatsCard label="Total Solved" value={summary.totalSolved} accent="indigo" />
        <StatsCard label="Easy" value={summary.easySolved} accent="green" />
        <StatsCard label="Medium" value={summary.mediumSolved} accent="amber" />
        <StatsCard label="Hard" value={summary.hardSolved} accent="red" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ReadinessHistoryChart history={history} />
        <DifficultyDistributionChart
          easySolved={summary.easySolved}
          mediumSolved={summary.mediumSolved}
          hardSolved={summary.hardSolved}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TopicCard variant="weak" topics={summary.weakTopics} />
        <TopicCard variant="strong" topics={summary.strongTopics} />
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;
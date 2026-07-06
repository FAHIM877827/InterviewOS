import LinkProfileForm from "./LinkProfileForm";

// Shown when the backend returns 404 for dashboard endpoints, i.e.
// NoProfileDataException - the user hasn't linked a LeetCode profile yet
// (ProfileService.linkProfile / POST /api/profile/link). Embeds
// LinkProfileForm so they can submit a username right here; on success,
// onProfileLinked (Dashboard's useDashboardData refetch) reloads the
// dashboard with real data instead of requiring a manual page refresh.
function EmptyState({ onProfileLinked }) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center sm:py-20">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-2xl">
        🔗
      </div>
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-slate-900">
          No LeetCode profile linked yet
        </h2>
        <p className="mx-auto max-w-sm text-sm text-slate-600">
          Link your LeetCode profile to start tracking your readiness score,
          solved problems, and weak topics.
        </p>
      </div>
      <LinkProfileForm onLinked={onProfileLinked} />
    </div>
  );
}

export default EmptyState;
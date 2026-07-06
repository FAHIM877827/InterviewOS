// Shown when the backend returns 404 for dashboard endpoints, i.e.
// NoProfileDataException - the user hasn't linked a LeetCode profile yet
// (ProfileService.linkProfile / POST /api/profile/link, wired up in an
// earlier commit's ProfileController).
function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
      <h2 className="text-lg font-semibold text-slate-900">
        No LeetCode profile linked yet
      </h2>
      <p className="max-w-sm text-sm text-slate-600">
        Link your LeetCode profile to start tracking your readiness score,
        solved problems, and weak topics.
      </p>
    </div>
  );
}

export default EmptyState;
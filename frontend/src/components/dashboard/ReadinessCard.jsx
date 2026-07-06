// Mirrors the "trend" values produced by AnalyticsService.resolveTrend:
// IMPROVING, DECLINING, STABLE, NEW.
const TREND_STYLES = {
  IMPROVING: { label: "Improving", classes: "bg-emerald-50 text-emerald-700" },
  DECLINING: { label: "Declining", classes: "bg-red-50 text-red-700" },
  STABLE: { label: "Stable", classes: "bg-slate-100 text-slate-700" },
  NEW: { label: "New", classes: "bg-indigo-50 text-indigo-700" },
};

function formatDateTime(value) {
  if (!value) return "—";
  return new Date(value).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function ReadinessCard({ readinessScore, previousScore, trend, fetchedAt }) {
  const trendStyle = TREND_STYLES[trend] || TREND_STYLES.NEW;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Readiness Score
          </p>
          <p className="mt-1 text-4xl font-bold text-slate-900">{readinessScore ?? 0}%</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${trendStyle.classes}`}>
          {trendStyle.label}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-1 text-sm text-slate-600">
        {previousScore !== null && previousScore !== undefined && (
          <span>Previous score: {previousScore}%</span>
        )}
        <span>Last updated: {formatDateTime(fetchedAt)}</span>
      </div>
    </div>
  );
}

export default ReadinessCard;
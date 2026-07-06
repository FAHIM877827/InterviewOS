const ACCENT_CLASSES = {
  slate: "text-slate-900",
  green: "text-emerald-600",
  amber: "text-amber-600",
  red: "text-red-600",
  indigo: "text-indigo-600",
};

// Generic stat tile reused for Total Solved, Easy, Medium, and Hard counts.
function StatsCard({ label, value, accent = "slate" }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className={`mt-1 text-2xl font-bold ${ACCENT_CLASSES[accent] || ACCENT_CLASSES.slate}`}>
        {value ?? 0}
      </p>
    </div>
  );
}

export default StatsCard;
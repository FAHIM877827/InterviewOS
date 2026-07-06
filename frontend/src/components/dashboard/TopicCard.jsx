const VARIANT_STYLES = {
  weak: {
    badge: "bg-red-50 text-red-700",
    title: "Weak Topics",
    empty: "No weak topics identified yet.",
  },
  strong: {
    badge: "bg-emerald-50 text-emerald-700",
    title: "Strong Topics",
    empty: "Keep solving to build up strong topics.",
  },
};

// Reused for both the weak-topics and strong-topics lists returned by
// DashboardSummaryResponse - the variant prop picks the copy and color.
function TopicCard({ variant, topics }) {
  const styles = VARIANT_STYLES[variant] || VARIANT_STYLES.weak;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-sm font-semibold text-slate-900">{styles.title}</p>
      {topics && topics.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {topics.map((topic) => (
            <span
              key={topic}
              className={`rounded-full px-3 py-1 text-xs font-medium ${styles.badge}`}
            >
              {topic}
            </span>
          ))}
        </div>
      ) : (
        <p className="mt-3 text-sm text-slate-500">{styles.empty}</p>
      )}
    </div>
  );
}

export default TopicCard;
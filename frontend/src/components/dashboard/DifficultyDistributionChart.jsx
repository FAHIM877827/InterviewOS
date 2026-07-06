import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";

const COLORS = {
  Easy: "#22c55e",
  Medium: "#f59e0b",
  Hard: "#ef4444",
};

// Bar chart of DashboardSummaryResponse's easySolved/mediumSolved/hardSolved.
function DifficultyDistributionChart({ easySolved, mediumSolved, hardSolved }) {
  const data = [
    { difficulty: "Easy", count: easySolved || 0 },
    { difficulty: "Medium", count: mediumSolved || 0 },
    { difficulty: "Hard", count: hardSolved || 0 },
  ];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="mb-2 text-sm font-semibold text-slate-900">
        Difficulty Distribution
      </p>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 8, right: 16, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="difficulty" tick={{ fontSize: 12, fill: "#64748b" }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#64748b" }} />
          <Tooltip />
          <Bar dataKey="count" radius={[6, 6, 0, 0]}>
            {data.map((entry) => (
              <Cell key={entry.difficulty} fill={COLORS[entry.difficulty]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default DifficultyDistributionChart;
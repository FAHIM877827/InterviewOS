import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

function formatTick(value) {
  return new Date(value).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

// Plots ReadinessHistoryResponse.history (from GET /api/dashboard/history),
// each entry being { readinessScore, fetchedAt }.
function ReadinessHistoryChart({ history }) {
  const data = (history || []).map((entry) => ({
    fetchedAt: entry.fetchedAt,
    readinessScore: entry.readinessScore,
  }));

  if (data.length < 2) {
    return (
      <div className="flex h-72 items-center justify-center rounded-xl border border-slate-200 bg-white p-4 text-center text-sm text-slate-500 shadow-sm">
        Not enough history yet to plot a trend. Check back after your next
        profile refresh.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="mb-2 text-sm font-semibold text-slate-900">Readiness History</p>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data} margin={{ top: 8, right: 16, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="fetchedAt"
            tickFormatter={formatTick}
            tick={{ fontSize: 12, fill: "#64748b" }}
          />
          <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: "#64748b" }} />
          <Tooltip
            labelFormatter={(value) => new Date(value).toLocaleString()}
            formatter={(value) => [`${value}%`, "Readiness"]}
          />
          <Line
            type="monotone"
            dataKey="readinessScore"
            stroke="#4f46e5"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ReadinessHistoryChart;
import { useAuth } from "../context/AuthContext";

// Minimal placeholder behind ProtectedRoute, proving the authenticated flow
// end-to-end (redirect-on-login, redirect-if-unauthenticated, logout). The
// real analytics dashboard - readiness score, history chart, topic
// breakdown from ENDPOINTS.DASHBOARD - is built in Commit 10.
function Dashboard() {
  const { email } = useAuth();

  return (
    <section className="space-y-2">
      <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
      <p className="text-slate-600">
        You&apos;re logged in as <span className="font-medium">{email}</span>.
      </p>
    </section>
  );
}

export default Dashboard;
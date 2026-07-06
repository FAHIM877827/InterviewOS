// Page-level content layout for the dashboard - distinct from the route
// shell in layouts/MainLayout.jsx (which already provides the navbar and
// outer page padding). This just standardizes the title/subtitle header
// and vertical spacing between dashboard sections.
function DashboardLayout({ title, subtitle, children }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-slate-600">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

export default DashboardLayout;
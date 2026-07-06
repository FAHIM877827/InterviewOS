// Shown when a dashboard request fails with something other than 404
// (network failure, 500, etc.) - see useDashboardData's ERROR branch.
// Distinct from EmptyState, which handles the 404/"no profile linked" case.
function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-red-300 bg-red-50 px-6 py-16 text-center">
      <h2 className="text-lg font-semibold text-red-800">
        Couldn&apos;t load your dashboard
      </h2>
      <p className="max-w-sm text-sm text-red-700">
        {message || "Something went wrong while loading your data."}
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-100"
        >
          Try again
        </button>
      )}
    </div>
  );
}

export default ErrorState;
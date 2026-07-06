function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-6 py-16 text-center">
      <h2 className="text-lg font-semibold text-red-800">
        Couldn&apos;t load your dashboard
      </h2>
      <p className="max-w-sm text-sm text-red-700">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-500"
        >
          Try again
        </button>
      )}
    </div>
  );
}

export default ErrorState;
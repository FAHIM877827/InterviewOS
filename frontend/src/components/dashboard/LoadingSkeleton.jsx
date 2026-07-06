function SkeletonBlock({ className = "" }) {
  return <div className={`animate-pulse rounded-xl bg-slate-200 ${className}`} />;
}

// Mirrors the real dashboard layout's shape (readiness card, 4 stat tiles,
// 2 charts, 2 topic cards) so the loading state doesn't cause layout shift.
function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <SkeletonBlock className="h-32 w-full" />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <SkeletonBlock className="h-24" />
        <SkeletonBlock className="h-24" />
        <SkeletonBlock className="h-24" />
        <SkeletonBlock className="h-24" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SkeletonBlock className="h-72" />
        <SkeletonBlock className="h-72" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <SkeletonBlock className="h-32" />
        <SkeletonBlock className="h-32" />
      </div>
    </div>
  );
}

export default LoadingSkeleton;
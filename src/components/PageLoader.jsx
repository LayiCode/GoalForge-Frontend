import { useState, useEffect } from 'react';

export const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse rounded-xl bg-line ${className}`} />
);

export default function PageLoader({ message }) {
  const [slow, setSlow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setSlow(true), 1500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="space-y-4 py-6">
      {slow && (
        <p className="rounded-xl border border-line bg-surface px-4 py-3 text-sm text-muted">
          {message || 'Waking up the server… this can take a few seconds on the free plan.'}
        </p>
      )}
      <Skeleton className="h-36 w-full" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
      <Skeleton className="h-24 w-full" />
    </div>
  );
}

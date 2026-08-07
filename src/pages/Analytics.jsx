import { useState, useEffect } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';

export default function Analytics() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    api.get('/api/goals/stats')
      .then(res => setStats(res.data))
      .catch(() => setError(true));
  }, []);

  const statusOrder = [
    { key: 'IN_PROGRESS', label: 'In progress', tint: 'bg-brand-500' },
    { key: 'COMPLETED', label: 'Completed', tint: 'bg-green-500' },
    { key: 'ABANDONED', label: 'Abandoned', tint: 'bg-red-500' },
  ];

  const tiles = [
    { label: 'Milestones', value: stats?.totalMilestones, tint: 'text-brand-600' },
    { label: 'Completed', value: stats?.completedMilestones, tint: 'text-green-600' },
    { label: 'Completion rate', value: `${stats?.milestoneCompletionRate ?? 0}%`, tint: 'text-blue-600' },
    { label: 'Shared goals', value: stats?.publicGoals, tint: 'text-amber-600' },
  ];

  const statusCounts = statusOrder.map(s => stats?.byStatus?.[s.key] ?? 0);
  const statusMax = Math.max(1, ...statusCounts);
  const categoryEntries = Object.entries(stats?.byCategory || {});
  const catMax = Math.max(1, ...categoryEntries.map(([, count]) => count));

  return (
    <div className="min-h-screen bg-base">
      <Navbar />

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-6">
          <h1 className="section-title">Analytics</h1>
          <p className="mt-1 text-sm text-muted">Your progress at a glance</p>
        </div>

        {error ? (
          <div className="card p-8 text-center text-muted">Could not load analytics.</div>
        ) : !stats ? (
          <div className="py-20 text-center"><p className="text-muted">Loading…</p></div>
        ) : (
          <>
            <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {tiles.map(tile => (
                <div key={tile.label} className="card p-5 text-center">
                  <p className={`text-3xl font-bold ${tile.tint}`}>{tile.value ?? 0}</p>
                  <p className="mt-1 text-sm text-muted">{tile.label}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="card p-6">
                <h3 className="font-display mb-4 text-lg font-semibold text-ink">Goals by category</h3>
                {categoryEntries.length === 0 ? (
                  <p className="py-6 text-center text-sm text-muted">No goals yet.</p>
                ) : (
                  <div className="space-y-3">
                    {categoryEntries.map(([cat, count]) => (
                      <div key={cat} className="flex items-center gap-3">
                        <span className="w-24 truncate text-xs text-muted">{cat}</span>
                        <div className="h-2.5 flex-1 rounded-full bg-line">
                          <div
                            className="h-2.5 rounded-full bg-gradient-to-r from-brand-400 to-brand-700 transition-all"
                            style={{ width: `${(count / catMax) * 100}%` }}
                          />
                        </div>
                        <span className="w-6 text-right text-xs text-muted">{count}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="card p-6">
                <h3 className="font-display mb-4 text-lg font-semibold text-ink">Goals by status</h3>
                <div className="space-y-3">
                  {statusOrder.map((status, i) => (
                    <div key={status.key} className="flex items-center gap-3">
                      <span className="flex w-24 items-center gap-2 text-xs text-muted">
                        <span className={`h-2.5 w-2.5 rounded-full ${status.tint}`} />
                        {status.label}
                      </span>
                      <div className="h-2.5 flex-1 rounded-full bg-line">
                        <div
                          className={`h-2.5 rounded-full ${status.tint} transition-all`}
                          style={{ width: `${(statusCounts[i] / statusMax) * 100}%` }}
                        />
                      </div>
                      <span className="w-6 text-right text-xs text-muted">{statusCounts[i]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

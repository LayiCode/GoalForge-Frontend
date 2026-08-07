import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import { statusColor } from '../utils/goalUi';

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [reminders, setReminders] = useState([]);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/api/goals/stats').then(res => setStats(res.data)).catch(() => {}),
      api.get('/api/goals/reminders?days=7').then(res => setReminders(res.data)).catch(() => {}),
      api.get('/api/goals?size=4').then(res => setRecent(res.data.content)).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, []);

  const statCards = [
    { label: 'Total Goals', value: stats?.totalGoals, tint: 'text-ink', to: '/goals' },
    { label: 'In Progress', value: stats?.byStatus?.IN_PROGRESS, tint: 'text-brand-600', to: '/goals?status=IN_PROGRESS' },
    { label: 'Completed', value: stats?.byStatus?.COMPLETED, tint: 'text-green-600', to: '/goals?status=COMPLETED' },
  ];

  return (
    <div className="min-h-screen bg-base">
      <Navbar />

      <div className="mx-auto max-w-6xl px-4 pt-8 pb-28 sm:px-6 md:pb-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="section-title">Overview</h1>
            <p className="mt-1 text-sm text-muted">A quick look at your goals.</p>
          </div>
          <button onClick={() => navigate('/goals/new')} className="btn btn-primary">
            + New Goal
          </button>
        </div>

        {loading ? (
          <div className="py-20 text-center"><p className="text-muted">Loading…</p></div>
        ) : (
          <>
            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {statCards.map(card => (
                <button
                  key={card.label}
                  onClick={() => navigate(card.to)}
                  className="card p-5 text-left transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <p className="text-sm text-muted">{card.label}</p>
                  <p className={`mt-1 text-3xl font-bold ${card.tint}`}>{card.value ?? 0}</p>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="card p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-display text-lg font-semibold text-ink">Due within 7 days</h3>
                  <button onClick={() => navigate('/reminders')} className="text-sm font-medium text-brand-600 hover:underline">
                    View all
                  </button>
                </div>
                {reminders.length === 0 ? (
                  <p className="py-6 text-center text-sm text-muted">Nothing due this week. Nice and steady.</p>
                ) : (
                  <ul className="space-y-2">
                    {reminders.slice(0, 5).map(goal => (
                      <li key={goal.id}>
                        <button
                          onClick={() => navigate(`/goals/${goal.id}`)}
                          className="flex w-full items-center justify-between rounded-xl border border-line bg-base px-3 py-2.5 text-left transition hover:border-brand-300"
                        >
                          <span className="truncate text-sm font-medium text-ink">{goal.title}</span>
                          <span className="ml-3 shrink-0 text-xs text-muted">{goal.targetDate}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="card p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-display text-lg font-semibold text-ink">Recent goals</h3>
                  <button onClick={() => navigate('/goals')} className="text-sm font-medium text-brand-600 hover:underline">
                    View all
                  </button>
                </div>
                {recent.length === 0 ? (
                  <div className="py-6 text-center">
                    <p className="mb-4 text-sm text-muted">No goals yet.</p>
                    <button onClick={() => navigate('/goals/new')} className="btn btn-primary">
                      + Forge your first goal
                    </button>
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {recent.map(goal => (
                      <li key={goal.id}>
                        <button
                          onClick={() => navigate(`/goals/${goal.id}`)}
                          className="flex w-full items-center justify-between gap-3 rounded-xl border border-line bg-base px-3 py-2.5 text-left transition hover:border-brand-300"
                        >
                          <span className="flex min-w-0 items-center gap-2">
                            <span className="truncate text-sm font-medium text-ink">{goal.title}</span>
                          </span>
                          <span className={`chip shrink-0 whitespace-nowrap ${statusColor(goal.status)}`}>
                            {goal.status.replace('_', ' ')}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

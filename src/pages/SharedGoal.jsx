import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';

export default function SharedGoal() {
  const { id } = useParams();
  const [goal, setGoal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    api.get(`/api/goals/public/${id}`)
      .then(res => setGoal(res.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  const statusColor = (status) => {
    if (status === 'COMPLETED') return 'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400';
    if (status === 'ABANDONED') return 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400';
    return 'bg-ember-100 text-ember-700 dark:bg-ember-500/15 dark:text-ember-400';
  };

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-base">
      <p className="text-muted">Loading shared goal…</p>
    </div>
  );

  if (error || !goal) return (
    <div className="flex min-h-screen items-center justify-center bg-base">
      <div className="text-center">
        <p className="mb-4 text-5xl">🔒</p>
        <h1 className="font-display mb-2 text-xl font-semibold text-ink">Goal not found</h1>
        <p className="mb-6 text-muted">This goal isn&apos;t public or doesn&apos;t exist.</p>
        <Link to="/" className="text-sm font-semibold text-ember-600 hover:underline">Back to GoalForge</Link>
      </div>
    </div>
  );

  const completed = goal.milestones?.filter(m => m.completed).length || 0;
  const total = goal.milestones?.length || 0;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="min-h-screen bg-base">

      <Navbar homeTo="/" links={false}>
        <Link to="/" className="btn btn-outline">Sign in</Link>
      </Navbar>

      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div className="mb-6 text-center">
          <p className="mb-2 text-xs uppercase tracking-wider text-muted">Shared public goal</p>
          <span className={`chip ${statusColor(goal.status)}`}>
            {goal.status.replace('_', ' ')}
          </span>
        </div>

        <div className="card mb-6 p-8 text-center">
          <h1 className="font-display mb-3 text-3xl font-semibold text-ink">{goal.title}</h1>
          {goal.description && (
            <p className="mb-4 text-muted">{goal.description}</p>
          )}
          <div className="space-y-1 text-sm text-muted">
            {goal.category && <p>📁 {goal.category}</p>}
            {goal.targetDate && <p>📅 Target Date: {goal.targetDate}</p>}
          </div>
          {goal.tags?.length > 0 && (
            <div className="mt-4 flex flex-wrap justify-center gap-1.5">
              {goal.tags.map(tag => (
                <span key={tag} className="chip bg-ember-50 text-ember-700 dark:bg-ember-500/10 dark:text-ember-400">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="card mb-6 p-8">
          <div className="mb-2 flex justify-between text-sm text-muted">
            <span>Milestone Progress</span>
            <span>{completed}/{total} completed</span>
          </div>
          <div className="h-3 w-full rounded-full bg-line">
            <div
              className="h-3 rounded-full bg-gradient-to-r from-ember-400 to-ember-700 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-1 text-right text-xs text-muted">{progress}%</p>
        </div>

        <div className="card p-8">
          <h3 className="font-display mb-4 text-lg font-semibold text-ink">Milestones</h3>
          {total === 0 ? (
            <p className="py-4 text-center text-sm text-muted">No milestones added yet.</p>
          ) : (
            <ul className="space-y-2">
              {goal.milestones?.map(milestone => (
                <li key={milestone.id} className="flex items-center gap-3 rounded-xl border border-line bg-base p-3">
                  <span
                    className="h-4 w-4 flex-shrink-0 rounded-full border-2"
                    style={{
                      backgroundColor: milestone.completed ? '#ea580c' : 'transparent',
                      borderColor: milestone.completed ? '#ea580c' : 'var(--text-muted)',
                    }}
                  />
                  <span className={`text-sm ${milestone.completed ? 'text-muted line-through' : 'text-ink'}`}>
                    {milestone.title}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <p className="mt-8 text-center text-xs text-muted">Made with 🔥 GoalForge</p>
      </div>
    </div>
  );
}

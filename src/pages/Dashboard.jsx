import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Logo from '../components/Logo';

export default function Dashboard() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '', description: '', category: '', status: 'IN_PROGRESS', targetDate: '', tags: ''
  });
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [reminders, setReminders] = useState([]);
  const [stats, setStats] = useState(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const fetchGoals = useCallback(() => {
    const params = new URLSearchParams({ page, size: 6 });
    if (search) params.set('search', search);
    if (statusFilter) params.set('status', statusFilter);
    if (categoryFilter) params.set('category', categoryFilter);
    if (tagFilter) params.set('tag', tagFilter);
    return api.get(`/api/goals?${params}`)
      .then(res => {
        setGoals(res.data.content);
        setTotalPages(res.data.totalPages);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [page, search, statusFilter, categoryFilter, tagFilter]);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  useEffect(() => {
    api.get('/api/goals/reminders?days=7')
      .then(res => setReminders(res.data))
      .catch(err => console.error(err));
    api.get('/api/goals/stats')
      .then(res => setStats(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...newGoal,
        tags: newGoal.tags.split(',').map(t => t.trim()).filter(Boolean),
      };
      await api.post('/api/goals', payload);
      setShowForm(false);
      setNewGoal({ title: '', description: '', category: '', status: 'IN_PROGRESS', targetDate: '', tags: '' });
      fetchGoals();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this goal?')) return;
    await api.delete(`/api/goals/${id}`);
    fetchGoals();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const statusColor = (status) => {
    if (status === 'COMPLETED') return 'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400';
    if (status === 'ABANDONED') return 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400';
    return 'bg-ember-100 text-ember-700 dark:bg-ember-500/15 dark:text-ember-400';
  };

  const categoryEmoji = (category) => {
    const map = {
      Career: '💼', Health: '💪', Finance: '💰',
      Personal: '🌱', Education: '📚', Travel: '✈️'
    };
    return map[category] || '📌';
  };

  const sharedStats = {
    total: goals.length,
    completed: goals.filter(g => g.status === 'COMPLETED').length,
    inProgress: goals.filter(g => g.status === 'IN_PROGRESS').length,
  };

  const statCards = [
    { label: 'Total Goals', value: stats?.totalGoals ?? sharedStats.total, tint: 'text-ink' },
    { label: 'In Progress', value: stats?.byStatus?.IN_PROGRESS ?? sharedStats.inProgress, tint: 'text-ember-600' },
    { label: 'Completed', value: stats?.byStatus?.COMPLETED ?? sharedStats.completed, tint: 'text-green-600' },
  ];

  return (
    <div className="min-h-screen bg-base">

      <Navbar>
        <button
          onClick={() => setShowAnalytics(!showAnalytics)}
          className={`nav-item hidden sm:inline-flex ${showAnalytics ? 'text-ink bg-surface' : ''}`}
        >
          📊 Analytics
        </button>
        <button onClick={handleLogout} className="btn btn-outline">
          Log out
        </button>
      </Navbar>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">

        {reminders.length > 0 && (
          <div className="mb-8 rounded-2xl border border-ember-200 bg-ember-50 p-4 dark:border-ember-500/30 dark:bg-ember-500/10">
            <p className="mb-2 text-sm font-semibold text-ember-700 dark:text-ember-300">⏰ Due within 7 days</p>
            <div className="flex flex-wrap gap-2">
              {reminders.map(goal => (
                <button
                  key={goal.id}
                  onClick={() => navigate(`/goals/${goal.id}`)}
                  className="rounded-lg border border-ember-200 bg-surface px-3 py-1.5 text-xs text-ember-700 transition hover:bg-ember-100 dark:border-ember-500/30 dark:text-ember-300 dark:hover:bg-ember-500/20"
                >
                  {goal.title} — {goal.targetDate}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mb-8 grid grid-cols-3 gap-4">
          {statCards.map(card => (
            <div key={card.label} className="card p-5">
              <p className="text-sm text-muted">{card.label}</p>
              <p className={`mt-1 text-3xl font-bold ${card.tint}`}>{card.value}</p>
            </div>
          ))}
        </div>

        {showAnalytics && stats && (
          <div className="card mb-8 p-6">
            <h3 className="font-display mb-4 text-lg font-semibold text-ink">📊 Analytics</h3>
            <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="rounded-xl bg-ember-50 p-4 text-center dark:bg-ember-500/10">
                <p className="text-2xl font-bold text-ember-600">{stats.totalMilestones}</p>
                <p className="mt-1 text-xs text-muted">Milestones</p>
              </div>
              <div className="rounded-xl bg-green-50 p-4 text-center dark:bg-green-500/10">
                <p className="text-2xl font-bold text-green-600">{stats.completedMilestones}</p>
                <p className="mt-1 text-xs text-muted">Completed</p>
              </div>
              <div className="rounded-xl bg-blue-50 p-4 text-center dark:bg-blue-500/10">
                <p className="text-2xl font-bold text-blue-600">{stats.milestoneCompletionRate}%</p>
                <p className="mt-1 text-xs text-muted">Completion rate</p>
              </div>
              <div className="rounded-xl bg-amber-50 p-4 text-center dark:bg-amber-500/10">
                <p className="text-2xl font-bold text-amber-600">{stats.publicGoals}</p>
                <p className="mt-1 text-xs text-muted">Shared goals</p>
              </div>
            </div>
            {Object.keys(stats.byCategory || {}).length > 0 && (
              <div>
                <p className="mb-3 text-sm font-semibold text-muted">Goals by category</p>
                <div className="space-y-3">
                  {Object.entries(stats.byCategory).map(([cat, count]) => {
                    const max = Math.max(...Object.values(stats.byCategory));
                    return (
                      <div key={cat} className="flex items-center gap-3">
                        <span className="w-24 truncate text-xs text-muted">{categoryEmoji(cat)} {cat}</span>
                        <div className="h-2.5 flex-1 rounded-full bg-line">
                          <div
                            className="h-2.5 rounded-full bg-gradient-to-r from-ember-400 to-ember-700 transition-all"
                            style={{ width: `${(count / max) * 100}%` }}
                          />
                        </div>
                        <span className="w-6 text-right text-xs text-muted">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="section-title">My Goals</h2>
            <p className="mt-1 text-sm text-muted">Track and manage your goals</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
            {showForm ? '✕ Cancel' : '+ New Goal'}
          </button>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
          <input
            type="text"
            placeholder="🔍 Search goals..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(0); }}
            className="input"
          />
          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(0); }} className="input">
            <option value="">All statuses</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="ABANDONED">Abandoned</option>
          </select>
          <select value={categoryFilter} onChange={e => { setCategoryFilter(e.target.value); setPage(0); }} className="input">
            <option value="">All categories</option>
            {['Career', 'Health', 'Finance', 'Personal', 'Education', 'Travel'].map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="# filter by tag"
            value={tagFilter}
            onChange={e => { setTagFilter(e.target.value); setPage(0); }}
            className="input"
          />
        </div>

        {showForm && (
          <div className="card mb-6 p-6">
            <h3 className="font-display mb-4 text-lg font-semibold text-ink">Create New Goal</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <input
                type="text"
                placeholder="Goal title *"
                value={newGoal.title}
                onChange={e => setNewGoal({ ...newGoal, title: e.target.value })}
                className="input"
                required
              />
              <textarea
                placeholder="Description (optional)"
                value={newGoal.description}
                onChange={e => setNewGoal({ ...newGoal, description: e.target.value })}
                className="input resize-none"
                rows={3}
              />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <input
                  type="text"
                  placeholder="Category (e.g. Career)"
                  value={newGoal.category}
                  onChange={e => setNewGoal({ ...newGoal, category: e.target.value })}
                  className="input"
                />
                <input
                  type="date"
                  value={newGoal.targetDate}
                  onChange={e => setNewGoal({ ...newGoal, targetDate: e.target.value })}
                  className="input"
                />
                <select
                  value={newGoal.status}
                  onChange={e => setNewGoal({ ...newGoal, status: e.target.value })}
                  className="input"
                >
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="ABANDONED">Abandoned</option>
                </select>
              </div>
              <input
                type="text"
                placeholder="Tags (comma separated, e.g. exam, coding)"
                value={newGoal.tags}
                onChange={e => setNewGoal({ ...newGoal, tags: e.target.value })}
                className="input"
              />
              <button type="submit" className="btn btn-primary w-full py-3">
                Create Goal →
              </button>
            </form>
          </div>
        )}

        {loading ? (
          <div className="py-20 text-center">
            <p className="text-muted">Loading your goals…</p>
          </div>
        ) : goals.length === 0 ? (
          <div className="card py-16 text-center">
            <div className="mb-4 flex justify-center opacity-80"><Logo size={48} /></div>
            <h3 className="font-display mb-2 text-xl font-semibold text-ink">No goals yet</h3>
            <p className="mb-6 text-muted">Forge your first goal and start making progress.</p>
            <button onClick={() => setShowForm(true)} className="btn btn-primary">
              + Forge your first goal
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {goals.map(goal => (
              <div key={goal.id} className="card flex flex-col p-5 transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="mb-3 flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2">
                    <span className="text-xl">{categoryEmoji(goal.category)}</span>
                    <h3 className="font-semibold leading-tight text-ink">{goal.title}</h3>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {goal.isPublic && (
                      <span
                        className="chip bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400"
                        title="Shared publicly"
                      >
                        🌐
                      </span>
                    )}
                    <span className={`chip whitespace-nowrap ${statusColor(goal.status)}`}>
                      {goal.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {goal.description && (
                  <p className="mb-3 line-clamp-2 text-sm text-muted">{goal.description}</p>
                )}

                {goal.tags?.length > 0 && (
                  <div className="mb-3 flex flex-wrap gap-1.5">
                    {goal.tags.map(tag => (
                      <span key={tag} className="chip bg-ember-50 text-ember-700 dark:bg-ember-500/10 dark:text-ember-400">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {goal.milestones?.length > 0 && (
                  <div className="mb-3">
                    <div className="mb-1 flex justify-between text-xs text-muted">
                      <span>Progress</span>
                      <span>{goal.milestones.filter(m => m.completed).length}/{goal.milestones.length}</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-line">
                      <div
                        className="h-1.5 rounded-full bg-gradient-to-r from-ember-400 to-ember-700 transition-all"
                        style={{ width: `${Math.round((goal.milestones.filter(m => m.completed).length / goal.milestones.length) * 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="mb-4 text-xs text-muted">
                  {goal.targetDate && <p>📅 Due: {goal.targetDate}</p>}
                </div>

                <div className="mt-auto flex gap-2">
                  <button
                    onClick={() => navigate(`/goals/${goal.id}`)}
                    className="btn flex-1 border border-ember-200 bg-ember-50 text-ember-700 hover:bg-ember-100 dark:border-ember-500/30 dark:bg-ember-500/10 dark:text-ember-300 dark:hover:bg-ember-500/20"
                  >
                    View details
                  </button>
                  <button
                    onClick={() => handleDelete(goal.id)}
                    className="btn btn-danger px-3!"
                    aria-label="Delete goal"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-8 flex justify-center gap-3">
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="btn btn-outline"
            >
              ← Previous
            </button>
            <span className="btn pointer-events-none border border-line bg-surface text-muted">
              {page + 1} / {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              className="btn btn-outline"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

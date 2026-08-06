import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import GoalCard from '../components/GoalCard';
import Logo from '../components/Logo';

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [tagFilter, setTagFilter] = useState('');
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

  const removeGoal = (id) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  return (
    <div className="min-h-screen bg-base">
      <Navbar />

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="section-title">My Goals</h1>
            <p className="mt-1 text-sm text-muted">Search, filter, and manage your goals</p>
          </div>
          <button onClick={() => navigate('/goals/new')} className="btn btn-primary">
            + New Goal
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

        {loading ? (
          <div className="py-20 text-center">
            <p className="text-muted">Loading your goals…</p>
          </div>
        ) : goals.length === 0 ? (
          <div className="card py-16 text-center">
            <div className="mb-4 flex justify-center opacity-80"><Logo size={48} /></div>
            <h3 className="font-display mb-2 text-xl font-semibold text-ink">No goals found</h3>
            <p className="mb-6 text-muted">
              {search || statusFilter || categoryFilter || tagFilter
                ? 'Try adjusting your search or filters.'
                : 'Forge your first goal and start making progress.'}
            </p>
            {!(search || statusFilter || categoryFilter || tagFilter) && (
              <button onClick={() => navigate('/goals/new')} className="btn btn-primary">
                + Forge your first goal
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {goals.map(goal => (
              <GoalCard key={goal.id} goal={goal} onDeleted={removeGoal} />
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

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';

export default function NewGoal() {
  const navigate = useNavigate();
  const [newGoal, setNewGoal] = useState({
    title: '', description: '', category: '', status: 'IN_PROGRESS', targetDate: '', tags: ''
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...newGoal,
        tags: newGoal.tags.split(',').map(t => t.trim()).filter(Boolean),
      };
      const res = await api.post('/api/goals', payload);
      navigate(`/goals/${res.data.id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Could not create goal');
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-base">
      <Navbar />

      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <Link to="/goals" className="nav-item mb-4 -ml-3">← Back to goals</Link>

        <div className="mb-6">
          <h1 className="section-title">New Goal</h1>
          <p className="mt-1 text-sm text-muted">Define something worth forging.</p>
        </div>

        <div className="card p-6">
          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="label">Title *</label>
              <input
                id="title"
                type="text"
                placeholder="e.g. Learn to ship a full-stack app"
                value={newGoal.title}
                onChange={e => setNewGoal({ ...newGoal, title: e.target.value })}
                className="input"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="label">Description</label>
              <textarea
                id="description"
                placeholder="What does success look like?"
                value={newGoal.description}
                onChange={e => setNewGoal({ ...newGoal, description: e.target.value })}
                className="input resize-none"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label htmlFor="category" className="label">Category</label>
                <input
                  id="category"
                  type="text"
                  placeholder="Career"
                  value={newGoal.category}
                  onChange={e => setNewGoal({ ...newGoal, category: e.target.value })}
                  className="input"
                />
              </div>
              <div>
                <label htmlFor="targetDate" className="label">Target date</label>
                <input
                  id="targetDate"
                  type="date"
                  value={newGoal.targetDate}
                  onChange={e => setNewGoal({ ...newGoal, targetDate: e.target.value })}
                  className="input"
                />
              </div>
              <div>
                <label htmlFor="status" className="label">Status</label>
                <select
                  id="status"
                  value={newGoal.status}
                  onChange={e => setNewGoal({ ...newGoal, status: e.target.value })}
                  className="input"
                >
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="ABANDONED">Abandoned</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="tags" className="label">Tags</label>
              <input
                id="tags"
                type="text"
                placeholder="comma separated, e.g. exam, coding"
                value={newGoal.tags}
                onChange={e => setNewGoal({ ...newGoal, tags: e.target.value })}
                className="input"
              />
            </div>

            <button type="submit" disabled={saving} className="btn btn-primary w-full py-3">
              {saving ? 'Creating…' : 'Create Goal →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

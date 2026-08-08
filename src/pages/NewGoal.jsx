import { useState } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import PlanChat from '../components/PlanChat';
import { TEMPLATES } from '../utils/goalTemplates';
import { PlusIcon, TrashIcon } from '../components/Icons';

export default function NewGoal() {
  const navigate = useNavigate();
  const { templateId } = useParams();
  const template = templateId ? TEMPLATES.find(t => t.id === templateId) : null;
  const [newGoal, setNewGoal] = useState(() => template
    ? {
        title: template.title,
        description: template.description,
        category: template.category,
        status: 'IN_PROGRESS',
        targetDate: '',
        tags: template.tags.join(', '),
      }
    : { title: '', description: '', category: '', status: 'IN_PROGRESS', targetDate: '', tags: '' });
  const [milestones, setMilestones] = useState(() => template?.milestones?.length
    ? [...template.milestones]
    : ['']);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const applyPlan = (plan) => {
    setNewGoal({
      title: plan.title || '',
      description: plan.description || '',
      category: plan.category || '',
      status: 'IN_PROGRESS',
      targetDate: '',
      tags: (plan.tags || []).join(', '),
    });
    setMilestones(plan.milestones?.length ? [...plan.milestones] : ['']);
  };

  const handleAiPlanApplied = (plan) => {
    applyPlan(plan);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateMilestone = (i, value) =>
    setMilestones(ms => ms.map((m, idx) => (idx === i ? value : m)));
  const addMilestone = () => setMilestones(ms => [...ms, '']);
  const removeMilestone = (i) =>
    setMilestones(ms => (ms.length === 1 ? [''] : ms.filter((_, idx) => idx !== i)));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...newGoal,
        tags: newGoal.tags.split(',').map(t => t.trim()).filter(Boolean),
        milestones: milestones.map(m => m.trim()).filter(Boolean),
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

      <div className="mx-auto max-w-2xl px-4 pt-8 pb-28 sm:px-6 md:pb-8">
        <Link to="/goals" className="nav-item mb-4 -ml-3">← Back to goals</Link>

        <div className="mb-6">
          <h1 className="section-title">New Goal</h1>
          <p className="mt-1 text-sm text-muted">Define something worth forging.</p>
        </div>

        {template ? (
          <div className="card mb-6 flex flex-wrap items-center justify-between gap-3 p-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">{template.category}</p>
              <p className="font-semibold text-ink">Template: {template.title}</p>
              <p className="mt-1 text-sm text-muted">Tweak the details below, then create it.</p>
            </div>
            <Link to="/goals/new" className="btn btn-outline">Start blank</Link>
          </div>
        ) : (
          <div className="mb-6">
            <h2 className="font-display mb-3 text-lg font-semibold text-ink">Start from a template</h2>
            <p className="mb-3 text-sm text-muted">Pick a starting plan — we&apos;ll open a ready-to-edit form.</p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {TEMPLATES.map(t => (
                <Link
                  key={t.id}
                  to={`/goals/new/${t.id}`}
                  className="card p-4 text-left transition hover:border-brand-400 hover:shadow-md"
                >
                  <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">{t.category}</p>
                  <p className="mt-1 font-semibold text-ink">{t.title}</p>
                  <p className="mt-1 line-clamp-2 text-xs text-muted">{t.description}</p>
                  <p className="mt-2 text-xs text-muted">{t.milestones.length} milestones →</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        <PlanChat onApplyPlan={handleAiPlanApplied} />

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

            <div>
              <label className="label">Milestones</label>
              <div className="space-y-2">
                {milestones.map((milestone, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      type="text"
                      placeholder={`Milestone ${i + 1}`}
                      value={milestone}
                      onChange={e => updateMilestone(i, e.target.value)}
                      className="input flex-1"
                    />
                    <button
                      type="button"
                      onClick={() => removeMilestone(i)}
                      aria-label="Remove milestone"
                      className="btn btn-danger px-3!"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
              <button type="button" onClick={addMilestone} className="btn btn-outline mt-2">
                <PlusIcon className="h-4 w-4" />
                Add milestone
              </button>
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

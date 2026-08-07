import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { statusColor } from '../utils/goalUi';
import { GlobeIcon, TrashIcon, CalendarIcon } from './Icons';

export default function GoalCard({ goal, onDeleted, compact = false }) {
  const navigate = useNavigate();

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this goal?')) return;
    await api.delete(`/api/goals/${goal.id}`);
    onDeleted?.(goal.id);
  };

  const completed = goal.milestones?.filter(m => m.completed).length || 0;
  const total = goal.milestones?.length || 0;

  return (
    <div
      onClick={() => navigate(`/goals/${goal.id}`)}
      className="card flex cursor-pointer flex-col p-5 transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="flex items-start gap-2">
          <h3 className="font-semibold leading-tight text-ink">{goal.title}</h3>
        </div>
        <div className="flex items-center gap-1.5">
          {goal.isPublic && (
            <span
              className="chip bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400"
              title="Shared publicly"
            >
              <GlobeIcon className="h-3.5 w-3.5" />
            </span>
          )}
          <span className={`chip whitespace-nowrap ${statusColor(goal.status)}`}>
            {goal.status.replace('_', ' ')}
          </span>
        </div>
      </div>

      {goal.description && !compact && (
        <p className="mb-3 line-clamp-2 text-sm text-muted">{goal.description}</p>
      )}

      {goal.tags?.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-1.5">
          {goal.tags.map(tag => (
            <span key={tag} className="chip bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-400">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {total > 0 && (
        <div className="mb-3">
          <div className="mb-1 flex justify-between text-xs text-muted">
            <span>Progress</span>
            <span>{completed}/{total}</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-line">
            <div
              className="h-1.5 rounded-full bg-gradient-to-r from-brand-400 to-brand-700 transition-all"
              style={{ width: `${Math.round((completed / total) * 100)}%` }}
            />
          </div>
        </div>
      )}

      <div className="mb-4 flex items-center gap-1.5 text-xs text-muted">
        {goal.targetDate && (
          <>
            <CalendarIcon className="h-3.5 w-3.5" />
            <p>Due: {goal.targetDate}</p>
          </>
        )}
      </div>

      <div className="mt-auto flex gap-2" onClick={e => e.stopPropagation()}>
        <button
          onClick={() => navigate(`/goals/${goal.id}`)}
          className="btn flex-1 border border-brand-200 bg-brand-50 text-brand-700 hover:bg-brand-100 dark:border-brand-500/30 dark:bg-brand-500/10 dark:text-brand-300 dark:hover:bg-brand-500/20"
        >
          View details
        </button>
        <button
          onClick={handleDelete}
          className="btn btn-danger px-3!"
          aria-label="Delete goal"
        >
          <TrashIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

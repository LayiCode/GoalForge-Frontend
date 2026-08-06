import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { statusColor, categoryEmoji } from '../utils/goalUi';

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

      {goal.description && !compact && (
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

      {total > 0 && (
        <div className="mb-3">
          <div className="mb-1 flex justify-between text-xs text-muted">
            <span>Progress</span>
            <span>{completed}/{total}</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-line">
            <div
              className="h-1.5 rounded-full bg-gradient-to-r from-ember-400 to-ember-700 transition-all"
              style={{ width: `${Math.round((completed / total) * 100)}%` }}
            />
          </div>
        </div>
      )}

      <div className="mb-4 text-xs text-muted">
        {goal.targetDate && <p>📅 Due: {goal.targetDate}</p>}
      </div>

      <div className="mt-auto flex gap-2" onClick={e => e.stopPropagation()}>
        <button
          onClick={() => navigate(`/goals/${goal.id}`)}
          className="btn flex-1 border border-ember-200 bg-ember-50 text-ember-700 hover:bg-ember-100 dark:border-ember-500/30 dark:bg-ember-500/10 dark:text-ember-300 dark:hover:bg-ember-500/20"
        >
          View details
        </button>
        <button
          onClick={handleDelete}
          className="btn btn-danger px-3!"
          aria-label="Delete goal"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}

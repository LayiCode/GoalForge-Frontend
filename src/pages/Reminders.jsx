import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Logo from '../components/Logo';
import { statusColor, categoryEmoji } from '../utils/goalUi';

export default function Reminders() {
  const navigate = useNavigate();
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/goals/reminders?days=30')
      .then(res => setReminders(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const byDate = reminders.reduce((acc, goal) => {
    const date = goal.targetDate || 'No date';
    (acc[date] = acc[date] || []).push(goal);
    return acc;
  }, {});
  const dates = Object.keys(byDate).sort();

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="min-h-screen bg-base">
      <Navbar />

      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <div className="mb-6">
          <h1 className="section-title">Reminders</h1>
          <p className="mt-1 text-sm text-muted">Goals with a target date in the next 30 days</p>
        </div>

        {loading ? (
          <div className="py-20 text-center"><p className="text-muted">Loading…</p></div>
        ) : dates.length === 0 ? (
          <div className="card py-16 text-center">
            <div className="mb-4 flex justify-center opacity-80"><Logo size={48} /></div>
            <h3 className="font-display mb-2 text-xl font-semibold text-ink">All caught up</h3>
            <p className="text-muted">Nothing is due in the next 30 days.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {dates.map(date => (
              <div key={date}>
                <div className="mb-2 flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-muted">
                    {date === today ? 'Today' : date}
                  </h3>
                  <span className="h-px flex-1 bg-line" />
                </div>
                <div className="flex flex-wrap gap-2">
                  {byDate[date].map(goal => (
                    <button
                      key={goal.id}
                      onClick={() => navigate(`/goals/${goal.id}`)}
                      className="card flex items-center gap-2 px-4 py-3 text-left transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <span>{categoryEmoji(goal.category)}</span>
                      <span className="text-sm font-medium text-ink">{goal.title}</span>
                      <span className={`chip whitespace-nowrap ${statusColor(goal.status)}`}>
                        {goal.status.replace('_', ' ')}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

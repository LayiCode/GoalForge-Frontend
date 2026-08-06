import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const emailFromToken = (token) => {
  try {
    const payload = token.split('.')[1];
    const json = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    return json.sub || '';
  } catch {
    return '';
  }
};

const initials = (email) => {
  const local = email.split('@')[0] || '?';
  return local.slice(0, 2).toUpperCase();
};

export default function Account() {
  const navigate = useNavigate();
  const { token, logout } = useAuth();
  const email = emailFromToken(token);

  return (
    <div className="min-h-screen bg-base">
      <Navbar />

      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <h1 className="section-title">Account</h1>

        <div className="card mt-6 p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-ember-500 to-ember-700 font-display text-2xl font-bold text-white">
              {initials(email)}
            </div>
            <div className="min-w-0">
              <h2 className="font-display text-xl font-semibold text-ink">Signed in</h2>
              <p className="truncate text-sm text-muted">{email || '—'}</p>
            </div>
          </div>
        </div>

        <div className="card mt-4 divide-y divide-line p-0">
          <button
            onClick={() => navigate('/goals')}
            className="flex w-full items-center justify-between px-6 py-4 text-left transition hover:bg-base-soft"
          >
            <span className="text-sm font-medium text-ink">My goals</span>
            <span className="text-muted">→</span>
          </button>
          <button
            onClick={() => navigate('/analytics')}
            className="flex w-full items-center justify-between px-6 py-4 text-left transition hover:bg-base-soft"
          >
            <span className="text-sm font-medium text-ink">Progress &amp; analytics</span>
            <span className="text-muted">→</span>
          </button>
          <button
            onClick={() => navigate('/reminders')}
            className="flex w-full items-center justify-between px-6 py-4 text-left transition hover:bg-base-soft"
          >
            <span className="text-sm font-medium text-ink">Reminders</span>
            <span className="text-muted">→</span>
          </button>
        </div>

        <button
          onClick={() => {
            logout();
            navigate('/');
          }}
          className="btn btn-ghost mt-6 w-full border border-red-200 text-red-600 hover:bg-red-50 dark:border-red-500/30 dark:text-red-400 dark:hover:bg-red-500/10"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}

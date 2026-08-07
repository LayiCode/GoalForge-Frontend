import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const initials = (name) => {
  const parts = (name || '?').trim().split(/\s+/);
  const first = parts[0]?.[0] || '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toUpperCase();
};

export default function Account() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [profile, setProfile] = useState(null);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [pwMessage, setPwMessage] = useState('');
  const [pwError, setPwError] = useState('');
  const [pwLoading, setPwLoading] = useState(false);

  useEffect(() => {
    api.get('/api/auth/me')
      .then(res => setProfile(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwMessage('');
    setPwError('');
    if (newPassword !== confirm) {
      setPwError('Passwords do not match');
      return;
    }
    setPwLoading(true);
    try {
      await api.post('/api/auth/change-password', { currentPassword, newPassword });
      setPwMessage('Password updated.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirm('');
    } catch (err) {
      setPwError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base">
      <Navbar />

      <div className="mx-auto max-w-2xl px-4 pt-8 pb-28 sm:px-6 md:pb-8">
        <h1 className="section-title">Account</h1>

        <div className="card mt-6 p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 font-display text-2xl font-bold text-white">
              {initials(profile?.fullName)}
            </div>
            <div className="min-w-0">
              <h2 className="font-display truncate text-xl font-semibold text-ink">
                {profile?.fullName || 'Loading…'}
              </h2>
              <p className="truncate text-sm text-muted">{profile?.email}</p>
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

        <div className="card mt-4 p-6">
          <h3 className="font-display mb-4 text-lg font-semibold text-ink">Change password</h3>

          {pwMessage && (
            <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-500/30 dark:bg-green-500/10 dark:text-green-400">
              {pwMessage}
            </div>
          )}
          {pwError && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400">
              {pwError}
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label htmlFor="current" className="label">Current password</label>
              <input
                id="current"
                type="password"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                className="input"
                placeholder="••••••••"
                required
              />
            </div>
            <div>
              <label htmlFor="new" className="label">New password</label>
              <input
                id="new"
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="input"
                placeholder="••••••••"
                required
              />
              <p className="mt-1.5 text-xs text-muted">
                At least 8 characters, with uppercase, lowercase, number, and special character.
              </p>
            </div>
            <div>
              <label htmlFor="confirm" className="label">Confirm new password</label>
              <input
                id="confirm"
                type="password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                className="input"
                placeholder="••••••••"
                required
              />
            </div>
            <button type="submit" disabled={pwLoading} className="btn btn-primary w-full py-3">
              {pwLoading ? 'Updating…' : 'Update password'}
            </button>
          </form>
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

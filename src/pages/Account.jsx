import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { SunIcon, MoonIcon } from '../components/ThemeToggle';
import { LockIcon } from '../components/Icons';
import api from '../services/api';

const initials = (name) => {
  const parts = (name || '?').trim().split(/\s+/);
  const first = parts[0]?.[0] || '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toUpperCase();
};

const themeClass = (active) =>
  `flex items-center justify-center gap-2 rounded-xl border py-3 text-sm font-medium transition ${
    active
      ? 'border-brand-600 bg-brand-600 text-white'
      : 'border-line bg-base text-muted hover:bg-base-soft'
  }`;

export default function Account() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { dark, setDark } = useTheme();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    api.get('/api/auth/me')
      .then(res => setProfile(res.data))
      .catch(err => console.error(err));
  }, []);

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
          <button
            onClick={() => navigate('/change-password')}
            className="flex w-full items-center justify-between px-6 py-4 text-left transition hover:bg-base-soft"
          >
            <span className="flex items-center gap-3 text-sm font-medium text-ink">
              <LockIcon className="h-4 w-4 text-muted" />
              Change password
            </span>
            <span className="text-muted">→</span>
          </button>
        </div>

        <div className="card mt-4 p-6">
          <h3 className="font-display mb-1 text-lg font-semibold text-ink">Appearance</h3>
          <p className="mb-4 text-sm text-muted">Choose how GoalForge looks for you.</p>
          <div className="grid grid-cols-2 gap-3">
            <button type="button" onClick={() => setDark(false)} className={themeClass(!dark)}>
              <SunIcon />
              Light
            </button>
            <button type="button" onClick={() => setDark(true)} className={themeClass(dark)}>
              <MoonIcon />
              Dark
            </button>
          </div>
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

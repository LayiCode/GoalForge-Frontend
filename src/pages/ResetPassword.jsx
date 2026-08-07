import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import AuthCard from '../components/AuthCard';
import { CheckIcon } from '../components/Icons';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    if (password !== confirm) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    try {
      await api.post('/api/auth/reset-password', { token, newPassword: password });
      setDone(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Choose a new password"
      subtitle="Your reset link is valid for one hour."
      footer={
        done ? null : (
          <>
            Change of heart?{' '}
            <Link to="/login" className="font-semibold text-brand-600 hover:underline">
              Back to login
            </Link>
          </>
        )
      }
    >
      {done ? (
        <div className="text-center">
          <CheckIcon className="mx-auto mb-3 h-12 w-12 text-green-600" />
          <p className="mb-2 text-sm text-ink">Password updated.</p>
          <p className="mb-6 text-sm text-muted">You can now sign in with your new password.</p>
          <Link to="/login" className="btn btn-primary w-full py-3">
            Log in → 
          </Link>
        </div>
      ) : (
        <>
          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="password" className="label">New password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="input"
                placeholder="••••••••"
                required
                autoFocus
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

            <button type="submit" disabled={loading} className="btn btn-primary w-full py-3">
              {loading ? 'Updating…' : 'Update password'}
            </button>
          </form>
        </>
      )}
    </AuthCard>
  );
}

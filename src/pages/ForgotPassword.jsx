import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import AuthCard from '../components/AuthCard';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/api/auth/forgot-password', { email });
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Forgot your password?"
      subtitle="Enter your email and we'll send you a reset link."
      footer={
        sent ? null : (
          <>
            Remembered it?{' '}
            <Link to="/login" className="font-semibold text-ember-600 hover:underline">
              Back to login
            </Link>
          </>
        )
      }
    >
      {sent ? (
        <div className="text-center">
          <div className="mb-3 text-4xl">📬</div>
          <p className="mb-2 text-sm text-ink">Check your inbox.</p>
          <p className="text-sm text-muted">
            If an account exists for <span className="font-medium text-ink">{email}</span>, we&apos;ve
            sent a link to reset your password. It&apos;s valid for one hour.
          </p>
          <Link to="/login" className="btn btn-outline mt-6 inline-block w-full py-3">
            Back to login
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
              <label htmlFor="email" className="label">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="input"
                placeholder="you@example.com"
                required
                autoFocus
              />
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary w-full py-3">
              {loading ? 'Sending…' : 'Send reset link'}
            </button>
          </form>
        </>
      )}
    </AuthCard>
  );
}

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { MailIcon, LockIcon } from '../components/Icons';

export default function ChangePassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/api/auth/me')
      .then(res => setEmail(res.data.email || ''))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleRequest = async (e) => {
    e.preventDefault();
    setSending(true);
    setError('');
    try {
      await api.post('/api/auth/forgot-password', { email });
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Could not send the link. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-base">
      <Navbar />

      <div className="mx-auto max-w-xl px-4 pt-8 pb-28 sm:px-6 md:pb-8">
        <Link to="/account" className="nav-item mb-4 -ml-3">← Back to account</Link>

        <div className="mb-6">
          <h1 className="section-title">Change password</h1>
          <p className="mt-1 text-sm text-muted">We verify it&apos;s really you before anything changes.</p>
        </div>

        <div className="card p-6">
          {sent ? (
            <div className="text-center">
              <MailIcon className="mx-auto mb-3 h-12 w-12 text-brand-600" />
              <p className="mb-2 font-semibold text-ink">Check your inbox.</p>
              <p className="text-sm text-muted">
                We&apos;ve sent a reset link to <span className="font-medium text-ink">{email}</span>.
                Follow it to choose a new password. The link is valid for one hour.
              </p>
              <Link to="/account" className="btn btn-outline mt-6 inline-block w-full py-3">
                Back to account
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-5 flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300">
                  <LockIcon className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="font-display font-semibold text-ink">Request a reset link</h2>
                  <p className="mt-1 text-sm text-muted">
                    We&apos;ll email <span className="font-medium text-ink">{loading ? '…' : email}</span>{' '}
                    a link that lets you set a new password. You won&apos;t need to type your current
                    password here.
                  </p>
                </div>
              </div>

              {error && (
                <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400">
                  {error}
                </div>
              )}

              <form onSubmit={handleRequest} className="space-y-4">
                <button type="submit" disabled={sending} className="btn btn-primary w-full py-3">
                  {sending ? 'Sending…' : 'Email me a reset link'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

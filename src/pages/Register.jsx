import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import AuthCard from '../components/AuthCard';

const evaluatePassword = (password, fullName, email) => {
  const name = (fullName || '').toLowerCase().trim();
  const emailLocal = (email || '').toLowerCase().split('@')[0];
  const pwd = (password || '').toLowerCase();
  const checks = [
    { label: 'At least 8 characters', ok: password.length >= 8 },
    { label: 'An uppercase letter', ok: /[A-Z]/.test(password) },
    { label: 'A lowercase letter', ok: /[a-z]/.test(password) },
    { label: 'A number', ok: /\d/.test(password) },
    { label: 'A special character', ok: /[@$!%*?&#^+=_\-. ]/.test(password) },
    {
      label: 'Different from your name or email',
      ok: Boolean(password) && pwd !== name && pwd !== emailLocal && pwd !== (email || '').toLowerCase() && !(name && pwd.includes(name)),
    },
  ];
  const score = checks.filter(c => c.ok).length;
  return { checks, score };
};

const strengthLabel = ['Too weak', 'Weak', 'Getting there', 'Solid', 'Strong', 'Excellent'];

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const { checks, score } = evaluatePassword(password, fullName, email);
  const allValid = checks.every(c => c.ok);
  const meterColor = ['bg-red-500', 'bg-red-400', 'bg-amber-400', 'bg-amber-400', 'bg-emerald-500', 'bg-emerald-500'][score];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!allValid) {
      setError('Please satisfy every password requirement below.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/api/auth/register', { fullName, email, password });
      login(res.data.token);
      navigate('/dashboard');
    } catch (err) {
      const pwdErr = err.response?.data?.password;
      const msg = err.response?.data?.error
        || err.response?.data?.message
        || (typeof pwdErr === 'string' ? pwdErr : pwdErr?.[0])
        || 'Registration failed';
      setError(typeof msg === 'string' ? msg : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Create account"
      subtitle="Set up your forge in under a minute — it's free."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-brand-600 hover:underline">
            Log in
          </Link>
        </>
      }
    >
      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="fullName" className="label">Full Name</label>
          <input
            id="fullName"
            type="text"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            className="input"
            placeholder="Uthman"
            required
          />
        </div>

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
          />
        </div>

        <div>
          <label htmlFor="password" className="label">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="input"
            placeholder="At least 8 characters"
            required
          />
          {password && (
            <div className="mt-3">
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="font-medium text-muted">{strengthLabel[score]}</span>
                <span className="text-muted">{score}/6</span>
              </div>
              <div className="flex gap-1">
                {[0, 1, 2, 3, 4, 5].map(i => (
                  <span
                    key={i}
                    className={`h-1.5 flex-1 rounded-full transition ${i < score ? meterColor : 'bg-line-strong'}`}
                  />
                ))}
              </div>
              <ul className="mt-3 grid gap-1.5">
                {checks.map(check => (
                  <li key={check.label} className="flex items-center gap-2 text-xs">
                    <span
                      className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] ${
                        check.ok
                          ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400'
                          : 'bg-line text-muted'
                      }`}
                    >
                      {check.ok ? '✓' : ''}
                    </span>
                    <span className={check.ok ? 'text-muted' : 'text-ink/70'}>{check.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <button type="submit" disabled={loading} className="btn btn-primary w-full py-3">
          {loading ? 'Creating account…' : 'Create account →'}
        </button>
      </form>
    </AuthCard>
  );
}

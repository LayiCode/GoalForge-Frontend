import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import ThemeToggle from '../components/ThemeToggle';

const FEATURES = [
  'Set meaningful goals and break them into milestones',
  'See everything due in the next week',
  'Keep a private journal and collect useful resources',
  'Share public goals with anyone, free forever',
];

export default function Landing() {
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) navigate('/dashboard');
  }, [token, navigate]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-stone-950 text-white">
      <div className="pointer-events-none absolute -right-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-ember-600/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-24 h-[28rem] w-[28rem] rounded-full bg-ember-800/25 blur-3xl" />

      <div className="absolute right-6 top-6">
        <ThemeToggle className="rounded-xl border border-white/20 p-2.5 text-stone-300 transition hover:bg-white/10 hover:text-white" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-16 text-center">
        <Logo size={64} />
        <h1 className="font-display mt-6 text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
          Forge goals.
          <br />
          Make <span className="text-ember-400">progress</span> real.
        </h1>
        <p className="mt-5 max-w-lg text-stone-400">
          A quiet, dependable goal tracker. Set your targets, break them into milestones, and keep
          a record of every step.
        </p>

        <ul className="mt-10 space-y-3 text-left">
          {FEATURES.map(item => (
            <li key={item} className="flex items-center gap-3">
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-ember-500/20 text-sm text-ember-400">
                ✓
              </span>
              <span className="text-stone-300">{item}</span>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={() => navigate('/login')}
            className="rounded-xl bg-gradient-to-b from-ember-400 to-ember-600 px-8 py-3.5 text-base font-semibold text-white shadow-md shadow-ember-500/30 transition hover:from-ember-500 hover:to-ember-700 hover:shadow-ember-500/40 active:scale-[.98]"
          >
            Get started
          </button>
          <button
            onClick={() => navigate('/register')}
            className="rounded-xl border border-white/20 px-8 py-3.5 text-base font-semibold text-stone-200 transition hover:bg-white/10 hover:text-white"
          >
            Create an account
          </button>
        </div>
      </div>
    </div>
  );
}

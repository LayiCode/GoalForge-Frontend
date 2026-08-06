import Logo from './Logo';

const FEATURES = {
  login: ['See everything due in the next week', 'Progress you can actually measure', 'Simple, focused, no noise'],
  register: ['Free forever', 'Unlimited goals and milestones', 'Private journal and resource links'],
};

export default function AuthLayout({ variant, children }) {
  const features = FEATURES[variant] || FEATURES.login;
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-stone-950 text-white lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-ember-600/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-16 h-96 w-96 rounded-full bg-ember-800/25 blur-3xl" />

        <div className="relative flex items-center gap-3">
          <Logo size={40} />
          <span className="font-display text-2xl font-bold">
            Goal<span className="text-ember-400">Forge</span>
          </span>
        </div>

        <div className="relative">
          <h1 className="font-display text-5xl font-semibold leading-tight">
            Forge goals.
            <br />
            Make <span className="text-ember-400">progress</span> real.
          </h1>
          <p className="mt-4 max-w-md text-stone-400">
            A quiet, dependable goal tracker. Set your targets, break them into milestones, and
            keep a record of every step.
          </p>
          <ul className="mt-10 space-y-3">
            {features.map(item => (
              <li key={item} className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ember-500/20 text-sm text-ember-400">
                  ✓
                </span>
                <span className="text-stone-300">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-stone-500">{variant === 'register' ? 'Free forever. No credit card required.' : 'Your goals, your pace, your record.'}</p>
      </div>

      <div className="flex items-center justify-center bg-base p-6">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <Logo size={32} />
            <span className="font-display text-lg font-bold text-ink">
              Goal<span className="text-ember-600">Forge</span>
            </span>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

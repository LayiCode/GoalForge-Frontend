import Logo from './Logo';
import ThemeToggle from './ThemeToggle';

export default function AuthCard({ title, subtitle, children, footer }) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-base px-4 py-12">
      <div className="absolute right-6 top-6">
        <ThemeToggle />
      </div>
      <div className="mb-8 flex items-center gap-2.5">
        <Logo size={36} />
        <span className="font-display text-xl font-bold text-ink">
          Goal<span className="text-brand-600">Forge</span>
        </span>
      </div>
      <div className="w-full max-w-md rounded-2xl border border-line bg-surface p-8 shadow-sm">
        <h2 className="font-display text-2xl font-semibold text-ink">{title}</h2>
        <p className="mb-6 mt-1 text-muted">{subtitle}</p>
        {children}
      </div>
      {footer && <div className="mt-8 text-center text-sm text-muted">{footer}</div>}
    </div>
  );
}

import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';
import { HomeIcon, TargetIcon, ChartIcon, BellIcon, UserIcon } from './Icons';

const NAV = [
  { to: '/dashboard', label: 'Overview', icon: <HomeIcon className="h-[18px] w-[18px]" /> },
  { to: '/goals', label: 'Goals', icon: <TargetIcon className="h-[18px] w-[18px]" /> },
  { to: '/analytics', label: 'Analytics', icon: <ChartIcon className="h-[18px] w-[18px]" /> },
  { to: '/reminders', label: 'Reminders', icon: <BellIcon className="h-[18px] w-[18px]" /> },
  { to: '/account', label: 'Account', icon: <UserIcon className="h-[18px] w-[18px]" /> },
];

const linkClass = ({ isActive }) =>
  `nav-item ${isActive ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300' : ''}`;

export default function Navbar({ children, homeTo = '/dashboard', links = true }) {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-30 border-b border-line bg-surface/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link to={homeTo} className="flex items-center gap-2.5">
          <Logo size={30} />
          <span className="font-display text-lg font-bold text-ink">
            Goal<span className="text-brand-600">Forge</span>
          </span>
        </Link>

        {links && (
          <div className="hidden items-center gap-1 md:flex">
            {NAV.map(item => (
              <NavLink key={item.to} to={item.to} className={linkClass}>
                {item.icon}
                {item.label}
              </NavLink>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2">
          {children}
          <ThemeToggle />
          {links && (
            <button
              onClick={() => setOpen(!open)}
              aria-label="Toggle navigation menu"
              aria-expanded={open}
              className="icon-btn md:hidden"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                {open
                  ? <path d="M6 6l12 12M18 6L6 18" />
                  : <path d="M3 6h18M3 12h18M3 18h18" />}
              </svg>
            </button>
          )}
        </div>
      </div>

      {links && open && (
        <div className="border-t border-line bg-surface px-4 py-2 md:hidden">
          {NAV.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={`${linkClass} w-full justify-start`}
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  );
}

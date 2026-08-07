import { NavLink, Link } from 'react-router-dom';
import Logo from './Logo';
import MobileTabBar from './MobileTabBar';
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
  return (
    <>
      <nav className="sticky top-0 z-30 border-b border-line bg-surface/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2 sm:px-6 md:py-3">
          <Link to={homeTo} className="flex items-center gap-2.5">
            <Logo size={28} />
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
          </div>
        </div>
      </nav>

      {links && <MobileTabBar />}
    </>
  );
}

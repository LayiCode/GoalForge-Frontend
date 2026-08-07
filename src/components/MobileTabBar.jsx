import { NavLink } from 'react-router-dom';
import { HomeIcon, TargetIcon, ChartIcon, BellIcon, UserIcon } from './Icons';

const TABS = [
  { to: '/dashboard', label: 'Overview', icon: HomeIcon },
  { to: '/goals', label: 'Goals', icon: TargetIcon },
  { to: '/analytics', label: 'Analytics', icon: ChartIcon },
  { to: '/reminders', label: 'Reminders', icon: BellIcon },
  { to: '/account', label: 'Account', icon: UserIcon },
];

export default function MobileTabBar() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 backdrop-blur md:hidden">
      <div className="mx-auto flex max-w-lg items-stretch justify-around">
        {TABS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/dashboard'}
            className={({ isActive }) =>
              `flex min-w-0 flex-1 flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium transition ${
                isActive ? 'text-brand-600 dark:text-brand-400' : 'text-muted'
              }`
            }
          >
            <Icon className="h-5 w-5" />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

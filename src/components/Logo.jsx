import { useId } from 'react';

export default function Logo({ size = 34, className = '' }) {
  const id = useId();
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="4" y1="3" x2="28" y2="29" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fb923c" />
          <stop offset="1" stopColor="#c2410c" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill={`url(#${id})`} />
      <path
        d="M16 5.5c1.2 3.6-3.6 5.2-3.6 9.4a3.6 3.6 0 0 0 7.2 0c0-2.3-1.2-3.7-2.3-5.4 1.8 1 3.3 2.8 3.3 5.4a4.6 4.6 0 0 1-9.2 0c0-4.4 4.1-6.6 4.6-9.4z"
        fill="#fff"
      />
      <circle cx="21.5" cy="7.5" r="1.4" fill="#fff" opacity=".85" />
    </svg>
  );
}

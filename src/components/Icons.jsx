const base = {
  width: '1em',
  height: '1em',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': 'true',
};

const svg = (props, ...children) => (
  <svg {...base} {...props}>{children}</svg>
);

export const HomeIcon = (props) => svg(props,
  <path d="M3 10.5L12 3l9 7.5" />,
  <path d="M5 9.5V21h14V9.5" />,
);

export const TargetIcon = (props) => svg(props,
  <circle cx="12" cy="12" r="9" />,
  <circle cx="12" cy="12" r="5" />,
  <circle cx="12" cy="12" r="1" />,
);

export const ChartIcon = (props) => svg(props,
  <path d="M3 3v18h18" />,
  <rect x="7" y="12" width="3" height="6" />,
  <rect x="12" y="8" width="3" height="10" />,
  <rect x="17" y="5" width="3" height="13" />,
);

export const BellIcon = (props) => svg(props,
  <path d="M6 8a6 6 0 0 1 12 0c0 7 3 7 3 9H3c0-2 3-2 3-9" />,
  <path d="M10.5 21a1.5 1.5 0 0 0 3 0" />,
);

export const UserIcon = (props) => svg(props,
  <circle cx="12" cy="8" r="4" />,
  <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />,
);

export const SearchIcon = (props) => svg(props,
  <circle cx="11" cy="11" r="7" />,
  <path d="M21 21l-4.3-4.3" />,
);

export const GlobeIcon = (props) => svg(props,
  <circle cx="12" cy="12" r="9" />,
  <path d="M3 12h18" />,
  <path d="M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />,
);

export const TrashIcon = (props) => svg(props,
  <path d="M4 7h16" />,
  <path d="M9 7V4h6v3" />,
  <path d="M6 7l1 13h10l1-13" />,
);

export const LinkIcon = (props) => svg(props,
  <path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1.5 1.5" />,
  <path d="M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1.5-1.5" />,
);

export const LockIcon = (props) => svg(props,
  <rect x="4" y="11" width="16" height="10" rx="2" />,
  <path d="M8 11V7a4 4 0 0 1 8 0v4" />,
);

export const MailIcon = (props) => svg(props,
  <rect x="3" y="5" width="18" height="14" rx="2" />,
  <path d="M3 7l9 6 9-6" />,
);

export const CheckIcon = (props) => svg(props,
  <path d="M4 12.5l5 5L20 6.5" />,
);

export const CalendarIcon = (props) => svg(props,
  <rect x="3" y="5" width="18" height="16" rx="2" />,
  <path d="M8 3v4M16 3v4M3 10h18" />,
);

export const FolderIcon = (props) => svg(props,
  <path d="M3 6a2 2 0 0 1 2-2h4l2 3h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />,
);

export const PenIcon = (props) => svg(props,
  <path d="M12 20h9" />,
  <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />,
);

export const PlusIcon = (props) => svg(props,
  <path d="M12 5v14M5 12h14" />,
);

export const ArrowRightIcon = (props) => svg(props,
  <path d="M5 12h14" />,
  <path d="M13 6l6 6-6 6" />,
);

export const statusColor = (status) => {
  if (status === 'COMPLETED') return 'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400';
  if (status === 'ABANDONED') return 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400';
  return 'bg-brand-100 text-brand-700 dark:bg-brand-500/15 dark:text-brand-400';
};

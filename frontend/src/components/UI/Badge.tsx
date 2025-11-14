// components/ui/Badge.tsx
import { Circle } from 'lucide-react';

interface BadgeProps {
  status: string;
}
// active, pending, declined/cancelled, removed/left
export function Badge({ status }: BadgeProps) {
  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'active':
        return {
          color: 'text-green-500 dark:text-green-400',
          glow: 'shadow-[0_0_8px_rgba(34,197,94,0.6)]',
        };
      case 'pending':
        return {
          color: 'text-yellow-500 dark:text-yellow-400',
          glow: 'shadow-[0_0_8px_rgba(234,179,8,0.6)]',
        };
      case 'declined':
        return {
          color: 'text-red-500 dark:text-red-400',
          glow: 'shadow-[0_0_8px_rgba(239,68,68,0.6)]',
        };
      case 'cancelled':
        return {
          color: 'text-red-500 dark:text-red-400',
          glow: 'shadow-[0_0_8px_rgba(239,68,68,0.6)]',
        };
      case 'removed':
        return {
          color: 'text-red-500 dark:text-red-400',
          glow: 'shadow-[0_0_8px_rgba(239,68,68,0.6)]',
        };
      case 'left':
        return {
          color: 'text-gray-400 dark:text-gray-500',
          glow: '',
        };
      case 'approved':
        return {
          color: 'text-green-500 dark:text-green-400',
          glow: 'shadow-[0_0_8px_rgba(34,197,94,0.6)]',
        };
      case 'released':
        return {
          color: 'text-green-500 dark:text-green-400',
          glow: 'shadow-[0_0_8px_rgba(34,197,94,0.6)]',
        };
      case 'rejected':
        return {
          color: 'text-red-500 dark:text-red-400',
          glow: 'shadow-[0_0_8px_rgba(239,68,68,0.6)]',
        };
      case 'refunded':
        return {
          color: 'text-blue-500 dark:text-blue-400',
          glow: 'shadow-[0_0_8px_rgba(59,130,246,0.6)]',
        };
      default:
        return {
          color: 'text-gray-400 dark:text-gray-500',
          glow: '',
        };
    }
  };

  const styles = getStatusStyles(status);

  return (
    <div className='flex flex-col items-center gap-1'>
      <div className={`${styles.glow} rounded-full`}>
        <Circle className={`${styles.color} fill-current`} size={12} />
      </div>
      <span className={`text-xs ${styles.color}`}>{status.toUpperCase()}</span>
    </div>
  );
}

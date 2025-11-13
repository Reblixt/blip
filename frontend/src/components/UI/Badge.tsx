interface BadgeProps {
  status: string;
}

export function Badge({ status }: BadgeProps) {
  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <span
      className={`
        text-xs
        font-semibold
        px-3
        py-1
        rounded-full
        inline-block
        ${getStatusStyles(status)}
      `}>
      {status.toUpperCase()}
    </span>
  );
}

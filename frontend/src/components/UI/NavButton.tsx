'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavButtonProps {
  href: string;
  icon: React.ComponentType<any>;
  label: string;
}

export default function NavButton({ href, icon: Icon, label }: NavButtonProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} className='flex flex-col items-center gap-1'>
      <Icon
        className={
          isActive ? 'text-blue-500' : 'text-gray-400 dark:text-gray-500'
        }
        size={24}
      />
      <span
        className={`text-xs ${
          isActive ? 'text-blue-500' : 'text-gray-400 dark:text-gray-500'
        }`}>
        {label}
      </span>
    </Link>
  );
}

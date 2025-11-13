'use client';

import NavButton from '@/components/UI/NavButton';
import { Home, Clock, User, Shield } from 'lucide-react';

export default function BottomNav() {
  return (
    <nav className='fixed bottom-0 w-full h-20 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex justify-around items-center'>
      <NavButton href='/' icon={Home} label='Home' />
      <NavButton href='/profile' icon={User} label='Profile' />
      <NavButton href='/history' icon={Clock} label='History' />
      <NavButton href='/guardians' icon={Shield} label='Guardians' />
    </nav>
  );
}

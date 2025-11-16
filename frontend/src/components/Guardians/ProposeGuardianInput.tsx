'use client';
import { useState } from 'react';
import { UserPlus } from 'lucide-react';

interface ProposeGuardianInputProps {
  onSubmit: (address: string) => void;
}

export function ProposeGuardianInput({ onSubmit }: ProposeGuardianInputProps) {
  const [address, setAddress] = useState('');

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (address.trim()) {
      onSubmit(address);
      setAddress('');
    }
  };

  return (
    <div className='fixed bottom-24 left-0 right-0 flex justify-center z-40 px-4'>
      <form
        onSubmit={handleSubmit}
        className='flex gap-0 w-full sm:w-auto shadow-lg rounded-xl overflow-hidden'>
        <input
          type='text'
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder='0x...'
          className='
            flex-1
            bg-white
            border
            border-gray-300
            border-r-0
            text-gray-900
            px-6
            py-4 sm:py-3
            text-lg sm:text-sm
            rounded-l-xl
            focus:outline-none
            focus:ring-2
            focus:ring-blue-500
          '
        />
        <button
          type='submit'
          className='
            bg-blue-500
            hover:bg-blue-600
            text-white
            px-6
            py-4 sm:py-3
            rounded-r-xl
            flex
            items-center
            justify-center
            transition-colors
            duration-200
            min-w-fit
          '>
          <UserPlus size={24} />
        </button>
      </form>
    </div>
  );
}

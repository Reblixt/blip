'use client';
import { useState } from 'react';

interface ProposeGuardianInputProps {
  onSubmit: (address: string) => void;
}

export function ProposeGuardianInput({ onSubmit }: ProposeGuardianInputProps) {
  const [address, setAddress] = useState('');

  const handleSubmit = () => {
    onSubmit(address);
    setAddress('');
  };

  return (
    <div className='flex gap-2'>
      <input
        type='text'
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder='0x...'
        className='flex-1 px-4 py-2 border rounded-lg'
      />
      <button
        onClick={handleSubmit}
        className='px-4 py-2 bg-green-500 text-white rounded-lg'>
        Föreslå
      </button>
    </div>
  );
}

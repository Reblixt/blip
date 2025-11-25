'use client';
import { useState, useEffect } from 'react';
import { UserPlus } from 'lucide-react';
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useChainId,
} from 'wagmi';
import { blipAbi } from '@/contracts/Blip';
import { getBlipAddress } from '@/contracts/addresses';
import { Address } from 'viem';

interface ProposeGuardianInputProps {
  onClose: () => void;
  onRefresh: () => void;
}

export function ProposeGuardianInput({
  onClose,
  onRefresh,
}: ProposeGuardianInputProps) {
  const [address, setAddress] = useState('');
  const chainId = useChainId();
  const blipAddress = getBlipAddress(chainId);

  const { data: hash, writeContract } = useWriteContract();
  const { isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const handleProposeGuardian = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (address.trim()) {
      writeContract({
        abi: blipAbi,
        address: blipAddress,
        functionName: 'proposeGuardian',
        args: [address as Address],
      });
      setAddress('');
    }
  };

  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        onRefresh();
        onClose();
      }, 1000);
    }
  }, [isSuccess, onRefresh, onClose]);

  return (
    <div className='fixed bottom-24 left-0 right-0 flex justify-center z-40 px-4'>
      <form
        onSubmit={handleProposeGuardian}
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

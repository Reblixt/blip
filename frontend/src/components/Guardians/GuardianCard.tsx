// components/Guardians/GuardianCard.tsx
import { Card } from '../UI/Card';
import { Badge } from '../UI/Badge';
import { Trash2 } from 'lucide-react';
import { Address } from 'viem';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { blipAbi, BLIP_CONTRACT_ADDRESS } from '@/contracts/Blip';
import { useEffect } from 'react';

interface Guardian {
  id: string;
  recipientWallet: string;
  guardianWallet: string;
  status: string;
  createdAt: string;
}

interface GuardianCardProps {
  guardian: Guardian;
  onRefresh?: () => void;
  onDelete?: (guardianWallet: string) => void;
}

export function GuardianCard({
  guardian,
  onDelete,
  onRefresh,
}: GuardianCardProps) {
  const { data: hash, writeContract } = useWriteContract();
  const { isSuccess } = useWaitForTransactionReceipt({
    hash,
  });
  useEffect(() => {
    if (isSuccess && onRefresh) {
      setTimeout(() => {
        onRefresh();
      }, 1000);
    }
  }, [isSuccess, onRefresh]);

  const handleCancelGuardianProposal = (guardian: Guardian) => {
    writeContract({
      abi: blipAbi,
      address: BLIP_CONTRACT_ADDRESS,
      functionName: 'cancelGuardianProposal',
      args: [guardian.guardianWallet as Address],
    });
  };

  const shortenAddress = (address: string) => {
    const first = address.slice(0, 6);
    const last = address.slice(-4);
    return `${first}...${last}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('sv-SE', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getStatusText = (status: string, date: string) => {
    switch (status) {
      case 'active':
        return `Guardian since ${formatDate(date)}`;
      case 'pending':
        return 'Invitation sent';
      case 'declined':
        return 'Invitation declined';
      case 'cancelled':
        return 'Invitation cancelled';
      case 'removed':
        return 'Removed as guardian';
      case 'left':
        return 'Left guardian role';
      default:
        return 'Status unknown';
    }
  };

  return (
    <Card className='mb-4'>
      <div className='flex justify-between items-center'>
        <span className='font-mono text-sm'>
          {shortenAddress(guardian.guardianWallet)}
        </span>
        <Badge status={guardian.status} />
      </div>

      <div className='flex justify-between items-center mt-2'>
        <p className='text-sm text-gray-600 dark:text-gray-400'>
          {getStatusText(guardian.status, guardian.createdAt)}
        </p>

        <button
          onClick={() => handleCancelGuardianProposal(guardian)}
          className='transition-colors duration-200 ml-2'>
          <Trash2
            size={18}
            className='text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-600'
          />
        </button>
      </div>
    </Card>
  );
}

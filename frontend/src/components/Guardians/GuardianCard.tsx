import { Card } from '../UI/Card';
import { Badge } from '../UI/Badge';
import { Trash2, Check, X, DoorOpen } from 'lucide-react';
import { useWaitForTransactionReceipt } from 'wagmi';
import { useEffect } from 'react';
import { Guardian, useGuardian } from '@/hooks/useGuardian';

interface GuardianCardProps {
  guardian: Guardian;
  onRefresh: () => void;
  onDelete: (guardianWallet: string) => void;
  variant: 'guardians' | 'protecting';
}

export function GuardianCard({
  guardian,
  onRefresh,
  onDelete,
  variant,
}: GuardianCardProps) {
  const {
    handleAcceptGuardianRole,
    handleCancelGuardianProposal,
    handleDeclineGuardianRole,
    handleLeaveGuardianRole,
    handleRemoveGuardian,
    hash,
  } = useGuardian(guardian);

  const { isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        onRefresh();
      }, 1000);
    }
  }, [isSuccess, onRefresh]);

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
    if (variant === 'guardians') {
      switch (status) {
        case 'active':
          return `Guardian since ${formatDate(date)}`;
        case 'pending':
          return 'Invitation sent';
        default:
          return 'Status unknown';
      }
    } else {
      switch (status) {
        case 'active':
          return `Protecting since ${formatDate(date)}`;
        case 'pending':
          return 'Invitation received';
        default:
          return 'Status unknown';
      }
    }
  };

  const renderButtons = () => {
    if (variant === 'guardians') {
      if (guardian.status === 'pending') {
        return (
          <button
            onClick={handleCancelGuardianProposal}
            className='transition-colors duration-200'>
            <Trash2
              size={18}
              className='text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-600'
            />
          </button>
        );
      } else if (guardian.status === 'active') {
        return (
          <button
            onClick={handleRemoveGuardian}
            className='transition-colors duration-200'>
            <Trash2
              size={18}
              className='text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-600'
            />
          </button>
        );
      }
    } else {
      if (guardian.status === 'pending') {
        return (
          <div className='flex gap-2'>
            <button
              onClick={handleAcceptGuardianRole}
              className='transition-colors duration-200'>
              <Check
                size={18}
                className='text-green-500 hover:text-green-700 dark:text-green-400 dark:hover:text-green-600'
              />
            </button>
            <button
              onClick={handleDeclineGuardianRole}
              className='transition-colors duration-200'>
              <X
                size={18}
                className='text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-600'
              />
            </button>
          </div>
        );
      } else if (guardian.status === 'active') {
        return (
          <button
            onClick={handleLeaveGuardianRole}
            className='transition-colors duration-200'>
            <DoorOpen
              size={18}
              className='text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-600'
            />
          </button>
        );
      }
    }
    return null;
  };

  return (
    <Card className='mb-4'>
      <div className='flex justify-between items-center'>
        <span className='font-mono text-sm'>
          {variant === 'guardians'
            ? shortenAddress(guardian.guardianWallet)
            : shortenAddress(guardian.recipientWallet)}
        </span>
        <Badge status={guardian.status} />
      </div>

      <div className='flex justify-between items-center mt-2'>
        <p className='text-sm text-gray-600 dark:text-gray-400'>
          {getStatusText(guardian.status, guardian.createdAt)}
        </p>

        {renderButtons()}
      </div>
    </Card>
  );
}

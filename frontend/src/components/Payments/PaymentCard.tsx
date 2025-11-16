// components/history/PaymentCard.tsx
import { Card } from '../UI/Card';
import { Badge } from '../UI/Badge';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Address, formatEther } from 'viem';
import { useWriteContract } from 'wagmi';
import { blipAbi, BLIP_CONTRACT_ADDRESS } from '@/contracts/Blip';

interface Payment {
  id: string;
  contractId: number;
  senderWallet: string;
  recipientWallet: string;
  amount: string;
  tokenAddress: string | null;
  message: string | null;
  status: string;
  createdAt: string;
  approvals: PaymentApprovals[];
}

interface PaymentApprovals {
  guardianWallet: string;
  approved: boolean;
}

interface PaymentCardProps {
  payment: Payment;
  currentUserWallet: string;
}

export function PaymentCard({ payment, currentUserWallet }: PaymentCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const isIncoming = payment.recipientWallet === currentUserWallet;
  const otherParty = isIncoming
    ? payment.senderWallet
    : payment.recipientWallet;
  const formattedAmount = formatEther(BigInt(payment.amount));
  const displayAmount = isIncoming
    ? `+${formattedAmount}`
    : `-${formattedAmount}`;
  const amountColor = isIncoming ? 'text-green-500' : 'text-gray-500';

  const { writeContract } = useWriteContract();
  const handleCancelPayment = () => {
    writeContract({
      abi: blipAbi,
      address: BLIP_CONTRACT_ADDRESS,
      functionName: 'cancelPendingPayment',
      args: [BigInt(payment.contractId)],
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
    });
  };

  const formatFullTimestamp = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('sv-SE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusText = (status: string, date: string) => {
    switch (status) {
      case 'pending':
        return `Waiting on approval since\n${formatFullTimestamp(date)}`;
      case 'approved':
        return `Approved at\n${formatFullTimestamp(date)}`;
      case 'released':
        return `Released at\n${formatFullTimestamp(date)}`;
      case 'rejected':
        return `Rejected at\n${formatFullTimestamp(date)}`;
      case 'refunded':
        return `Refunded at\n${formatFullTimestamp(date)}`;
      default:
        return 'Status unknown';
    }
  };

  return (
    <Card>
      <div className='flex justify-between items-center'>
        <span className='font-mono text-sm'>{shortenAddress(otherParty)}</span>
        <Badge status={payment.status} />
      </div>

      <div className='flex justify-between items-center mt-2'>
        <p className='text-sm text-gray-600 dark:text-gray-400'>
          {formatDate(payment.createdAt)}
        </p>

        <span className={`text-lg font-semibold ${amountColor}`}>
          {displayAmount} ETH
        </span>
      </div>

      <div className='flex justify-between items-center mt-2'>
        <button
          onClick={handleCancelPayment}
          className='transition-colors duration-200'>
          <Trash2
            size={18}
            className='text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-600'
          />
        </button>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className='transition-colors duration-200'>
          {isExpanded ? (
            <Minus
              size={18}
              className='text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            />
          ) : (
            <Plus
              size={18}
              className='text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            />
          )}
        </button>
      </div>

      {isExpanded && (
        <div className='mt-4 pt-4 border-t border-gray-200 dark:border-gray-700'>
          <p className='text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line'>
            {getStatusText(payment.status, payment.createdAt)}
          </p>
        </div>
      )}
    </Card>
  );
}

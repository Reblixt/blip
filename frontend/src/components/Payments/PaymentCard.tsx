import { Card } from '../UI/Card';
import { Badge } from '../UI/Badge';
import { Plus, Minus, Trash2, Check, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { formatEther } from 'viem';
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useChainId,
} from 'wagmi';
import { blipAbi } from '@/contracts/Blip';
import { getBlipAddress } from '@/contracts/addresses';

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
  onRefresh: () => void;
  variant: 'history' | 'protecting';
}

export function PaymentCard({
  payment,
  currentUserWallet,
  onRefresh,
  variant,
}: PaymentCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const chainId = useChainId();
  const blipAddress = getBlipAddress(chainId);

  const isIncoming = payment.recipientWallet === currentUserWallet;
  const otherParty = isIncoming
    ? payment.senderWallet
    : payment.recipientWallet;
  const formattedAmount = formatEther(BigInt(payment.amount));
  const displayAmount = isIncoming
    ? `+${formattedAmount}`
    : `-${formattedAmount}`;
  const amountColor = isIncoming ? 'text-green-500' : 'text-gray-500';

  const { data: hash, writeContract } = useWriteContract();

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

  const handleCancelPayment = () => {
    writeContract({
      abi: blipAbi,
      address: blipAddress,
      functionName: 'cancelPendingPayment',
      args: [BigInt(payment.contractId)],
    });
  };

  const handleAcceptPayment = () => {
    console.log('Accept payment:', payment.id);
    writeContract({
      abi: blipAbi,
      address: blipAddress,
      functionName: 'approvePayment',
      args: [BigInt(payment.contractId)],
    });
  };

  const handleDeclinePayment = () => {
    console.log('Decline payment:', payment.id);
    writeContract({
      abi: blipAbi,
      address: blipAddress,
      functionName: 'rejectPayment',
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
      {variant === 'history' ? (
        <div className='flex justify-between items-center'>
          <div>
            <p className='text-xs text-gray-500 dark:text-gray-400 mb-1'>
              From:
            </p>
            <span className='font-mono text-sm'>
              {shortenAddress(otherParty)}
            </span>
          </div>
          <Badge status={payment.status} />
        </div>
      ) : (
        <div className='flex justify-between items-start'>
          <div className='space-y-2'>
            <div>
              <p className='text-xs text-gray-500 dark:text-gray-400'>From:</p>
              <span className='font-mono text-sm'>
                {shortenAddress(payment.senderWallet)}
              </span>
            </div>
            <div>
              <p className='text-xs text-gray-500 dark:text-gray-400'>To:</p>
              <span className='font-mono text-sm'>
                {shortenAddress(payment.recipientWallet)}
              </span>
            </div>
          </div>
          <Badge status={payment.status} />
        </div>
      )}

      <div className='flex justify-between items-center mt-2'>
        <p className='text-sm text-gray-600 dark:text-gray-400'>
          {formatDate(payment.createdAt)}
        </p>

        <span className={`text-lg font-semibold ${amountColor}`}>
          {displayAmount} ETH
        </span>
      </div>

      <div className='flex justify-between items-center mt-2'>
        {variant === 'history' ? (
          <button
            onClick={handleCancelPayment}
            className='transition-colors duration-200'>
            <Trash2
              size={18}
              className='text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-600'
            />
          </button>
        ) : (
          <div className='flex gap-2'>
            {payment.status === 'pending' ? (
              <>
                <button
                  onClick={handleAcceptPayment}
                  className='transition-colors duration-200'>
                  <Check
                    size={18}
                    className='text-green-500 hover:text-green-700 dark:text-green-400 dark:hover:text-green-600'
                  />
                </button>
                <button
                  onClick={handleDeclinePayment}
                  className='transition-colors duration-200'>
                  <X
                    size={18}
                    className='text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-600'
                  />
                </button>
              </>
            ) : (
              <div className='text-sm text-gray-500 dark:text-gray-400'>
                {payment.status === 'approved' || payment.status === 'released'
                  ? 'Approved'
                  : 'Declined'}
              </div>
            )}
          </div>
        )}

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

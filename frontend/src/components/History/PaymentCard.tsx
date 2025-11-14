import { Card } from '../UI/Card';
import { Badge } from '../UI/Badge';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

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
  const displayAmount = isIncoming
    ? `+${payment.amount}`
    : `-${payment.amount}`;
  const amountColor = isIncoming ? 'text-green-500' : 'text-gray-500';

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

  return (
    <Card>
      <div className='flex items-start justify-between'>
        <Badge status={payment.status} />
        <span className={`text-2xl font-semibold ${amountColor}`}>
          {displayAmount} ETH
        </span>
      </div>

      <div className='mt-4 space-y-2'>
        <p className='text-sm text-gray-600 dark:text-gray-400'>
          {isIncoming ? 'From: ' : 'To: '}
          <span className='font-mono'>{shortenAddress(otherParty)}</span>
        </p>

        <p className='text-xs text-gray-500'>{formatDate(payment.createdAt)}</p>
      </div>

      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className='mt-4 flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors'>
        <span>{isExpanded ? 'Show less' : 'Show more'}</span>
        <ChevronDown
          size={16}
          className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
        />
      </button>

      {isExpanded && (
        <div className='mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3'>
          {payment.tokenAddress && (
            <p className='text-sm text-gray-600 dark:text-gray-400'>
              Token address:{' '}
              <span className='font-mono'>
                {shortenAddress(payment.tokenAddress)}
              </span>
            </p>
          )}
          {payment.message && (
            <p className='text-sm text-gray-600 dark:text-gray-400'>
              Message: <span className='font-mono'>{payment.message}</span>
            </p>
          )}

          {payment.approvals.filter((a) => a.approved).length > 0 && (
            <div className='text-sm text-gray-600 dark:text-gray-400'>
              <span>Approved by: </span>
              <span className='font-mono'>
                {payment.approvals
                  .filter((a) => a.approved)
                  .map((a) => shortenAddress(a.guardianWallet))
                  .join(', ')}
              </span>
            </div>
          )}

          <p className='text-xs text-gray-500'>
            {formatFullTimestamp(payment.createdAt)}
          </p>
        </div>
      )}
    </Card>
  );
}

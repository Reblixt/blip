import { PaymentCard } from './PaymentCard';

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

interface PaymentListProps {
  payments: Payment[];
  currentUserWallet: string;
  onRefresh: () => void;
}

export function PaymentList({
  payments,
  currentUserWallet,
  onRefresh,
}: PaymentListProps) {
  return (
    <div className='p-4 pb-32'>
      <h1 className='text-2xl font-bold mb-4'>History</h1>
      <div className='space-y-4'>
        {payments.map((payment) => (
          <PaymentCard
            key={payment.id}
            payment={payment}
            currentUserWallet={currentUserWallet}
            onRefresh={onRefresh}
          />
        ))}
      </div>
    </div>
  );
}

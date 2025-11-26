'use client';
import { useState } from 'react';
import { PaymentList } from './PaymentList';

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

interface PaymentTabsProps {
  payments: Payment[];
  currentUserWallet: string;
  onRefresh: () => void;
}

export function PaymentTabs({
  payments,
  currentUserWallet,
  onRefresh,
}: PaymentTabsProps) {
  const [activeTab, setActiveTab] = useState('history');

  const historyPayments = payments.filter((payment) => {
    return (
      payment.senderWallet.toLowerCase() === currentUserWallet.toLowerCase() ||
      payment.recipientWallet.toLowerCase() === currentUserWallet.toLowerCase()
    );
  });

  const protectingPayments = payments.filter((payment) => {
    return payment.approvals.some(
      (approval) =>
        approval.guardianWallet.toLowerCase() ===
        currentUserWallet.toLowerCase()
    );
  });

  return (
    <div className='p-4 pb-32'>
      <div className='flex justify-center gap-8 mb-6'>
        <h1
          onClick={() => setActiveTab('history')}
          className={`
            pb-2 cursor-pointer transition-all duration-200 text-2xl
            ${
              activeTab === 'history'
                ? 'text-gray-900 dark:text-white font-semibold border-b-2 border-blue-500'
                : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
            }
          `}>
          History
        </h1>

        <h1
          onClick={() => setActiveTab('protecting')}
          className={`
            pb-2 cursor-pointer transition-all duration-200 text-2xl
            ${
              activeTab === 'protecting'
                ? 'text-gray-900 dark:text-white font-semibold border-b-2 border-blue-500'
                : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
            }
          `}>
          Protecting
        </h1>
      </div>

      <div>
        {activeTab === 'history' ? (
          <PaymentList
            payments={historyPayments}
            currentUserWallet={currentUserWallet}
            onRefresh={onRefresh}
            variant='history'
          />
        ) : (
          <PaymentList
            payments={protectingPayments}
            currentUserWallet={currentUserWallet}
            onRefresh={onRefresh}
            variant='protecting'
          />
        )}
      </div>
    </div>
  );
}

'use client';
import { useState, useEffect } from 'react';
import { PaymentTabs } from './PaymentTabs';
import { ShowPaymentsButton } from './ShowPaymentsButton';

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

const BOB_ADDRESS = process.env.NEXT_PUBLIC_BOB_ADDRESS!;
const ALICE_ADDRESS = process.env.NEXT_PUBLIC_ALICE_ADDRESS!;
const CHARLIE_ADDRESS = process.env.NEXT_PUBLIC_CHARLIE_ADDRESS!;
const BACKEND_URL = 'http://localhost:3001';

export default function PaymentManager() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isListVisible, setIsListVisible] = useState<boolean>(false);

  const handleRefresh = () => {
    fetchPayments();
  };

  async function fetchPayments() {
    const response = await fetch(`${BACKEND_URL}/payments`);
    const data = await response.json();
    setPayments(data);
  }

  const handleShowList = () => {
    setIsListVisible(true);
  };

  useEffect(() => {
    if (isListVisible === true) {
      fetchPayments();
    }
  }, [isListVisible]);

  return (
    <>
      {isListVisible ? (
        <PaymentTabs
          payments={payments}
          currentUserWallet={BOB_ADDRESS}
          onRefresh={handleRefresh}
        />
      ) : (
        <ShowPaymentsButton onClick={handleShowList} />
      )}
    </>
  );
}

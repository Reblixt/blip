'use client';
import { useState, useEffect } from 'react';
import { PaymentList } from './PaymentList';
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

const RECIPIENT_ALICE_ADDRESS = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
const BACKEND_URL = 'http://localhost:3001';

export default function PaymentManager() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isListVisible, setIsListVisible] = useState<boolean>(false);

  const handleRefresh = () => {
    fetchPayments();
  };

  async function fetchPayments() {
    const response = await fetch(
      `${BACKEND_URL}/payments?recipientWallet=${RECIPIENT_ALICE_ADDRESS}`
    );
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
        <PaymentList
          payments={payments}
          currentUserWallet={RECIPIENT_ALICE_ADDRESS}
          onRefresh={handleRefresh}
        />
      ) : (
        <ShowPaymentsButton onClick={handleShowList} />
      )}
    </>
  );
}

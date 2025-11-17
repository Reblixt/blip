'use client';
import { useState } from 'react';
import { ShowSendPaymentButton } from './ShowSendPaymentButton';
import { SendPaymentForm } from './SendPaymentForm';

export default function SendPaymentManager() {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const handleShowForm = () => {
    setIsFormVisible(true);
  };
  return (
    <>
      {isFormVisible ? (
        <SendPaymentForm />
      ) : (
        <ShowSendPaymentButton onClick={handleShowForm} />
      )}
    </>
  );
}

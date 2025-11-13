'use client';
import { useState, useEffect } from 'react';
import { GuardianList } from './GuardianList';
import { ProposeGuardianButton } from './ProposeGuardianButton';

interface Guardian {
  id: string;
  recipientWallet: string;
  guardianWallet: string;
  status: string;
  createdAt: string;
}

const RECIPIENT_ALICE_ADDRESS = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';

export default function GuardianManager() {
  const [guardians, setGuardians] = useState<Guardian[]>([]);

  async function fetchGuardians() {
    const response = await fetch(
      `http://localhost:3001/users/${RECIPIENT_ALICE_ADDRESS}/guardians`
    );
    const data = await response.json();
    setGuardians(data);
  }

  useEffect(() => {
    fetchGuardians();
  }, []);

  const handleDelete = (wallet: string) => {
    console.log('Delete:', wallet);
  };

  return (
    <>
      <GuardianList guardians={guardians} onDelete={handleDelete} />
      <ProposeGuardianButton onClick={() => console.log('Propose clicked!')} />
    </>
  );
}

'use client';
import { useState, useEffect } from 'react';
import { GuardianList } from './GuardianList';
import { ProposeGuardianButton } from './ProposeGuardianButton';
import { useWriteContract } from 'wagmi';
import { blipAbi } from '@/contracts/Blip';
import { Address } from 'viem';

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

  const { writeContract } = useWriteContract();

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

  const handleProposeGuardian = () => {
    writeContract({
      abi: blipAbi,
      address: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
      functionName: 'proposeGuardian',
      args: ['0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC' as Address],
    });
  };

  return (
    <>
      <GuardianList guardians={guardians} onDelete={handleDelete} />
      <ProposeGuardianButton onClick={() => handleProposeGuardian()} />
    </>
  );
}

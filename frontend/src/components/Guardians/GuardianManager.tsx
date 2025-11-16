'use client';
import { useState, useEffect } from 'react';
import { GuardianList } from './GuardianList';
import { ProposeGuardianButton } from './ProposeGuardianButton';
import { ProposeGuardianInput } from './ProposeGuardianInput';
import { useWriteContract } from 'wagmi';
import { blipAbi, BLIP_CONTRACT_ADDRESS } from '@/contracts/Blip';
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
  const [input, setInput] = useState(false);

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

  const handleProposeGuardian = (guardianAddress: string) => {
    writeContract({
      abi: blipAbi,
      address: BLIP_CONTRACT_ADDRESS,
      functionName: 'proposeGuardian',
      args: [guardianAddress as Address],
    });

    setInput(false);
  };

  const openInput = () => {
    setInput(true);
  };

  return (
    <>
      <GuardianList guardians={guardians} onDelete={handleDelete} />
      {input ? (
        <ProposeGuardianInput onSubmit={handleProposeGuardian} />
      ) : (
        <ProposeGuardianButton onClick={openInput} />
      )}
    </>
  );
}

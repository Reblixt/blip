'use client';
import { useState, useEffect } from 'react';
import { GuardianTabs } from './GuardianTabs';
import { ProposeGuardianButton } from './ProposeGuardianButton';
import { ProposeGuardianInput } from './ProposeGuardianInput';
import { ShowGuardiansButton } from './ShowGuardiansButton';

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
  const [isListVisible, setIsListVisible] = useState(false);
  const [isInputOpen, setIsInputOpen] = useState(false);

  const handleRefresh = () => {
    fetchGuardians();
  };

  async function fetchGuardians() {
    const response = await fetch('http://localhost:3001/users/guardians/all');
    const data = await response.json();
    setGuardians(data);
  }

  useEffect(() => {
    if (isListVisible) {
      fetchGuardians();
    }
  }, [isListVisible]);

  const handleDelete = (wallet: string) => {
    console.log('Delete:', wallet);
  };

  const handleCloseInput = () => {
    setIsInputOpen(false);
  };

  const openInput = () => {
    setIsInputOpen(true);
  };

  const handleShowGuardians = () => {
    setIsListVisible(true);
  };

  return (
    <>
      {!isListVisible ? (
        <ShowGuardiansButton onClick={handleShowGuardians} />
      ) : (
        <>
          <GuardianTabs
            guardians={guardians}
            currentUserWallet={RECIPIENT_ALICE_ADDRESS}
            onRefresh={handleRefresh}
          />
          {isInputOpen ? (
            <ProposeGuardianInput
              onClose={handleCloseInput}
              onRefresh={handleRefresh}
            />
          ) : (
            <ProposeGuardianButton onClick={openInput} />
          )}
        </>
      )}
    </>
  );
}

'use client';

import { useState, useEffect } from 'react';

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

  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold mb-4'>Guardian Manager</h1>
      <p className='text-gray-600'>Number of guardians: {guardians.length}</p>

      <ul className='mt-4'>
        {guardians.map((guardian) => (
          <li key={guardian.id}>
            {guardian.guardianWallet} ({guardian.status})
          </li>
        ))}
      </ul>
    </div>
  );
}

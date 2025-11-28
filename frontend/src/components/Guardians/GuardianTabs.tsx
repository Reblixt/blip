'use client';
import { useState } from 'react';
import { GuardianList } from './GuardianList';

interface Guardian {
  id: string;
  recipientWallet: string;
  guardianWallet: string;
  status: string;
  createdAt: string;
}

interface GuardianTabsProps {
  guardians: Guardian[];
  currentUserWallet: string;
  onRefresh: () => void;
}

export function GuardianTabs({
  guardians,
  currentUserWallet,
  onRefresh,
}: GuardianTabsProps) {
  const [activeTab, setActiveTab] = useState('guardians');

  const myGuardians = guardians.filter((guardians) => {
    return (
      guardians.recipientWallet.toLowerCase() ===
      currentUserWallet.toLowerCase()
    );
  });

  const asGuardian = guardians.filter((guardians) => {
    return (
      guardians.guardianWallet.toLowerCase() === currentUserWallet.toLowerCase()
    );
  });

  const handleDelete = (wallet: string) => {
    console.log('Delete:', wallet);
  };

  return (
    <div className='p-4 pb-32'>
      <div className='flex justify-center gap-8 mb-6'>
        <h1
          onClick={() => setActiveTab('guardians')}
          className={`
            pb-2 cursor-pointer transition-all duration-200 text-2xl
            ${
              activeTab === 'guardians'
                ? 'text-gray-900 dark:text-white font-semibold border-b-2 border-blue-500'
                : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
            }
          `}>
          Guardians
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
        {activeTab === 'guardians' ? (
          <GuardianList
            guardians={myGuardians}
            onRefresh={onRefresh}
            onDelete={handleDelete}
            variant='guardians'
          />
        ) : (
          <GuardianList
            guardians={asGuardian}
            onRefresh={onRefresh}
            onDelete={handleDelete}
            variant='protecting'
          />
        )}
      </div>
    </div>
  );
}

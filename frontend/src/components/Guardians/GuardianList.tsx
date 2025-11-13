import { GuardianCard } from './GuardianCard';

interface Guardian {
  id: string;
  recipientWallet: string;
  guardianWallet: string;
  status: string;
  createdAt: string;
}

interface GuardianListProps {
  guardians: Guardian[];
  onDelete: (guardianWallet: string) => void;
}

export function GuardianList({ guardians, onDelete }: GuardianListProps) {
  return (
    <div className='p-4 pb-32'>
      <h1 className='text-2xl font-bold mb-4'>Guardians</h1>
      <div className='space-y-4'>
        {guardians.map((guardian) => (
          <GuardianCard
            key={guardian.id}
            guardian={guardian}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}

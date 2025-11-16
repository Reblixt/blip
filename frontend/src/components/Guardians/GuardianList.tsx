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
  onRefresh: () => void;
}

export function GuardianList({
  guardians,
  onDelete,
  onRefresh,
}: GuardianListProps) {
  return (
    <div className='p-4 pb-32'>
      <h1 className='text-2xl font-bold mb-4'>Guardians</h1>
      <div className='space-y-4'>
        {guardians.map((guardian) => (
          <GuardianCard
            key={guardian.id}
            guardian={guardian}
            onDelete={onDelete}
            onRefresh={onRefresh}
          />
        ))}
      </div>
    </div>
  );
}

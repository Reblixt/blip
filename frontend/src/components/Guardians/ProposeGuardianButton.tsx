import { ShieldPlus } from 'lucide-react';

interface ProposeGuardianButtonProps {
  onClick: () => void;
}

export function ProposeGuardianButton({ onClick }: ProposeGuardianButtonProps) {
  return (
    <div className='fixed bottom-24 left-0 right-0 flex justify-center z-40 px-4'>
      <button
        onClick={onClick}
        className='
      w-full sm:w-auto
      bg-blue-500
      hover:bg-blue-600
      text-white
      px-6
      py-4 sm:py-3
      text-lg sm:text-sm
      rounded-xl
      shadow-lg
      flex
      items-center
      justify-center
      gap-2
      transition-colors
      duration-200
    '>
        <ShieldPlus size={24} />
        <span className='font-semibold'>Propose guardian</span>
      </button>
    </div>
  );
}

interface ShowHistoryButtonProps {
  onClick: () => void;
}

export function ShowPaymentsButton({ onClick }: ShowHistoryButtonProps) {
  return (
    <button
      onClick={onClick}
      className='      w-full sm:w-auto
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
      duration-200'>
      Visa historik
    </button>
  );
}

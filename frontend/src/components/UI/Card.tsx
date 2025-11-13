// components/ui/Card.tsx

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={`
         rounded-lg
        shadow-md
        p-4
        bg-white
        dark:bg-gray-800
        border
        border-gray-200
        dark:border-gray-700
        ${className}
      `}>
      {children}
    </div>
  );
}

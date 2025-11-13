import Header from './Header';
import BottomNav from './BottomNav';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  return (
    <>
      <Header />

      <main className='pt-16 pb-20 min-h-screen bg-white dark:bg-gray-900'>
        {children}
      </main>

      <BottomNav />
    </>
  );
}

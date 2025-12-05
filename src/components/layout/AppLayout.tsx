import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';

export const AppLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <main className="pb-24">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
};

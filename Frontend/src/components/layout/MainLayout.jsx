import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import MobileHeader from './MobileHeader';

const MainLayout = () => {
  return (
    <div className="flex bg-dark min-h-screen text-white">
      <Sidebar />
      <MobileHeader />
      <main className="flex-1 md:ml-64 pt-16 md:pt-0 pb-24 md:pb-6 relative min-h-screen overflow-x-hidden">
        <div className="max-w-4xl mx-auto w-full h-full">
          <Outlet />
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default MainLayout;

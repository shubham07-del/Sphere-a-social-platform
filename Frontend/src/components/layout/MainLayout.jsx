import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';

const MainLayout = () => {
  return (
    <div className="flex bg-dark min-h-screen text-white">
      <Sidebar />
      <main className="flex-1 md:ml-64 pb-24 md:pb-6 relative min-h-screen overflow-x-hidden">
        <div className="max-w-4xl mx-auto w-full">
          <Outlet />
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default MainLayout;

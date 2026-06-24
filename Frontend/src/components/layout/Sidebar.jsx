import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, Compass, MessageCircle, Heart, PlusSquare, User, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
  { name: 'Home', icon: Home, path: '/' },
  { name: 'Search', icon: Search, path: '/search' },
  { name: 'Explore', icon: Compass, path: '/explore' },
  { name: 'Messages', icon: MessageCircle, path: '/messages' },
  { name: 'Notifications', icon: Heart, path: '/notifications' },
  { name: 'Create', icon: PlusSquare, path: '/create' },
  { name: 'Profile', icon: User, path: '/profile' },
];

const Sidebar = () => {
  return (
    <div className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 border-r border-border glass z-50">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gradient mb-8 tracking-tighter">PremiumApp</h1>
        
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-4 p-3 rounded-xl transition-all relative ${
                  isActive ? 'text-white font-medium' : 'text-gray-400 hover:text-white glass-hover'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute inset-0 bg-primary/10 rounded-xl border border-primary/20"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    />
                  )}
                  <item.icon className={`w-6 h-6 relative z-10 ${isActive ? 'text-primary' : ''}`} />
                  <span className="relative z-10 text-lg">{item.name}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6">
        <NavLink
          to="/settings"
          className="flex items-center gap-4 p-3 rounded-xl text-gray-400 hover:text-white glass-hover transition-all"
        >
          <Settings className="w-6 h-6" />
          <span className="text-lg">Settings</span>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;

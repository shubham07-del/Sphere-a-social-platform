import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, PlusSquare, Heart, User } from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
  { name: 'Home', icon: Home, path: '/' },
  { name: 'Search', icon: Search, path: '/search' },
  { name: 'Create', icon: PlusSquare, path: '/create', special: true },
  { name: 'Notifications', icon: Heart, path: '/notifications' },
  { name: 'Profile', icon: User, path: '/profile' },
];

const BottomNav = () => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full h-16 glass border-t border-border z-50 flex items-center justify-around px-2">
      {navItems.map((item) => (
        <NavLink
          key={item.name}
          to={item.path}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center p-2 rounded-xl transition-all relative ${
              item.special ? '-mt-6 bg-linear-to-tr from-primary to-secondary p-3 rounded-full shadow-lg shadow-primary/30 text-white' : 
              (isActive ? 'text-primary' : 'text-gray-400')
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive && !item.special && (
                <motion.div
                  layoutId="bottom-nav-active"
                  className="absolute -top-1 w-1 h-1 bg-primary rounded-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
              )}
              <item.icon className={item.special ? 'w-6 h-6' : 'w-6 h-6'} />
            </>
          )}
        </NavLink>
      ))}
    </div>
  );
};

export default BottomNav;

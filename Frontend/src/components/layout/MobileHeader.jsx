import React from 'react';
import { NavLink } from 'react-router-dom';
import { Compass, MessageCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const MobileHeader = () => {
  const { user } = useAuth();

  return (
    <div className="md:hidden fixed top-0 left-0 w-full h-16 glass border-b border-border z-50 flex items-center justify-between px-4">
      {/* Logo */}
      <NavLink to="/" className="text-2xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
        Sphere
      </NavLink>

      {/* Right Icons */}
      <div className="flex items-center gap-4">
        <NavLink 
          to="/explore" 
          className={({ isActive }) => 
            `p-2 transition-colors ${isActive ? 'text-primary' : 'text-gray-300 hover:text-white'}`
          }
        >
          <Compass className="w-6 h-6" />
        </NavLink>
        
        <NavLink 
          to="/messages" 
          className={({ isActive }) => 
            `p-2 transition-colors ${isActive ? 'text-primary' : 'text-gray-300 hover:text-white'}`
          }
        >
          <MessageCircle className="w-6 h-6" />
        </NavLink>
      </div>
    </div>
  );
};

export default MobileHeader;

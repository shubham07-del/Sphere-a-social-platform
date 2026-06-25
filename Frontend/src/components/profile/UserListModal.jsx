import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Avatar from '../ui/Avatar';

const UserListModal = ({ title, users, onClose }) => {
  const navigate = useNavigate();

  const handleUserClick = (userId) => {
    onClose();
    navigate(`/profile/${userId}`);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-sm bg-dark rounded-2xl flex flex-col shadow-2xl border border-border h-[60vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-border bg-dark">
          <h2 className="text-white font-bold text-lg">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* User List */}
        <div className="flex-1 overflow-y-auto p-2 hide-scrollbar">
          {users.length === 0 ? (
            <div className="text-center text-gray-500 py-8 text-sm">No users found</div>
          ) : (
            users.map(user => (
              <div 
                key={user._id}
                onClick={() => handleUserClick(user._id)}
                className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-white/5 transition-colors"
              >
                <Avatar src={user.profilePic} size="md" />
                <div className="flex flex-col">
                  <span className="text-white font-semibold text-sm">{user.name || user.username}</span>
                  <span className="text-gray-500 text-xs">@{user.username}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default UserListModal;

import React from 'react';
import { motion } from 'framer-motion';
import Avatar from '../ui/Avatar';

const StoryCard = ({ user, isAdd, onClick }) => {
  return (
    <motion.div 
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="flex flex-col items-center gap-2 cursor-pointer w-[72px]"
      onClick={onClick}
    >
      <div className="relative">
        <Avatar 
          src={user?.profilePic} 
          size="lg" 
          hasStory={!isAdd} 
          className={isAdd ? "border-dashed border-gray-500" : ""}
        />
        {isAdd && (
          <div className="absolute bottom-0 right-0 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold border-2 border-dark">
            +
          </div>
        )}
      </div>
      <span className="text-xs text-gray-300 truncate w-full text-center">
        {isAdd ? 'Your Story' : user?.username}
      </span>
    </motion.div>
  );
};

export default StoryCard;

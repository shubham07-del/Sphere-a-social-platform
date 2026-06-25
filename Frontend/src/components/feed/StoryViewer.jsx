import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import Avatar from '../ui/Avatar';

const StoryViewer = ({ stories, initialIndex = 0, onClose }) => {
  const [userIndex, setUserIndex] = useState(initialIndex);
  const [storyIndex, setStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const currentUserGroup = stories[userIndex];
  const currentStory = currentUserGroup?.stories[storyIndex];

  useEffect(() => {
    // Reset progress when story changes
    setProgress(0);
    
    // 5-second timer for each story
    const duration = 5000;
    const interval = 50; // Update every 50ms
    const steps = duration / interval;
    
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + (100 / steps);
      });
    }, interval);

    return () => clearInterval(timer);
  }, [userIndex, storyIndex, stories.length]);

  const handleNext = () => {
    if (storyIndex < currentUserGroup.stories.length - 1) {
      setStoryIndex(prev => prev + 1);
    } else if (userIndex < stories.length - 1) {
      setUserIndex(prev => prev + 1);
      setStoryIndex(0);
    } else {
      onClose(); // Close if it's the very last story
    }
  };

  const handlePrev = () => {
    if (storyIndex > 0) {
      setStoryIndex(prev => prev - 1);
      setProgress(0);
    } else if (userIndex > 0) {
      setUserIndex(prev => prev - 1);
      setStoryIndex(stories[userIndex - 1].stories.length - 1);
      setProgress(0);
    } else {
      // If first story and tapping left, restart it
      setProgress(0);
    }
  };

  if (!currentStory) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col sm:p-4">
      {/* Desktop wrapper */}
      <div className="flex-1 w-full max-w-md mx-auto relative bg-dark sm:rounded-2xl overflow-hidden flex flex-col shadow-2xl">
        
        {/* Progress Bars */}
        <div className="absolute top-0 left-0 right-0 z-20 flex gap-1 p-2 pt-4 px-3 bg-gradient-to-b from-black/60 to-transparent">
          {currentUserGroup?.stories.map((_, idx) => (
            <div key={idx} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white transition-all duration-75 ease-linear"
                style={{ 
                  width: idx === storyIndex ? `${progress}%` : 
                         idx < storyIndex ? '100%' : '0%' 
                }}
              />
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="absolute top-6 left-0 right-0 z-20 flex justify-between items-center px-4">
          <div className="flex items-center gap-3">
            <Avatar src={currentUserGroup.user?.profilePic} size="sm" />
            <span className="text-white font-bold text-sm drop-shadow-md">
              {currentUserGroup.user?.username}
            </span>
            <span className="text-white/70 text-xs drop-shadow-md">
              {new Date(currentStory.createdAt).getHours()}h
            </span>
          </div>
          <button 
            onClick={onClose}
            className="text-white drop-shadow-md p-1 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Image Content */}
        <div className="relative flex-1 bg-black flex items-center justify-center">
          <img 
            src={currentStory.image} 
            alt="Story" 
            className="w-full h-full object-cover"
          />

          {/* Tap Zones for Navigation */}
          <div 
            className="absolute top-0 bottom-0 left-0 w-1/3 z-10 cursor-pointer"
            onClick={handlePrev}
          />
          <div 
            className="absolute top-0 bottom-0 right-0 w-1/3 z-10 cursor-pointer"
            onClick={handleNext}
          />
        </div>

      </div>
    </div>
  );
};

export default StoryViewer;

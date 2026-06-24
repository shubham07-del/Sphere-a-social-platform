import React from 'react';
import { cn } from '../../utils/cn';

const Avatar = ({ src, alt = "Avatar", size = "md", className, hasStory = false }) => {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-14 h-14",
    xl: "w-24 h-24"
  };

  return (
    <div className={cn("relative rounded-full flex-shrink-0", sizes[size], className)}>
      {hasStory && (
        <div className="absolute -inset-1 bg-gradient-to-tr from-primary to-secondary rounded-full animate-pulse-slow" />
      )}
      <img
        src={src || "https://api.dicebear.com/7.x/avataaars/svg?seed=fallback"}
        alt={alt}
        className="w-full h-full object-cover rounded-full border-2 border-dark relative z-10"
      />
    </div>
  );
};

export default Avatar;

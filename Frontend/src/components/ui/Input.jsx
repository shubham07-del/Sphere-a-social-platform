import React from 'react';
import { cn } from '../../utils/cn';

const Input = React.forwardRef(({ className, icon: Icon, error, ...props }, ref) => {
  return (
    <div className="relative w-full">
      {Icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          <Icon className="w-5 h-5" />
        </div>
      )}
      <input
        ref={ref}
        className={cn(
          "w-full bg-card border border-border text-white rounded-xl px-4 py-3 placeholder:text-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all",
          Icon && "pl-12",
          error && "border-red-500 focus:border-red-500 focus:ring-red-500",
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;

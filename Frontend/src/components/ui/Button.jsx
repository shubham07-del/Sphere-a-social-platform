import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

const Button = ({ children, variant = "primary", className, fullWidth, onClick, disabled, ...props }) => {
  const baseStyles = "relative inline-flex items-center justify-center font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/20",
    secondary: "glass text-white hover:bg-white/10",
    ghost: "text-gray-400 hover:text-white hover:bg-white/5",
    danger: "bg-red-500/10 text-red-500 hover:bg-red-500/20"
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={cn(
        baseStyles,
        variants[variant],
        fullWidth ? "w-full" : "",
        "px-6 py-3",
        className
      )}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  );
};

export default Button;

import React from 'react';
import { motion } from 'framer-motion';

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}) {
  const baseStyles =
  'relative overflow-hidden font-medium tracking-wide transition-all duration-500 font-sans flex items-center justify-center';
  const variants = {
    primary: 'bg-gold-400 text-black hover:bg-white hover:text-black',
    outline:
    'border border-gold-400/30 text-gold-400 hover:border-gold-400 hover:bg-gold-400/10',
    ghost: 'text-white/70 hover:text-gold-400'
  };
  const sizes = {
    sm: 'px-4 py-2 text-xs uppercase',
    md: 'px-8 py-3 text-sm uppercase',
    lg: 'px-10 py-4 text-base uppercase'
  };
  return (
    <motion.button
      whileHover={{
        scale: 1.02
      }}
      whileTap={{
        scale: 0.98
      }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}>

      {children}
    </motion.button>);

}
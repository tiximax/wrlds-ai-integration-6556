
import React from 'react';
import { motion } from 'framer-motion';

interface LoadingAnimationProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'dots' | 'pulse' | 'wave';
  className?: string;
}

export const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ 
  size = 'md', 
  variant = 'dots',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4', 
    lg: 'w-6 h-6'
  };

  const spacing = {
    sm: 8,
    md: 12,
    lg: 16
  };

  if (variant === 'pulse') {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <motion.div
          className={`${sizeClasses[size]} rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500`}
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
    );
  }

  if (variant === 'wave') {
    return (
      <div className={`flex items-center justify-center space-x-1 ${className}`}>
        {[0, 1, 2, 3, 4].map((index) => (
          <motion.div
            key={index}
            className={`${sizeClasses[size]} bg-gradient-to-t from-blue-500 to-purple-500 rounded-full`}
            animate={{
              scaleY: [1, 2, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: index * 0.1,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    );
  }

  // Default dots variant with improved styling
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="relative">
        {[0, 1, 2, 3].map((index) => (
          <motion.span
            key={index}
            className={`absolute inline-block ${sizeClasses[size]} rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-lg`}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [1, 0.6, 1],
              y: [0, -8, 0]
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              repeatType: "loop",
              delay: index * 0.15,
              ease: "easeInOut"
            }}
            style={{
              left: `${index * spacing[size]}px`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default LoadingAnimation;

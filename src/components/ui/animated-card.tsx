import React from 'react';
import { motion, Variants } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'hover-lift' | 'hover-glow' | 'gradient-border';
  animation?: 'fade-up' | 'scale' | 'slide-left' | 'slide-right';
  delay?: number;
  interactive?: boolean;
}

const cardVariants: Record<string, Variants> = {
  'fade-up': {
    hidden: { 
      opacity: 0, 
      y: 20 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  },
  'scale': {
    hidden: { 
      opacity: 0, 
      scale: 0.9 
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  },
  'slide-left': {
    hidden: { 
      opacity: 0, 
      x: -20 
    },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  },
  'slide-right': {
    hidden: { 
      opacity: 0, 
      x: 20 
    },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  }
};

const interactiveVariants: Variants = {
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.2,
      ease: "easeInOut"
    }
  },
  tap: {
    scale: 0.98,
    transition: {
      duration: 0.1,
      ease: "easeInOut"
    }
  }
};

export const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  className,
  variant = 'default',
  animation = 'fade-up',
  delay = 0,
  interactive = false
}) => {
  const baseClasses = "relative rounded-xl border border-gray-100 bg-white shadow-sm transition-all duration-300";
  
  const variantClasses = {
    default: "hover:shadow-md",
    'hover-lift': "hover:shadow-lg hover:-translate-y-1",
    'hover-glow': "hover:shadow-lg hover:shadow-blue-100 hover:border-blue-200",
    'gradient-border': "bg-gradient-to-r from-white to-gray-50 border-transparent bg-clip-padding before:absolute before:inset-0 before:-z-10 before:bg-gradient-to-r before:from-blue-500 before:to-purple-500 before:opacity-0 hover:before:opacity-10 before:rounded-xl before:transition-opacity before:duration-300"
  };

  const motionProps = {
    initial: "hidden",
    animate: "visible",
    variants: cardVariants[animation],
    transition: { delay },
    ...(interactive && {
      whileHover: "hover",
      whileTap: "tap",
      variants: {
        ...cardVariants[animation],
        ...interactiveVariants
      }
    })
  };

  return (
    <motion.div
      className={cn(
        baseClasses,
        variantClasses[variant],
        className
      )}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedCard;

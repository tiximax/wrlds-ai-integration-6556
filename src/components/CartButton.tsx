import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CartButtonProps {
  onClick: () => void;
  variant?: 'default' | 'floating' | 'compact';
  showLabel?: boolean;
  className?: string;
}

export const CartButton: React.FC<CartButtonProps> = ({ 
  onClick, 
  variant = 'default',
  showLabel = false,
  className 
}) => {
  const { totalItems } = useCart();

  const buttonVariants = {
    default: "relative p-3 hover:scale-105 transition-all duration-200",
    floating: "relative p-4 rounded-full shadow-lg hover:shadow-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 hover:from-blue-600 hover:to-purple-600",
    compact: "relative p-2 hover:bg-gray-100"
  };

  const iconSizes = {
    default: "w-5 h-5",
    floating: "w-6 h-6",
    compact: "w-4 h-4"
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Button
        variant={variant === 'floating' ? 'default' : 'outline'}
        onClick={onClick}
        className={cn(buttonVariants[variant], className)}
        data-testid="cart-button"
        aria-label={`Shopping cart${totalItems > 0 ? ` (${totalItems} items)` : ' (empty)'}`}
      >
        <motion.div
          animate={totalItems > 0 ? { rotate: [0, -10, 10, 0] } : {}}
          transition={{ duration: 0.5 }}
        >
          <ShoppingBag className={iconSizes[variant]} />
        </motion.div>
        
        {showLabel && (
          <span className="ml-2 text-sm font-medium">
            Cart{totalItems > 0 && ` (${totalItems})`}
          </span>
        )}
        
        <AnimatePresence>
          {totalItems > 0 && (
            <motion.span
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: 1, 
                opacity: 1,
                transition: {
                  type: "spring",
                  stiffness: 500,
                  damping: 15
                }
              }}
              exit={{ 
                scale: 0, 
                opacity: 0,
                transition: { duration: 0.2 }
              }}
              key={totalItems}
              className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg border-2 border-white"
            >
              <motion.span
                key={totalItems}
                initial={{ scale: 1.5 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                {totalItems > 99 ? '99+' : totalItems}
              </motion.span>
            </motion.span>
          )}
        </AnimatePresence>
        
        {/* Pulse effect for new items */}
        {totalItems > 0 && (
          <motion.div
            className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-20"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.2, 0.1, 0.2]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
      </Button>
    </motion.div>
  );
};

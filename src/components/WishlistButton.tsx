import React from 'react';
import { Heart } from 'lucide-react';
import { useWishlist } from '@/contexts/WishlistContext';
import type { Product } from '@/types/simple';
import { cn } from '@/lib/utils';

interface WishlistButtonProps {
  product: Product;
  className?: string;
}

const WishlistButton: React.FC<WishlistButtonProps> = ({ product, className }) => {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const active = isInWishlist(product.id);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(product as any);
      }}
      className={cn(
        'p-2 rounded-full bg-white/90 hover:bg-white transition-colors shadow-sm',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
        className
      )}
      aria-label={active ? 'Remove from wishlist' : 'Add to wishlist'}
      title={active ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart className={cn('w-4 h-4', active ? 'text-red-500 fill-red-500' : 'text-gray-600 hover:text-red-500')} />
    </button>
  );
};

export default WishlistButton;
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Heart, ShoppingCart } from 'lucide-react';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { useSimpleCart } from '@/contexts/SimpleCartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { cn } from '@/lib/utils';

const BottomNav: React.FC = () => {
  const location = useLocation();
  const { totalItems } = useSimpleCart();
  const { getWishlistCount } = useWishlist();

  const isActive = (path: string) => location.pathname === path;

  const openCart = () => {
    try {
      window.dispatchEvent(new CustomEvent('wrlds:open-cart'));
    } catch {
      // fallback event
      window.dispatchEvent(new Event('wrlds:open-cart'));
    }
  };

  return (
    <div
      className={cn(
        'md:hidden fixed bottom-0 left-0 right-0 z-50 border-t bg-white/95 backdrop-blur supports-[padding:max(0px,env(safe-area-inset-bottom))]:pb-[max(0px,env(safe-area-inset-bottom))]'
      )}
      data-testid="bottom-nav"
    >
      <div className="max-w-screen-xl mx-auto px-3 py-2 grid grid-cols-4 gap-2">
        <Link to="/" className="flex items-center justify-center">
          <EnhancedButton
            variant={isActive('/') ? 'primary' : 'ghost'}
            size="icon"
            aria-label="Go home"
          >
            <Home className="w-5 h-5" />
          </EnhancedButton>
        </Link>

        <Link to="/products?search=" className="flex items-center justify-center">
          <EnhancedButton
            variant={/\/products/i.test(location.pathname) ? 'primary' : 'ghost'}
            size="icon"
            aria-label="Open search"
          >
            <Search className="w-5 h-5" />
          </EnhancedButton>
        </Link>

        <Link to="/wishlist" className="flex items-center justify-center relative">
          <EnhancedButton
            variant={isActive('/wishlist') ? 'primary' : 'ghost'}
            size="icon"
            aria-label="Open wishlist"
          >
            <Heart className="w-5 h-5" />
          </EnhancedButton>
          {getWishlistCount() > 0 && (
            <span className="absolute top-1/2 left-1/2 translate-x-3 -translate-y-3 bg-pink-500 text-white text-[10px] rounded-full min-w-4 h-4 px-1 flex items-center justify-center">
              {getWishlistCount()}
            </span>
          )}
        </Link>

        <div className="flex items-center justify-center relative">
          <EnhancedButton
            variant="ghost"
            size="icon"
            aria-label="Open cart"
            onClick={openCart}
            data-testid="bottomnav-cart-button"
          >
            <ShoppingCart className="w-5 h-5" />
          </EnhancedButton>
          {totalItems > 0 && (
            <span className="absolute top-1/2 left-1/2 translate-x-3 -translate-y-3 bg-red-500 text-white text-[10px] rounded-full min-w-4 h-4 px-1 flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default BottomNav;

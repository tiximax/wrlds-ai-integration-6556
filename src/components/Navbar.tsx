
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Menu, X, ChevronDown, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from 'react-router-dom';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { SimpleCartSidebar } from './SimpleCartSidebar';
import { useSimpleCart } from '@/contexts/SimpleCartContext';
import { ShoppingCart, Heart } from 'lucide-react';
import { EnhancedSearch } from '@/components/ui/enhanced-search';
import { useWishlist } from '@/contexts/WishlistContext';
import CategoryMenu from './CategoryMenu';
import MobileCategoryMenu from './MobileCategoryMenu';
import { MegaMenu } from '@/components/ui/mega-menu';
import { servicesSections, featuredService } from '@/data/mega-menu-data';
import { EnhancedButton } from '@/components/ui/enhanced-button';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { t } = useTranslation();
  const { totalItems } = useSimpleCart();
  const { getWishlistCount } = useWishlist();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);

    // Listen to custom event from BottomNav to open cart
    const openCartListener = () => setIsCartOpen(true);
    window.addEventListener('wrlds:open-cart' as unknown as string, openCartListener as EventListener);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('wrlds:open-cart' as unknown as string, openCartListener as EventListener);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth'
      });
    }
    setIsMenuOpen(false);
  };

  return (
    <motion.nav 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 w-full",
        isScrolled 
          ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/50" 
          : "bg-gradient-to-r from-black/90 via-black/95 to-black/90 backdrop-blur-sm"
      )} 
      initial={{ opacity: 1, y: 0 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        transition: { 
          duration: 0.3,
          ease: "easeInOut"
        }
      }}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img src="/lovable-uploads/7d120ee6-3614-4b75-9c35-716d54490d67.png" alt="WRLDS Technologies Logo" className={cn("h-8 w-auto", isScrolled ? "" : "brightness-0 invert")} />
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <NavigationMenu className={cn(isScrolled ? "" : "text-white")}>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      to="/"
                      className={cn(
                        navigationMenuTriggerStyle(),
                        isScrolled ? "text-gray-700 hover:text-gray-900" : "text-gray-100 hover:text-white bg-transparent hover:bg-gray-800"
                      )}
                    >
                      {t('navigation.home')}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      to="/about"
                      className={cn(
                        navigationMenuTriggerStyle(),
                        isScrolled ? "text-gray-700 hover:text-gray-900" : "text-gray-100 hover:text-white bg-transparent hover:bg-gray-800"
                      )}
                    >
                      {t('navigation.about')}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      to="/products"
                      className={cn(
                        navigationMenuTriggerStyle(),
                        isScrolled ? "text-gray-700 hover:text-gray-900" : "text-gray-100 hover:text-white bg-transparent hover:bg-gray-800"
                      )}
                    >
                      {t('navigation.products')}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      to="/search"
                      className={cn(
                        navigationMenuTriggerStyle(),
                        isScrolled ? "text-gray-700 hover:text-gray-900" : "text-gray-100 hover:text-white bg-transparent hover:bg-gray-800"
                      )}
                    >
                      Search
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                
                <CategoryMenu isScrolled={isScrolled} />
                
                <NavigationMenuItem>
                  <NavigationMenuTrigger 
                    className={cn(
                      "group transition-all duration-200",
                      isScrolled 
                        ? "text-gray-700 hover:text-blue-600 data-[state=open]:text-blue-600" 
                        : "text-gray-100 hover:text-white bg-transparent hover:bg-gray-800 data-[state=open]:bg-gray-800 data-[state=open]:text-white"
                    )}
                  >
                    <motion.div 
                      className="flex items-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform duration-200" />
                      {t('navigation.services')}
                    </motion.div>
                  </NavigationMenuTrigger>
                  <MegaMenu 
                    sections={servicesSections} 
                    featured={featuredService}
                  />
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <NavigationMenuTrigger className={cn(isScrolled ? "text-gray-700 hover:text-gray-900" : "text-gray-100 hover:text-white bg-transparent hover:bg-gray-800")}>
                    {t('navigation.learnMore')}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-4 w-[400px]">
                      <li>
                        <Link to="/tech-details" className="block p-3 space-y-1 rounded-md hover:bg-gray-100">
                          <div className="font-medium">{t('navigation.techDetails')}</div>
                          <p className="text-sm text-gray-500">{t('navigation.techDetailsDesc')}</p>
                        </Link>
                      </li>
                      <li>
                        <Link to="/development-process" className="block p-3 space-y-1 rounded-md hover:bg-gray-100">
                          <div className="font-medium">{t('navigation.devProcess')}</div>
                          <p className="text-sm text-gray-500">{t('navigation.devProcessDesc')}</p>
                        </Link>
                      </li>
                      <li>
                        
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      to="/blog"
                      className={cn(
                        navigationMenuTriggerStyle(),
                        isScrolled ? "text-gray-700 hover:text-gray-900" : "text-gray-100 hover:text-white bg-transparent hover:bg-gray-800"
                      )}
                    >
                      {t('navigation.news')}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      to="/careers"
                      className={cn(
                        navigationMenuTriggerStyle(),
                        isScrolled ? "text-gray-700 hover:text-gray-900" : "text-gray-100 hover:text-white bg-transparent hover:bg-gray-800"
                      )}
                    >
                      {t('navigation.careers')}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <EnhancedButton 
                    onClick={() => scrollToSection('contact')} 
                    variant={isScrolled ? "secondary" : "ghost"}
                    size="sm"
                    className={isScrolled ? "" : "text-white hover:bg-gray-700"}
                  >
                    {t('navigation.contact')}
                  </EnhancedButton>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            
            {/* Enhanced Search Bar */}
            <div className="w-96">
              <EnhancedSearch
                placeholder="Search products, brands..."
                variant={isScrolled ? "navbar" : "navbar"}
                className="transition-all duration-200"
                compact={true}
                showHistory={true}
                showSuggestions={true}
              />
            </div>
            
            {/* Right side controls */}
            <div className="flex items-center space-x-2">
              <LanguageSwitcher />
              <Link
                to="/wishlist"
                className={cn(
                  "relative flex items-center gap-2 px-3 py-2 rounded-md transition-colors",
                  isScrolled ? "text-gray-700 hover:text-gray-900 hover:bg-gray-100" : "text-gray-100 hover:text-white hover:bg-gray-800"
                )}
                aria-label="Open wishlist"
              >
                <Heart className="w-5 h-5" />
                <span className="hidden sm:inline">Wishlist</span>
                {getWishlistCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full min-w-5 h-5 px-1 flex items-center justify-center">
                    {getWishlistCount()}
                  </span>
                )}
              </Link>
              <EnhancedButton
                data-testid="cart-button"
                onClick={() => setIsCartOpen(true)}
                variant="ghost"
                size="sm"
                className={cn(
                  "relative",
                  isScrolled ? "text-gray-700 hover:text-gray-900 hover:bg-gray-100" : "text-gray-100 hover:text-white hover:bg-gray-800"
                )}
                aria-label="Open cart"
                leftIcon={<ShoppingCart className="w-5 h-5" />}
              >
                <span className="hidden sm:inline">Cart</span>
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </EnhancedButton>
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <EnhancedButton
              data-testid="cart-button"
              onClick={() => setIsCartOpen(true)}
              variant="ghost"
              size="icon"
              className={cn(
                "relative w-11 h-11",
                isScrolled ? "text-gray-700 hover:text-gray-900 hover:bg-gray-100" : "text-gray-100 hover:text-white hover:bg-gray-800"
              )}
              aria-label="Open cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </EnhancedButton>
            <EnhancedButton 
              onClick={toggleMenu} 
              variant="ghost" 
              size="icon"
              className={cn("w-11 h-11", isScrolled ? "text-gray-700" : "text-white")}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </EnhancedButton>
          </div>
        </div>
      </div>

      {/* Mobile: Always-visible Search bar */}
      <div className="md:hidden px-4 pb-3">
        <EnhancedSearch
          placeholder="Search products, brands..."
          variant="default"
          className="w-full"
          compact={false}
          showHistory={true}
          showSuggestions={true}
        />
        {/* Quick link to /search for tests that rely on link navigation */}
        <div className="mt-2">
          <Link
            to="/search"
            className="inline-block text-sm text-blue-600 hover:underline"
          >
            Search
          </Link>
        </div>
      </div>

      {/* Enhanced Mobile Navigation Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="md:hidden w-full overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ 
              height: "auto", 
              opacity: 1,
              transition: {
                duration: 0.3,
                ease: "easeOut",
                staggerChildren: 0.05
              }
            }}
            exit={{ 
              height: 0, 
              opacity: 0,
              transition: { duration: 0.2, ease: "easeIn" }
            }}
          >
            <div className={cn(
              "px-4 pt-4 pb-6 space-y-3 shadow-xl border-t",
              isScrolled 
                ? "bg-white/95 backdrop-blur-md border-gray-200/50" 
                : "bg-black/95 backdrop-blur-md border-gray-800/50"
            )}>
              {/* Mobile Enhanced Search Bar */}
              <motion.div 
                className="pb-4"
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <EnhancedSearch
                  placeholder="Search products, brands..."
                  variant="default"
                  className="w-full"
                  compact={false}
                  showHistory={true}
                  showSuggestions={true}
                />
              </motion.div>
          
              {/* Mobile Navigation Links */}
              <div className="space-y-2">
                {[
                  { href: "/", label: t('navigation.home') },
                  { href: "/about", label: t('navigation.about') },
                  { href: "/products", label: t('navigation.products') },
                  { href: "/search", label: 'Search' },
                ].map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                  >
                    <Link 
                      to={link.href} 
                      className={cn(
                        "block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105",
                        isScrolled 
                          ? "text-gray-700 hover:bg-blue-50 hover:text-blue-600" 
                          : "text-gray-200 hover:bg-gray-800 hover:text-white"
                      )} 
                      onClick={() => {
                        setIsMenuOpen(false);
                        window.scrollTo(0, 0);
                      }}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </div>
              
              {/* Mobile Category Menu */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.25 }}
              >
                <MobileCategoryMenu 
                  isScrolled={isScrolled} 
                  onLinkClick={() => {
                    setIsMenuOpen(false);
                    window.scrollTo(0, 0);
                  }} 
                />
              </motion.div>
              
              {/* Additional Links */}
              <div className="space-y-2 pt-2">
                {[
                  { href: "/projects/firecat", label: t('navigation.services') },
                  { href: "/tech-details", label: t('navigation.learnMore') },
                  { href: "/blog", label: t('navigation.news') },
                  { href: "/careers", label: t('navigation.careers') },
                ].map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                  >
                    <Link 
                      to={link.href} 
                      className={cn(
                        "block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105",
                        isScrolled 
                          ? "text-gray-700 hover:bg-blue-50 hover:text-blue-600" 
                          : "text-gray-200 hover:bg-gray-800 hover:text-white"
                      )}
                      onClick={() => {
                        setIsMenuOpen(false);
                        window.scrollTo(0, 0);
                      }}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </div>
              
              {/* Contact Button */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="pt-4"
              >
                <EnhancedButton 
                  onClick={() => scrollToSection('contact')} 
                  variant={isScrolled ? "primary" : "secondary"}
                  size="lg"
                  className="w-full transition-all duration-200 hover:scale-105 shadow-lg"
                >
                  {t('navigation.contact')}
                </EnhancedButton>
              </motion.div>
              
              {/* Language Switcher */}
              <motion.div 
                className="pt-4 border-t border-gray-200/20"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <LanguageSwitcher />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Shopping Cart Sidebar */}
      <SimpleCartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </motion.nav>
  );
};

export default Navbar;


import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import EnhancedFooter from '@/components/EnhancedFooter';
import ContactInfo from '@/components/ContactInfo';
import FloatingContactButton from '@/components/FloatingContactButton';
import BottomNav from '@/components/BottomNav';
import CompareBar from '@/components/products/CompareBar';

type PageLayoutProps = {
  children: React.ReactNode;
  showContact?: boolean;
};

const PageLayout = ({ children, showContact = true }: PageLayoutProps) => {
  const location = useLocation();

  // Effect to scroll to top when route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="min-h-screen bg-white w-full max-w-[100vw] overflow-x-hidden">
      <Navbar />
      {children}
      {showContact && <ContactInfo />}
      <EnhancedFooter />
      {showContact && <FloatingContactButton />}
      <BottomNav />
      <CompareBar />
    </div>
  );
};

export default PageLayout;

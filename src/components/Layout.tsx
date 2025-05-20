import React, { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import BottomNavigation from './navigation/BottomNavigation';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  
  // Don't show bottom navigation on content creation pages
  const hideNavigation = 
    location.pathname.includes('/create-question') || 
    location.pathname.includes('/create-story');

  return (
    <div className="flex flex-col min-h-screen bg-neutral-50">
      <main className="flex-1 pb-16">
        {children}
      </main>
      {!hideNavigation && <BottomNavigation />}
    </div>
  );
};

export default Layout;
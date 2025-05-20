import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Map, List, PlusCircle } from 'lucide-react';

const BottomNavigation: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 py-2 px-4 flex justify-around items-center z-10">
      <Link 
        to="/" 
        className={`flex flex-col items-center p-2 ${currentPath === '/' ? 'text-emerald-600' : 'text-neutral-500'}`}
      >
        <Map size={24} />
        <span className="text-xs mt-1">Map</span>
      </Link>
      
      <Link 
        to="/create-question" 
        className="flex flex-col items-center p-2 -mt-6 bg-emerald-600 text-white rounded-full w-16 h-16 justify-center shadow-lg"
      >
        <PlusCircle size={28} />
        <span className="text-xs mt-1 font-medium">Ask</span>
      </Link>
      
      <Link 
        to="/feed" 
        className={`flex flex-col items-center p-2 ${currentPath === '/feed' ? 'text-emerald-600' : 'text-neutral-500'}`}
      >
        <List size={24} />
        <span className="text-xs mt-1">Stories</span>
      </Link>
    </div>
  );
};

export default BottomNavigation;
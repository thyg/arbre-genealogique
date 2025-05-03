'use client';

import { useEffect, useState } from 'react';

interface GlissezDeplacerProps {
  active: boolean;
  className?: string;
}

export default function GlissezDeplacer({ active, className = '' }: GlissezDeplacerProps) {
  const [visible, setVisible] = useState(true);
  
  // Hide the hint after 5 seconds
  useEffect(() => {
    if (active) {
      const timer = setTimeout(() => {
        setVisible(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [active]);
  
  if (!active || !visible) return null;
  
  return (
    <div className={`fixed z-10 bottom-24 left-1/2 transform -translate-x-1/2 bg-gray-800 bg-opacity-80 text-white px-4 py-2 rounded-md shadow-lg flex items-center space-x-2 ${className}`}>
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
      </svg>
      <span className="text-sm font-medium">Glissez pour déplacer la vue</span>
    </div>
  );
}
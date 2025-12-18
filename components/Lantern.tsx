import React from 'react';

// A purely decorative CSS lantern for that festive feel
const Lantern: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative w-12 h-10 ${className}`}>
      {/* String */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-2 bg-yellow-500"></div>
      {/* Body */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-8 bg-red-600 rounded-lg shadow-lg border border-red-400 z-10 flex items-center justify-center">
        <div className="w-8 h-6 border border-red-800 rounded opacity-50"></div>
      </div>
      {/* Tassel */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full flex flex-col items-center">
         <div className="w-1 h-1 bg-yellow-500"></div>
         <div className="w-0.5 h-4 bg-yellow-600"></div>
      </div>
    </div>
  );
};

export default Lantern;
import React from 'react';

export default function GNB() {
  return (
    <div className="h-full w-full bg-white/80 backdrop-blur-md flex items-center justify-between px-10">
      <h1 className="text-xl font-bold text-gray-800 tracking-tight">Dashboard</h1>
      
      <div className="flex items-center gap-6">
        <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">🔔</button>
        <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
          <div className="text-right">
            <p className="text-sm font-bold text-gray-900 leading-none">Juan Dela Cruz</p>
            <p className="text-xs text-gray-400 mt-1">ACME Corporation</p>
          </div>
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-sm">JB</div>
        </div>
      </div>
    </div>
  );
}
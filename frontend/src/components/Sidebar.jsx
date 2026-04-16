// frontend/src/components/Sidebar.jsx
import React from 'react';

export default function Sidebar() {
  return (
    <div className="w-full h-full flex flex-col py-8 px-6">
      {/* 로고 영역 */}
      <div className="flex items-center gap-3 mb-12 px-2 flex-shrink-0">
        <div className="w-10 h-10 bg-[#1A73E8] rounded-xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
          W
        </div>
        <span className="text-xl font-bold tracking-tight text-gray-900 whitespace-nowrap">
          Wanju Portal
        </span>
      </div>

      {/* 메뉴 영역 */}
      <nav className="flex-1 space-y-2 overflow-y-auto">
        <div className="bg-[#1A73E8] text-white px-5 py-3.5 rounded-2xl flex items-center gap-4 shadow-md cursor-pointer transition-all">
          <span className="text-xl">📊</span>
          <span className="font-bold text-[15px]">대시보드</span>
        </div>

        {[
          { icon: '🏡', label: '마을정보' },
          { icon: '💰', label: '보조금사업' },
          { icon: '📝', label: '나의업무' },
          { icon: '📋', label: '게시판' },
          { icon: '⚙️', label: '시스템관리' },
        ].map((menu) => (
          <div key={menu.label} className="flex items-center justify-between px-5 py-3.5 text-gray-500 hover:bg-gray-50 hover:text-gray-900 rounded-2xl transition-all cursor-pointer group">
            <div className="flex items-center gap-4">
              <span className="text-xl opacity-80">{menu.icon}</span>
              <span className="font-bold text-[15px]">{menu.label}</span>
            </div>
            <span className="text-xs opacity-30 group-hover:opacity-100 transition-opacity">▼</span>
          </div>
        ))}
      </nav>

      {/* 하단 도움말 */}
      <div className="mt-auto pt-8 px-2 border-t border-gray-50 flex-shrink-0">
        <div className="flex items-center gap-3 text-gray-400 text-sm font-semibold hover:text-gray-600 cursor-pointer">
          <span className="text-red-400">?</span>
          <span>FAQs</span>
        </div>
      </div>
    </div>
  );
}
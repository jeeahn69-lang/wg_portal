import React from 'react';

export default function Header() {
  return (
    <div className="w-full h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm">
      {/* 왼쪽: 시스템 명칭 */}
      <div className="flex items-center gap-3">
        <span className="text-gray-400">|</span>
        <h2 className="text-lg font-semibold text-gray-700 tracking-tight">
          완주군 마을통합 포털
        </h2>
      </div>

      {/* 오른쪽: 사용자 및 알림 섹션 */}
      <div className="flex items-center gap-6">
        {/* 알림 버튼 */}
        <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
          <span className="text-sm font-medium">🔔 알림</span>
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        {/* 관리자 프로필 */}
        <div className="flex items-center gap-3 pl-4 border-l border-gray-200 cursor-pointer group">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold group-hover:bg-blue-600 group-hover:text-white transition-all">
            管
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-gray-800 leading-none">관리자</span>
            <span className="text-xs text-green-600 mt-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> 접속중
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
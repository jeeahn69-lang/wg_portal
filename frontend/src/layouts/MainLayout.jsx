// frontend/src/layouts/MainLayout.jsx
import React from 'react';
import Sidebar from '../components/Sidebar';
import GNB from '../components/GNB';
import AppTabs from '../components/AppTabs';

export default function MainLayout({ children }) {
  return (
    <div className="flex h-screen w-full bg-[#F8FAFC] overflow-hidden font-sans">

      {/* 1. 좌측 메뉴 영역: 고정 및 개별 스크롤 */}
      <aside className="w-72 flex-shrink-0 border-r border-gray-100 bg-white h-full overflow-y-auto">
        <Sidebar />
      </aside>

      {/* 2. 우측 전체 영역 (GNB + Content) */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">

        {/* 3. 상단 GNB: 높이 고정 */}
        <header className="h-20 flex-shrink-0 border-b border-gray-100 bg-white">
          <GNB />
        </header>

        {/* 4. 탭 영역 추가 */}
        <AppTabs />

        {/* 5. 메인 컨텐츠 영역: 여기만 상하 스크롤됨 */}
        <main className="flex-1 overflow-y-auto outline-none scroll-smooth bg-[#F8FAFC]">
          <div className="p-10 max-w-[1600px] mx-auto min-h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
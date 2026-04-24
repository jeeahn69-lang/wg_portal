import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { useTabs } from '@/context/TabContext'; // 프로젝트 설정에 따라 경로를 확인하세요

const MENU_DATA = [
  {
    icon: '🏡',
    label: '마을정보',
    subMenus: [
      { label: '마을관리카드', href: '/village/card/' },
      { label: '마을정보관리', href: '/village/vlinfo/' },
      { label: '마을매출정보', href: '/village/sales/' }

    ]
  },
  {
    icon: '💰',
    label: '보조금사업',
    subMenus: [
      { label: '생생마을', href: '#' },
      { label: '파워빌리지', href: '#' },
      { label: '아파트공동체', href: '#' },
      { label: '마을특성화', href: '#' }
    ]
  },
  {
    icon: '📝',
    label: '나의업무',
    subMenus: [
      { label: '일일업무', href: '#' },
      { label: '휴가관리', href: '#' }
    ]
  },
  {
    icon: '📋',
    label: '게시판',
    subMenus: [
      { label: '공지사항', href: '#' }
    ]
  },
  {
    icon: '⚙️',
    label: '시스템관리',
    subMenus: [
      { label: '사용자관리', href: '#' },
      { label: '공통코드관리', href: '/system/comcode/' }
    ]
  },
];

export default function Sidebar() {
  const { addTab } = useTabs(); // 이 줄을 추가하세요 멀티탭 선언

  const [openMenus, setOpenMenus] = useState({
    '마을정보': true,
  });

  const toggleMenu = (label) => {
    setOpenMenus((prev) => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  return (
    <div className="w-full h-full flex flex-col py-8 px-6">
      {/* 로고 영역 */}
      <Link href="/village/dashboard/" className="flex items-center gap-3 mb-12 px-2 flex-shrink-0 cursor-pointer">
        <div className="w-10 h-10 bg-[#1A73E8] rounded-xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
          W
        </div>
        <span className="text-xl font-bold tracking-tight text-gray-900 whitespace-nowrap">
          Wanju Portal
        </span>
      </Link>

      {/* 메뉴 영역 */}
      <nav className="flex-1 space-y-1 overflow-y-auto pr-2">
        {MENU_DATA.map((menu) => (
          <div key={menu.label} className="flex flex-col">
            <div
              onClick={() => toggleMenu(menu.label)}
              className={`flex items-center justify-between px-5 py-3.5 rounded-2xl transition-all cursor-pointer group ${openMenus[menu.label] ? 'text-gray-900 bg-blue-50/50' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
            >
              <div className="flex items-center gap-4">
                <span className="text-xl opacity-80">{menu.icon}</span>
                <span className="font-bold text-[15px]">{menu.label}</span>
              </div>
              <span className={`text-xs transition-transform duration-300 ${openMenus[menu.label] ? 'rotate-180 text-[#1A73E8]' : 'opacity-30 group-hover:opacity-100'}`}>
                ▼
              </span>
            </div>

            {/* 서브 메뉴 */}
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${openMenus[menu.label] ? 'max-h-64 opacity-100 mb-2' : 'max-h-0 opacity-0'}`}
            >
              <div className="pl-14 pr-4 py-1.5 flex flex-col gap-1 mt-1">
                {menu.subMenus.map((subMenu) => (
                  <div
                    key={subMenu.label}
                    onClick={(e) => {
                      e.preventDefault(); // 기본 이동 방지
                      addTab({ 
                        id: subMenu.label, 
                        title: subMenu.label, 
                        path: subMenu.href 
                      });
                    }}

                    className="group cursor-pointer text-[14px] text-gray-500 hover:text-[#1A73E8] hover:bg-blue-50/30 rounded-lg px-2 py-2 flex items-center gap-2.5 transition-all"
                  >
                    <div className="w-1.5 h-1.5 bg-gray-300 rounded-full group-hover:bg-[#1A73E8] group-hover:scale-125 transition-all"></div>
                    <span className="font-medium">{subMenu.label}</span>
                  </div>
                ))}
              </div>
            </div>
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
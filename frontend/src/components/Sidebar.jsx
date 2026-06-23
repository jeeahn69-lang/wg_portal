import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { useTabs } from '@/context/TabContext';

// 사이드바 메뉴 데이터 구성
const MENU_DATA = [
  {
    icon: '🏡',
    label: '공동체정보',
    subMenus: [
      { id: 'vlinfo', label: '마을공동체현황', path: '/village/vlinfo/', vilMngNo: null },
      { id: 'aptinfo', label: '아파트공동체현황', path: '/village/aptinfo/', vilMngNo: null },
      { id: 'sales', label: '마을기업매출현황', path: '/village/sales/', vilMngNo: null }
    ]
  },
  {
    icon: '💰',
    label: '보조금사업',
    subMenus: [
      { id: 'subsidy_kkm', label: '생생마을', path: '/subsidy/kkm/' },
      { id: 'subsidy_powervillage', label: '파워빌리지', path: '/subsidy/powervillage/' },
      { id: 'subsidy_apt', label: '아파트공동체', path: '/subsidy/apt/' },
      { id: 'subsidy_special', label: '마을특성화', path: '/subsidy/special/' }
    ]
  },
  {
    icon: '📝',
    label: '나의업무',
    subMenus: [
      { id: 'work_daily', label: '일일업무', path: '/work/daily/' },
      { id: 'work_vacation', label: '휴가관리', path: '/work/vacation/' }
    ]
  },
  {
    icon: '📋',
    label: '게시판',
    subMenus: [
      { id: 'board_notice', label: '공지사항', path: '/board/notice/' }
    ]
  },
  {
    icon: '⚙️',
    label: '시스템관리',
    subMenus: [
      { id: 'system_user', label: '사용자관리', path: '/system/user/' },
      { id: 'system_code', label: '공통코드관리', path: '/system/comcode/' }
    ]
  },
];

export default function Sidebar() {
  const { addTab, openTabs, maxTabs } = useTabs();
  
  // 기본적으로 '공동체정보' 메뉴가 열려있도록 초기화
  const [openMenus, setOpenMenus] = useState({
    '공동체정보': true,
  });

  // 메인 메뉴 아코디언 토글 함수
  const toggleMenu = (label) => {
    setOpenMenus((prev) => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  // ==========================================
  // 메뉴 아이템 클릭 핸들러 (멀티 탭 연동 및 예외 처리)
  // ==========================================
  const handleMenuItemClick = (subMenu) => {
    const result = addTab({
      id: subMenu.id,
      title: subMenu.label,
      path: subMenu.path,
    });

    // 최대 탭 개수(10개) 초과 시 알림창 표시
    if (!result.success && result.message.includes('최대')) {
      alert(`⚠️ ${result.message}`);
      console.warn(result.message);
    }
  };

  return (
    <div className="w-full h-full flex flex-col py-8 px-6 bg-gray-50">
      {/* ==========================================
          로고 영역 (대시보드로 이동)
          ========================================== */}
      <Link
        href="/village/dashboard/"
        className="flex items-center gap-3 mb-12 px-2 flex-shrink-0 cursor-pointer group hover:opacity-80 transition-opacity"
      >
        <div className="w-10 h-10 bg-[#1A73E8] rounded-xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0 group-hover:shadow-lg transition-shadow">
          W
        </div>
        <span className="text-xl font-bold tracking-tight text-gray-900 whitespace-nowrap">
          Wanju Portal
        </span>
      </Link>

      {/* ==========================================
          메뉴 네비게이션 영역
          ========================================== */}
      <nav className="flex-1 space-y-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        {MENU_DATA.map((menu) => (
          <div key={menu.label} className="flex flex-col">
            {/* 메인 대메뉴 */}
            <div
              onClick={() => toggleMenu(menu.label)}
              className={`flex items-center justify-between px-5 py-3.5 rounded-2xl transition-all cursor-pointer group ${
                openMenus[menu.label]
                  ? 'text-gray-900 bg-blue-50/50'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="text-xl opacity-80">{menu.icon}</span>
                <span className="font-bold text-[15px]">{menu.label}</span>
              </div>
              <span
                className={`text-xs transition-transform duration-300 ${
                  openMenus[menu.label]
                    ? 'rotate-180 text-[#1A73E8]'
                    : 'opacity-30 group-hover:opacity-100'
                }`}
              >
                ▼
              </span>
            </div>

            {/* 서브 서브메뉴 리스트 (아코디언 애니메이션 포함) */}
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                openMenus[menu.label] ? 'max-h-96 opacity-100 mb-2' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="pl-14 pr-4 py-1.5 flex flex-col gap-1 mt-1">
                {menu.subMenus.map((subMenu) => {
                  // 해당 서브 메뉴가 탭에 열려있는지 실시간 확인
                  const isTabOpen = openTabs.some(t => t.id === subMenu.id);

                  return (
                    <div
                      key={subMenu.id}
                      onClick={() => handleMenuItemClick(subMenu)}
                      className={`
                        group cursor-pointer text-[14px] rounded-lg px-2 py-2 flex items-center gap-2.5
                        transition-all duration-200
                        ${isTabOpen
                          ? 'bg-blue-100 text-[#1A73E8] font-semibold'
                          : 'text-gray-500 hover:text-[#1A73E8] hover:bg-blue-50/30'
                        }
                      `}
                      title={`클릭하면 탭을 열거나 전환합니다 (${openTabs.length}/${maxTabs})`}
                    >
                      {/* 활성화 상태 인디케이터 도트 */}
                      <div
                        className={`
                          w-1.5 h-1.5 rounded-full transition-all
                          ${isTabOpen
                            ? 'bg-[#1A73E8] scale-125'
                            : 'bg-gray-300 group-hover:bg-[#1A73E8] group-hover:scale-125'
                          }
                        `}
                      />
                      <span className="font-medium flex-1">{subMenu.label}</span>

                      {/* 탭 활성화 시 우측 체크(✓) 표시 */}
                      {isTabOpen && (
                        <span className="text-xs opacity-70">✓</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </nav>

      {/* ==========================================
          하단 고정 영역 (탭 누적 상태바 및 도움말)
          ========================================== */}
      <div className="mt-auto pt-8 border-t border-gray-200 flex-shrink-0">
        {/* 탭 수량 프로그레스 바 */}
        <div className="mb-4 px-2">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
            <span>열린 탭</span>
            <span className="font-bold">{openTabs.length}/{maxTabs}</span>
          </div>
          <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${
                openTabs.length === maxTabs ? 'bg-red-500' : 'bg-[#1A73E8]'
              }`}
              style={{ width: `${(openTabs.length / maxTabs) * 100}%` }}
            />
          </div>
        </div>

        {/* FAQ 링크 안내 */}
        <div className="flex items-center gap-3 text-gray-400 text-sm font-semibold hover:text-gray-600 cursor-pointer transition-colors px-2">
          <span className="text-red-400">?</span>
          <span>FAQs</span>
        </div>
      </div>
    </div>
  );
}
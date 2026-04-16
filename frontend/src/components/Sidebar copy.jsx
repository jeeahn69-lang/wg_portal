// frontend/src/components/Sidebar.jsx 수정본
import React, { useState } from "react";
import { Link, usePage } from "@inertiajs/react";

export default function Sidebar() {
  const { url } = usePage();
  const [openMenu, setOpenMenu] = useState(null);

  const toggleMenu = (menuName) => {
    setOpenMenu(openMenu === menuName ? null : menuName);
  };

  const menuItems = [
    { title: "대시보드", icon: "📊", href: "/" },
    {
      title: "마을정보",
      icon: "🏡",
      subMenus: [
        { title: "마을관리카드", href: "/village/card" },
        { title: "마을매출정보", href: "/village/sales" },
      ],
    },
    {
      title: "보조금사업",
      icon: "💰",
      subMenus: [
        { title: "생생마을", href: "/subsidy/saengsaeng" },
        { title: "마을특성화", href: "/subsidy/special" },
        { title: "아파트공동체", href: "/subsidy/apartment" },
        { title: "파워빌리지", href: "/subsidy/power" },
      ],
    },
    {
      title: "나의업무",
      icon: "📋",
      subMenus: [
        { title: "출·퇴근관리", href: "/work/attendance" },
        { title: "휴가관리", href: "/work/leave" },
        { title: "업무보고", href: "/work/report" },
      ],
    },
    {
      title: "게시판",
      icon: "📝",
      subMenus: [{ title: "공지사항", href: "/board/notice" }],
    },
    {
      title: "시스템관리",
      icon: "⚙️",
      subMenus: [
        { title: "코드관리", href: "/system/code" },
        { title: "권한관리", href: "/system/auth" },
        { title: "사용자관리", href: "/system/user" },
      ],
    },
  ];

  return (
    // overflow-x-hidden을 추가하여 좌우 스크롤 원천 차단
    <div className="w-full bg-white text-gray-600 h-screen flex flex-col border-r border-gray-100 font-sans overflow-x-hidden">
      
      {/* 상단 로고 영역 패딩 최적화 */}
      <div className="p-6 flex items-center gap-3 border-b border-gray-50/50">
        <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-md">
          W
        </div>
        <span className="text-lg font-bold text-gray-900 tracking-tight truncate">Wanju Portal</span>
      </div>

      {/* 메뉴 리스트 영역: 스크롤이 필요할 경우만 내부에 생성 (스크롤바 숨김 처리 가능) */}
      <nav className="flex-1 mt-4 px-3 space-y-1 overflow-y-auto scrollbar-hide">
        {menuItems.map((menu, index) => (
          <div key={index} className="w-full">
            {menu.subMenus ? (
              <div className="w-full">
                <button
                  onClick={() => toggleMenu(menu.title)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
                    openMenu === menu.title ? "bg-blue-50/50 text-blue-600" : "hover:bg-gray-50 text-gray-500"
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <span className="text-lg flex-shrink-0">{menu.icon}</span>
                    <span className="font-semibold text-[15px]">{menu.title}</span>
                  </div>
                  <svg
                    className={`w-3.5 h-3.5 flex-shrink-0 transition-transform duration-300 ${openMenu === menu.title ? "rotate-180" : ""}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                <div className={`overflow-hidden transition-all duration-300 ${
                  openMenu === menu.title ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
                }`}>
                  <div className="ml-4 mt-1 border-l-2 border-gray-50 space-y-0.5">
                    {menu.subMenus.map((sub, sIdx) => (
                      <Link
                        key={sIdx}
                        href={sub.href}
                        className={`block px-6 py-2 text-[13.5px] rounded-lg transition-all truncate ${
                          url === sub.href 
                          ? "text-blue-600 font-bold bg-blue-50/80" 
                          : "text-gray-400 hover:text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {sub.title}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                href={menu.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  url === menu.href
                    ? "bg-blue-600 text-white font-bold shadow-md shadow-blue-100"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                <span className="text-lg flex-shrink-0">{menu.icon}</span>
                <span className="font-semibold text-[15px]">{menu.title}</span>
              </Link>
            )}
          </div>
        ))}
      </nav>

      {/* 하단 FAQs 영역 */}
      <div className="p-4 border-t border-gray-50 mt-auto">
        <div className="flex items-center gap-3 px-4 py-2.5 text-gray-400 hover:text-gray-600 cursor-pointer text-xs font-medium">
          <span className="text-base">❓</span>
          <span>FAQs</span>
        </div>
      </div>
    </div>
  );
}
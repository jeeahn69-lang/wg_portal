import React, { useEffect, useState } from 'react';
import { useTabs } from '@/context/TabContext';
import { router } from '@inertiajs/react';

export default function AppTabs() {
  const { openTabs, activeTabId, removeTab, activateTab, isInitialized } = useTabs();
  const [hoveredTabId, setHoveredTabId] = useState(null);

  // 초기화 전에는 아무것도 렌더링하지 않음
  if (!isInitialized || openTabs.length === 0) {
    return null;
  }

  // ==========================================
  // 탭 클릭 핸들러
  // ==========================================
  const handleTabClick = (e, tab) => {
    e.preventDefault();

    // 현재 활성 탭을 클릭한 경우 아무것도 하지 않음
    if (activeTabId === tab.id) {
      return;
    }

    // 다른 탭 클릭 시 활성화
    activateTab(tab.id);
  };

  // ==========================================
  // 탭 닫기 핸들러
  // ==========================================
  const handleCloseTab = (e, tabId) => {
    e.stopPropagation(); // 탭 클릭 이벤트 전파 방지
    removeTab(tabId);
  };

  // ==========================================
  // 탭 중간 클릭 (마우스 휠) - 닫기
  // ==========================================
  const handleTabMiddleClick = (e, tabId) => {
    if (e.button === 1) {
      // 중간 클릭 (마우스 휠)
      e.preventDefault();
      removeTab(tabId);
    }
  };

  // ==========================================
  // 활성 탭이 현재 URL과 일치하는지 확인
  // ==========================================
  const activeTab = openTabs.find(t => t.id === activeTabId);

  return (
    <div className="w-full h-12 bg-white border-b border-gray-200 flex items-center px-2 gap-1 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
      {/* 탭 렌더링 */}
      {openTabs.map(tab => {
        const isActive = activeTabId === tab.id;
        const isHovered = hoveredTabId === tab.id;

        return (
          <div
            key={tab.id}
            onClick={e => handleTabClick(e, tab)}
            onMouseDown={e => handleTabMiddleClick(e, tab.id)}
            onMouseEnter={() => setHoveredTabId(tab.id)}
            onMouseLeave={() => setHoveredTabId(null)}
            className={`
              flex items-center gap-2 px-3 py-2 rounded-t-lg cursor-pointer
              transition-all duration-200 whitespace-nowrap group
              ${isActive
                ? 'bg-blue-50 text-gray-900 border-b-2 border-blue-500'
                : 'bg-gray-50 text-gray-600 border-b border-gray-200 hover:bg-gray-100'
              }
            `}
          >
            {/* 탭 제목 */}
            <span className={`font-medium text-sm ${isActive ? 'text-gray-900' : 'text-gray-600'}`}>
              {tab.title}
            </span>

            {/* 닫기 버튼 (X) */}
            <button
              onClick={e => handleCloseTab(e, tab.id)}
              className={`
                ml-1 p-0.5 rounded-md transition-all
                ${isHovered || isActive
                  ? 'opacity-100 hover:bg-gray-300'
                  : 'opacity-0 group-hover:opacity-100'
                }
              `}
              title={`${tab.title} 탭 닫기`}
            >
              <svg
                className="w-4 h-4 text-gray-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        );
      })}

      {/* 탭 개수 표시 */}
      <div className="ml-auto flex items-center gap-2 px-3 py-2 text-xs text-gray-500 border-l border-gray-200">
        <span>{openTabs.length}/10</span>
      </div>
    </div>
  );
}

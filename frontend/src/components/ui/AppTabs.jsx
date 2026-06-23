// frontend/src/components/AppTabs.jsx
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTabs } from '@/context/TabContext';
import { X } from 'lucide-react';

export default function AppTabs() {
  const { openTabs, activeTabId, removeTab, activateTab } = useTabs();

  // 열려있는 탭이 전무하면 바 자체를 화면에서 소멸 처리
  if (openTabs.length === 0) {
    return null;
  }

  return (
    <div className="w-full px-4 pt-2 border-b border-gray-200 bg-gray-100 min-h-[45px]">
      <Tabs value={activeTabId || ''} className="w-full">
        <TabsList className="flex items-center justify-start h-10 bg-transparent p-0 gap-0 overflow-x-auto scrollbar-none">
          {openTabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              onClick={() => activateTab(tab.id)} // 내부에서 중복 체크 및 주소 매칭 제어함
              className="
                group relative
                !bg-gray-200/50
                !text-gray-500
                hover:!bg-gray-300
                hover:!text-gray-700
                data-[state=active]:!bg-gray-300
                data-[state=active]:!text-black
                data-[state=active]:!shadow-none
                !border-none
                !rounded-none
                !transition-all
                !px-4
                !py-2
                !flex
                !items-center
                after:!hidden
                whitespace-nowrap
              "
            >
              {tab.title}

              <span
                className="
                  ml-2
                  opacity-0
                  group-hover:opacity-100
                  hover:bg-gray-400
                  rounded-sm
                  p-0.5
                  transition-opacity
                "
                onClick={(e) => {
                  e.stopPropagation(); // 부모 탭 이동 트리거 방지 필수
                  removeTab(tab.id);
                }}
              >
                <X size={12} />
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
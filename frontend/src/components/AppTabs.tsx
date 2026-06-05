import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTabs } from '@/context/TabContext';
import { X } from 'lucide-react';
import { router } from '@inertiajs/react';

// 탭 데이터의 타입을 정의합니다 (TypeScript의 장점!)
interface Tab {
  id: string;
  title: string;
  path: string;
}

export default function AppTabs() {
  const { openTabs, activeTabId, removeTab, setActiveTab } = useTabs();
  
  if (openTabs.length === 0) {
      return null;
  }

  const handleTabClick = (tab: Tab) => {
    if (activeTabId === tab.id) return; // 활성화된 탭이면, 다시 활성화하지 않음 [2026.06.05] 

    router.visit(tab.path, {
        preserveState: true,  // 페이지 상태를 유지합니다 (예: 폼 데이터, 스크롤 위치 등) [2026.06.05]
        preserveScroll: true, // 스크롤 위치를 유지합니다 [2026.06.05]
    });
  };

  return (
    <div className="w-full px-4 pt-2 border-b border-gray-200 bg-gray-100 min-h-[45px]">
      {/* min-h를 주어 공간을 확보합니다 */}
      {/* <Tabs value={activeTabId} className="w-full"> */}
        <Tabs value={activeTabId} onValueChange={setActiveTab} className="w-full">
        {/* <TabsList variant="line" className="bg-transparent h-10 p-0 gap-1"> */}
        <TabsList className="flex items-center justify-start h-10 bg-transparent p-0 gap-0">
          {/* variant="line"을 제거하고 커스텀 스타일 적용 */}
          {openTabs.map((tab: Tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              onClick={() => handleTabClick(tab)}
              className="group relative !bg-gray-200/50 !text-gray-500 hover:!bg-gray-300 hover:!text-gray-700 data-[state=active]:!bg-gray-300 data-[state=active]:!text-black data-[state=active]:!shadow-none !border-none !rounded-none !transition-all !px-4 !py-2 !flex !items-center after:!hidden"
            >
              {tab.title}
              <span
                className="ml-2 opacity-0 group-hover:opacity-100 hover:bg-gray-400 rounded-sm p-0.5 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation(); 
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
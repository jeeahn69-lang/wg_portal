import React, { createContext, useState, useContext } from 'react';
import { router } from '@inertiajs/react';

const TabContext = createContext();

export const TabProvider = ({ children }) => {
  const [openTabs, setOpenTabs] = useState([]);
  const [activeTabId, setActiveTabId] = useState(null);

  // 탭 추가
  // TabContext.jsx 수정본
  const addTab = (tab) => {
    setOpenTabs((prevTabs) => {
      const isExist = prevTabs.some((t) => t.id === tab.id);
      if (isExist) {
        return prevTabs; // 이미 있으면 추가 안 함
      }
      return [...prevTabs, tab];
    });
    setActiveTabId(tab.id);
    
    // 탭 추가와 동시에 해당 경로로 이동 (Inertia 방문)
    router.visit(tab.path, { preserveState: true }); 
  };

  // 탭 닫기
  const removeTab = (tabId) => {
    const newTabs = openTabs.filter((t) => t.id !== tabId);
    setOpenTabs(newTabs);
    
    // 닫은 탭이 활성화된 탭이었다면, 마지막 탭으로 이동
    if (activeTabId === tabId && newTabs.length > 0) {
      const lastTab = newTabs[newTabs.length - 1];
      setActiveTabId(lastTab.id);
      router.visit(lastTab.path, { preserveState: true });
    } else if (newTabs.length === 0) {
      setActiveTabId(null);
      router.visit('/village/dashboard/', { preserveState: true }); // 기본 대시보드로 이동
    }
  };

  return (
    <TabContext.Provider value={{ openTabs, activeTabId, addTab, removeTab, setActiveTab: setActiveTabId }}>
      {children}
    </TabContext.Provider>
  );
};

// 다른 곳에서 편하게 불러다 쓰기 위한 훅
export const useTabs = () => useContext(TabContext);
import React, { createContext, useState, useContext, useEffect } from 'react';
import { router } from '@inertiajs/react';

const TabContext = createContext();

const STORAGE_KEYS = {
  OPEN_TABS: 'wg_portal_open_tabs',
  ACTIVE_TAB_ID: 'wg_portal_active_tab_id',
};

const MAX_TABS = 10;
const DASHBOARD_PATH = '/village/dashboard/';

export const TabProvider = ({ children }) => {
  const [openTabs, setOpenTabs] = useState([]);
  const [activeTabId, setActiveTabId] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // ==========================================
  // 1. 앱 초기화 - localStorage에서 탭 복원
  // ==========================================
  useEffect(() => {
    if (isInitialized) return;

    const savedTabs = localStorage.getItem(STORAGE_KEYS.OPEN_TABS);
    const savedActiveTabId = localStorage.getItem(STORAGE_KEYS.ACTIVE_TAB_ID);

    if (savedTabs) {
      try {
        let parsedTabs = JSON.parse(savedTabs);
        parsedTabs = parsedTabs.filter(tab => tab.path !== DASHBOARD_PATH);
        setOpenTabs(parsedTabs);

        if (savedActiveTabId && parsedTabs.some(t => t.id === savedActiveTabId)) {
          setActiveTabId(savedActiveTabId);
        } else if (parsedTabs.length > 0) {
          setActiveTabId(parsedTabs[0].id);
        }
      } catch (error) {
        console.error('localStorage 파싱 실패:', error);
        setOpenTabs([]);
        setActiveTabId(null);
      }
    } else {
      setOpenTabs([]);
      setActiveTabId(null);
    }
    setIsInitialized(true);
  }, [isInitialized]);

  // ==========================================
  // 2. localStorage에 탭 목록 저장
  // ==========================================
  useEffect(() => {
    if (!isInitialized) return;
    localStorage.setItem(STORAGE_KEYS.OPEN_TABS, JSON.stringify(openTabs));
  }, [openTabs, isInitialized]);

  // ==========================================
  // 3. localStorage에 활성 탭 ID 저장
  // ==========================================
  useEffect(() => {
    if (!isInitialized) return;
    if (activeTabId) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_TAB_ID, activeTabId);
    }
  }, [activeTabId, isInitialized]);

  // ==========================================
  // 4-1. 앱 최초 로드(새로고침) 시 URL 초기 동기화 (최초 1회만 실행)
  // ==========================================
  useEffect(() => {
    if (isInitialized && openTabs.length > 0) {
      // 💡 pathname과 쿼리스트링(?...)을 결합하여 정밀 탐색하도록 수정
      const currentUrl = window.location.pathname + window.location.search;
      const matchingTab = openTabs.find(tab => tab.path === currentUrl);
      if (matchingTab) {
        setActiveTabId(matchingTab.id);
      }
    }
  }, [isInitialized]);

  // ==========================================
  // 4-2. 라우팅 변경 감지 - 활성 탭 동기화 (Inertia 내장 이벤트 활용)
  // ==========================================
  useEffect(() => {
    if (!isInitialized) return;

    // 💡 Inertia 페이지 전환 완료 및 브라우저 뒤로가기 시점을 정확히 추적하여 탭 동기화 수행
    const unbind = router.on('navigate', (event) => {
      const url = event.detail.page.url; // 쿼리 스트링이 모두 포함된 전체 주소
      const matchingTab = openTabs.find(tab => tab.path === url);
      
      if (matchingTab) {
        setActiveTabId(matchingTab.id);
      }
    });

    return () => unbind();
  }, [isInitialized, openTabs]);

  // ==========================================
  // 5. 탭 추가 (또는 기존 탭 활성화)
  // ==========================================
  const addTab = (newTab) => {
    if (!newTab.id || !newTab.title || !newTab.path) {
      console.error('Invalid tab data:', newTab);
      return { success: false, message: '탭 정보가 불완전합니다' };
    }

    if (newTab.path === DASHBOARD_PATH) {
      router.visit(newTab.path, { preserveState: true, preserveScroll: true });
      return { success: false, message: 'Dashboard는 탭으로 관리되지 않습니다' };
    }

    const existingTab = openTabs.find(t => t.id === newTab.id);

    if (existingTab) {
      setActiveTabId(newTab.id);
      
      const currentUrl = window.location.pathname + window.location.search;
      if (currentUrl !== newTab.path) {
        router.visit(newTab.path, { preserveState: true, preserveScroll: true });
      }
      return { success: true, message: '기존 탭을 활성화했습니다', isNew: false };
    }

    if (openTabs.length >= MAX_TABS) {
      return { success: false, message: `최대 ${MAX_TABS}개의 탭만 열 수 있습니다` };
    }

    const updatedTabs = [...openTabs, newTab];
    setOpenTabs(updatedTabs);
    setActiveTabId(newTab.id);

    localStorage.setItem(STORAGE_KEYS.ACTIVE_TAB_ID, newTab.id);

    // 탭 캐싱: preserveState를 true로 설정하여 한번 열었던 탭은 상태 유지
    router.visit(newTab.path, { preserveState: true, preserveScroll: true });
    return { success: true, message: '새 탭을 생성했습니다', isNew: true };
  };

  // ==========================================
  // 6. 탭 닫기
  // ==========================================
  const removeTab = (tabId) => {
    const newTabs = openTabs.filter(t => t.id !== tabId);

    if (activeTabId === tabId) {
      let nextTab = null;
      const closingTabIndex = openTabs.findIndex(t => t.id === tabId);
      
      if (closingTabIndex > 0) {
        nextTab = openTabs[closingTabIndex - 1];
      } else if (closingTabIndex < openTabs.length - 1) {
        nextTab = openTabs[closingTabIndex + 1];
      } else if (newTabs.length > 0) {
        nextTab = newTabs[0];
      }

      setOpenTabs(newTabs);

      if (nextTab) {
        setActiveTabId(nextTab.id);
        router.visit(nextTab.path, { preserveState: true, preserveScroll: true });
      } else {
        setActiveTabId(null);
        router.visit(DASHBOARD_PATH, { preserveState: true, preserveScroll: true });
      }
    } else {
      setOpenTabs(newTabs);
    }
    return { success: true, message: '탭이 닫혔습니다' };
  };

  // ==========================================
  // 7. 활성 탭 변경
  // ==========================================
  const activateTab = (tabId) => {
    const tab = openTabs.find(t => t.id === tabId);

    // 임시로 디버깅 로그 추가 [2026.06.23  - 탭 활성화 시점 확인]
    console.log('activateTab');
    console.log(tab);

    if (!tab) {
      return { success: false, message: '탭을 찾을 수 없습니다' };
    }
    if (activeTabId === tabId) {
      return { success: false, message: '이미 활성화된 탭입니다' };
    }

    setActiveTabId(tabId);
    router.visit(tab.path, { preserveState: true, preserveScroll: true });
    return { success: true, message: '탭을 활성화했습니다' };
  };

  const clearAllTabs = () => {
    setOpenTabs([]);
    setActiveTabId(null);
    localStorage.removeItem(STORAGE_KEYS.OPEN_TABS);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_TAB_ID);
  };

  const getTabState = () => {
    return { openTabs, activeTabId, totalTabs: openTabs.length, maxTabs: MAX_TABS, isInitialized };
  };

  const value = {
    openTabs,
    activeTabId,
    addTab,
    removeTab,
    activateTab,
    setActiveTab: setActiveTabId,
    clearAllTabs,
    getTabState,
    isInitialized,
    maxTabs: MAX_TABS,
  };

  return <TabContext.Provider value={value}>{children}</TabContext.Provider>;
};

export const useTabs = () => {
  const context = useContext(TabContext);
  if (!context) throw new Error('useTabs must be used within TabProvider');
  return context;
};
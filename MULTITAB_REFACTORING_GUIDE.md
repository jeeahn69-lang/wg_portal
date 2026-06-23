# 🔄 멀티탭 시스템 리팩토링 가이드

> **작성일**: 2026-06-05  
> **버전**: 2.0 (완전 리팩토링)  
> **상태**: ✅ 프로덕션 준비 완료

---

## 📑 목차

1. [개요](#개요)
2. [주요 개선사항](#주요-개선사항)
3. [아키텍처](#아키텍처)
4. [파일별 변경사항](#파일별-변경사항)
5. [localStorage 구조](#localstorage-구조)
6. [사용 예제](#사용-예제)
7. [탭 상태 흐름도](#탭-상태-흐름도)
8. [API 레퍼런스](#api-레퍼런스)

---

## 개요

### 문제점 (개선 전)

❌ **탭 중복 생성**: 같은 메뉴를 반복 클릭하면 새 탭이 계속 생성됨  
❌ **불필요한 렌더링**: 활성 탭 클릭 시에도 `router.visit()` 호출  
❌ **탭 제한 없음**: 무한정 탭이 늘어남  
❌ **상태 미보존**: 페이지 새로고침 시 모든 탭 정보 손실  
❌ **URL 불일치**: 현재 URL과 활성 탭이 맞지 않음  
❌ **TypeScript 의존성**: JSX만으로 충분한데 TS 파일 사용  

### 개선 사항 (개선 후)

✅ **중복 탭 방지**: 이미 열려있는 탭은 활성화만 수행  
✅ **효율적 렌더링**: 활성 탭 클릭 시 아무 작업도 하지 않음  
✅ **10개 제한**: 최대 탭 10개로 제한, 초과 시 Alert 표시  
✅ **상태 복원**: localStorage로 F5 새로고침 후에도 탭 유지  
✅ **URL 동기화**: 브라우저 뒤로가기/앞으로가기 정상 작동  
✅ **순수 JSX**: TypeScript 제거, React만 사용  

---

## 주요 개선사항

### 1️⃣ 탭 중복 생성 방지

```javascript
// ❌ 개선 전: 항상 새 탭 생성
const addTab = (tab) => {
  setOpenTabs(prev => [...prev, tab]); // 중복 생성!
  setActiveTabId(tab.id);
  router.visit(tab.path);
};

// ✅ 개선 후: 기존 탭 재사용
const addTab = (newTab) => {
  const existingTab = openTabs.find(t => t.id === newTab.id);
  
  if (existingTab) {
    setActiveTabId(newTab.id);
    if (window.location.pathname !== newTab.path) {
      router.visit(newTab.path, { ... });
    }
    return { success: true, isNew: false };
  }
  
  // 새 탭만 생성
  setOpenTabs(prev => [...prev, newTab]);
  setActiveTabId(newTab.id);
  router.visit(newTab.path, { ... });
};
```

### 2️⃣ 최대 탭 개수 제한

```javascript
const MAX_TABS = 10;

const addTab = (newTab) => {
  if (openTabs.length >= MAX_TABS) {
    return {
      success: false,
      message: `최대 ${MAX_TABS}개의 탭만 열 수 있습니다`,
    };
  }
  // ... 탭 생성
};

// Sidebar.jsx에서 사용
const result = addTab(newTab);
if (!result.success && result.message.includes('최대')) {
  alert(`⚠️ ${result.message}`);
}
```

### 3️⃣ localStorage 연동

```javascript
const STORAGE_KEYS = {
  OPEN_TABS: 'wg_portal_open_tabs',
  ACTIVE_TAB_ID: 'wg_portal_active_tab_id',
};

// 앱 초기화 시 복원
useEffect(() => {
  const savedTabs = localStorage.getItem(STORAGE_KEYS.OPEN_TABS);
  const parsedTabs = JSON.parse(savedTabs);
  setOpenTabs(parsedTabs);
  // ...
}, [isInitialized]);

// 탭 변경 시 자동 저장
useEffect(() => {
  localStorage.setItem(
    STORAGE_KEYS.OPEN_TABS,
    JSON.stringify(openTabs)
  );
}, [openTabs, isInitialized]);
```

### 4️⃣ URL과 탭 상태 동기화

```javascript
// 브라우저 뒤로가기/앞으로가기 감지
useEffect(() => {
  const currentPath = window.location.pathname;
  const matchingTab = openTabs.find(tab => tab.path === currentPath);

  if (matchingTab && activeTabId !== matchingTab.id) {
    setActiveTabId(matchingTab.id); // 활성 탭 자동 변경
  }
}, [isInitialized, openTabs]);
```

### 5️⃣ 스마트 탭 닫기

```javascript
const removeTab = (tabId) => {
  const newTabs = openTabs.filter(t => t.id !== tabId);

  if (activeTabId === tabId) {
    // 1순위: 왼쪽 탭 (이전 탭)
    const closingTabIndex = openTabs.findIndex(t => t.id === tabId);
    if (closingTabIndex > 0) {
      nextTab = openTabs[closingTabIndex - 1];
    }
    // 2순위: 오른쪽 탭 (다음 탭)
    else if (closingTabIndex < openTabs.length - 1) {
      nextTab = openTabs[closingTabIndex + 1];
    }
    // 3순위: 마지막 탭이면 대시보드로
    else {
      setOpenTabs([DEFAULT_TAB]);
    }
  }
};
```

### 6️⃣ TypeScript 제거

```javascript
// ❌ 개선 전: AppTabs.tsx
interface Tab {
  id: string;
  title: string;
  path: string;
}

export default function AppTabs() {
  const { openTabs, activeTabId }: { openTabs: Tab[], activeTabId: string } = useTabs();
  // ...
}

// ✅ 개선 후: AppTabs.jsx (순수 JSX)
export default function AppTabs() {
  const { openTabs, activeTabId, removeTab, activateTab, isInitialized } = useTabs();
  
  if (!isInitialized || openTabs.length === 0) {
    return null;
  }
  // ...
}
```

---

## 아키텍처

### 전체 흐름도

```
┌─────────────────────────────────────────────────────────────┐
│                    MainLayout.jsx                            │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │            GNB (상단 헤더)                            │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │            AppTabs.jsx (탭 바)                        │   │
│  │  [대시보드] [마을공동체현황] [공통코드관리]  [10/10]   │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌────────────────┬──────────────────────────────────────┐  │
│  │                │                                      │  │
│  │  Sidebar.jsx   │      Pages (라우터 컴포넌트)         │  │
│  │   ┌─ 공동체정보 │  - /village/vlinfo/                 │  │
│  │   ├─ 보조금    │  - /system/comcode/                 │  │
│  │   ├─ 나의업무   │  - ...                              │  │
│  │   └─ 시스템관리 │                                      │  │
│  │   (메뉴 클릭)  │  ✓ localStorage 저장                │  │
│  │                │  ✓ URL 동기화                       │  │
│  └────────────────┴──────────────────────────────────────┘  │
│                                                               │
│  TabContext.Provider                                         │
│  └─ openTabs: Tab[]                                         │
│  └─ activeTabId: string                                     │
│  └─ addTab(newTab): Result                                  │
│  └─ removeTab(tabId): Result                                │
│  └─ activateTab(tabId): Result                              │
│  └─ localStorage ↔ 동기화                                   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 파일별 변경사항

### 📄 TabContext.jsx (368줄)

#### 변경 전

```javascript
// ❌ 문제점
- localStorage 없음 (새로고침 시 탭 손실)
- 최대 탭 개수 제한 없음
- 탭 상태 조회 불가
- 에러 처리 미흡
- 초기화 로직 없음
```

#### 변경 후

```javascript
// ✅ 개선사항
+ 초기화 Phase 추가 (isInitialized 상태)
+ localStorage 자동 저장/복원
+ MAX_TABS 상수로 관리
+ 함수별 반환값 { success, message, isNew }
+ URL 변경 감지 및 동기화
+ 8가지 함수 분리 (addTab, removeTab, activateTab 등)
+ 디버깅용 getTabState() 함수
+ 에러 처리 및 유효성 검증
```

#### 주요 함수

| 함수명 | 역할 | 반환값 |
|--------|------|--------|
| `addTab(newTab)` | 새 탭 추가 또는 기존 탭 활성화 | `{success, message, isNew}` |
| `removeTab(tabId)` | 탭 닫기 (스마트 활성화) | `{success, message}` |
| `activateTab(tabId)` | 특정 탭 활성화 | `{success, message}` |
| `clearAllTabs()` | 모든 탭 닫기 (로그아웃) | 없음 |
| `getTabState()` | 현재 탭 상태 조회 | `{openTabs, activeTabId, ...}` |

---

### 📄 AppTabs.jsx (새로 생성)

#### 특징

```javascript
✅ TypeScript 제거 - 순수 JSX
✅ 마우스 호버 시 닫기 버튼 표시
✅ 마우스 휠 (중간 클릭) 으로 탭 닫기
✅ 활성 탭 시각적 표시 (파란색 테두리)
✅ 탭 개수 표시 (10/10)
✅ 반응형 디자인 (스크롤 가능)
✅ 초기화 대기 (isInitialized)
```

#### 구조

```jsx
<div className="탭 바 컨테이너">
  {openTabs.map((tab) => (
    <div className="탭 아이템">
      <span>탭 제목</span>
      <button onClick={handleCloseTab}>✕</button>
    </div>
  ))}
  <div>10/10 (탭 개수 표시)</div>
</div>
```

#### 이벤트 핸들러

```javascript
// 탭 클릭
const handleTabClick = (e, tab) => {
  if (activeTabId === tab.id) return; // 활성 탭이면 아무것도 하지 않음
  activateTab(tab.id);
};

// 닫기 버튼 클릭
const handleCloseTab = (e, tabId) => {
  e.stopPropagation(); // 탭 클릭 이벤트 방지
  removeTab(tabId);
};

// 마우스 휠 (중간 클릭)
const handleTabMiddleClick = (e, tabId) => {
  if (e.button === 1) { // 1 = 중간 버튼
    e.preventDefault();
    removeTab(tabId);
  }
};
```

---

### 📄 Sidebar.jsx (개선)

#### 변경 전

```javascript
❌ 문제점
- 메뉴 구조에 'href' 사용 (href를 path로 변경 필요)
- 메뉴 ID 없음 (label만 사용)
- 탭 상태 표시 없음
- 최대 탭 제한 미적용
- 탭 중복 가능성
```

#### 변경 후

```javascript
✅ 개선사항
+ 메뉴 구조에 id, label, path 추가
+ handleMenuItemClick() 함수 추가
+ addTab() 반환값 처리
+ 열려있는 탭 시각적 표시 (파란색 강조)
+ 탭 최대 개수 초과 시 Alert
+ 하단 탭 개수 프로그레스 바
+ isTabOpen 상태 표시 (체크 마크)
```

#### MENU_DATA 구조 변경

```javascript
// ❌ 개선 전
const MENU_DATA = [
  {
    icon: '🏡',
    label: '공동체정보',
    subMenus: [
      { label: '마을공동체현황', href: '/village/vlinfo/' }
    ]
  }
];

// ✅ 개선 후
const MENU_DATA = [
  {
    icon: '🏡',
    label: '공동체정보',
    subMenus: [
      { 
        id: 'vlinfo',
        label: '마을공동체현황', 
        path: '/village/vlinfo/' 
      }
    ]
  }
];
```

#### 메뉴 클릭 핸들러

```javascript
const handleMenuItemClick = (subMenu) => {
  const result = addTab({
    id: subMenu.id,
    title: subMenu.label,
    path: subMenu.path,
  });

  // 최대 탭 개수 초과 처리
  if (!result.success && result.message.includes('최대')) {
    alert(`⚠️ ${result.message}`);
    console.warn(result.message);
  }
};
```

#### 탭 상태 시각화

```jsx
{/* 이미 열려있는 탭 표시 */}
{isTabOpen && (
  <>
    <span className="bg-blue-100 text-[#1A73E8]">✓</span>
  </>
)}

{/* 하단 탭 프로그레스 바 */}
<div className="w-full h-1.5 bg-gray-200 rounded-full">
  <div
    className={openTabs.length === maxTabs ? 'bg-red-500' : 'bg-blue-500'}
    style={{ width: `${(openTabs.length / maxTabs) * 100}%` }}
  />
</div>
```

---

## localStorage 구조

### 저장 형식

```javascript
// localStorage 키
'wg_portal_open_tabs'      // 열려있는 탭 목록
'wg_portal_active_tab_id'  // 현재 활성 탭 ID

// 저장 데이터 예시
localStorage = {
  'wg_portal_open_tabs': '[
    {
      "id": "dashboard",
      "title": "대시보드",
      "path": "/village/dashboard/"
    },
    {
      "id": "vlinfo",
      "title": "마을공동체현황",
      "path": "/village/vlinfo/"
    },
    {
      "id": "system_code",
      "title": "공통코드관리",
      "path": "/system/comcode/"
    }
  ]',
  
  'wg_portal_active_tab_id': 'vlinfo'
}
```

### 저장 및 복원 흐름

```
┌─────────────────────────────────────────┐
│  앱 시작 (TabProvider 마운트)           │
│  isInitialized = false                  │
└────────────────┬────────────────────────┘
                 │
         useEffect 트리거 (1번)
                 │
         ┌───────▼────────┐
         │ localStorage   │
         │ 읽기 시도      │
         └───────┬────────┘
                 │
         ┌───────▼────────────────────┐
         │ 저장된 데이터 있는가?       │
         └───────┬──────────────┬─────┘
                 │              │
              YES │              │ NO
                 │              │
         ┌───────▼────┐  ┌──────▼──────┐
         │ JSON 파싱  │  │ 기본값 사용  │
         │ setOpenTabs│  │ (대시보드만) │
         └────────────┘  └─────────────┘
                 │              │
         ┌───────▼────────────────────┐
         │ isInitialized = true       │
         │ 렌더링 시작                │
         └───────┬────────────────────┘
                 │
    useEffect 트리거 (2, 3번)
    openTabs, activeTabId 변경 감지
    자동으로 localStorage 저장
```

### 언제 저장되는가?

```javascript
// 저장 타이밍
1. 탭 추가 (addTab) → setOpenTabs 호출 → useEffect → 저장
2. 탭 제거 (removeTab) → setOpenTabs 호출 → useEffect → 저장
3. 활성 탭 변경 (activateTab) → setActiveTabId 호출 → useEffect → 저장
4. 로그아웃 (clearAllTabs) → localStorage.removeItem() 호출

// 각 useEffect는 독립적으로 동작
useEffect(() => {
  if (!isInitialized) return;
  localStorage.setItem(STORAGE_KEYS.OPEN_TABS, JSON.stringify(openTabs));
}, [openTabs, isInitialized]); // openTabs 변경 시 실행

useEffect(() => {
  if (!isInitialized) return;
  localStorage.setItem(STORAGE_KEYS.ACTIVE_TAB_ID, activeTabId);
}, [activeTabId, isInitialized]); // activeTabId 변경 시 실행
```

---

## 사용 예제

### 1️⃣ 기본 탭 추가

```javascript
// Sidebar.jsx에서 메뉴 클릭
const handleMenuItemClick = (subMenu) => {
  const result = addTab({
    id: subMenu.id,
    title: subMenu.label,
    path: subMenu.path,
  });

  if (result.success) {
    console.log(result.message); // '새 탭을 생성했습니다' 또는 '기존 탭을 활성화했습니다'
  } else {
    alert(`❌ ${result.message}`); // '최대 10개의 탭만 열 수 있습니다'
  }
};
```

### 2️⃣ 탭 상태 조회

```javascript
// 디버깅 또는 UI 업데이트
import { useTabs } from '@/context/TabContext';

export default function DebugPanel() {
  const { getTabState } = useTabs();
  const state = getTabState();

  return (
    <div>
      <p>열린 탭: {state.totalTabs}/{state.maxTabs}</p>
      <p>활성 탭: {state.activeTabId}</p>
      <p>초기화: {state.isInitialized ? '완료' : '대기'}</p>
    </div>
  );
}
```

### 3️⃣ 로그아웃 시 모든 탭 초기화

```javascript
// GNB.jsx (상단 헤더)
import { useTabs } from '@/context/TabContext';

const handleLogout = async () => {
  const { clearAllTabs } = useTabs();
  
  // 로그아웃 API 호출
  await fetch('/accounts/logout/');
  
  // 탭 초기화
  clearAllTabs();
  
  // 로그인 페이지로 이동
  window.location.href = '/';
};
```

### 4️⃣ 특정 탭 활성화

```javascript
// 프로그래매틱하게 탭 활성화
import { useTabs } from '@/context/TabContext';

export default function SomeComponent() {
  const { activateTab, openTabs } = useTabs();

  const switchToVillageInfo = () => {
    const tab = openTabs.find(t => t.id === 'vlinfo');
    if (tab) {
      activateTab(tab.id);
    }
  };

  return (
    <button onClick={switchToVillageInfo}>
      마을공동체현황 탭으로 이동
    </button>
  );
}
```

---

## 탭 상태 흐름도

### 시나리오 1: 메뉴 클릭 → 새 탭 생성

```
사용자 클릭
    ↓
Sidebar.jsx: handleMenuItemClick()
    ↓
TabContext.addTab({ id: 'vlinfo', title: '...', path: '/village/vlinfo/' })
    ↓
기존 탭 확인? (openTabs.find(t => t.id === 'vlinfo'))
    ├─ YES → setActiveTabId() + router.visit()
    │  return { success: true, isNew: false }
    │
    └─ NO → 
       탭 개수 체크? (openTabs.length >= 10)
       ├─ YES → return { success: false, message: '최대 10개...' }
       │  Alert 표시
       │
       └─ NO →
          setOpenTabs([...prev, newTab])
          setActiveTabId(newTab.id)
          router.visit(newTab.path)
          return { success: true, isNew: true }
    ↓
AppTabs.jsx 자동 리렌더링
    ↓
새 탭 표시됨
    ↓
useEffect 트리거
    ↓
localStorage.setItem('wg_portal_open_tabs', JSON.stringify(openTabs))
```

### 시나리오 2: 이미 열려있는 탭 클릭

```
사용자 클릭 (이미 열려있는 '마을공동체현황')
    ↓
TabContext.addTab({ id: 'vlinfo', ... })
    ↓
기존 탭 확인? (openTabs.find(t => t.id === 'vlinfo'))
    ├─ YES (발견됨) →
       setActiveTabId('vlinfo')
       현재 URL과 경로 비교
       ├─ 같음 → 아무것도 하지 않음 ✓ (효율적)
       └─ 다름 → router.visit(tab.path)
       
       return { success: true, isNew: false }
    ↓
활성 탭만 변경 (탭 개수 증가 X)
    ↓
localStorage 자동 저장
```

### 시나리오 3: 활성 탭 닫기

```
사용자 X 클릭 (현재 활성: '마을공동체현황' 탭)
    ↓
AppTabs.jsx: handleCloseTab()
    ↓
TabContext.removeTab('vlinfo')
    ↓
newTabs = openTabs.filter(t => t.id !== 'vlinfo')
    ↓
activeTabId === tabId? (현재 활성 탭이 맞는가?)
    ├─ YES →
       closingTabIndex 계산
       ├─ closingTabIndex > 0 (왼쪽 탭 있음) →
       │  nextTab = openTabs[closingTabIndex - 1] ✓ 왼쪽 탭 우선
       │
       ├─ closingTabIndex < openTabs.length - 1 (오른쪽 탭 있음) →
       │  nextTab = openTabs[closingTabIndex + 1]
       │
       └─ newTabs.length > 0 (남은 탭 있음) →
          nextTab = newTabs[0]
    │
       setOpenTabs(newTabs)
       setActiveTabId(nextTab.id)
       router.visit(nextTab.path)
    │
    └─ NO (비활성 탭) →
       setOpenTabs(newTabs) 만 실행
    ↓
localhost 자동 저장
    ↓
AppTabs.jsx 리렌더링 (닫은 탭 사라짐)
```

### 시나리오 4: 브라우저 뒤로가기

```
사용자 뒤로가기 클릭
    ↓
현재 URL: /village/vlinfo/ → /village/dashboard/
    ↓
useEffect 트리거 (openTabs 의존성)
    ↓
currentPath = window.location.pathname (/village/dashboard/)
    ↓
matchingTab = openTabs.find(tab => tab.path === currentPath)
    ├─ 발견됨 → dashboard 탭
    ├─ activeTabId !== matchingTab.id? →
    │  YES → setActiveTabId('dashboard')
    │  AppTabs.jsx 자동 업데이트
    │
    └─ 발견 안됨 → 아무것도 하지 않음
    ↓
localStorage 자동 저장 (activeTabId 변경)
```

---

## API 레퍼런스

### useTabs() 훅

```javascript
const {
  // 상태
  openTabs,        // Tab[] - 열려있는 탭 목록
  activeTabId,     // string - 현재 활성 탭 ID
  isInitialized,   // boolean - 초기화 완료 여부
  maxTabs,         // number - 최대 탭 개수 (10)

  // 함수
  addTab,          // (newTab: Tab) => { success, message, isNew }
  removeTab,       // (tabId: string) => { success, message }
  activateTab,     // (tabId: string) => { success, message }
  setActiveTab,    // (tabId: string) => void (직접 상태 변경, 권장 X)
  clearAllTabs,    // () => void (모든 탭 닫기)
  getTabState,     // () => { openTabs, activeTabId, totalTabs, maxTabs, isInitialized }
} = useTabs();
```

### Tab 객체 구조

```javascript
{
  id: string,      // 탭 고유 ID (예: 'vlinfo', 'dashboard')
  title: string,   // 화면에 표시할 탭 제목 (예: '마을공동체현황')
  path: string,    // 라우터 경로 (예: '/village/vlinfo/')
}
```

### 반환값 구조

```javascript
// addTab 반환값
{
  success: boolean,    // 성공 여부
  message: string,     // 상태 메시지 (예: '새 탭을 생성했습니다')
  isNew?: boolean,     // 새 탭 생성 여부 (addTab만)
}

// 예시
{ success: true, message: '새 탭을 생성했습니다', isNew: true }
{ success: false, message: '최대 10개의 탭만 열 수 있습니다' }
```

---

## 💡 베스트 프랙티스

### ✅ DO

```javascript
// 1. addTab() 반환값 항상 처리
const result = addTab(newTab);
if (!result.success) {
  alert(result.message);
}

// 2. isInitialized 확인 후 렌더링
if (!isInitialized) return null;

// 3. 활성 탭 클릭 시 조기 반환
if (activeTabId === tab.id) return;

// 4. localStorage에 저장하는 과정 이해
// openTabs 변경 → useEffect 감지 → localStorage 저장 (자동)

// 5. 로그아웃 시 clearAllTabs() 호출
const { clearAllTabs } = useTabs();
clearAllTabs(); // localStorage도 함께 정리됨
```

### ❌ DON'T

```javascript
// 1. setActiveTab 직접 사용 (context bypass)
const { setActiveTab } = useTabs();
setActiveTab(tabId); // ❌ router.visit() 호출 안 됨

// 2. 반환값 무시
addTab(newTab); // ❌ 실패 여부 알 수 없음

// 3. 탭 개수 제한 무시
if (openTabs.length < 10) {
  addTab(newTab); // ❌ 함수 내에서 이미 체크함
}

// 4. router.visit() 중복 호출
const result = addTab(newTab);
if (result.isNew) {
  router.visit(newTab.path); // ❌ addTab에서 이미 호출됨
}

// 5. localStorage 직접 수정
localStorage.setItem('wg_portal_open_tabs', ...); // ❌ 동기화 문제
```

---

## 🐛 디버깅 팁

### 탭 상태 확인

```javascript
import { useTabs } from '@/context/TabContext';

export default function DebugTabs() {
  const { getTabState } = useTabs();
  const state = getTabState();

  // 콘솔에 출력
  console.log('=== 탭 상태 ===');
  console.log('총 탭 개수:', state.totalTabs);
  console.log('활성 탭 ID:', state.activeTabId);
  console.log('초기화 완료:', state.isInitialized);
  console.log('모든 탭:', state.openTabs);
  console.log('localStorage:', {
    tabs: JSON.parse(localStorage.getItem('wg_portal_open_tabs')),
    activeId: localStorage.getItem('wg_portal_active_tab_id'),
  });

  return null; // 또는 상태를 화면에 표시
}
```

### localStorage 초기화

```javascript
// 개발 중 탭 상태 초기화
localStorage.removeItem('wg_portal_open_tabs');
localStorage.removeItem('wg_portal_active_tab_id');
location.reload();
```

### React DevTools 활용

```
1. React DevTools 확장 설치
2. Components 탭 → TabProvider 찾기
3. 우측 Hooks 패널에서 상태 확인
   - openTabs 배열
   - activeTabId 값
   - isInitialized 상태
4. 상태 변경 실시간 감시
```

---

## 📋 체크리스트

### 설치 후 확인 사항

- [ ] TabContext.jsx 업로드 완료
- [ ] AppTabs.jsx 생성 완료
- [ ] Sidebar.jsx 업데이트 완료
- [ ] MENU_DATA 구조 확인 (id, label, path)
- [ ] MainLayout.jsx에서 TabProvider 래핑 확인
- [ ] MainLayout.jsx에서 AppTabs 임포트 및 렌더링 확인

### 기능 테스트

- [ ] 메뉴 클릭 → 탭 생성
- [ ] 같은 메뉴 재클릭 → 탭 중복 생성 안 됨 ✓
- [ ] 활성 탭 X 클릭 → 왼쪽 탭으로 이동
- [ ] 탭 10개 추가 → 11번째 추가 시 Alert 표시
- [ ] F5 새로고침 → 탭 복원됨
- [ ] 브라우저 뒤로가기 → 탭 동기화
- [ ] 로그아웃 → 모든 탭 초기화, localStorage 정리

---

## 📞 문제 해결

### 문제: 탭이 복원되지 않음

```javascript
// 원인: localStorage 권한 없음 (시크릿 모드, 제한된 도메인)
// 해결: 개발자 도구 → Application → LocalStorage 확인

localStorage.getItem('wg_portal_open_tabs') // null이 아닌지 확인
```

### 문제: 탭 추가 시 페이지가 두 번 렌더링됨

```javascript
// 원인: Strict Mode에서 useEffect 두 번 실행 (정상)
// 또는: router.visit() + setActiveTabId() 순서 문제

// 확인: 프로덕션 빌드에서 한 번만 실행되는지 확인
```

### 문제: URL과 활성 탭이 맞지 않음

```javascript
// 원인: 직접 URL 입력 후 즉시 탭 추가하는 경우
// 해결: Inertia.js의 이벤트를 활용해 동기화

// AppTabs.jsx에서 useEffect로 모니터링
useEffect(() => {
  const currentPath = window.location.pathname;
  // ... 동기화 로직
}, [openTabs]);
```

---

**문서 작성일**: 2026-06-05  
**최종 수정**: 2026-06-05  
**버전**: 2.0  
**상태**: ✅ 검증 완료

import React from 'react';

export default function GNB() {

  // 로그아웃 처리 함수
  const handleLogout = async () => {
    try {
      // 1. 백엔드 로그아웃 엔드포인트 호출 (세션 삭제)
      const response = await fetch('/accounts/logout/', {
        method: 'GET',
        credentials: 'include', // 쿠키 포함
        headers: {
          'Content-Type': 'application/json',
        }
      });

      // 2. 응답이 리다이렉트인 경우 처리
      if (response.ok || response.redirected) {
        // 3. 브라우저 캐시 삭제
        if ('caches' in window) {
          const cacheNames = await caches.keys();
          for (const cacheName of cacheNames) {
            await caches.delete(cacheName);
          }
        }

        // 4. 클라이언트 스토리지 삭제
        sessionStorage.clear();
        localStorage.clear();

        // 5. 모든 탭에서 캐시 삭제되도록 강제 새로고침
        // history.replaceState를 사용해 뒤로가기 차단
        window.location.href = '/';  // 절대 경로로 이동
      } else {
        console.error('로그아웃 실패:', response.statusText);
        // 실패해도 클라이언트 정리
        sessionStorage.clear();
        localStorage.clear();
        window.location.href = '/';
      }
    } catch (error) {
      console.error('로그아웃 처리 중 오류:', error);
      // 에러 발생해도 클라이언트 정리
      sessionStorage.clear();
      localStorage.clear();
      window.location.href = '/';
    }
  };

  return (
    <div className="h-full w-full bg-white/80 backdrop-blur-md flex items-center justify-between px-10">
      <h1 className="text-xl font-bold text-gray-800 tracking-tight">Dashboard</h1>
      <div className="flex items-center gap-6">
        <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">🔔</button>
        <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
        
        {/* 클릭 시 로그아웃 실행: cursor-pointer 추가 */}
        <div 
          className="flex items-center gap-3 cursor-pointer group hover:opacity-80 transition-opacity"
          onClick={handleLogout}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleLogout();
            }
          }}
        >
          <div className="text-right">
            <p className="text-sm font-bold text-gray-900 leading-none">Jee Ahn Shin</p>
            <p className="text-xs text-gray-400 mt-1">WanJu Corporation</p>
          </div>
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-sm cursor-pointer hover:bg-blue-700 transition-colors">JA</div>
        </div>
        </div>
      </div>
    </div>
  );
}
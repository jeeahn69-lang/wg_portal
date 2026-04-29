import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import React from 'react';
import './index.css';
import { TabProvider } from './context/TabContext'; // 1. TabProvider 추가


// 2. WanjuPortalV2 컴포넌트 불러오기를 할때는 아래 주석을 해제하고, createInertiaApp 부분은 주석 처리합니다.
// import WanjuPortalV2 from './Pages/village/wanju-portal-v2'; // 불러오기


// const el = document.getElementById('root'); // index.html의 id 확인 (보통 'app' 또는 'root')

// createRoot(el).render(
//   <React.StrictMode>
//     <WanjuPortalV2 />
//   </React.StrictMode>
// );


// 1. 데이터 가져오기 (json_script 방식)
// const jsonData = document.getElementById('inertia-data')?.textContent;
// const initialPage = jsonData ? JSON.parse(jsonData) : null;

const jsonData = document.getElementById('inertia-data').textContent;
const initialPage = JSON.parse(jsonData); // 이제 여기서 "undefined"가 아닌 객체가 나옵니다!

createInertiaApp({
  page: initialPage,
  resolve: (name) => {
    // 모든 하위 폴더의 .jsx 파일을 가져옵니다.
    const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true });
    const page = pages[`./Pages/${name}.jsx`];

    // 페이지를 찾지 못했을 경우를 대비한 에러 처리
    if (!page) {
      console.error(`Page not found: ./Pages/${name}.jsx`);
      console.log('현재 로드된 페이지 목록:', Object.keys(pages));
      return;
    }
    
    return typeof page === 'function' ? page() : page.default;
  },

    setup({ el, App, props }) {
        if (el) {
          createRoot(el).render(
            <React.StrictMode>
              {/* 2. <App />을 <TabProvider>로 감싸줍니다 */}
              <TabProvider>
                <App {...props} />
              </TabProvider>
            </React.StrictMode>
          );
        }
      },
    })


import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import React from 'react';
import './index.css';


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
          <App {...props} />
        </React.StrictMode>
      );
    }
  },
})
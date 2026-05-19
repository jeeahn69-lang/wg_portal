import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import tailwindcss from '@tailwindcss/vite' // 이 부분이 있는지 확인!

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    host: '127.0.0.1',
    port: 5173,
    cors: true,
    strictPort: true,
    origin: 'http://127.0.0.1:5173',
    hmr: {
      host: '127.0.0.1',
    },
    // [추가] 백엔드 API 프록시 설정
    proxy: {
      '/system': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path,
      },
      '/accounts': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path,
      },
      '/village': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path,
      },
    },
  },

  build: {
    outDir: path.resolve(__dirname, '../backend/static/dist'), // 절대 경로로 지정하는 것이 안전합니다.
    emptyOutDir: true,
    manifest: "manifest.json", // manifest 파일명을 명시적으로 지정
    rollupOptions: {
      input: './src/main.jsx',
    },
  },
  
  resolve: {
    alias: {
      // @/components/ui/button 처럼 경로를 간결하게 쓰기 위한 설정
      '@': path.resolve(__dirname, './src'),
    },
  },
})
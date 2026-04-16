import React from 'react'
import { router, useForm } from '@inertiajs/react'

export default function Login() {
  const { data, setData, post, processing, errors } = useForm({
    username: '',
    password: '',
  })

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Inertia의 post 메서드를 사용하여 데이터를 서버로 전송합니다.
    post('/accounts/login/action/', {
        onSuccess: () => {
            // 성공 시 페이지를 새로고침하여 세션을 확실히 반영합니다.
            window.location.href = '/';
        },
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-800">
          완주군 마을통합마케팅 포털
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">아이디</label>
            <input
              type="text"
              value={data.username}
              onChange={e => setData('username', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">비밀번호</label>
            <input
              type="password"
              value={data.password}
              onChange={e => setData('password', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>

          {errors.error && (
            <div className="text-red-500 text-sm font-bold p-2 bg-red-50 rounded">
              {errors.error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={processing} 
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {processing ? '로그인 중...' : '로그인'}
          </button>
        </form>
      </div>
    </div>
  )
}
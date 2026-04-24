import React from 'react';
import { Head, useForm } from '@inertiajs/react';

const Login = ({ errors }) => {
    // Inertia useForm 세팅
    const { data, setData, post, processing } = useForm({
        username: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post('/accounts/login/action/'); // urls.py 설정에 맞춰 경로 수정 가능
    };

    return (
        <>
            <Head title="로그인 | 완주마을 통합마케팅 지원단" />

            <div className="min-h-screen flex bg-[#F3F4F6] font-sans">
                {/* 왼쪽: 로그인 폼 영역 */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
                    <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-lg border border-gray-200">
                    
                    {/* 상단 문구 영역 */}
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-900">완주마을 포탈 로그인</h2>
                        <p className="text-gray-500 mt-2 text-sm">
                            완주마을 통합마케팅 지원단 서비스 이용을 위해<br/> 
                            아이디와 비밀번호를 입력해주세요.
                        </p>
                    </div>

                    <form onSubmit={submit} className="space-y-6">
                        {/* 아이디 입력 */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">아이디</label>
                            <input
                                type="text"
                                value={data.username}
                                onChange={e => setData('username', e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-gray-400"
                                placeholder="아이디를 입력하세요 (admin)"
                                required
                            />
                        </div>

                        {/* 비밀번호 입력 */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">비밀번호</label>
                            <input
                                type="password"
                                value={data.password}
                                onChange={e => setData('password', e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-gray-400"
                                placeholder="비밀번호를 입력하세요 (ad1234)"
                                required
                            />
                        </div>

                        {/* 에러 메시지 표시 */}
                        {errors.auth && (
                            <p className="text-red-500 text-xs font-medium italic">{errors.auth}</p>
                        )}

                        {/* 로그인 상태 유지 및 링크 */}
                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                                    onChange={e => setData('remember', e.target.checked)}
                                />
                                <span className="text-gray-600">로그인 유지</span>
                            </label>
                            <a href="#" className="text-blue-600 hover:underline font-medium">비밀번호 찾기</a>
                        </div>

                        {/* 로그인 버튼 */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-[#1F2937] text-white py-3.5 rounded-lg font-bold text-lg hover:bg-black transition-colors shadow-md disabled:bg-gray-400"
                        >
                            {processing ? '로그인 중...' : '로그인'}
                        </button>
                    </form>

                    {/* 하단 푸터 */}
                    <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                        <p className="text-sm text-gray-500">
                            계정이 없으신가요? <a href="#" className="text-blue-600 font-bold ml-1 hover:underline">회원가입</a>
                        </p>
                    </div>
                    </div>
                </div>
                {/* 오른쪽: 일러스트 배경 영역 */}
                <div className="hidden lg:flex w-1/2 items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-10">
                    <img 
                        src="/assets/login_bg.png" 
                        alt="Login Background Illustration" 
                        className="max-w-md w-full h-auto object-contain drop-shadow-lg"
                    />
                </div>
            </div>
        </>
    );
};

export default Login;
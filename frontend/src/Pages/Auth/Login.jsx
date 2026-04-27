import { useForm } from "@inertiajs/react";
import { useState } from "react";

export default function Login({ errors: initialErrors = {} }) {
  const { data, setData, post, processing, errors } = useForm({
    username: "",
    password: "",
  });

  const [showError, setShowError] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(name, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowError(false);
    
    post("/accounts/login/action/", {
      onError: () => {
        setShowError(true);
      },
      onSuccess: () => {
        // 성공 시 대시보드로 이동 (Django에서 redirect)
      },
    });
  };

  // 에러 메시지 통합
  const authError = initialErrors.auth || errors.auth || (showError ? "사용자 ID, 비밀번호를 확인하세요" : null);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-slate-200 to-blue-200">
      {/* 전체 이미지 컨테이너 */}
      <div className="relative w-[1100px] h-[680px] rounded-2xl overflow-hidden shadow-xl">
        
        {/* 배경 이미지 */}
        <img
          src="/static/images/login_bg.png"
          alt="로그인 배경"
          className="absolute w-full h-full object-cover"
        />

        {/* 좌측 로그인 영역 (카드 제거 버전) */}
        <div className="absolute left-16 top-1/2 -translate-y-1/2 w-[320px] text-gray-800">
          
          <h2 className="text-4xl font-extrabold text-gray-800 tracking-tight mb-3">
            로그인
          </h2>
          <p className="text-sm font-semibold text-gray-600 mb-8 leading-relaxed">
            Wanju-gun Village <br />
            Please log in to use the service.
          </p>

            <form onSubmit={handleSubmit} className="space-y-5 max-w-[260px]">
  
                {/* 에러 메시지 */}
                {authError && (
                  <div className="p-3 bg-red-100 border border-red-400 rounded-lg">
                    <p className="text-sm text-red-700 font-medium">{authError}</p>
                  </div>
                )}

                {/* 아이디 */}
                <div>
                    <label className="text-sm font-medium block mb-1">사용자 ID</label>
                    <input
                    type="text"
                    name="username"
                    value={data.username}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg bg-white/80 backdrop-blur border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="아이디 입력"
                    required
                    />
                </div>

                {/* 비밀번호 */}
                <div>
                    <label className="text-sm font-medium block mb-1">비밀번호</label>
                    <input
                    type="password"
                    name="password"
                    value={data.password}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg bg-white/80 backdrop-blur border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="비밀번호 입력"
                    required
                    />
                </div>

                {/* 🔥 로그인 유지 + 비밀번호 찾기 */}
                <div className="flex items-center justify-between text-sm">
                    
                    {/* 로그인 유지 */}
                    <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                    <input
                        type="checkbox"
                        className="accent-blue-500"
                    />
                    로그인 유지
                    </label>

                    {/* 비밀번호 찾기 */}
                    <button
                    type="button"
                    className="text-blue-500 hover:underline"
                    >
                    비밀번호 찾기
                    </button>
                </div>

                {/* 로그인 버튼 */}
                <button
                    type="submit"
                    disabled={processing}
                    className="w-full py-2 rounded-lg text-white font-semibold bg-gradient-to-r from-blue-500 to-indigo-500 hover:opacity-90 active:scale-[0.98] transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {processing ? "Login ing..." : "Login"}
                </button>

            </form>

          {/* 회원가입 */}
          <p className="text-sm mt-6">
            계정이 없으신가요?{" "}
            <span className="text-blue-500 cursor-pointer hover:underline">
              회원가입
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
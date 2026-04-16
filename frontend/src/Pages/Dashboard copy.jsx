// frontend/src/Pages/Dashboard.jsx
import React from 'react';
import MainLayout from "../layouts/MainLayout_지원";
import Card from "../components/Card";

export default function Dashboard() {
  const stats = [
    { title: "마을 수", value: "128", icon: "🏡", color: "blue", trend: { value: "↑ 12%" } },
    { title: "보조금 사업", value: "24", icon: "💰", color: "green", trend: { value: "↑ 5.2%" } },
    { title: "업무 건수", value: "56", icon: "📝", color: "purple", trend: { value: "↓ 2.1%" } },
    { title: "게시글", value: "320", icon: "📄", color: "amber", trend: { value: "↑ 18%" } },
  ];

  const posts = [
    { id: '#1234567890', title: '2026년 상반기 마을 공동체 보조금 신청 안내', author: '관리자', date: 'July 01, 2021 - 10:00 AM', status: 'Payment Successful' },
    { id: '#0987654321', title: '완주군 마을 통합 마케팅 지원 사업 공지', author: '시스템운영팀', date: 'June 01, 2021 - 1:00 PM', status: 'Refunded' },
  ];

  return (
    <MainLayout>
      {/* 1. 상단 타이틀 및 경로 섹션 */}
      <div className="flex items-center justify-between mb-12 p-10 bg-white rounded-3xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-950 tracking-tighter">📊 관리자 대시보드</h1>
          <p className="text-lg text-gray-500 mt-2 font-medium">완주군 마을통합마케팅 포털의 실시간 현황</p>
        </div>
        
        {/* 첨부 이미지 스타일의 경로 표시기 추가 */}
        <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
          <span>Home</span>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-gray-950 font-semibold">대시보드</span>
        </div>
      </div>

      {/* 2. 요약 카드 그리드 (구조 유지, 컴포넌트 디자인 변경) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        {stats.map((item, index) => (
          <Card key={index} {...item} />
        ))}
      </div>

      {/* 3. 하단 콘텐츠 영역 (테이블 디자인 변경) */}
      <div className="bg-white rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-gray-100 p-10 mt-10 space-y-8">
        <div className="flex justify-between items-center border-b border-gray-100 pb-6">
          <h3 className="text-2xl font-bold text-gray-950 tracking-tight">
            <span className="font-mono text-gray-400 mr-1 opacity-60">|</span> 최근 게시글
          </h3>
          <button className="text-sm font-semibold text-blue-700 hover:text-blue-900 transition-colors bg-blue-50 px-5 py-2.5 rounded-xl">전체보기 →</button>
        </div>

        {/* 첨부 이미지 테이블 스타일 적용 */}
        <div className="overflow-x-auto">
          <table className="w-full text-left table-auto">
            <thead className="border-b-2 border-gray-200">
              <tr>
                <th className="px-6 py-5 text-sm font-bold text-gray-900 uppercase tracking-widest whitespace-nowrap">Order No.</th>
                <th className="px-6 py-5 text-sm font-bold text-gray-900 uppercase tracking-widest">제목</th>
                <th className="px-6 py-5 text-sm font-bold text-gray-900 uppercase tracking-widest whitespace-nowrap">작성자</th>
                <th className="px-6 py-5 text-sm font-bold text-gray-900 uppercase tracking-widest whitespace-nowrap">날짜</th>
                <th className="px-6 py-5 text-sm font-bold text-gray-900 uppercase tracking-widest whitespace-nowrap">상태</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-blue-50/20 transition-colors group cursor-pointer">
                  <td className="px-6 py-6 font-mono text-sm text-gray-500 font-semibold tracking-tighter">{post.id}</td>
                  <td className="px-6 py-6 text-gray-950 font-semibold group-hover:text-blue-700">{post.title}</td>
                  <td className="px-6 py-6 text-gray-600 text-sm font-medium">{post.author}</td>
                  <td className="px-6 py-6 text-gray-500 text-sm italic">{post.date}</td>
                  {/* 상태 태그 (장식용 데코) */}
                  <td className="px-6 py-6 text-sm">
                    <span className={`inline-flex px-4 py-1.5 rounded-full font-bold text-xs ${post.status === 'Payment Successful' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                      {post.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
}
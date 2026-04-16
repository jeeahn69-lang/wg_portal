import React, { useState } from 'react';

export default function VillageCardDetail() {
  const [activeTab, setActiveTab] = useState('기본정보');

  const tabs = [
    '기본정보', '지원사업', '매출/고용', '장비현황', '사업장전경', '방문결과', '쟁점사항'
  ];

  return (
    <div className="space-y-6">
      {/* 1. 헤더 영역 (공통 정보 카드) */}
      <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-3xl">🏡</div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">소양면 오성마을</h2>
              <p className="text-gray-500 font-medium">오성 영농조합법인</p>
            </div>
          </div>
          <div className="flex gap-8">
            <div className="text-center">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">대표자</p>
              <p className="font-bold text-gray-800">유강언</p>
            </div>
            <div className="text-center border-l border-gray-100 pl-8">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">연락처</p>
              <p className="font-bold text-gray-800">010-6664-5434</p>
            </div>
            <div className="text-center border-l border-gray-100 pl-8">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">주요제품</p>
              <p className="font-bold text-blue-600">한옥, 경관조성</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. 탭 메뉴 영역 */}
      <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-gray-50 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === tab 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 3. 탭별 콘텐츠 영역 [cite: 1, 3, 11, 12] */}
      <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-50 min-h-[400px]">
        {activeTab === '기본정보' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section>
              <h4 className="text-lg font-bold mb-4 flex items-center gap-2">📌 마을정보</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-400">주소</span> <span className="font-medium text-gray-700">완주군 소양면 오도길 73</span>
                </li>
                <li className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-400">설립목적</span> <span className="font-medium text-gray-700">주민화합 (마을화합형)</span>
                </li>
                <li className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-400">법인유형</span> <span className="font-medium text-gray-700">영농조합법인 (2017년 설립)</span>
                </li>
              </ul>
            </section>
            <section>
              <h4 className="text-lg font-bold mb-4 flex items-center gap-2">👥 임원명단</h4>
              <table className="w-full text-sm text-left">
                <thead className="text-gray-400 border-b border-gray-100">
                  <tr><th className="py-2">이름</th><th className="py-2">직위/역할</th><th className="py-2">연락처</th></tr>
                </thead>
                <tbody className="text-gray-700">
                  <tr><td className="py-3 font-bold">유강언</td><td>대표</td><td>010-6664-5434</td></tr>
                  <tr><td className="py-3 font-bold">김민서</td><td>임원</td><td>010-3798-6738</td></tr>
                </tbody>
              </table>
            </section>
          </div>
        )}

        {activeTab === '지원사업' && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 text-left rounded-l-xl">지원년도</th>
                  <th className="px-6 py-4 text-left">사업명</th>
                  <th className="px-6 py-4 text-right">지원액(천원)</th>
                  <th className="px-6 py-4 text-left rounded-r-xl">내용</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {[
                  { year: '2013', name: '맛있는마을', price: '3,000', note: '-' },
                  { year: '2014', name: '참살기좋은마을', price: '50,000', note: '(5,000)' },
                  { year: '2018', name: '마을소득상품개발', price: '6,000', note: '-' },
                  { year: '2019', name: '신규마을기업', price: '50,000', note: '한옥사무실, 카페' },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-700">{row.year}</td>
                    <td className="px-6 py-4 text-gray-600">{row.name}</td>
                    <td className="px-6 py-4 text-right font-bold text-blue-600">{row.price}</td>
                    <td className="px-6 py-4 text-gray-400">{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 나머지 탭 영역(매출, 방문결과 등)도 위와 같은 테이블 및 리스트 형식으로 구현 가능 */}
        {activeTab === '방문결과' && (
          <div className="space-y-6">
            <div className="border-l-4 border-blue-500 pl-6 py-1">
              <p className="text-xs text-blue-500 font-bold mb-1">2021.03</p>
              <p className="text-sm text-gray-700 leading-relaxed">
                BTS 방문지 유명세와 편승할 젊은 사람들이 선호할 식단 구성 제언. 종갓집 요리대회 개최 등. [cite: 12]
              </p>
            </div>
            <div className="border-l-4 border-gray-200 pl-6 py-1">
              <p className="text-xs text-gray-400 font-bold mb-1">2020.02</p>
              <p className="text-sm text-gray-500 leading-relaxed">
                산림청 산촌캠프 진행 예정. 생태숲(돌, 바람, 물) 조성 및 대회의실/숙박시설 확충. [cite: 11]
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
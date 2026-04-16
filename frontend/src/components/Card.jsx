// frontend/src/components/Card.jsx
import React from 'react';

export default function Card({ title, value, color = "blue", icon, trend }) {
  // 첨부 이미지의 세련된 색상 팔레트 적용
  const colorSchemes = {
    blue: "text-blue-600 border-blue-100 bg-blue-50/50 hover:bg-blue-100",
    green: "text-green-600 border-green-100 bg-green-50/50 hover:bg-green-100",
    purple: "text-purple-600 border-purple-100 bg-purple-50/50 hover:bg-purple-100",
    amber: "text-amber-600 border-amber-100 bg-amber-50/50 hover:bg-amber-100",
  };

  const scheme = colorSchemes[color] || colorSchemes.blue;

  return (
    // 첨부 이미지 특유의 부드럽고 큰 그림자 효과 적용
    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] transition-all hover:shadow-lg flex items-center gap-6">
      
      {/* 핀테크 스타일 아이콘 영역 */}
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-mono ${scheme.split(' ')[2]}`}>
        {icon || "📄"}
      </div>

      <div className="flex-1">
        {/* 단위 표시 컴포넌트 */}
        <p className="text-sm font-medium text-gray-400 mb-1 leading-none">
          {title} <span className="font-light text-xs"> (단위: {title.includes('수') ? '개' : title.includes('건') ? '건' : ''})</span>
        </p>
        
        {/* 데이터 값 */}
        <h3 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">
          {Number(value).toLocaleString()}
        </h3>

        {/* 첨부 이미지 스타일의 트렌드 태그 추가 */}
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${scheme.split(' ')[0] === 'text-green-600' ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'}`}>
          <span>{trend?.value || "↑ 0.1%"}</span>
          <span className="text-gray-400 font-medium">전월 대비</span>
        </div>
      </div>
    </div>
  );
}
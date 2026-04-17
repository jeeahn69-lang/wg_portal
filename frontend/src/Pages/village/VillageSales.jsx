import React, { useState } from 'react';
import MainLayout from "../../layouts/MainLayout";

export default function VillageSales() {
    // 샘플 데이터 (image_2de23d.png 기반)
    const salesData = [
        { id: 1, eubmyeon: '삼례읍', village: '정산마을', corporation: '(유)정산식품', ceo: '최성기', type: '마을화합형', product: '장류 (된장 등)', revenue: '125,000' },
        { id: 2, eubmyeon: '삼례읍', village: '학동마을', corporation: '학동마을 영농조합', ceo: '박민경', type: '소득창출형', product: '참기름, 김부각', revenue: '84,200' },
        { id: 3, eubmyeon: '삼례읍', village: '후와마을', corporation: '완주딸기랜드', ceo: '이문택', type: '소득창출형', product: '딸기잼, 냉동딸기', revenue: '210,500' },
        { id: 4, eubmyeon: '봉동읍', village: '제촌마을', corporation: '제촌마을회', ceo: '송호석', type: '마을화합형', product: '진천송씨 연잎국수', revenue: '45,000' },
        { id: 5, eubmyeon: '구이면', village: '안덕마을', corporation: '안덕파워', ceo: '입옥섭', type: '소득창출형', product: '체험, 숙박', revenue: '1.043.000' },
    ];

    return (
        <MainLayout>
            {/* 1. 페이지 헤더 */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-950 tracking-tighter">💰 마을 매출 정보</h1>
                    <p className="text-gray-500 mt-1 font-medium">완주군 내 마을 공동체별 매출액 및 사업 현황을 조회합니다.</p>
                </div>
                <button className="px-6 py-3 bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all flex items-center gap-2">
                    <span>📊</span> 엑셀 다운로드
                </button>
            </div>

            {/* 2. 조회 조건 (Filter Section) */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 ml-1 uppercase">읍·면 선택</label>
                        <select className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-blue-100 transition-all">
                            <option>전체</option>
                            <option>삼례읍</option>
                            <option>봉동읍</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 ml-1 uppercase">마을명</label>
                        <input type="text" placeholder="마을 이름을 입력하세요" className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-blue-100" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 ml-1 uppercase">설립유형</label>
                        <select className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-blue-100">
                            <option>전체</option>
                            <option>마을화합형</option>
                            <option>소득창출형</option>
                        </select>
                    </div>
                    <div className="flex items-end">
                        <button className="w-full h-[52px] bg-gray-950 text-white font-bold rounded-2xl hover:bg-black transition-all">
                            조회하기
                        </button>
                    </div>
                </div>
            </div>

            {/* 3. 리스트 영역 (List Section) */}
            <div className="bg-white rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.02)] border border-gray-100 overflow-hidden">
                <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-white/50">
                    <span className="text-sm font-bold text-gray-400">검색 결과 <span className="text-blue-600">{salesData.length}</span>건</span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-8 py-5 text-[13px] font-bold text-gray-400 uppercase tracking-widest">읍면</th>
                                <th className="px-8 py-5 text-[13px] font-bold text-gray-400 uppercase tracking-widest">마을명</th>
                                <th className="px-8 py-5 text-[13px] font-bold text-gray-400 uppercase tracking-widest">공동체법인명</th>
                                <th className="px-8 py-5 text-[13px] font-bold text-gray-400 uppercase tracking-widest">대표자</th>
                                <th className="px-8 py-5 text-[13px] font-bold text-gray-400 uppercase tracking-widest">주요제품</th>
                                <th className="px-8 py-5 text-[13px] font-bold text-gray-400 uppercase tracking-widest text-right">매출액(천원)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {salesData.map((item) => (
                                <tr key={item.id} className="hover:bg-blue-50/30 transition-colors group cursor-pointer">
                                    <td className="px-8 py-6 text-sm text-gray-500 font-medium">{item.eubmyeon}</td>
                                    <td className="px-8 py-6">
                                        <span className="text-gray-950 font-bold group-hover:text-blue-600 transition-colors">{item.village}</span>
                                        <div className="text-[11px] text-gray-400 mt-0.5">{item.type}</div>
                                    </td>
                                    <td className="px-8 py-6 text-sm text-gray-600 font-semibold">{item.corporation}</td>
                                    <td className="px-8 py-6 text-sm text-gray-600 font-medium">{item.ceo}</td>
                                    <td className="px-8 py-6">
                                        <span className="inline-flex px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold">{item.product}</span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <span className="text-blue-600 font-black font-mono text-lg">{item.revenue}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* 페이지네이션 (장식용) */}
                <div className="p-8 border-t border-gray-50 bg-gray-50/20 flex justify-center">
                    <div className="flex gap-2">
                        {[1, 2, 3].map(n => (
                            <button key={n} className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${n === 1 ? 'bg-blue-600 text-white' : 'bg-white text-gray-400 hover:bg-gray-100'}`}>
                                {n}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
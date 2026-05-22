import React, { useState } from 'react';
import MainLayout from "../../layouts/MainLayout";
import { useTabs } from '../../context/TabContext';
import { Wallet } from 'lucide-react';

export default function VillageInfoList({ regions = [], comptypes = [] }) {
    const { addTab } = useTabs();
    // 샘플 데이터 (image_2de23d.png 기반)
    const initialSalesData = [
        { id: 1, eubmyeon: '삼례읍', village: '정산마을', corporation: '(유)정산식품', memberyn: '회원', ceo: '최성기', type: '마을화합형', cotype: '영농조합법인', worker: '김철수', product: '장류 (된장 등)', villhead: '김이장', revenue: '125,000' },
        { id: 2, eubmyeon: '삼례읍', village: '학동마을', corporation: '학동마을 영농조합', memberyn: '비회원', ceo: '박민경', type: '소득창출형', cotype: '영농조합법인', worker: '김철수', product: '참기름, 김부각', villhead: '최이장', revenue: '95,000' },
        { id: 3, eubmyeon: '삼례읍', village: '후와마을', corporation: '완주딸기랜드', memberyn: '회원', ceo: '이문택', type: '소득창출형', cotype: '영농조합법인', worker: '김철수', product: '딸기잼, 냉동딸기', villhead: '박이장', revenue: '85,000' },
        { id: 4, eubmyeon: '봉동읍', village: '제촌마을', corporation: '제촌마을회', memberyn: '회원', ceo: '송호석', type: '마을화합형', cotype: '영농조합법인', worker: '김철수', product: '진천송씨 연잎국수', villhead: '이이장', revenue: '110,000' },
        { id: 5, eubmyeon: '봉동읍', village: '제촌마을', corporation: '제촌마을회', memberyn: '회원', ceo: '송호석', type: '마을화합형', cotype: '영농조합법인', worker: '김철수', product: '진천송씨 연잎국수', villhead: '조이장', revenue: '100,000' },
        { id: 6, eubmyeon: '봉동읍', village: '제촌마을', corporation: '제촌마을회', memberyn: '비회원', ceo: '송호석', type: '마을화합형', cotype: '영농조합법인', worker: '김철수', product: '진천송씨 연잎국수', villhead: '남이장', revenue: '90,000' },
        { id: 7, eubmyeon: '구이면', village: '안덕마을', corporation: '안덕파워', memberyn: '회원', ceo: '입옥섭', type: '소득창출형', cotype: '영농조합법인', worker: '김철수', product: '체험, 숙박', villhead: '한이장', revenue: '75,000' },
    ];

    // 검색 조건을 관리할 상태(State) 설정
    const [selectedRegion, setSelectedRegion] = useState('전체');
    const [selectedType, setSelectedType] = useState('전체');
    const [searchVillage, setSearchVillage] = useState('');

    // 실시간 필터링 로직 (마을명 첫 글자만 쳐도 바로 필터링 됨)
    const filteredData = initialSalesData.filter(item => {
        const matchRegion = selectedRegion === '전체' || item.eubmyeon === selectedRegion;
        const matchType = selectedType === '전체' || item.type === selectedType;
        const matchVillage = item.village.includes(searchVillage); // 글자가 포함되면 모두 조회
        
        return matchRegion && matchType && matchVillage;
    });

    return (
        <MainLayout>
            {/* 1. 페이지 헤더 */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    {/* <h1 className="text-3xl font-extrabold text-gray-950 tracking-tighter">💰 마을 매출 정보</h1> */}
                    <h1 className="text-3xl font-extrabold text-gray-950 tracking-tighter flex items-center gap-2">
                    <Wallet className="w-6 h-6 text-yellow-500" />마을 공동체 현황
                    </h1>

                    <p className="text-gray-500 mt-1 font-medium">완주군 내 마을 공동체 상세내역 및 사업 현황을 조회합니다.</p>
                </div>
                <button className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all flex items-center gap-2">
                    <span>📊</span> 엑셀 다운로드
                </button>
            </div>

            {/* 2. 조회 조건 (Filter Section) */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* 읍·면 선택 (SC0001 바인딩) */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-500 ml-1 uppercase">읍·면 선택</label>
                        <select 
                            value={selectedRegion}
                            onChange={(e) => setSelectedRegion(e.target.value)}
                            className="w-full p-4 bg-gray-100 border-none rounded-lg text-sm font-semibold focus:ring-2 focus:ring-blue-100 transition-all appearance-none cursor-pointer"
                        >
                            <option value="전체">전체</option>
                            {regions.map((region) => (
                                <option key={region.code} value={region.name}>{region.name}</option>
                            ))}
                        </select>
                    </div>
                    {/* 마을명 실시간 검색 */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-500 ml-1 uppercase">마을명</label>
                        <input type="text" 
                               value={searchVillage}
                               onChange={(e) => setSearchVillage(e.target.value)}
                               placeholder="마을 이름을 입력하세요" 
                               className="w-full p-4 bg-gray-100 border-none rounded-lg text-sm font-semibold focus:ring-2 focus:ring-blue-100"
                        />
                    </div>
                    {/* 공동체 협의회 회원 여부 선택 */}
                    
                     <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-500 ml-1">공동체 협의회 회원</label>
                        <select className="w-full p-4 bg-gray-100 border-none rounded-lg text-sm font-semibold focus:ring-2 focus:ring-blue-100 transition-all appearance-none cursor-pointer">
                            <option value="전체">전체</option>
                            <option value="Y">회원</option>
                            <option value="N">비회원</option>
                        </select>
                    </div>

                    {/* <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-400 ml-1 uppercase">법인유형</label>
                        <select 
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            className="w-full p-4 bg-gray-100 border-none rounded-lg text-sm font-semibold focus:ring-2 focus:ring-blue-100 transition-all appearance-none cursor-pointer"
                        >
                            <option value="전체">전체</option>
                            {comptypes.map((type) => (
                                <option key={type.code} value={type.name}>{type.name}</option>
                            ))}
                        </select>
                    </div> */}
                    {/* 조회버튼 기능은 이제 '초기화' 느낌으로 쓰거나, 백엔드 API 연동 시 사용할 수 있습니다. */}
                    <div className="flex items-end justify-end">
                        {/* <button className="w-1/2 h-[52px] bg-blue-600 text-white font-bold rounded-lg shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"> */}
                        <button 
                            onClick={() => {
                                // 추가적인 비동기 API 조회가 필요할 때 여기에 로직 추가
                                console.log("조회된 데이터 수:", filteredData.length);
                            }}
                            className="w-1/2 h-[52px] bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all"
                        >
                            조회하기
                        </button>
                    </div>
                </div>
            </div>

            {/* 3. 리스트 영역 (List Section) */}
            <div className="bg-white rounded-lg border border-blue-100 shadow-xl p-8 overflow-hidden">
                <div className="pb-8 border-b border-gray-100 flex justify-between items-center bg-white/50">
                    {/* 필터링된 데이터의 갯수를 표시합니다 */}
                    <span className="text-sm font-bold text-gray-400">검색 결과 <span className="text-blue-600">{filteredData.length}</span> 건</span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-center border-collapse border-b border-gray-300">
                        <thead>
                            <tr className="bg-gray-200/50">
                                <th className="px-8 py-5 text-sm font-bold text-gray-400 tracking-widest">No.</th>
                                <th className="px-8 py-5 text-sm font-bold text-gray-400 tracking-widest">읍면</th>
                                <th className="px-8 py-5 text-sm font-bold text-gray-400 tracking-widest">마을명</th>
                                <th className="px-8 py-5 text-sm font-bold text-gray-400 tracking-widest">공동체법인명</th>
                                <th className="px-8 py-5 text-sm font-bold text-gray-400 tracking-widest">법인유형</th>
                                <th className="px-8 py-5 text-sm font-bold text-gray-400 tracking-widest">회원여부</th>
                                <th className="px-8 py-5 text-sm font-bold text-gray-400 tracking-widest">대표자</th>
                                <th className="px-8 py-5 text-sm font-bold text-gray-400 tracking-widest">실무자</th>
                                <th className="px-8 py-5 text-sm font-bold text-gray-400 tracking-widest">마을이장</th>
                                <th className="px-8 py-5 text-sm font-bold text-gray-400 tracking-widest">주요제품</th>
                                <th className="px-8 py-5 text-sm font-bold text-gray-400 tracking-widest text-right">매출액(천원)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {/* map을 돌릴 때 salesData 대신 filteredData를 사용합니다 */}
                            {filteredData.length > 0 ? (
                                filteredData.map((item, idx) => (
                                    <tr key={item.id} className="hover:bg-blue-300/20 transition-colors group cursor-pointer" onClick={() => addTab({ id: `village-info-${item.id}`, title: `${item.village} 정보`, path: '/village/card/', villageName: item.village })}>
                                        <td className="px-8 py-4 text-center font-mono text-gray-400 text-sm font-bold">{idx + 1}</td>
                                        <td className="px-8 py-4">
                                            <span className="inline-flex items-center rounded-lg bg-blue-50 px-3 py-1 text-sm font-bold text-blue-600">{item.eubmyeon}</span>
                                        </td>
                                        <td className="px-8 py-4">
                                            <span className="text-gray-950 font-bold group-hover:text-blue-600 transition-colors text-sm">{item.village}</span>
                                            <div className="text-xs text-gray-400 mt-0.5">{item.type}</div>
                                        </td>
                                        <td className="px-8 py-4 text-sm text-gray-600 font-semibold">{item.corporation}</td>
                                        <td className="px-8 py-4 text-sm text-gray-600 font-medium">{item.cotype}</td>
                                        <td className="px-8 py-4 text-sm text-gray-600 font-medium">{item.memberyn}</td>
                                        <td className="px-8 py-4 text-sm text-gray-600 font-medium">{item.ceo}</td>
                                        <td className="px-8 py-4 text-sm text-gray-600 font-medium">{item.worker}</td>
                                        <td className="px-8 py-4 text-sm text-gray-600 font-medium">{item.villhead}</td>
                                        <td className="px-8 py-4">
                                            <span className="inline-flex px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm font-bold">{item.product}</span>
                                        </td>
                                        <td className="px-8 py-4 text-right">
                                            <span className="text-blue-600 font-black font-mono text-xm">{item.revenue}</span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="10" className="px-8 py-12 text-center text-gray-400 font-bold">
                                        검색 조건에 맞는 데이터가 없습니다.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* 페이지네이션 (장식용) */}
                <div className="p-8 border-t border-gray-50 bg-gray-50/20 flex justify-center">
                    <div className="flex gap-2">
                        {[1, 2, 3].map(n => (
                            <button key={n} className={`w-10 h-10 rounded-lg font-bold text-sm transition-all ${n === 1 ? 'bg-blue-600 text-white' : 'bg-white text-gray-400 hover:bg-gray-100'}`}>
                                {n}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}

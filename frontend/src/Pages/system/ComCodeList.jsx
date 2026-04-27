import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import MainLayout from "../../layouts/MainLayout";
import { useTabs } from '../../context/TabContext';
import { Database, Search, RotateCcw, Loader2 } from 'lucide-react';
import ComCodeCreate from './ComCodeCreate';

export default function ComCodeManager({ masterList = [], detailList = [], searchParams: initialSearchParams = {} }) {
    const { addTab } = useTabs();
    const [selectedMaster, setSelectedMaster] = useState(null);
    const [detailsData, setDetailsData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const [searchParams, setSearchParams] = useState({
        master_cd: initialSearchParams?.master_cd || '',
        master_nm: initialSearchParams?.master_nm || ''
    });

    const handleSearch = () => {
        router.get('/system/comcode', searchParams, {
            preserveState: true,
            replace: false
        });
    };

    const handleMasterClick = async (masterCode) => {
        setSelectedMaster(masterCode);
        setIsLoading(true);
        try {
            const response = await fetch(`/system/comcode/detail/${masterCode}/`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            setDetailsData(data.success ? data.data : []);
        } catch (error) {
            console.error('Failed to fetch detail codes:', error);
            setDetailsData([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setSearchParams({ master_cd: '', master_nm: '' });
    };

    const handleCreateSuccess = () => {
        router.reload({ preserveState: false });
    };

    return (
        <MainLayout>
            <div className="font-sans flex flex-col bg-gray-50/50 mb-8">

                {/* 상단 헤더 */}
                <div className="mb-6 flex justify-between items-end flex-shrink-0">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-950 tracking-tighter flex items-center gap-2">
                            <Database className="w-6 h-6 text-cyan-500" />공통코드 관리
                        </h1>
                        <p className="text-gray-400 text-xs mt-1 font-medium">시스템 전반에서 사용되는 마스터 코드를 관리합니다.</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-5 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl shadow-sm hover:bg-gray-50 font-bold text-xs transition-all">
                            엑셀 내보내기
                        </button>
                        <button
                            onClick={() => setIsCreateOpen(true)}
                            className="px-5 py-2.5 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-100 hover:bg-blue-700 font-bold text-xs transition-all active:scale-95"
                        >
                            공통코드 등록
                        </button>
                    </div>
                </div>

                {/* 메인 그리드 */}
                <div className="flex gap-6 items-stretch">

                    {/* ── 왼쪽: 검색 + 공통코드 목록 ── */}
                    <div className="w-5/12 flex flex-col gap-6">

                        {/* 검색 카드 */}
                        <div className="bg-white rounded-[24px] border border-blue-100 shadow-xl p-5 flex-shrink-0">
                            <div className="flex items-center gap-4">
                                <div className="flex-1 grid grid-cols-2 gap-3">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-sm font-bold text-gray-400 ml-1 uppercase tracking-wider">코드</label>
                                        <input
                                            type="text"
                                            className="px-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-cyan-100 transition-all outline-none"
                                            value={searchParams.master_cd}
                                            onChange={(e) => setSearchParams({ ...searchParams, master_cd: e.target.value })}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-sm font-bold text-gray-400 ml-1 uppercase tracking-wider">코드명</label>
                                        <input
                                            type="text"
                                            className="px-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-cyan-100 transition-all outline-none"
                                            value={searchParams.master_nm}
                                            onChange={(e) => setSearchParams({ ...searchParams, master_nm: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-2 self-end">
                                    <button onClick={handleReset} className="p-2.5 bg-gray-100 text-gray-500 rounded-xl hover:bg-gray-200">
                                        <RotateCcw size={18} />
                                    </button>
                                    <button onClick={handleSearch} className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-xl font-bold text-xs hover:bg-black shadow-md">
                                        <Search size={16} /> 조회
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* 공통코드 목록 카드 - ✅ 고정 높이 + flex 구조로 스크롤 */}
                        <div className="bg-white rounded-[32px] border border-blue-100 shadow-xl flex flex-col h-full">
                            {/* 카드 헤더 - 고정 */}
                            <div className="p-6 border-b border-gray-50 bg-gray-50/30 flex-shrink-0 rounded-t-[32px]">
                                <h3 className="font-black text-gray-800 flex items-center gap-2 text-lg">
                                    <span className="w-1.5 h-4 bg-blue-600 rounded-full"></span>
                                    공통코드 목록 ({masterList.length})
                                </h3>
                            </div>
                            {/* ✅ 스크롤 영역 - flex-1 + overflow-y-auto */}
                            <div className="flex-1 overflow-y-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-gray-50/80 sticky top-0 z-10 backdrop-blur-sm">
                                        <tr className="text-gray-400 text-sm uppercase font-black tracking-widest">
                                            <th className="px-8 py-4">코드</th>
                                            <th className="px-8 py-4">코드명</th>
                                            <th className="px-8 py-4 text-center">상태</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm text-gray-600">
                                        {masterList.length > 0 ? masterList.map((item) => 
                                        (
                                            <tr
                                                key={item.master_cd}
                                                onClick={() => handleMasterClick(item.master_cd)}
                                                className={`cursor-pointer transition-all border-b border-gray-50
                                                    ${selectedMaster === item.master_cd
                                                        ? 'bg-blue-50/80 font-bold border-l-4 border-l-blue-600'
                                                        : 'hover:bg-gray-50'}`}
                                            >
                                                <td className="px-8 py-4 text-gray-900">{item.master_cd}</td>
                                                <td className="px-8 py-4">{item.master_nm}</td>
                                                <td className="px-8 py-4 text-center">
                                                    <span className={`px-2 py-1 rounded-md text-[10px] font-black
                                                        ${item.use_yn === 'Y' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                                        {item.use_yn === 'Y' ? '사용' : '미사용'}
                                                    </span>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="3" className="px-6 py-12 text-center text-gray-300 italic">데이터가 없습니다.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* ── 오른쪽: 상세코드 목록 ── */}
                    {/* ✅ 고정 높이 + flex 구조로 스크롤 */}
                    <div className="w-7/12 flex">
                        <div className="bg-white rounded-[32px] border border-blue-100 shadow-xl flex flex-col h-full w-full">    {/* 여기수정 위 2줄 ✅ 고정 높이 + flex 구조로 스크롤 */}
                            {/* 카드 헤더 - 고정 */}
                            <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/30 flex-shrink-0 rounded-t-[32px]">
                                <h3 className="font-black text-gray-800 flex items-center gap-2 text-lg">
                                    <span className="w-1.5 h-4 bg-indigo-500 rounded-full"></span>
                                    상세코드 목록
                                    {selectedMaster && (
                                        <span className="ml-2 px-2 py-0.5 bg-indigo-50 text-indigo-500 text-[12px] rounded-md tracking-tighter">
                                            {selectedMaster} ({detailsData.length})
                                        </span>
                                    )}
                                </h3>
                                <button className="px-3 py-1.5 text-[13px] font-black bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors">
                                    + Add New Code
                                </button>
                            </div>
                            {/* ✅ 스크롤 영역 - flex-1 + overflow-y-auto */}
                            <div className="flex-1 overflow-y-auto">
                                {selectedMaster ? (
                                    isLoading ? (
                                        <div className="h-full flex flex-col items-center justify-center p-20">
                                            <Loader2 size={40} className="text-indigo-500 animate-spin mb-3" />
                                            <p className="text-gray-400 text-sm">조회 중...</p>
                                        </div>
                                    ) : (
                                        <table className="w-full text-left border-collapse">
                                            <thead className="bg-gray-50/80 sticky top-0 z-10 backdrop-blur-sm">
                                                <tr className="text-gray-400 text-sm uppercase font-black tracking-widest">
                                                    <th className="px-8 py-4">상세코드</th>
                                                    <th className="px-8 py-4">상세코드명</th>
                                                    <th className="px-8 py-4 text-center">순서</th>
                                                    <th className="px-8 py-4 text-center">사용여부</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-sm text-gray-600">
                                                {detailsData.length > 0 ? detailsData.map((item, idx) => (
                                                    <tr key={`${item.dtl_cd}-${idx}`} className="hover:bg-indigo-50/50 transition-colors border-b border-gray-50">
                                                        <td className="px-8 py-4 font-bold text-gray-900">{item.dtl_cd}</td>
                                                        <td className="px-8 py-4">{item.dtl_nm}</td>
                                                        <td className="px-8 py-4 text-center text-gray-500">{item.sort_ord}</td>
                                                        <td className="px-8 py-4 text-center">
                                                            <span className={`px-2 py-1 rounded-md text-[10px] font-black
                                                            ${item.use_yn === 'Y' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                                                {item.use_yn === 'Y' ? '사용' : '미사용'}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                )) : (
                                                    <tr>
                                                        <td colSpan="4" className="px-6 py-12 text-center text-gray-300 italic">등록된 상세 코드가 없습니다.</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    )
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center p-20 text-center opacity-50">
                                        <div className="text-4xl mb-4">📂</div>
                                        <p className="text-gray-400 text-xs font-bold">왼쪽에서 대분류를 선택하세요.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>

                {/* 공통코드 등록 모달 */}
                <ComCodeCreate
                    isOpen={isCreateOpen}
                    onClose={() => setIsCreateOpen(false)}
                    onSuccess={handleCreateSuccess}
                />

        </MainLayout>
    );
}
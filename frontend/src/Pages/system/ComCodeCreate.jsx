import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { X, Database, Plus, RotateCcw } from 'lucide-react';
import Swal from 'sweetalert2';

/**
 * ComCodeCreate - 공통코드 등록 모달
 * 
 * Props:
 *   isOpen   {boolean}  - 모달 표시 여부
 *   onClose  {function} - 모달 닫기 콜백
 *   onSuccess {function} - 등록 성공 후 콜백 (목록 새로고침 등)
 */
export default function ComCodeCreate({ isOpen = false, onClose, onSuccess }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        master_cd: '',
        master_nm: '',
        use_yn: 'Y',
        remarks: '',
    });

    // 입력값 변경 핸들러
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // 해당 필드 에러 초기화
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    // 유효성 검사
    const validate = () => {
        const newErrors = {};
        if (!formData.master_cd.trim()) {
            newErrors.master_cd = '코드를 입력하세요.';
        } else if (formData.master_cd.length > 50) {
            newErrors.master_cd = '코드는 50자 이하로 입력하세요.';
        }
        if (!formData.master_nm.trim()) {
            newErrors.master_nm = '코드명을 입력하세요.';
        } else if (formData.master_nm.length > 100) {
            newErrors.master_nm = '코드명은 100자 이하로 입력하세요.';
        }
        return newErrors;
    };

    // 초기화
    const handleReset = () => {
        setFormData({ master_cd: '', master_nm: '', use_yn: 'Y', remarks: '' });
        setErrors({});
    };

    // 등록 제출
    const handleSubmit = async () => {
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsSubmitting(true);

        try {
            // ✅ router.post 대신 fetch 사용 (JsonResponse 수신 가능)
            const response = await fetch('/system/comcode/create/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1] || '',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (data.success) {
                // ✅ 기존 alert 대신 SweetAlert2 적용
                Swal.fire({
                    title: '완료',
                    text: '정상적으로 처리되었습니다.',
                    icon: 'success',
                    // 1. 크기 조절 (기본값은 32rem 정도입니다. 24rem이나 300~400px 정도로 줄일 수 있습니다)
                    width: '320px', 
                    // 2. 바깥 클릭 시 창이 닫히지 않도록 설정
                    allowOutsideClick: false,
                    // 3. ESC 키를 눌러서 닫히는 것 방지
                    allowEscapeKey: false,

                    confirmButtonText: '확인',
                    confirmButtonColor: '#4f46e5', // 프로젝트 테마색(Indigo)

                    // 버튼 디자인을 더 작게 만들고 싶을 때 (Tailwind 클래스 활용 가능)
                    customClass: {
                        text: 'text-[8px] font-bold pt-2', // sm(14px) 또는 xs(12px) 추천
                        title: 'text-[10px] font-bold pt-2', // sm(14px) 또는 xs(12px) 추천
                        icon: 'm-2 w-12 h-12 scale-75', // 마진 줄이고, 가로세로 고정 후 scale로 축소
                        confirmButton: 'px-6 py-2 text-sm rounded-lg',
                        htmlContainer: 'text-xs text-gray-500 m-0', // xs는 12px로 가장 작은 표준 크기
                        confirmButton: 'text-xs py-1.5 px-4 rounded-md',
                        popup: 'rounded-xl'      // 팝업: 모서리 곡률 조절
                    },
                    // 아이콘 크기 자체가 너무 크다면 아래 옵션으로 비중을 조절할 수 있습니다.
                    showClass: {
                        popup: 'animate__animated animate__fadeIn animate__faster'
                    }
                });
                handleReset();
                if (onSuccess) onSuccess();
                // if (onClose) onClose(); // 성공 후에도 모달 유지 (목록 새로고침 후 사용자가 직접 닫도록)
            } else {
                // 서버 유효성 에러 표시
                if (data.errors) setErrors(data.errors);
            }
        } catch (error) {
            console.error('등록 오류:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // 모달 외부 클릭 시 닫기
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            if (onClose) onClose();
        }
    };

    if (!isOpen) return null;

    return (
        /* Backdrop */
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ backgroundColor: 'rgba(15, 23, 42, 0.55)', backdropFilter: 'blur(4px)' }}
            // onClick={handleBackdropClick}  // 외부 클릭으로 닫기 (필요 시 활성화)
        >
            {/* Modal Panel */}
            <div className="relative bg-white rounded-[6px] shadow-2xl border border-gray-100 w-full max-w-md mx-4 overflow-hidden"
                style={{ boxShadow: '0 32px 64px -12px rgba(0,0,0,0.18), 0 0 0 1px rgba(99,102,241,0.08)' }}
            >
                {/* 상단 파란 액센트 바 */}
                {/* <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400" /> */}

                {/* 헤더 */}
                <div className="flex items-center justify-between px-7 pt-6 pb-5 border-b border-gray-50">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
                            <Database className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-base font-black text-gray-900 tracking-tight">공통코드 등록</h2>
                            <p className="text-[11px] text-gray-400 font-medium mt-0.5">새로운 마스터 코드를 등록합니다.</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* 폼 바디 */}
                <div className="px-7 py-6 flex flex-col gap-5">

                    {/* 코드 */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-wider ml-1">
                            코드 <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            name="master_cd"
                            value={formData.master_cd}
                            onChange={handleChange}
                            placeholder="예) GENDER, STATUS"
                            maxLength={50}
                            className={`px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm transition-all outline-none
                                ${errors.master_cd
                                    ? 'ring-2 ring-red-300 bg-red-50'
                                    : 'focus:ring-2 focus:ring-cyan-200'
                                }`}
                        />
                        {errors.master_cd && (
                            <p className="text-[11px] text-red-500 font-bold ml-1">{errors.master_cd}</p>
                        )}
                    </div>

                    {/* 코드명 */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-wider ml-1">
                            코드명 <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            name="master_nm"
                            value={formData.master_nm}
                            onChange={handleChange}
                            placeholder="예) 성별, 상태구분"
                            maxLength={100}
                            className={`px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm transition-all outline-none
                                ${errors.master_nm
                                    ? 'ring-2 ring-red-300 bg-red-50'
                                    : 'focus:ring-2 focus:ring-cyan-200'
                                }`}
                        />
                        {errors.master_nm && (
                            <p className="text-[11px] text-red-500 font-bold ml-1">{errors.master_nm}</p>
                        )}
                    </div>

                    {/* 사용여부 */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-wider ml-1">
                            사용여부
                        </label>
                        <div className="flex gap-2">
                            {[
                                { value: 'Y', label: '사용', activeClass: 'bg-green-500 text-white shadow-md shadow-green-100' },
                                { value: 'N', label: '미사용', activeClass: 'bg-red-400 text-white shadow-md shadow-red-100' },
                            ].map(opt => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, use_yn: opt.value }))}
                                    className={`flex-1 py-2.5 rounded-xl text-sm font-black transition-all
                                        ${formData.use_yn === opt.value
                                            ? opt.activeClass
                                            : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                                        }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 비고 */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-wider ml-1">
                            설명 (Description)
                        </label>
                        <textarea
                            name="remarks"
                            value={formData.remarks}
                            onChange={handleChange}
                            placeholder="코드의 설명을 입력하세요. (선택)"
                            rows={3}
                            className="px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm transition-all outline-none focus:ring-2 focus:ring-cyan-200 resize-none"
                        />
                    </div>
                </div>

                {/* 하단 버튼 */}
                <div className="flex gap-2.5 px-7 pb-7">
                    <button
                        type="button"
                        onClick={handleReset}
                        className="p-2.5 bg-gray-100 text-gray-500 rounded-xl hover:bg-gray-200 transition-all"
                        title="초기화"
                    >
                        <RotateCcw size={16} />
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl font-black text-xs hover:bg-gray-50 transition-all"
                    >
                        취소
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-600 text-white rounded-xl font-black text-xs hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                        ) : (
                            <Plus size={14} />
                        )}
                        공통코드 등록
                    </button>
                </div>
            </div>
        </div>
    );
}

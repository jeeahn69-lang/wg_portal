import React, { useState } from "react";
import MainLayout from "../../layouts/MainLayout";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
} from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

export default function VillageDetail() {
    const tabs = [
        "기본정보",
        "지원사업",
        "매출/일자리",
        "시설/장비",
        "사업장 전경",
        "현장점검",
    ];

    return (
        <MainLayout>
            {/* 헤더 */}
            <Card className="mb-8 shadow-xl border-blue-100">
                <CardContent className="flex justify-between items-center p-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1 rounded-lg">
                                동상면
                            </span>
                            <h1 className="text-3xl font-extrabold">밤티마을</h1>
                        </div>
                        <p className="text-gray-500">완주군 동상면 사봉리 123-12</p>
                    </div>

                    <div className="flex gap-3">
                        <Button variant="secondary">임시저장</Button>
                        <Button>정보수정</Button>
                    </div>
                </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs defaultValue="기본정보">
                <TabsList className="mb-6">
                    {tabs.map((tab) => (
                        <TabsTrigger key={tab} value={tab}>
                            {tab}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {/* ================= 기본정보 ================= */}
                <TabsContent value="기본정보">
                    <div className="space-y-6">
                        <Card>
                            <CardContent className="p-6 grid grid-cols-3 gap-6">
                                <Input defaultValue="밤티마을" placeholder="마을명" />
                                <Input defaultValue="완주군 동상면" />
                                <Input defaultValue="영농조합법인" />
                                <Input defaultValue="45세대" />
                                <Input defaultValue="112명" />
                                <Input defaultValue="김철수" />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6 grid grid-cols-4 gap-6">
                                <Input defaultValue="정종수" />
                                <Input defaultValue="대표" />
                                <Input defaultValue="010-0000-0000" />
                                <Input defaultValue="60세" />
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* ================= 지원사업 ================= */}
                <TabsContent value="지원사업">
                    <Card>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-3 gap-4 mb-6">
                                <Card className="p-4 text-center">총 6건</Card>
                                <Card className="p-4 text-center">838,600천원</Card>
                                <Card className="p-4 text-center">2019.06.12</Card>
                            </div>

                            <table className="w-full text-sm text-center">
                                <thead>
                                    <tr>
                                        <th>연도</th>
                                        <th>사업명</th>
                                        <th>금액</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>2018</td>
                                        <td>파워빌리지</td>
                                        <td>24,000</td>
                                    </tr>
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ================= 매출 ================= */}
                <TabsContent value="매출/일자리">
                    <Card>
                        <CardContent className="p-6">
                            <Button className="mb-4">매출 등록</Button>
                            <table className="w-full text-center">
                                <thead>
                                    <tr>
                                        <th>연도</th>
                                        <th>1분기</th>
                                        <th>합계</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>2025</td>
                                        <td>3000</td>
                                        <td>3000</td>
                                    </tr>
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ================= 시설 ================= */}
                <TabsContent value="시설/장비">
                    <Card>
                        <CardContent className="p-6">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr>
                                        <th>품목</th>
                                        <th>금액</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>썰매장</td>
                                        <td>20,000</td>
                                    </tr>
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ================= 이미지 ================= */}
                <TabsContent value="사업장 전경">
                    <div className="grid grid-cols-3 gap-6">
                        <Card className="p-6 text-center">이미지 영역</Card>
                        <Card className="p-6 text-center">이미지 영역</Card>
                        <Card className="p-6 text-center">이미지 영역</Card>
                    </div>
                </TabsContent>

                {/* ================= 현장점검 ================= */}
                <TabsContent value="현장점검">
                    <Card>
                        <CardContent className="p-6 space-y-4">
                            <div>2026.04.08 - 점검 내용</div>
                            <div>2021.03 - 점검 내용</div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </MainLayout>
    );
}
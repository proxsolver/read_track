/**
 * 로그인 페이지
 * 
 * OAuth를 통한 인증 제공
 */

import { Button } from '@/components/ui/button';
import { getLoginUrl } from '@/const';
import { BookOpen, Smartphone, Monitor, Cloud } from 'lucide-react';

export default function Login() {
    const handleLogin = () => {
        window.location.href = getLoginUrl();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* 로고 및 제목 */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-full mb-4">
                        <BookOpen className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        Read Track
                    </h1>
                    <p className="text-gray-600">
                        독서 진행을 추적하고 관리하세요
                    </p>
                </div>

                {/* 기능 소개 카드 */}
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
                        모든 디바이스에서 동기화
                    </h2>

                    <div className="space-y-4 mb-8">
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Cloud className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-900">클라우드 동기화</h3>
                                <p className="text-sm text-gray-600">
                                    모든 디바이스에서 실시간으로 독서 기록 동기화
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <Smartphone className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-900">모바일 지원</h3>
                                <p className="text-sm text-gray-600">
                                    휴대폰에서도 편리하게 독서 기록
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                <Monitor className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-900">PC 지원</h3>
                                <p className="text-sm text-gray-600">
                                    데스크톱에서 상세한 분석 및 관리
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* 로그인 버튼 */}
                    <Button
                        onClick={handleLogin}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg font-semibold rounded-xl"
                    >
                        로그인하고 시작하기
                    </Button>

                    <p className="text-xs text-gray-500 text-center mt-4">
                        로그인하면 모든 디바이스에서 데이터가 동기화됩니다
                    </p>
                </div>

                {/* 푸터 */}
                <p className="text-center text-sm text-gray-600">
                    © 2025 Read Track. 독서를 더욱 체계적으로.
                </p>
            </div>
        </div>
    );
}

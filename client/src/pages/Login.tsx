/**
 * 로그인 페이지
 * 
 * Google OAuth를 통한 인증 제공
 */

import { Button } from '@/components/ui/button';
import { BookOpen, Smartphone, Monitor, Cloud } from 'lucide-react';

export default function Login() {
    const handleGoogleLogin = () => {
        window.location.href = '/api/auth/google';
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

                    {/* Google 로그인 버튼 */}
                    <Button
                        onClick={handleGoogleLogin}
                        className="w-full bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-300 py-6 text-lg font-semibold rounded-xl flex items-center justify-center gap-3"
                    >
                        <svg className="w-6 h-6" viewBox="0 0 24 24">
                            <path
                                fill="#4285F4"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="#34A853"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                                fill="#EA4335"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                        </svg>
                        Google로 로그인
                    </Button>

                    <p className="text-xs text-gray-500 text-center mt-4">
                        Google 계정으로 로그인하면 모든 디바이스에서 데이터가 동기화됩니다
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

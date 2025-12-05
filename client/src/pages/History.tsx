/**
 * 독서 기록 히스토리 페이지
 * 
 * 모든 독서 기록을 날짜별로 정렬하여 표시
 */

import { useLocation } from 'wouter';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen, Calendar } from 'lucide-react';

export default function History() {
    const [, setLocation] = useLocation();
    const { state } = useApp();
    const { books, records } = state;

    // 날짜별로 기록 정렬 (최신순)
    const sortedRecords = [...records].sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    // 날짜별로 그룹화
    const groupedRecords = sortedRecords.reduce((acc, record) => {
        const date = record.date;
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(record);
        return acc;
    }, {} as Record<string, typeof records>);

    const getBookTitle = (bookId: number) => {
        const book = books.find(b => b.id === bookId);
        return book?.title || '알 수 없는 책';
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (dateStr === today.toISOString().split('T')[0]) {
            return '오늘';
        } else if (dateStr === yesterday.toISOString().split('T')[0]) {
            return '어제';
        }

        return date.toLocaleDateString('ko-KR', {
            month: 'long',
            day: 'numeric',
            weekday: 'short'
        });
    };

    return (
        <div className="min-h-screen bg-white overflow-auto pb-20">
            {/* 헤더 */}
            <header className="border-b border-gray-200 sticky top-0 bg-white z-10">
                <div className="container mx-auto px-4 py-4 sm:py-6 flex items-center gap-2 sm:gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setLocation('/')}
                        className="text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">📚 독서 기록</h1>
                </div>
            </header>

            {/* 기록 목록 */}
            <main className="container mx-auto px-4 py-6 max-w-2xl">
                {Object.keys(groupedRecords).length === 0 ? (
                    <div className="text-center py-12">
                        <BookOpen className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500">아직 독서 기록이 없습니다.</p>
                        <p className="text-sm text-gray-400 mt-1">책을 읽고 기록을 남겨보세요!</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {Object.entries(groupedRecords).map(([date, dayRecords]) => (
                            <div key={date}>
                                {/* 날짜 헤더 */}
                                <div className="flex items-center gap-2 mb-3">
                                    <Calendar className="w-4 h-4 text-gray-400" />
                                    <h2 className="text-sm font-semibold text-gray-600">
                                        {formatDate(date)}
                                    </h2>
                                </div>

                                {/* 해당 날짜의 기록들 */}
                                <div className="space-y-3">
                                    {dayRecords.map((record) => (
                                        <div
                                            key={record.id}
                                            className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                                        >
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-medium text-gray-900 text-sm sm:text-base">
                                                        {getBookTitle(record.bookId)}
                                                    </h3>
                                                    <p className="text-sm text-blue-600 font-medium">
                                                        {record.currentPage}p 완료
                                                    </p>
                                                </div>
                                            </div>
                                            {record.memo && (
                                                <p className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                                                    💬 {record.memo}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

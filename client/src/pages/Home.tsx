/**
 * 메인 대시보드 페이지
 * 
 * 설계: 미니멀하고 집중력 있는 스타일
 * - 현재 읽고 있는 도서 목록 표시
 * - 오늘의 전체 목표 달성률 표시
 * - 각 도서별 진행 상황 표시
 * - 오늘의 요약 복사 기능
 */

import { useLocation } from 'wouter';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Plus, Copy, Check } from 'lucide-react';
import BookCard from '@/components/BookCard';
import SettingsButton from '@/components/SettingsButton';
import { getTodayOverallProgress, generateDailySummaryAll } from '@/lib/calculations';
import { useState } from 'react';
import { toast } from 'sonner';

export default function Home() {
  const [, setLocation] = useLocation();
  const { state } = useApp();
  const [copied, setCopied] = useState(false);

  // 현재 읽고 있는 도서만 필터링
  const activeBooks = state.books.filter(book => !book.isCompleted);
  
  // 오늘의 전체 목표 달성률
  const todayProgress = getTodayOverallProgress(activeBooks, state.records);

  // 오늘 기록이 있는지 확인
  const today = new Date().toISOString().split('T')[0];
  const hasTodayRecord = state.records.some(r => r.date === today);

  const handleCopySummary = async () => {
    const summary = generateDailySummaryAll(
      state.ownerName || '사용자',
      state.startDate || today,
      state.books,
      state.records
    );
    
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      toast.success('요약이 복사되었습니다!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('복사에 실패했습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 */}
      <header className="border-b border-gray-200">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">날두독서</h1>
            <p className="text-sm text-gray-500 mt-1">독서 습관 관리</p>
          </div>
          <SettingsButton />
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="container mx-auto px-4 py-6 sm:py-8">
        {/* 오늘의 목표 달성률 */}
        <div className="mb-6 sm:mb-8">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
              오늘의 목표 달성률
            </h2>
            <span className="text-2xl font-bold text-gray-900">{todayProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${todayProgress}%` }}
            />
          </div>
        </div>

        {/* 도서 목록 */}
        {activeBooks.length > 0 ? (
          <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
            {activeBooks.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">아직 읽고 있는 책이 없습니다.</p>
          </div>
        )}

        {/* 버튼 영역 */}
        <div className="space-y-3">
          {/* 오늘의 요약 복사 버튼 */}
          {hasTodayRecord && (
            <Button
              onClick={handleCopySummary}
              className="w-full bg-green-600 hover:bg-green-700 text-white text-sm sm:text-base"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-1 sm:mr-2" />
                  <span>복사됨!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">오늘의 요약 복사</span>
                  <span className="sm:hidden">요약 복사</span>
                </>
              )}
            </Button>
          )}

          {/* 새 도서 추가 및 완독 목록 버튼 */}
          <div className="flex gap-2 sm:gap-3">
            <Button
              onClick={() => setLocation('/add-book')}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base"
            >
              <Plus className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">새로운 책 추가</span>
              <span className="sm:hidden">책 추가</span>
            </Button>
            <Button
              onClick={() => setLocation('/completed')}
              variant="outline"
              className="flex-1 text-sm sm:text-base"
            >
              <span className="hidden sm:inline">완독 목록</span>
              <span className="sm:hidden">완독</span>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

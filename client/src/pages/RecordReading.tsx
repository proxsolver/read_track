/**
 * 독서 기록 페이지
 * 
 * 설계: 메모 중심의 간단한 기록
 * - 현재 진행 상황 표시
 * - 오늘 읽을 페이지 자동 계산
 * - 메모 입력에 집중
 */

import { useState } from 'react';
import { useLocation, useRoute } from 'wouter';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Copy, Check } from 'lucide-react';
import {
  getCurrentPage,
  getTodayString,
  generateTodaySummary,
  getProgressPercentage,
} from '@/lib/calculations';

export default function RecordReading() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute('/record/:bookId');
  const { state, addRecord, getRecordsByBook } = useApp();

  const bookIdStr = params?.bookId as string;
  const bookId = parseInt(bookIdStr, 10);
  const book = state.books.find(b => b.id === bookId);
  const records = getRecordsByBook(bookId);

  const [memo, setMemo] = useState('');
  const [summary, setSummary] = useState('');
  const [copied, setCopied] = useState(false);
  const [autocopied, setAutocopied] = useState(false);

  if (!match || !book) {
    return null;
  }

  // 현재 페이지와 오늘 목표 페이지 계산
  const currentPageNum = getCurrentPage(book, records);
  const targetPage = Math.min(currentPageNum + book.dailyPages, book.totalPages);
  const progress = getProgressPercentage(book, records);

  const handleRecordComplete = async (e: React.FormEvent) => {
    e.preventDefault();

    // 기록 추가 (자동으로 dailyPages 만큼 진행)
    addRecord({
      bookId: book.id,
      date: getTodayString(),
      currentPage: targetPage,
      memo: memo.trim() || undefined,
    });

    // 요약 생성
    const newRecords = [...records, {
      id: 'temp',
      bookId: book.id,
      date: getTodayString(),
      currentPage: targetPage,
      memo: memo.trim() || undefined,
    }];

    const summaryText = generateTodaySummary(
      state.ownerName || '사용자',
      state.books.filter(b => !b.isCompleted),
      newRecords
    );
    setSummary(summaryText);

    // 자동으로 클립보드에 복사
    try {
      await navigator.clipboard.writeText(summaryText);
      setAutocopied(true);
      setTimeout(() => setAutocopied(false), 3000);
    } catch (err) {
      console.error('Failed to auto-copy:', err);
    }
  };

  const handleCopySummary = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (summary) {
    return (
      <div className="min-h-screen bg-white">
        {/* 헤더 */}
        <header className="border-b border-gray-200">
          <div className="container mx-auto px-4 py-6 flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation('/')}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">독서 요약</h1>
          </div>
        </header>

        {/* 요약 */}
        <main className="container mx-auto px-4 py-8 max-w-2xl">
          {/* 자동 복사 알림 */}
          {autocopied && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded text-sm text-green-700 flex items-center gap-2">
              <Check className="w-4 h-4" />
              요약이 자동으로 복사되었습니다!
            </div>
          )}

          <div className="mb-6">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 font-mono text-sm text-gray-900 whitespace-pre-wrap break-words mb-4">
              {summary}
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleCopySummary}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    복사됨!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    다시 복사하기
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => setLocation('/')}
              >
                완료
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 */}
      <header className="border-b border-gray-200">
        <div className="container mx-auto px-4 py-6 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation('/')}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">독서 기록: {book.title}</h1>
        </div>
      </header>

      {/* 폼 */}
      <main className="container mx-auto px-4 py-8 max-w-md">
        <form onSubmit={handleRecordComplete} className="space-y-6">
          {/* 현재 진행 상황 표시 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-700 mb-2">
              📖 현재 진행: <strong>{currentPageNum}p</strong> / {book.totalPages}p ({progress}%)
            </p>
            <p className="text-sm text-blue-700">
              📝 오늘 기록: <strong>{currentPageNum + 1}-{targetPage}p</strong> ({book.dailyPages}p)
            </p>
          </div>

          {/* 메모 */}
          <div>
            <label htmlFor="memo" className="block text-sm font-medium text-gray-700 mb-2">
              오늘의 메모 💬
            </label>
            <Textarea
              id="memo"
              placeholder="인상 깊었던 구절이나 생각을 기록하세요."
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              className="border-gray-300 min-h-32"
              autoFocus
            />
            <p className="text-xs text-gray-500 mt-1">
              요약에 포함됩니다. (선택 사항)
            </p>
          </div>

          {/* 버튼 */}
          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setLocation('/')}
              className="flex-1"
            >
              취소
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              ✓ 오늘 독서 완료
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}

/**
 * 독서 기록 페이지
 * 
 * 설계: 미니멀한 폼 디자인
 * - 오늘 읽은 페이지 입력
 * - 메모 입력 (선택 사항)
 * - 독서 요약 생성 및 자동 복사
 */

import { useState, useEffect } from 'react';
import { useLocation, useRoute } from 'wouter';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Copy, Check } from 'lucide-react';
import {
  getCurrentPage,
  getTodayString,
  generateTodaySummary,
  getYesterdayPage,
} from '@/lib/calculations';

export default function RecordReading() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute('/record/:bookId');
  const { state, addRecord, getRecordsByBook } = useApp();

  const bookIdStr = params?.bookId as string;
  const bookId = parseInt(bookIdStr, 10);
  const book = state.books.find(b => b.id === bookId);
  const records = getRecordsByBook(bookId);

  const [currentPage, setCurrentPage] = useState('');
  const [memo, setMemo] = useState('');
  const [summary, setSummary] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [autocopied, setAutocopied] = useState(false);

  useEffect(() => {
    if (book) {
      const yesterdayPage = getYesterdayPage(book, records);
      // 어제 페이지 + 일일 목표 페이지를 기본값으로 설정
      const suggestedPage = Math.min(yesterdayPage + book.dailyPages, book.totalPages);
      setCurrentPage(String(suggestedPage));
    }
  }, [book, records]);

  if (!match || !book) {
    return null;
  }

  const handleRecordComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!currentPage || parseInt(currentPage) < 0) {
      setError('페이지 수를 입력해주세요.');
      return;
    }

    const pageNum = parseInt(currentPage);
    if (pageNum > book.totalPages) {
      setError(`총 페이지 수(${book.totalPages}p)를 초과할 수 없습니다.`);
      return;
    }

    const yesterdayPage = getYesterdayPage(book, records);
    if (pageNum <= yesterdayPage) {
      setError(`어제 읽은 페이지(${yesterdayPage}p)보다 더 진행해야 합니다.`);
      return;
    }

    // 기록 추가
    addRecord({
      bookId: book.id,
      date: getTodayString(),
      currentPage: pageNum,
      memo: memo.trim() || undefined,
    });

    // 요약 생성
    const newRecords = [...records, {
      id: 'temp',
      bookId: book.id,
      date: getTodayString(),
      currentPage: pageNum,
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
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-blue-700">
              📖 현재 진행: <strong>{getYesterdayPage(book, records)}p</strong> / {book.totalPages}p
              ({Math.round((getYesterdayPage(book, records) / book.totalPages) * 100)}%)
            </p>
          </div>

          {/* 현재 페이지 */}
          <div>
            <label htmlFor="currentPage" className="block text-sm font-medium text-gray-700 mb-2">
              오늘 몇 페이지까지 읽으셨나요? *
            </label>
            <Input
              id="currentPage"
              type="number"
              placeholder="예: 359"
              value={currentPage}
              onChange={(e) => setCurrentPage(e.target.value)}
              className="border-gray-300 text-lg"
              min="0"
              max={book.totalPages}
            />
            <p className="text-xs text-gray-500 mt-1">
              {currentPage && parseInt(currentPage) > getYesterdayPage(book, records) ? (
                <span className="text-green-600">
                  ✓ {parseInt(currentPage) - getYesterdayPage(book, records)}p 읽음 → {Math.round((parseInt(currentPage) / book.totalPages) * 100)}% 완료
                </span>
              ) : (
                <span>목표: {book.dailyPages}p/일 (오늘 {getYesterdayPage(book, records) + book.dailyPages}p까지)</span>
              )}
            </p>
          </div>

          {/* 메모 */}
          <div>
            <label htmlFor="memo" className="block text-sm font-medium text-gray-700 mb-2">
              오늘의 메모 (선택 사항)
            </label>
            <Textarea
              id="memo"
              placeholder="인상 깊었던 구절이나 생각을 기록하세요."
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              className="border-gray-300 min-h-24"
            />
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
              {error}
            </div>
          )}

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
              기록 완료
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}

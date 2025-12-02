/**
 * 도서별 메모 목록 페이지
 * 
 * 설계: 미니멀한 목록 디자인
 * - 특정 도서의 모든 메모를 시간순으로 표시
 */

import { useLocation, useRoute } from 'wouter';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function BookNotes() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute('/book-notes/:bookId');
  const { state, getRecordsByBook } = useApp();

  const bookId = params?.bookId as string;
  const book = state.books.find(b => b.id === bookId);
  const records = getRecordsByBook(bookId).filter(r => r.memo);

  if (!match || !book) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 */}
      <header className="border-b border-gray-200">
        <div className="container mx-auto px-4 py-6 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation('/completed')}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">
            {book.title} - 메모
          </h1>
        </div>
      </header>

      {/* 메모 목록 */}
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {records.length > 0 ? (
          <div className="space-y-4">
            {records.map(record => (
              <div
                key={record.id}
                className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start gap-4 mb-2">
                  <h3 className="font-semibold text-gray-900">
                    {record.date}
                  </h3>
                  <span className="text-sm text-gray-500">
                    {record.currentPage}p
                  </span>
                </div>
                <p className="text-gray-700 whitespace-pre-wrap break-words">
                  {record.memo}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">아직 메모가 없습니다.</p>
          </div>
        )}
      </main>
    </div>
  );
}

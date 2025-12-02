/**
 * 완독 도서 목록 페이지
 * 
 * 설계: 미니멀한 목록 디자인
 * - 완독한 도서 목록 표시
 * - 완독일, 독서 기간 표시
 * - 메모 모아보기 기능
 */

import { useLocation } from 'wouter';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import {
  getCompletionDate,
  getReadingDuration,
} from '@/lib/calculations';

export default function CompletedBooks() {
  const [, setLocation] = useLocation();
  const { state, getRecordsByBook } = useApp();

  // 완독한 도서만 필터링
  const completedBooks = state.books.filter(book => book.isCompleted);

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
          <h1 className="text-2xl font-bold text-gray-900">
            완독한 책들 ({completedBooks.length}권)
          </h1>
        </div>
      </header>

      {/* 목록 */}
      <main className="container mx-auto px-4 py-8">
        {completedBooks.length > 0 ? (
          <div className="space-y-4">
            {completedBooks.map(book => {
              const records = getRecordsByBook(book.id);
              const completionDate = getCompletionDate(book, records);
              const duration = getReadingDuration(book, records);

              return (
                <div
                  key={book.id}
                  className="border border-gray-200 rounded-lg p-6 bg-white hover:shadow-md transition-shadow"
                >
                  <div className="flex gap-4">
                    {/* 책 표지 이미지 */}
                    {book.coverImageUrl && (
                      <div className="flex-shrink-0">
                        <img
                          src={book.coverImageUrl}
                          alt={book.title}
                          className="w-16 h-24 object-cover rounded border border-gray-200"
                        />
                      </div>
                    )}

                    {/* 도서 정보 */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 truncate mb-2">
                        {book.title}
                      </h3>

                      <div className="space-y-1 text-sm text-gray-600 mb-4">
                        {completionDate && (
                          <p>완독일: {completionDate}</p>
                        )}
                        <p>총 독서 기간: {duration}일</p>
                        <p>총 페이지: {book.totalPages}p</p>
                      </div>

                      <Button
                        onClick={() => setLocation(`/book-notes/${book.id}`)}
                        size="sm"
                        variant="outline"
                      >
                        메모 모아보기
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">아직 완독한 책이 없습니다.</p>
          </div>
        )}
      </main>
    </div>
  );
}

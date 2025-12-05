/**
 * 도서 카드 컴포넌트
 * 
 * 설계: 미니멀한 카드 디자인
 * - 도서 정보 표시
 * - 진행 상황 시각화
 * - 기록하기 버튼
 * - 설정 버튼
 */

import { useState } from 'react';
import { useLocation } from 'wouter';
import { Book, ReadingRecord } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import BookSettingsDialog from './BookSettingsDialog';
import {
  getDaysSinceStart,
  getTodayPageRange,
  getCurrentPage,
  getProgressPercentage,
  getTodayReadPages,
} from '@/lib/calculations';
import { MoreVertical } from 'lucide-react';

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  const [, setLocation] = useLocation();
  const { getRecordsByBook, updateBook, deleteBook, addRecord } = useApp();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const records = getRecordsByBook(book.id);
  const dayCount = getDaysSinceStart(book.startDate);
  const pageRange = getTodayPageRange(book, records);
  const currentPage = getCurrentPage(book, records);
  const progress = getProgressPercentage(book, records);
  const todayRead = getTodayReadPages(book, records);

  const handleUpdateBook = (updates: Partial<Book>) => {
    updateBook(book.id, updates);
  };

  const handleDeleteBook = () => {
    deleteBook(book.id);
  };

  return (
    <>
      <div className="border border-gray-200 rounded-lg p-4 sm:p-6 bg-white hover:shadow-md transition-shadow">
        <div className="flex gap-3 sm:gap-4">
          {/* 책 표지 이미지 - 모바일에서도 표시 */}
          {book.coverImageUrl && (
            <div className="flex-shrink-0">
              <img
                src={book.coverImageUrl}
                alt={book.title}
                className="w-12 h-16 sm:w-16 sm:h-24 object-cover rounded border border-gray-200"
              />
            </div>
          )}

          {/* 도서 정보 */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start gap-2 sm:gap-4 mb-2">
              <div className="min-w-0">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                  {book.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500">{dayCount}일차</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSettingsOpen(true)}
                className="text-gray-400 hover:text-gray-600 flex-shrink-0"
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>

            {/* 오늘의 목표 */}
            <div className="mb-2 sm:mb-3">
              <p className="text-xs text-gray-600 mb-1">
                오늘 목표: {pageRange.start}-{pageRange.end}p
              </p>
            </div>

            {/* 진행 상황 */}
            <div className="mb-2 sm:mb-3">
              <div className="flex justify-between items-center mb-1 text-xs sm:text-sm">
                <p className="text-xs text-gray-600 truncate">
                  진행률: {progress}%
                </p>
                <p className="text-xs text-gray-600 flex-shrink-0">
                  {currentPage}/{book.totalPages}p
                </p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* 오늘 읽은 독 */}
            {todayRead > 0 && (
              <p className="text-xs text-green-600 font-medium mb-2 sm:mb-3">
                ✓ 오늘 {todayRead}p 읽음
              </p>
            )}

            {/* 기록하기 버튼 */}
            <Button
              onClick={() => setLocation(`/record/${book.id}`)}
              size="sm"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm"
            >
              <span className="hidden sm:inline">기록하기</span>
              <span className="sm:hidden">기록</span>
            </Button>
          </div>
        </div>
      </div>

      {/* 도서 설정 모달 */}
      <BookSettingsDialog
        book={book}
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        onUpdate={handleUpdateBook}
        onDelete={handleDeleteBook}
        currentPage={currentPage}
        addRecord={addRecord}
      />
    </>
  );
}

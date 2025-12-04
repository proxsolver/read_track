/**
 * 도서 추가 페이지
 */

import { useState } from 'react';
import { useLocation } from 'wouter';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft } from 'lucide-react';
import { formatDate } from '@/lib/calculations';

export default function AddBook() {
  const [, setLocation] = useLocation();
  const { addBook } = useApp();

  // 폼 상태
  const [title, setTitle] = useState('');
  const [totalPages, setTotalPages] = useState('');
  const [dailyPages, setDailyPages] = useState('2');
  const [startDate, setStartDate] = useState(formatDate(new Date()));
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('도서명을 입력해주세요.');
      return;
    }

    if (!totalPages || parseInt(totalPages) <= 0) {
      setError('총 페이지 수를 입력해주세요.');
      return;
    }

    if (!dailyPages || parseInt(dailyPages) <= 0) {
      setError('하루 목표 페이지 수를 입력해주세요.');
      return;
    }

    await addBook({
      title: title.trim(),
      totalPages: parseInt(totalPages),
      dailyPages: parseInt(dailyPages),
      startDate,
      coverImageUrl: coverImageUrl.trim() || undefined,
      isCompleted: false,
    });

    setLocation('/');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 */}
      <header className="border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 sm:py-6 flex items-center gap-2 sm:gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation('/')}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">새로운 책 추가</h1>
        </div>
      </header>

      {/* 폼 */}
      <main className="container mx-auto px-4 py-6 sm:py-8 max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* 도서명 */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              도서명 *
            </label>
            <Input
              id="title"
              type="text"
              placeholder="예: 인간관계론"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border-gray-300"
            />
          </div>

          {/* 총 페이지 수 */}
          <div>
            <label htmlFor="totalPages" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              총 페이지 수 *
            </label>
            <Input
              id="totalPages"
              type="number"
              placeholder="예: 360"
              value={totalPages}
              onChange={(e) => setTotalPages(e.target.value)}
              className="border-gray-300"
              min="1"
            />
          </div>

          {/* 하루 목표 페이지 수 */}
          <div>
            <label htmlFor="dailyPages" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              하루 목표 페이지 수 *
            </label>
            <Input
              id="dailyPages"
              type="number"
              placeholder="예: 2"
              value={dailyPages}
              onChange={(e) => setDailyPages(e.target.value)}
              className="border-gray-300"
              min="1"
            />
          </div>

          {/* 읽기 시작한 날짜 */}
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              읽기 시작한 날짜
            </label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border-gray-300"
            />
          </div>

          {/* 책 표지 이미지 URL */}
          <div>
            <label htmlFor="coverImageUrl" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              책 표지 이미지 URL (선택 사항)
            </label>
            <Input
              id="coverImageUrl"
              type="url"
              placeholder="https://..."
              value={coverImageUrl}
              onChange={(e) => setCoverImageUrl(e.target.value)}
              className="border-gray-300"
            />
            {coverImageUrl && (
              <div className="mt-3">
                <img
                  src={coverImageUrl}
                  alt="책 표지 미리보기"
                  className="w-24 h-32 object-cover rounded border border-gray-200"
                />
              </div>
            )}
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
              {error}
            </div>
          )}

          {/* 버튼 */}
          <div className="flex gap-2 pt-2 sm:pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setLocation('/')}
              className="flex-1 text-sm sm:text-base"
            >
              취소
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base"
            >
              저장하기
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}

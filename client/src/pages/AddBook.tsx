/**
 * 도서 추가 페이지
 * 
 * 알라딘 API를 활용한 책 검색 및 자동 정보 입력
 */

import { useState } from 'react';
import { useLocation } from 'wouter';
import { useApp } from '@/contexts/AppContext';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Search, Loader2 } from 'lucide-react';
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

  // 검색 상태
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // 책 검색
  const searchBooksMutation = trpc.bookSearch.search.useMutation();

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const results = await searchBooksMutation.mutateAsync({
        query: searchQuery,
        maxResults: 10,
      });
      setSearchResults(results);
      setShowResults(true);
    } catch (err) {
      console.error('Search failed:', err);
      setError('책 검색에 실패했습니다.');
    } finally {
      setIsSearching(false);
    }
  };

  // 검색 결과 선택
  const handleSelectBook = (book: any) => {
    setTitle(book.title);
    setCoverImageUrl(book.cover);
    setTotalPages(book.itemPage?.toString() || '');
    setShowResults(false);
    setSearchQuery('');
  };

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
        {/* 책 검색 */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h2 className="text-sm font-semibold text-blue-900 mb-3">📚 책 검색 (yes24/알라딘)</h2>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="책 제목으로 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1"
            />
            <Button
              type="button"
              onClick={handleSearch}
              disabled={isSearching || !searchQuery.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSearching ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-blue-700 mt-2">
            yes24에서 책을 검색하면 표지와 정보가 자동으로 입력됩니다
          </p>
        </div>

        {/* 검색 결과 */}
        {showResults && searchResults.length > 0 && (
          <div className="mb-6 max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
            {searchResults.map((book, index) => (
              <button
                key={index}
                onClick={() => handleSelectBook(book)}
                className="w-full p-3 flex gap-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 text-left transition-colors"
              >
                {book.cover && (
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="w-12 h-16 object-cover rounded"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-gray-900 truncate">
                    {book.title}
                  </p>
                  <p className="text-xs text-gray-600 truncate">{book.author}</p>
                  <p className="text-xs text-gray-500">
                    {book.publisher} • {book.itemPage ? `${book.itemPage}p` : '페이지 정보 없음'}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}

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

/**
 * 도서 설정 모달 컴포넌트
 * 
 * 각 도서의 시작일, 하루 독서량, 현재 페이지, 전체 페이지를 수정할 수 있습니다.
 */

import { useState } from 'react';
import { Book, ReadingRecord } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Trash2 } from 'lucide-react';
import { getTodayString } from '@/lib/calculations';

interface BookSettingsDialogProps {
  book: Book;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (updates: Partial<Book>) => Promise<void>;
  onDelete: () => void;
  currentPage: number;
  addRecord: (record: Omit<ReadingRecord, 'id'>) => Promise<void>;
}

export default function BookSettingsDialog({
  book,
  open,
  onOpenChange,
  onUpdate,
  onDelete,
  currentPage,
  addRecord,
}: BookSettingsDialogProps) {
  const [title, setTitle] = useState(book.title);
  const [totalPages, setTotalPages] = useState(String(book.totalPages));
  const [dailyPages, setDailyPages] = useState(String(book.dailyPages));
  const [startDate, setStartDate] = useState(book.startDate);
  const [page, setPage] = useState(String(currentPage));
  const [coverImageUrl, setCoverImageUrl] = useState(book.coverImageUrl || '');
  const [error, setError] = useState('');

  const handleSave = async () => {
    setError('');

    if (!title.trim()) {
      setError('도서명을 입력해주세요.');
      return;
    }

    const total = parseInt(totalPages);
    const daily = parseInt(dailyPages);
    const current = parseInt(page);

    if (!total || total <= 0) {
      setError('총 페이지 수를 입력해주세요.');
      return;
    }

    if (!daily || daily <= 0) {
      setError('하루 목표 페이지 수를 입력해주세요.');
      return;
    }

    if (current < 0 || current > total) {
      setError(`현재 페이지는 0-${total} 사이여야 합니다.`);
      return;
    }

    await onUpdate({
      title: title.trim(),
      totalPages: total,
      dailyPages: daily,
      startDate,
      coverImageUrl: coverImageUrl.trim() || undefined,
    });

    // 현재 페이지가 변경되었으면 기록 추가 (await로 캐시 갱신 대기)
    if (current !== currentPage) {
      await addRecord({
        bookId: book.id,
        date: getTodayString(),
        currentPage: current,
      });
    }

    onOpenChange(false);
  };

  const handleDelete = () => {
    if (confirm('이 책을 정말 삭제하시겠습니까?')) {
      onDelete();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>도서 설정</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* 도서명 */}
          <div className="grid gap-2">
            <label htmlFor="edit-title" className="text-sm font-medium text-gray-700">
              도서명
            </label>
            <Input
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border-gray-300"
            />
          </div>

          {/* 책 표지 이미지 URL */}
          <div className="grid gap-2">
            <label htmlFor="edit-coverImageUrl" className="text-sm font-medium text-gray-700">
              책 표지 이미지 URL
            </label>
            <Input
              id="edit-coverImageUrl"
              type="url"
              placeholder="https://..."
              value={coverImageUrl}
              onChange={(e) => setCoverImageUrl(e.target.value)}
              className="border-gray-300"
            />
            <p className="text-xs text-gray-500">
              이미지 URL을 입력하면 책 표지가 업데이트됩니다.
            </p>
          </div>

          {/* 시작일 */}
          <div className="grid gap-2">
            <label htmlFor="edit-startDate" className="text-sm font-medium text-gray-700">
              읽기 시작한 날짜
            </label>
            <Input
              id="edit-startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border-gray-300"
            />
          </div>

          {/* 총 페이지 수 */}
          <div className="grid gap-2">
            <label htmlFor="edit-totalPages" className="text-sm font-medium text-gray-700">
              총 페이지 수
            </label>
            <Input
              id="edit-totalPages"
              type="number"
              value={totalPages}
              onChange={(e) => setTotalPages(e.target.value)}
              className="border-gray-300"
              min="1"
            />
          </div>

          {/* 하루 목표 페이지 수 */}
          <div className="grid gap-2">
            <label htmlFor="edit-dailyPages" className="text-sm font-medium text-gray-700">
              하루 목표 페이지 수
            </label>
            <Input
              id="edit-dailyPages"
              type="number"
              value={dailyPages}
              onChange={(e) => setDailyPages(e.target.value)}
              className="border-gray-300"
              min="1"
            />
          </div>

          {/* 현재 페이지 */}
          <div className="grid gap-2">
            <label htmlFor="edit-page" className="text-sm font-medium text-gray-700">
              현재 페이지
            </label>
            <Input
              id="edit-page"
              type="number"
              value={page}
              onChange={(e) => setPage(e.target.value)}
              className="border-gray-300"
              min="0"
              max={totalPages}
            />
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
              {error}
            </div>
          )}

          {/* 책 표지 미리보기 */}
          {coverImageUrl && (
            <div className="grid gap-2">
              <p className="text-sm font-medium text-gray-700">
                책 표지 미리보기
              </p>
              <img
                src={coverImageUrl}
                alt="Book cover preview"
                className="w-24 h-32 object-cover rounded border border-gray-200"
              />
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-between">
          <Button
            variant="destructive"
            onClick={handleDelete}
            className="mr-auto"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            삭제
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              취소
            </Button>
            <Button
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              저장
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

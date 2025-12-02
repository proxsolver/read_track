/**
 * 설정 버튼 컴포넌트
 * 
 * 사용자 이름, 날두독서 시작일 설정 및 기타 설정 접근
 */

import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Settings } from 'lucide-react';
import { formatDate } from '@/lib/calculations';

export default function SettingsButton() {
  const [open, setOpen] = useState(false);
  const { state, setOwnerName } = useApp();
  const [name, setName] = useState(state.ownerName || '');
  const [startDate, setStartDate] = useState(
    state.books.length > 0 ? state.books[0].startDate : formatDate(new Date())
  );

  const handleSave = () => {
    if (name.trim()) {
      setOwnerName(name);
    }
    setOpen(false);
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        className="text-gray-600 hover:text-gray-900"
      >
        <Settings className="w-5 h-5" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>설정</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* 사용자 이름 */}
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium text-gray-700">
                사용자 이름
              </label>
              <Input
                id="name"
                placeholder="예: 이현우"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border-gray-300"
              />
              <p className="text-xs text-gray-500">
                독서 요약에 표시될 이름입니다.
              </p>
            </div>

            {/* 날두독서 시작일 */}
            <div className="grid gap-2">
              <label htmlFor="startDate" className="text-sm font-medium text-gray-700">
                날두독서 시작일
              </label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border-gray-300"
                disabled
              />
              <p className="text-xs text-gray-500">
                첫 번째 도서의 시작일입니다. (읽기 전용)
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
            >
              취소
            </Button>
            <Button
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              저장
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

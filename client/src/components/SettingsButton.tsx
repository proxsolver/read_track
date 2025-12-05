/**
 * 설정 버튼 컴포넌트
 * 
 * 테마 선택, 사용자 이름, 날두독서 시작일 설정
 */

import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { useTheme, Theme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Settings, Sun, Moon, Sparkles } from 'lucide-react';
import { formatDate } from '@/lib/calculations';

const THEMES: { id: Theme; name: string; emoji: string; description: string; icon: React.ReactNode }[] = [
  { id: 'simple', name: '심플', emoji: '📖', description: '깔끔하고 미니멀한 디자인', icon: <Sun className="w-5 h-5" /> },
  { id: 'modern', name: '모던', emoji: '🌙', description: '다크모드 + 그라데이션', icon: <Moon className="w-5 h-5" /> },
  { id: 'kids', name: '키즈', emoji: '🌈', description: '밝고 화사한 파스텔 톤', icon: <Sparkles className="w-5 h-5" /> },
];

export default function SettingsButton() {
  const [open, setOpen] = useState(false);
  const { state, setOwnerName } = useApp();
  const { theme, setTheme } = useTheme();
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
            <DialogDescription>
              테마와 사용자 정보를 설정하세요.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* 테마 선택 */}
            <div className="grid gap-2">
              <label className="text-sm font-medium text-gray-700">
                테마 선택
              </label>
              <div className="grid grid-cols-3 gap-2">
                {THEMES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTheme(t.id)}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 ${theme === t.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <div className="text-2xl mb-1">{t.emoji}</div>
                    <div className="text-xs font-medium">{t.name}</div>
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500">
                {THEMES.find(t => t.id === theme)?.description}
              </p>
            </div>

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
              />
              <p className="text-xs text-gray-500">
                독서 일수 계산의 기준일입니다.
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

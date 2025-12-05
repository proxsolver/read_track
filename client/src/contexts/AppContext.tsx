/**
 * 전역 상태 관리 Context (서버 기반)
 * 
 * tRPC를 통해 서버와 동기화하며 모든 디바이스에서 데이터 공유
 */

import React, { createContext, useContext, useCallback } from 'react';
import { Book, ReadingRecord } from '@/lib/types';
import { trpc } from '@/lib/trpc';

interface AppContextType {
  // 사용자 정보
  user: { id: number; name: string | null } | undefined;

  // 도서 관련
  books: Book[];
  isLoadingBooks: boolean;
  addBook: (book: Omit<Book, 'id'>) => Promise<void>;
  deleteBook: (bookId: number) => Promise<void>;
  updateBook: (bookId: number, updates: Partial<Book>) => Promise<void>;

  // 기록 관련
  records: ReadingRecord[];
  isLoadingRecords: boolean;
  addRecord: (record: Omit<ReadingRecord, 'id'>) => Promise<void>;
  getRecordsByBook: (bookId: number) => ReadingRecord[];

  // 프로필 관련
  ownerName: string;
  setOwnerName: (name: string) => Promise<void>;

  // 하위 호환성을 위한 state 래퍼
  state: {
    books: Book[];
    records: ReadingRecord[];
    ownerName: string;
    startDate: string;
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const utils = trpc.useUtils();

  // 사용자 정보
  const { data: user } = trpc.auth.me.useQuery();

  // 도서 목록
  const { data: books = [], isLoading: isLoadingBooks } = trpc.books.list.useQuery(
    undefined,
    { enabled: !!user }
  );

  // 모든 독서 기록 (한 번의 쿼리로 가져오기 - React Hooks 규칙 준수)
  const { data: records = [], isLoading: isLoadingRecords } = trpc.records.listAll.useQuery(
    undefined,
    { enabled: !!user }
  );

  // 프로필
  const { data: profile } = trpc.profile.get.useQuery(
    undefined,
    { enabled: !!user }
  );

  // Mutations
  const createBookMutation = trpc.books.create.useMutation({
    onSuccess: () => {
      utils.books.list.invalidate();
    },
  });

  const updateBookMutation = trpc.books.update.useMutation({
    onSuccess: () => {
      utils.books.list.invalidate();
    },
  });

  const deleteBookMutation = trpc.books.delete.useMutation({
    onSuccess: () => {
      utils.books.list.invalidate();
    },
  });

  const createRecordMutation = trpc.records.create.useMutation({
    onSuccess: (_data, variables) => {
      utils.records.listByBook.invalidate({ bookId: variables.bookId });
    },
  });

  const updateProfileMutation = trpc.profile.update.useMutation({
    onSuccess: () => {
      utils.profile.get.invalidate();
    },
  });

  // Callbacks
  const addBook = useCallback(async (book: Omit<Book, 'id'>) => {
    await createBookMutation.mutateAsync({
      title: book.title,
      totalPages: book.totalPages,
      dailyPages: book.dailyPages,
      startDate: book.startDate,
      coverImageUrl: book.coverImageUrl,
    });
  }, [createBookMutation]);

  const deleteBook = useCallback(async (bookId: number) => {
    await deleteBookMutation.mutateAsync({ id: bookId });
  }, [deleteBookMutation]);

  const updateBook = useCallback(async (bookId: number, updates: Partial<Book>) => {
    await updateBookMutation.mutateAsync({
      id: bookId,
      ...updates,
      isCompleted: updates.isCompleted ? 1 : 0,
    });
  }, [updateBookMutation]);

  const addRecord = useCallback(async (record: Omit<ReadingRecord, 'id'>) => {
    await createRecordMutation.mutateAsync({
      bookId: record.bookId,
      date: record.date,
      currentPage: record.currentPage,
      memo: record.memo,
    });
  }, [createRecordMutation]);

  const setOwnerNameFn = useCallback(async (name: string) => {
    await updateProfileMutation.mutateAsync({ ownerName: name });
  }, [updateProfileMutation]);

  const getRecordsByBook = useCallback((bookId: number) => {
    return records
      .filter(r => r.bookId === bookId)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [records]);

  const value: AppContextType = {
    user,
    books: books.map(b => ({
      ...b,
      isCompleted: !!b.isCompleted,
    })),
    isLoadingBooks,
    addBook,
    deleteBook,
    updateBook,
    records,
    isLoadingRecords,
    addRecord,
    setOwnerName: setOwnerNameFn,
    getRecordsByBook,
    ownerName: profile?.ownerName || '',
    // 하위 호환성을 위한 state 래퍼
    state: {
      books: books.map(b => ({
        ...b,
        isCompleted: !!b.isCompleted,
      })),
      records,
      ownerName: profile?.ownerName || '',
      startDate: profile?.startDate || '',
    },
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextType {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
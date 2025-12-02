/**
 * 전역 상태 관리 Context
 * 
 * 설계: 미니멀한 상태 관리
 * - 도서 목록, 독서 기록, 사용자 정보를 전역으로 관리
 * - Local Storage와 자동 동기화
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AppState, Book, ReadingRecord } from '@/lib/types';
import * as storage from '@/lib/storage';
import { nanoid } from 'nanoid';
import { generateTestData } from '@/lib/testData';

interface AppContextType {
  state: AppState;
  addBook: (book: Omit<Book, 'id'>) => void;
  deleteBook: (bookId: string) => void;
  updateBook: (bookId: string, updates: Partial<Book>) => void;
  addRecord: (record: Omit<ReadingRecord, 'id'>) => void;
  setOwnerName: (name: string) => void;
  getRecordsByBook: (bookId: string) => ReadingRecord[];
  loadTestData?: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(() => {
    const stored = storage.loadState();
    // 저장된 데이터가 없으면 테스트 데이터 로드
    if (stored.books.length === 0) {
      return generateTestData();
    }
    return stored;
  });

  // 상태가 변경될 때마다 Local Storage에 저장
  useEffect(() => {
    storage.saveState(state);
  }, [state]);

  const addBook = useCallback((book: Omit<Book, 'id'>) => {
    const newBook: Book = {
      ...book,
      id: nanoid(),
    };
    setState(prev => storage.addBook(prev, newBook));
  }, []);

  const deleteBook = useCallback((bookId: string) => {
    setState(prev => storage.deleteBook(prev, bookId));
  }, []);

  const updateBook = useCallback((bookId: string, updates: Partial<Book>) => {
    setState(prev => storage.updateBook(prev, bookId, updates));
  }, []);

  const addRecord = useCallback((record: Omit<ReadingRecord, 'id'>) => {
    const newRecord: ReadingRecord = {
      ...record,
      id: nanoid(),
    };
    setState(prev => storage.addRecord(prev, newRecord));
  }, []);

  const setOwnerNameFn = useCallback((name: string) => {
    setState(prev => storage.setOwnerName(prev, name));
  }, []);

  const getRecordsByBook = useCallback((bookId: string) => {
    return storage.getRecordsByBook(state, bookId);
  }, [state]);

  const loadTestData = useCallback(() => {
    const testData = generateTestData();
    setState(testData);
  }, []);

  const value: AppContextType = {
    state,
    addBook,
    deleteBook,
    updateBook,
    addRecord,
    setOwnerName: setOwnerNameFn,
    getRecordsByBook,
  };

  // 개발 환경에서 테스트 데이터 로드 함수를 전역으로 노출
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).__loadTestData = loadTestData;
    }
  }, [loadTestData]);

  return (
    <AppContext.Provider value={{ ...value, loadTestData }}>
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

declare global {
  interface Window {
    __loadTestData?: () => void;
  }
}
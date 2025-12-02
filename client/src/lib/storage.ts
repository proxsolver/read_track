/**
 * Local Storage 관리 유틸리티
 * 
 * 설계: 미니멀한 데이터 저장소
 * - 도서 목록, 독서 기록, 사용자 정보를 Local Storage에 저장
 * - JSON 직렬화/역직렬화로 간단하게 처리
 */

import { AppState, Book, ReadingRecord } from './types';

const STORAGE_KEY = 'reading_tracker_app_state';

/**
 * 초기 상태
 */
const initialState: AppState = {
  books: [],
  records: [],
  ownerName: '',
};

/**
 * Local Storage에서 전체 상태를 불러옵니다
 */
export function loadState(): AppState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load state from localStorage:', error);
  }
  return initialState;
}

/**
 * 전체 상태를 Local Storage에 저장합니다
 */
export function saveState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save state to localStorage:', error);
  }
}

/**
 * 도서를 추가합니다
 */
export function addBook(state: AppState, book: Book): AppState {
  return {
    ...state,
    books: [...state.books, book],
  };
}

/**
 * 도서를 삭제합니다
 */
export function deleteBook(state: AppState, bookId: string): AppState {
  return {
    ...state,
    books: state.books.filter(b => b.id !== bookId),
    records: state.records.filter(r => r.bookId !== bookId),
  };
}

/**
 * 도서를 업데이트합니다
 */
export function updateBook(state: AppState, bookId: string, updates: Partial<Book>): AppState {
  return {
    ...state,
    books: state.books.map(b => b.id === bookId ? { ...b, ...updates } : b),
  };
}

/**
 * 독서 기록을 추가합니다
 */
export function addRecord(state: AppState, record: ReadingRecord): AppState {
  // 같은 날짜의 기록이 있으면 업데이트, 없으면 추가
  const existingIndex = state.records.findIndex(
    r => r.bookId === record.bookId && r.date === record.date
  );
  
  if (existingIndex >= 0) {
    const newRecords = [...state.records];
    newRecords[existingIndex] = record;
    return { ...state, records: newRecords };
  }
  
  return {
    ...state,
    records: [...state.records, record],
  };
}

/**
 * 특정 도서의 모든 기록을 불러옵니다
 */
export function getRecordsByBook(state: AppState, bookId: string): ReadingRecord[] {
  return state.records.filter(r => r.bookId === bookId).sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
}

/**
 * 특정 날짜의 모든 기록을 불러옵니다
 */
export function getRecordsByDate(state: AppState, date: string): ReadingRecord[] {
  return state.records.filter(r => r.date === date);
}

/**
 * 사용자 이름을 설정합니다
 */
export function setOwnerName(state: AppState, name: string): AppState {
  return {
    ...state,
    ownerName: name,
  };
}

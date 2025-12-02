/**
 * 테스트 데이터 생성 유틸리티
 * 
 * 애플리케이션 기능을 테스트하기 위한 샘플 데이터
 */

import { AppState, Book, ReadingRecord } from './types';
import { formatDate } from './calculations';

/**
 * 테스트용 샘플 데이터를 생성합니다
 */
export function generateTestData(): AppState {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const twoDaysAgo = new Date(today);
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - 10);

  const books: Book[] = [
    {
      id: 'book-1',
      title: '인간관계론',
      totalPages: 360,
      dailyPages: 2,
      startDate: formatDate(startDate),
      coverImageUrl: 'https://via.placeholder.com/150x200?text=인간관계론',
      isCompleted: false,
    },
    {
      id: 'book-2',
      title: '바바라민토 논리의 기술',
      totalPages: 400,
      dailyPages: 2,
      startDate: formatDate(startDate),
      coverImageUrl: 'https://via.placeholder.com/150x200?text=논리의기술',
      isCompleted: false,
    },
    {
      id: 'book-3',
      title: '서양미술사',
      totalPages: 1000,
      dailyPages: 3,
      startDate: formatDate(startDate),
      coverImageUrl: 'https://via.placeholder.com/150x200?text=서양미술사',
      isCompleted: false,
    },
    {
      id: 'book-4',
      title: '좋은 기업을 넘어 위대한 기업으로',
      totalPages: 500,
      dailyPages: 3,
      startDate: formatDate(new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)),
      isCompleted: true,
      completedDate: formatDate(new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000)),
    },
  ];

  const records: ReadingRecord[] = [
    // book-1 기록
    {
      id: 'record-1',
      bookId: 'book-1',
      date: formatDate(twoDaysAgo),
      currentPage: 50,
      memo: '인간관계의 기본 원칙이 흥미로웠다.',
    },
    {
      id: 'record-2',
      bookId: 'book-1',
      date: formatDate(yesterday),
      currentPage: 100,
      memo: '상대방을 이해하는 것의 중요성을 깨달았다.',
    },
    {
      id: 'record-3',
      bookId: 'book-1',
      date: formatDate(today),
      currentPage: 150,
      memo: '오늘의 내용도 매우 유익했다.',
    },
    // book-2 기록
    {
      id: 'record-4',
      bookId: 'book-2',
      date: formatDate(twoDaysAgo),
      currentPage: 80,
      memo: '논리적 사고의 중요성을 배웠다.',
    },
    {
      id: 'record-5',
      bookId: 'book-2',
      date: formatDate(yesterday),
      currentPage: 120,
      memo: '문제 해결 방법론이 도움이 된다.',
    },
    {
      id: 'record-6',
      bookId: 'book-2',
      date: formatDate(today),
      currentPage: 160,
    },
    // book-3 기록
    {
      id: 'record-7',
      bookId: 'book-3',
      date: formatDate(twoDaysAgo),
      currentPage: 200,
      memo: '미술 역사의 흐름이 흥미롭다.',
    },
    {
      id: 'record-8',
      bookId: 'book-3',
      date: formatDate(yesterday),
      currentPage: 350,
    },
    {
      id: 'record-9',
      bookId: 'book-3',
      date: formatDate(today),
      currentPage: 500,
      memo: '르네상스 시대의 예술이 정말 아름답다.',
    },
    // book-4 완독 기록
    {
      id: 'record-10',
      bookId: 'book-4',
      date: formatDate(new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000)),
      currentPage: 500,
      memo: '이 책은 정말 좋은 책이었다. 많은 인사이트를 얻었다.',
    },
  ];

  return {
    books,
    records,
    ownerName: '이현우',
  };
}

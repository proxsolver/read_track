import { describe, expect, it } from 'vitest';
import {
  getDaysSinceStart,
  getTodayString,
  formatDateKorean,
  getCurrentPage,
  getProgressPercentage,
  getTodayPageRange,
  getTodayReadPages,
  getTodayOverallProgress,
  isBookCompleted,
  generateTodaySummary,
  generateDailySummaryAll,
} from './calculations';
import { Book, ReadingRecord } from './types';

describe('calculations', () => {
  const mockBook: Book = {
    id: '1',
    title: '인간관계론',
    totalPages: 360,
    dailyPages: 50,
    startDate: '2025-11-25',
    isCompleted: false,
  };

  const mockBook2: Book = {
    id: '2',
    title: '바바라민토 논리의 기술',
    totalPages: 400,
    dailyPages: 40,
    startDate: '2025-11-25',
    isCompleted: false,
  };

  const today = getTodayString();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  const mockRecords: ReadingRecord[] = [
    {
      id: '1',
      bookId: '1',
      date: yesterdayStr,
      currentPage: 150,
    },
    {
      id: '2',
      bookId: '1',
      date: today,
      currentPage: 200,
    },
    {
      id: '3',
      bookId: '2',
      date: yesterdayStr,
      currentPage: 160,
    },
    {
      id: '4',
      bookId: '2',
      date: today,
      currentPage: 200,
    },
  ];

  describe('getDaysSinceStart', () => {
    it('should calculate days correctly', () => {
      const days = getDaysSinceStart('2025-12-01', '2025-12-03');
      expect(days).toBe(3);
    });

    it('should return at least 1 day', () => {
      const days = getDaysSinceStart('2025-12-03', '2025-12-03');
      expect(days).toBe(1);
    });
  });

  describe('formatDateKorean', () => {
    it('should format date in Korean style', () => {
      const formatted = formatDateKorean('2025-12-03');
      expect(formatted).toMatch(/2025\/12\/03\/\w/);
    });
  });

  describe('getCurrentPage', () => {
    it('should get current page for a book', () => {
      const page = getCurrentPage(mockBook, mockRecords, today);
      expect(page).toBe(200);
    });

    it('should return 0 if no records exist', () => {
      const page = getCurrentPage(mockBook, [], today);
      expect(page).toBe(0);
    });
  });

  describe('getProgressPercentage', () => {
    it('should calculate progress percentage', () => {
      const progress = getProgressPercentage(mockBook, mockRecords, today);
      expect(progress).toBe(56); // 200/360 * 100 ≈ 56%
    });

    it('should cap at 100%', () => {
      const completedBook: Book = { ...mockBook, totalPages: 100 };
      const records: ReadingRecord[] = [
        { id: '1', bookId: '1', date: today, currentPage: 150 },
      ];
      const progress = getProgressPercentage(completedBook, records, today);
      expect(progress).toBe(100);
    });
  });

  describe('getTodayPageRange', () => {
    it('should calculate today page range', () => {
      const range = getTodayPageRange(mockBook, mockRecords);
      expect(range.start).toBe(201); // currentPage + 1
      expect(range.end).toBe(250); // currentPage + dailyPages
    });
  });

  describe('getTodayReadPages', () => {
    it('should calculate pages read today', () => {
      const pages = getTodayReadPages(mockBook, mockRecords);
      expect(pages).toBe(50); // 200 - 150
    });
  });

  describe('getTodayOverallProgress', () => {
    it('should calculate overall progress for all books', () => {
      const progress = getTodayOverallProgress(
        [mockBook, mockBook2],
        mockRecords
      );
      // Book1: 50/50 = 100%, Book2: 40/40 = 100%
      expect(progress).toBe(100);
    });

    it('should return 0 if no books', () => {
      const progress = getTodayOverallProgress([], mockRecords);
      expect(progress).toBe(0);
    });
  });

  describe('isBookCompleted', () => {
    it('should return true if book is completed', () => {
      const completedBook: Book = { ...mockBook, totalPages: 100 };
      const records: ReadingRecord[] = [
        { id: '1', bookId: '1', date: today, currentPage: 100 },
      ];
      expect(isBookCompleted(completedBook, records)).toBe(true);
    });

    it('should return false if book is not completed', () => {
      expect(isBookCompleted(mockBook, mockRecords)).toBe(false);
    });
  });

  describe('generateDailySummaryAll', () => {
    it('should generate summary for all books with today records', () => {
      const summary = generateDailySummaryAll(
        '이현우',
        '2025-11-25',
        [mockBook, mockBook2],
        mockRecords
      );

      expect(summary).toContain('이현우의 날두독서 습관');
      expect(summary).toContain('인간관계론');
      expect(summary).toContain('바바라민토 논리의 기술');
      expect(summary).toContain('성장에 성공!');
    });

    it('should return no records message if no today records', () => {
      const summary = generateDailySummaryAll(
        '이현우',
        '2025-11-25',
        [mockBook],
        []
      );
      expect(summary).toContain('오늘 아직 독서 기록이 없습니다');
    });

    it('should show completed books with "완독-p" format', () => {
      const completedBook: Book = { ...mockBook, isCompleted: true };
      const records: ReadingRecord[] = [
        { id: '1', bookId: '1', date: today, currentPage: 360 },
      ];

      const summary = generateDailySummaryAll(
        '이현우',
        '2025-11-25',
        [completedBook],
        records
      );

      expect(summary).toContain('완독-p');
    });
  });
});

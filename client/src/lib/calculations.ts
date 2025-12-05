/**
 * 독서 진행 상황 계산 함수
 * 
 * 설계: 명확한 데이터 시각화를 위한 계산 로직
 * - 읽기 시작한 지 며칠째 계산
 * - 오늘의 목표 페이지 계산
 * - 진행률(%) 계산
 * - 독서 요약 생성
 */

import { Book, ReadingRecord, AppState } from './types';

/**
 * 두 날짜 사이의 일수를 계산합니다
 * @param startDate - 시작 날짜 (YYYY-MM-DD)
 * @param endDate - 종료 날짜 (YYYY-MM-DD), 기본값은 오늘
 * @returns 일수
 */
export function getDaysSinceStart(startDate: string, endDate: string = getTodayString()): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays + 1); // +1은 시작일을 포함하기 위함
}

/**
 * 오늘 날짜를 YYYY-MM-DD 형식으로 반환합니다
 */
export function getTodayString(): string {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

/**
 * 특정 날짜를 YYYY-MM-DD 형식으로 반환합니다
 */
export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * 날짜를 한국식 형식으로 표시합니다 (예: 2025/12/03/수)
 */
export function formatDateKorean(dateString: string): string {
  const date = new Date(dateString + 'T00:00:00');
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];
  return `${year}/${month}/${day}/${dayOfWeek}`;
}

/**
 * 특정 도서의 현재 페이지를 구합니다
 * @param book - 도서
 * @param records - 해당 도서의 모든 기록
 * @param date - 기준 날짜 (기본값은 오늘)
 * @returns 현재 페이지
 */
export function getCurrentPage(
  book: Book,
  records: ReadingRecord[],
  date: string = getTodayString()
): number {
  // 해당 날짜 이전의 기록 중 가장 최신 기록을 찾습니다
  const latestRecord = records
    .filter(r => r.date <= date)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

  return latestRecord ? latestRecord.currentPage : 0;
}

/**
 * 특정 도서의 진행률을 계산합니다 (0-100)
 */
export function getProgressPercentage(
  book: Book,
  records: ReadingRecord[],
  date: string = getTodayString()
): number {
  const currentPage = getCurrentPage(book, records, date);
  return Math.min(100, Math.round((currentPage / book.totalPages) * 100));
}

/**
 * 특정 도서의 오늘 읽을 페이지 범위를 구합니다
 * @returns { start: 시작 페이지, end: 종료 페이지 }
 */
export function getTodayPageRange(
  book: Book,
  records: ReadingRecord[]
): { start: number; end: number } {
  const currentPage = getCurrentPage(book, records);
  const start = currentPage + 1;
  const end = Math.min(currentPage + book.dailyPages, book.totalPages);
  return { start, end };
}

/**
 * 특정 도서의 어제 읽은 페이지를 구합니다
 */
export function getYesterdayPage(
  book: Book,
  records: ReadingRecord[]
): number {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayString = formatDate(yesterday);
  return getCurrentPage(book, records, yesterdayString);
}

/**
 * 특정 도서의 오늘 읽은 페이지를 구합니다
 */
export function getTodayReadPages(
  book: Book,
  records: ReadingRecord[]
): number {
  const today = getTodayString();
  const todayPage = getCurrentPage(book, records, today);
  const yesterdayPage = getYesterdayPage(book, records);
  return Math.max(0, todayPage - yesterdayPage);
}

/**
 * 모든 도서의 오늘 목표 달성률을 계산합니다
 */
export function getTodayOverallProgress(
  books: Book[],
  records: ReadingRecord[]
): number {
  if (books.length === 0) return 0;

  const totalProgress = books.reduce((sum, book) => {
    const todayRead = getTodayReadPages(book, records);
    const progress = Math.min(100, (todayRead / book.dailyPages) * 100);
    return sum + progress;
  }, 0);

  return Math.round(totalProgress / books.length);
}

/**
 * 도서가 완독되었는지 확인합니다
 */
export function isBookCompleted(
  book: Book,
  records: ReadingRecord[]
): boolean {
  const currentPage = getCurrentPage(book, records);
  return currentPage >= book.totalPages;
}

/**
 * 완독한 도서의 완독일을 구합니다
 */
export function getCompletionDate(
  book: Book,
  records: ReadingRecord[]
): string | null {
  // 총 페이지에 도달한 첫 번째 날짜를 찾습니다
  const completionRecord = records
    .filter(r => r.bookId === book.id && r.currentPage >= book.totalPages)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

  return completionRecord ? completionRecord.date : null;
}

/**
 * 도서의 독서 기간을 계산합니다 (일수)
 */
export function getReadingDuration(
  book: Book,
  records: ReadingRecord[]
): number {
  const completionDate = getCompletionDate(book, records);
  if (!completionDate) {
    return getDaysSinceStart(book.startDate);
  }
  return getDaysSinceStart(book.startDate, completionDate);
}

/**
 * 오늘의 독서 요약을 생성합니다
 * @param ownerName - 사용자 이름
 * @param books - 현재 읽고 있는 도서 목록
 * @param records - 모든 독서 기록
 * @returns 요약 텍스트
 */
export function generateTodaySummary(
  ownerName: string,
  books: Book[],
  records: ReadingRecord[]
): string {
  const today = getTodayString();
  const todayRecords = getRecordsByDate(records, today);

  if (todayRecords.length === 0) {
    return '오늘 아직 독서 기록이 없습니다.';
  }

  const totalDays = getDaysSinceStart(books[0]?.startDate || today);
  const dateStr = formatDateKorean(today);

  let summary = `${ownerName}의 날두독서 습관 ${totalDays}일차 ${dateStr}\n\n`;

  todayRecords.forEach(record => {
    const book = books.find(b => b.id === record.bookId);
    if (book) {
      const dayCount = getDaysSinceStart(book.startDate, today);
      const yesterdayPage = getYesterdayPage(book, records);
      const todayPage = record.currentPage;
      summary += `${dayCount}일차\n`;
      summary += `${book.title} ${yesterdayPage + 1}-${todayPage}p 독서 완료\n\n`;
    }
  });

  summary += '성장에 성공!';

  return summary;
}

/**
 * 기록 배열에서 특정 날짜의 기록을 필터링합니다
 */
function getRecordsByDate(records: ReadingRecord[], date: string): ReadingRecord[] {
  return records.filter(r => r.date === date);
}

/**
 * 모든 도서의 오늘 기록을 한 번에 생성합니다
 * 같은 책은 하루에 마지막 기록만 표시
 */
export function generateDailySummaryAll(
  ownerName: string,
  startDate: string,
  books: Book[],
  records: ReadingRecord[]
): string {
  const today = getTodayString();
  const todayRecords = getRecordsByDate(records, today);

  if (todayRecords.length === 0) {
    return '오늘 아직 독서 기록이 없습니다.';
  }

  const totalDays = getDaysSinceStart(startDate);
  const dateStr = formatDateKorean(today);

  let summary = `${ownerName}의 날두독서 습관 ${totalDays}일차 ${dateStr}\n\n`;

  // 책별로 마지막 기록만 추출 (같은 책 중복 방지)
  const latestRecordsByBook = new Map<number, typeof todayRecords[0]>();
  todayRecords.forEach(record => {
    latestRecordsByBook.set(record.bookId, record);
  });

  // 책별로 요약 생성
  latestRecordsByBook.forEach((record, bookId) => {
    const book = books.find(b => b.id === bookId);
    if (book) {
      const dayCount = getDaysSinceStart(book.startDate, today);
      summary += `${dayCount}일차\n`;

      if (isBookCompleted(book, records)) {
        // 완독한 책
        summary += `${book.title} 완독 독서 완료\n`;
      } else {
        // 읽는 중인 책
        const yesterdayPage = getYesterdayPage(book, records);
        const todayPage = record.currentPage;
        summary += `${book.title} ${yesterdayPage + 1}-${todayPage}p 독서 완료\n`;
      }

      // 메모가 있으면 추가
      if (record.memo) {
        summary += `"${record.memo}"\n`;
      }
      summary += '\n';
    }
  });

  summary += '성장에 성공!';

  return summary;
}

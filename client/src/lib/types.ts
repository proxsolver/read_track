/**
 * 독서 관리 애플리케이션의 데이터 타입 정의
 * 
 * 설계 철학: 미니멀하고 집중력 있는 스타일
 * - 깔끔한 데이터 구조로 복잡성 최소화
 * - 필수 정보만 포함
 */

/**
 * 도서 정보
 */
export interface Book {
  id: number; // 고유 ID (서버 생성)
  title: string; // 도서명
  totalPages: number; // 총 페이지 수
  dailyPages: number; // 하루 목표 페이지 수
  startDate: string; // 읽기 시작한 날짜 (YYYY-MM-DD)
  coverImageUrl?: string; // 책 표지 이미지 URL (선택 사항)
  isCompleted: boolean; // 완독 여부
  completedDate?: string; // 완독한 날짜 (YYYY-MM-DD)
}

/**
 * 일일 독서 기록
 */
export interface ReadingRecord {
  id: number; // 고유 ID (서버 생성)
  bookId: number; // 도서 ID
  date: string; // 기록 날짜 (YYYY-MM-DD)
  currentPage: number; // 현재까지 읽은 페이지
  memo?: string; // 그날의 메모 (선택 사항)
}

/**
 * 애플리케이션 전체 상태
 */
export interface AppState {
  books: Book[];
  records: ReadingRecord[];
  ownerName?: string; // 사용자 이름 (예: 이현우)
  startDate?: string; // 날두독서 시작일 (YYYY-MM-DD)
}

/**
 * yes24 도서 검색 API
 * 
 * GitHub 레포지토리 참고: https://github.com/2klips/Yes24_
 */

interface Book {
    title: string;
    author: string;
    publisher: string;
    pubDate: string;
    cover: string;
    isbn: string;
    isbn13: string;
    itemPage?: number;
    description: string;
    link: string;
    price: number;
}

const ALADIN_API_KEY = process.env.ALADIN_API_KEY || 'ttbdlengus11691003001';

/**
 * yes24 도서 검색
 * cheerio로 HTML 파싱
 */
async function searchBooksYes24(query: string, maxResults: number = 10): Promise<Book[]> {
    try {
        // yes24는 서버사이드 HTML 파싱이 어려우므로 (JavaScript 렌더링 필요)
        // 알라딘 API를 메인으로 사용
        console.log('[yes24] Skipping yes24 (requires browser rendering), using Aladin');
        return [];
    } catch (error) {
        console.error('[yes24] Search failed:', error);
        return [];
    }
}

/**
 * 알라딘 API (메인)
 */
async function searchBooksAladin(query: string, maxResults: number = 10): Promise<Book[]> {
    try {
        const url = new URL('http://www.aladin.co.kr/ttb/api/ItemSearch.aspx');
        url.searchParams.set('ttbkey', ALADIN_API_KEY);
        url.searchParams.set('Query', query);
        url.searchParams.set('QueryType', 'Title');
        url.searchParams.set('MaxResults', String(maxResults));
        url.searchParams.set('start', '1');
        url.searchParams.set('SearchTarget', 'Book');
        url.searchParams.set('output', 'js');
        url.searchParams.set('Version', '20131101');
        url.searchParams.set('Cover', 'Big');

        const response = await fetch(url.toString());

        if (!response.ok) {
            throw new Error(`Aladin API error: ${response.statusText}`);
        }

        const data: any = await response.json();

        return (data.item || []).map((book: any) => ({
            title: book.title,
            author: book.author,
            publisher: book.publisher,
            pubDate: book.pubDate,
            cover: book.cover,
            isbn: book.isbn,
            isbn13: book.isbn13,
            itemPage: book.itemPage,
            description: book.description,
            link: book.link || '',
            price: book.priceStandard || 0,
        }));
    } catch (error) {
        console.error('[Aladin API] Search failed:', error);
        return [];
    }
}

/**
 * 통합 책 검색
 * 알라딘 API 사용 (yes24는 브라우저 렌더링 필요로 서버에서 제한적)
 */
export async function searchBooks(query: string, maxResults: number = 10): Promise<Book[]> {
    // 알라딘 API 사용
    return searchBooksAladin(query, maxResults);
}

/**
 * 책 상세 정보
 */
export async function getBookDetails(isbn13: string): Promise<Book | null> {
    try {
        const url = new URL('http://www.aladin.co.kr/ttb/api/ItemLookUp.aspx');
        url.searchParams.set('ttbkey', ALADIN_API_KEY);
        url.searchParams.set('itemIdType', 'ISBN13');
        url.searchParams.set('ItemId', isbn13);
        url.searchParams.set('output', 'js');
        url.searchParams.set('Version', '20131101');
        url.searchParams.set('Cover', 'Big');

        const response = await fetch(url.toString());

        if (!response.ok) {
            throw new Error(`Aladin API error: ${response.statusText}`);
        }

        const data: any = await response.json();
        const book = data.item?.[0];

        if (!book) return null;

        return {
            title: book.title,
            author: book.author,
            publisher: book.publisher,
            pubDate: book.pubDate,
            cover: book.cover,
            isbn: book.isbn,
            isbn13: book.isbn13,
            itemPage: book.itemPage,
            description: book.description,
            link: book.link || '',
            price: book.priceStandard || 0,
        };
    } catch (error) {
        console.error('[Aladin API] Get book details failed:', error);
        return null;
    }
}

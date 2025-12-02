import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, index } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * 도서 테이블
 * 사용자가 읽고 있는 도서 정보를 저장합니다.
 */
export const books = mysqlTable("books", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  totalPages: int("totalPages").notNull(),
  dailyPages: int("dailyPages").notNull(),
  startDate: varchar("startDate", { length: 10 }).notNull(), // YYYY-MM-DD format
  coverImageUrl: text("coverImageUrl"),
  isCompleted: int("isCompleted").default(0).notNull(), // 0 = false, 1 = true
  completedDate: varchar("completedDate", { length: 10 }), // YYYY-MM-DD format
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => (
  {
    userIdIdx: index("books_userId_idx").on(table.userId),
  }
));

export type Book = typeof books.$inferSelect;
export type InsertBook = typeof books.$inferInsert;

/**
 * 독서 기록 테이블
 * 매일의 독서 진행 상황을 기록합니다.
 */
export const readingRecords = mysqlTable("readingRecords", {
  id: int("id").autoincrement().primaryKey(),
  bookId: int("bookId").notNull().references(() => books.id, { onDelete: "cascade" }),
  date: varchar("date", { length: 10 }).notNull(), // YYYY-MM-DD format
  currentPage: int("currentPage").notNull(),
  memo: text("memo"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => (
  {
    bookIdIdx: index("readingRecords_bookId_idx").on(table.bookId),
    dateIdx: index("readingRecords_date_idx").on(table.date),
  }
));

export type ReadingRecord = typeof readingRecords.$inferSelect;
export type InsertReadingRecord = typeof readingRecords.$inferInsert;

/**
 * 사용자 프로필 테이블
 * 사용자의 독서 습관 정보를 저장합니다.
 */
export const userProfiles = mysqlTable("userProfiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique().references(() => users.id, { onDelete: "cascade" }),
  ownerName: varchar("ownerName", { length: 100 }),
  startDate: varchar("startDate", { length: 10 }), // 날두독서 시작일
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertUserProfile = typeof userProfiles.$inferInsert;

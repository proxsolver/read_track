import { eq, and, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, books, readingRecords, userProfiles } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ===== Books =====

export async function createBook(userId: number, bookData: {
  title: string;
  totalPages: number;
  dailyPages: number;
  startDate: string;
  coverImageUrl?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.insert(books).values({
    userId,
    ...bookData,
  });
}

export async function getBooksByUserId(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.select().from(books).where(eq(books.userId, userId));
}

export async function getBookById(bookId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.select().from(books).where(eq(books.id, bookId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function updateBook(bookId: number, bookData: Partial<{
  title: string;
  totalPages: number;
  dailyPages: number;
  startDate: string;
  coverImageUrl?: string;
  isCompleted: number;
  completedDate?: string;
}>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.update(books).set(bookData).where(eq(books.id, bookId));
}

export async function deleteBook(bookId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.delete(books).where(eq(books.id, bookId));
}

// ===== Reading Records =====

export async function createReadingRecord(bookId: number, recordData: {
  date: string;
  currentPage: number;
  memo?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.insert(readingRecords).values({
    bookId,
    ...recordData,
  });
}

export async function getReadingRecordsByBookId(bookId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.select().from(readingRecords)
    .where(eq(readingRecords.bookId, bookId))
    .orderBy(desc(readingRecords.date));
}

export async function getReadingRecordByBookAndDate(bookId: number, date: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.select().from(readingRecords)
    .where(and(
      eq(readingRecords.bookId, bookId),
      eq(readingRecords.date, date)
    ))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function updateReadingRecord(recordId: number, recordData: Partial<{
  currentPage: number;
  memo?: string;
}>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.update(readingRecords).set(recordData).where(eq(readingRecords.id, recordId));
}

export async function deleteReadingRecord(recordId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.delete(readingRecords).where(eq(readingRecords.id, recordId));
}

// ===== User Profiles =====

export async function getUserProfile(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function createOrUpdateUserProfile(userId: number, profileData: {
  ownerName?: string;
  startDate?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await getUserProfile(userId);

  if (existing) {
    return db.update(userProfiles).set(profileData).where(eq(userProfiles.userId, userId));
  } else {
    return db.insert(userProfiles).values({
      userId,
      ...profileData,
    });
  }
}

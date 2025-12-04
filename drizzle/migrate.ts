import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { users, books, readingRecords, userProfiles } from "./schema";

export async function migrateDatabaseCommand() {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
        throw new Error("DATABASE_URL is not set");
    }

    // Create a postgres connection
    const client = postgres(connectionString);
    const db = drizzle(client);

    console.log("[DB] Creating/updating tables from schema...");

    try {
        // Create tables if they don't exist
        // This uses the schema definitions to create tables
        await client`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        "openId" VARCHAR(64) NOT NULL UNIQUE,
        name TEXT,
        email VARCHAR(320),
        "loginMethod" VARCHAR(64),
        role VARCHAR(10) NOT NULL DEFAULT 'user',
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        "lastSignedIn" TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS books (
        id SERIAL PRIMARY KEY,
        "userId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        "totalPages" INTEGER NOT NULL,
        "dailyPages" INTEGER NOT NULL,
        "startDate" VARCHAR(10) NOT NULL,
        "coverImageUrl" TEXT,
        "isCompleted" INTEGER NOT NULL DEFAULT 0,
        "completedDate" VARCHAR(10),
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS books_userId_idx ON books("userId");

      CREATE TABLE IF NOT EXISTS "readingRecords" (
        id SERIAL PRIMARY KEY,
        "bookId" INTEGER NOT NULL REFERENCES books(id) ON DELETE CASCADE,
        date VARCHAR(10) NOT NULL,
        "currentPage" INTEGER NOT NULL,
        memo TEXT,
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS "readingRecords_bookId_idx" ON "readingRecords"("bookId");
      CREATE INDEX IF NOT EXISTS "readingRecords_date_idx" ON "readingRecords"(date);

      CREATE TABLE IF NOT EXISTS "userProfiles" (
        id SERIAL PRIMARY KEY,
        "userId" INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
        "ownerName" VARCHAR(100),
        "startDate" VARCHAR(10),
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `;

        console.log("[DB] Tables created/verified successfully!");
    } catch (error) {
        console.error("[DB] Migration error:", error);
        throw error;
    } finally {
        await client.end();
    }
}

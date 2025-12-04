import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

export async function migrateDatabaseCommand() {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
        throw new Error("DATABASE_URL is not set");
    }

    // Create a postgres connection for migrations
    const migrationClient = postgres(connectionString, { max: 1 });
    const db = drizzle(migrationClient);

    console.log("[DB] Starting migration...");

    try {
        await migrate(db, { migrationsFolder: "./drizzle" });
        console.log("[DB] Migration complete!");
    } catch (error) {
        console.error("[DB] Migration error:", error);
        throw error;
    } finally {
        await migrationClient.end();
    }
}

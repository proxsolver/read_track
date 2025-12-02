import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(userId: number = 1): TrpcContext {
  const user: AuthenticatedUser = {
    id: userId,
    openId: `test-user-${userId}`,
    email: `test${userId}@example.com`,
    name: `Test User ${userId}`,
    loginMethod: "test",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return ctx;
}

describe("books router", () => {
  it("should list books for authenticated user", async () => {
    const ctx = createAuthContext(1);
    const caller = appRouter.createCaller(ctx);

    // This should not throw
    const books = await caller.books.list();
    expect(Array.isArray(books)).toBe(true);
  });

  it("should get book by id", async () => {
    const ctx = createAuthContext(1);
    const caller = appRouter.createCaller(ctx);

    // Get a non-existent book (should return null)
    const book = await caller.books.get({ id: 999 });
    expect(book === null).toBe(true);
  });
});

describe("records router", () => {
  it("should list reading records for a book", async () => {
    const ctx = createAuthContext(1);
    const caller = appRouter.createCaller(ctx);

    // List records for a non-existent book (should return empty array)
    const records = await caller.records.listByBook({ bookId: 999 });
    expect(Array.isArray(records)).toBe(true);
  });

  it("should get reading record by book and date", async () => {
    const ctx = createAuthContext(1);
    const caller = appRouter.createCaller(ctx);

    // Get a non-existent record (should return null)
    const record = await caller.records.getByBookAndDate({ bookId: 999, date: "2025-12-03" });
    expect(record === null).toBe(true);
  });
});

describe("profile router", () => {
  it("should get user profile", async () => {
    const ctx = createAuthContext(1);
    const caller = appRouter.createCaller(ctx);

    // Get profile (might be null initially since user does not exist in test DB)
    const profile = await caller.profile.get();
    expect(profile === null || typeof profile === "object").toBe(true);
  });
});

import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  books: router({
    list: protectedProcedure.query(({ ctx }) =>
      db.getBooksByUserId(ctx.user.id)
    ),
    get: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ input }) =>
      db.getBookById(input.id)
    ),
    create: protectedProcedure.input(z.object({
      title: z.string(),
      totalPages: z.number(),
      dailyPages: z.number(),
      startDate: z.string(),
      coverImageUrl: z.string().optional(),
    })).mutation(({ ctx, input }) =>
      db.createBook(ctx.user.id, input)
    ),
    update: protectedProcedure.input(z.object({
      id: z.number(),
      title: z.string().optional(),
      totalPages: z.number().optional(),
      dailyPages: z.number().optional(),
      startDate: z.string().optional(),
      coverImageUrl: z.string().optional(),
      isCompleted: z.number().optional(),
      completedDate: z.string().optional(),
    })).mutation(({ input }) =>
      db.updateBook(input.id, input)
    ),
    delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(({ input }) =>
      db.deleteBook(input.id)
    ),
  }),

  records: router({
    listByBook: protectedProcedure.input(z.object({ bookId: z.number() })).query(({ input }) =>
      db.getReadingRecordsByBookId(input.bookId)
    ),
    getByBookAndDate: protectedProcedure.input(z.object({ bookId: z.number(), date: z.string() })).query(({ input }) =>
      db.getReadingRecordByBookAndDate(input.bookId, input.date)
    ),
    create: protectedProcedure.input(z.object({
      bookId: z.number(),
      date: z.string(),
      currentPage: z.number(),
      memo: z.string().optional(),
    })).mutation(({ input }) =>
      db.createReadingRecord(input.bookId, input)
    ),
    update: protectedProcedure.input(z.object({
      id: z.number(),
      currentPage: z.number().optional(),
      memo: z.string().optional(),
    })).mutation(({ input }) =>
      db.updateReadingRecord(input.id, input)
    ),
    delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(({ input }) =>
      db.deleteReadingRecord(input.id)
    ),
  }),


  profile: router({
    get: protectedProcedure.query(({ ctx }) =>
      db.getUserProfile(ctx.user.id)
    ),
    update: protectedProcedure.input(z.object({
      ownerName: z.string().optional(),
      startDate: z.string().optional(),
    })).mutation(({ ctx, input }) =>
      db.createOrUpdateUserProfile(ctx.user.id, input)
    ),
  }),
});

export type AppRouter = typeof appRouter;

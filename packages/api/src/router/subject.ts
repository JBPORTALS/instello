import { and, desc, eq } from "@instello/db";
import { CreateSubjectSchema, subject } from "@instello/db/schema";
import { z } from "zod/v4";

import { branchProcedure } from "../trpc";

export const subjectRouter = {
  create: branchProcedure
    .input(CreateSubjectSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .insert(subject)
        .values({ ...input, semesterValue: ctx.auth.activeSemester.value });
    }),

  list: branchProcedure.query(async ({ ctx, input }) => {
    const isStaff = ctx.auth.orgRole == "org:staff";

    return ctx.db.query.subject.findMany({
      where: and(
        eq(subject.branchId, input.branchId),
        eq(subject.semesterValue, ctx.auth.activeSemester.value),
        // If user  is staff of the organization fetch only alloted subjects
        isStaff ? eq(subject.staffClerkUserId, ctx.auth.userId) : undefined,
      ),
      orderBy: desc(subject.createdAt),
    });
  }),

  assignStaff: branchProcedure
    .input(z.object({ staffClerkUserId: z.string(), subjectId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { branchId, staffClerkUserId, subjectId } = input;

      return ctx.db
        .update(subject)
        .set({ staffClerkUserId })
        .where(
          and(
            eq(subject.branchId, branchId),
            eq(subject.semesterValue, ctx.auth.activeSemester.value),
            eq(subject.id, subjectId),
          ),
        );
    }),
};

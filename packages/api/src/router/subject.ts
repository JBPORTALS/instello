import { and, eq } from "@instello/db";
import { CreateSubjectSchema, subject } from "@instello/db/schema";

import { branchProcedure } from "../trpc";

export const subjectRouter = {
  create: branchProcedure
    .input(CreateSubjectSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.insert(subject).values(input);
    }),

  list: branchProcedure.query(async ({ ctx, input }) => {
    return ctx.db.query.subject.findMany({
      where: and(
        eq(subject.branchId, input.branchId),
        eq(subject.semester, ctx.auth.activeSemester),
      ),
    });
  }),
};

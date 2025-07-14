import { and, asc, eq, not } from "@instello/db";
import { branch, CreateBranchSchema, semester } from "@instello/db/schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod/v4";

import { organizationProcedure } from "../trpc";

export const branchRouter = {
  create: organizationProcedure
    .input(CreateBranchSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.transaction(async (tx) => {
        const [newBranch] = await tx
          .insert(branch)
          .values({ ...input, clerkOrganizationId: ctx.auth.orgId })
          .returning();

        if (!newBranch)
          throw new TRPCError({
            message: "Couldn't able to create branch",
            code: "INTERNAL_SERVER_ERROR",
          });

        const semesterValues = Array.from(
          { length: input.totalSemesters },
          (_, i) => i + 1,
        )
          // Filter down to based on the mode
          .filter((n) =>
            input.currentSemesterMode == "odd" ? n % 2 === 1 : n % 2 === 0,
          )
          // Map it to shape of semester values
          .map((value) => ({ value, branchId: newBranch.id }));

        await tx.insert(semester).values(semesterValues);
      });
    }),

  getByBranchId: organizationProcedure
    .input(z.object({ branchId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.branch.findFirst({
        where: and(
          eq(branch.id, input.branchId),
          eq(branch.clerkOrganizationId, ctx.auth.orgId),
        ),
      });
    }),

  list: organizationProcedure.query(({ ctx }) => {
    return ctx.db.query.branch.findMany({
      where: eq(branch.clerkOrganizationId, ctx.auth.orgId),
    });
  }),

  getSemesterList: organizationProcedure
    .input(z.object({ branchId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.semester.findMany({
        where: and(
          eq(semester.branchId, input.branchId),
          not(semester.isArchived),
        ),
      });
    }),

  getFirstSemester: organizationProcedure
    .input(z.object({ branchId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.semester.findFirst({
        where: and(
          eq(semester.branchId, input.branchId),
          not(semester.isArchived),
        ),
        orderBy: asc(semester.value),
      });
    }),
};

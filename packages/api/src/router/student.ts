import { and, eq } from "@instello/db";
import { CreateStudentSchema, student } from "@instello/db/schema";

import { branchProcedure, hasPermission } from "../trpc";

export const studentRouter = {
  create: branchProcedure
    .use(hasPermission({ permission: "org:students:create" }))
    .input(CreateStudentSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.insert(student).values({
        ...input,
        clerkOrgId: ctx.auth.orgId,
        currentSemesterId: ctx.auth.activeSemester.id,
      });
    }),

  list: branchProcedure.query(async ({ ctx, input }) => {
    return await ctx.db.query.student.findMany({
      where: and(
        eq(student.branchId, input.branchId),
        eq(student.currentSemesterId, ctx.auth.activeSemester.id),
      ),
    });
  }),
};

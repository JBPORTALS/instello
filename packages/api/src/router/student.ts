import { and, eq, isDrizzleQueryError } from "@instello/db";
import { CreateStudentSchema, student } from "@instello/db/erp";
import { TRPCError } from "@trpc/server";

import { branchProcedure, hasPermission } from "../trpc";

export const studentRouter = {
  create: branchProcedure
    .use(hasPermission({ permission: "org:students:create" }))
    .input(CreateStudentSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.db.insert(student).values({
          ...input,
          clerkOrgId: ctx.auth.orgId,
          currentSemesterId: ctx.auth.activeSemester.id,
        });
      } catch (e) {
        if (isDrizzleQueryError(e)) {
          console.log(e.cause);
          throw new TRPCError({
            message:
              e.cause.code === "23505"
                ? e.cause.constraint === "usn_clerkOrgId_unique"
                  ? "USN already exists."
                  : "Email address already exists"
                : "Unknown error",
            code: "UNPROCESSABLE_CONTENT",
          });
        }

        throw new TRPCError({
          message: "Unable to create student right now",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
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

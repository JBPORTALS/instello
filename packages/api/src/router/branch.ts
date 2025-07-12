import { and, eq } from "@instello/db";
import { branch, CreateBranchSchema } from "@instello/db/schema";
import { z } from "zod/v4";

import { organizationProcedure } from "../trpc";

export const branchRouter = {
  create: organizationProcedure
    .input(CreateBranchSchema)
    .mutation(({ ctx, input }) => {
      return ctx.db
        .insert(branch)
        .values({ ...input, clerkOrganizationId: ctx.auth.orgId });
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
};

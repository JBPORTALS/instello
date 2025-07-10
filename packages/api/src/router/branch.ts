import { branch, CreateBranchSchema } from "@instello/db/schema";

import { protectedProcedure } from "../trpc";

export const branchRouter = {
  create: protectedProcedure
    .input(CreateBranchSchema)
    .mutation(({ ctx, input }) => {
      return ctx.db.insert(branch).values(input);
    }),
};

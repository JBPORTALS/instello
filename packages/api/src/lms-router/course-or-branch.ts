import { eq, isNull } from "@instello/db";
import { courseOrBranch } from "@instello/db/lms";
import { z } from "zod/v4";

import { protectedProcedure } from "../trpc";

export const courseOrBranchRouter = {
  list: protectedProcedure
    .input(z.object({ byCourseId: z.string() }).optional())
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.courseOrBranch.findMany({
        where: input?.byCourseId
          ? eq(courseOrBranch.courseId, input.byCourseId)
          : isNull(courseOrBranch.courseId),
        orderBy: (col, { asc }) => asc(col.name),
      });
    }),
};

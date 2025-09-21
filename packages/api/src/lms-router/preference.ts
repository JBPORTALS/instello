import { eq } from "@instello/db";
import { CreatePreferenceSchema, preference } from "@instello/db/lms";
import { z } from "zod/v4";

import { protectedProcedure } from "../trpc";

export const preferenceRouter = {
  update: protectedProcedure
    .input(
      CreatePreferenceSchema.and(
        z.object({
          firstName: z.string(),
          lastName: z.string(),
          dob: z.date(),
        }),
      ),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.transaction(async (tx) => {
        // 1. Update the clerk user data
        await ctx.clerk.users.updateUser(ctx.auth.userId, {
          publicMetadata: {
            onBoardingCompleted: true,
            dob: input.dob,
          },
          firstName: input.firstName,
          lastName: input.lastName,
        });

        // 2. Insert or Update the preferences in the db for the user
        await tx
          .insert(preference)
          .values({ ...input, id: ctx.auth.userId })
          .onConflictDoUpdate({
            set: input,
            target: [preference.id],
            setWhere: eq(preference.id, ctx.auth.userId),
          });
      });
    }),
};

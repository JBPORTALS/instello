import { isClerkAPIResponseError } from "@clerk/nextjs/errors";
import { TRPCError } from "@trpc/server";
import { z } from "zod/v4";

import { organizationProcedure } from "../trpc";

export const organizationRouter = {
  getOrganizationMembers: organizationProcedure.query(async ({ ctx }) => {
    const members = await ctx.clerk.organizations.getOrganizationMembershipList(
      { organizationId: ctx.auth.orgId, role: ["staff", "admin"] },
    );

    const mappedMembers = members.data.map((membership) => {
      return {
        /** Membership ID */
        id: membership.id,
        role: membership.role,
        fullName: `${membership.publicUserData?.firstName} ${membership.publicUserData?.lastName}`,
        userId: membership.publicUserData?.userId,
        imageUrl: membership.publicUserData?.imageUrl,
        createdAt: membership.createdAt,
        updatedAt: membership.updatedAt,
      };
    });

    return { members: mappedMembers, totalCount: members.totalCount };
  }),

  createInvitationBulk: organizationProcedure
    .input(z.array(z.object({ emailAddress: z.email(), role: z.string() })))
    .mutation(async ({ ctx, input }) => {
      try {
        const mappedInput = input.map((i) => ({
          ...i,
          inviterUserId: ctx.auth.userId,
        }));

        const member =
          await ctx.clerk.organizations.createOrganizationInvitationBulk(
            ctx.auth.orgId,
            mappedInput,
          );

        return member;
      } catch (e) {
        const message = isClerkAPIResponseError(e)
          ? e.errors[0]?.longMessage
          : "Unknown error occured while inviting members";

        throw new TRPCError({ message, code: "INTERNAL_SERVER_ERROR" });
      }
    }),

  getInviationList: organizationProcedure.query(async ({ ctx }) => {
    const invitations =
      await ctx.clerk.organizations.getOrganizationInvitationList({
        organizationId: ctx.auth.orgId,
        status: ["pending"],
      });

    const mappedInviations = invitations.data.map((i) => ({
      /** Invitation ID */
      id: i.id,
      emailAddress: i.emailAddress,
      role: i.role,
      expiresAt: i.expiresAt,
      createdAt: i.createdAt,
      updatedAt: i.updatedAt,
    }));

    return {
      invitations: mappedInviations,
      totalCount: invitations.totalCount,
    };
  }),
};

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
};

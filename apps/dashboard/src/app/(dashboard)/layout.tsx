import React from "react";
import { redirect } from "next/navigation";
import { auth, clerkClient } from "@clerk/nextjs/server";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const clerk = await clerkClient();
  const session = await auth();

  if (!session.userId) redirect("/sign-in");

  const orgnanizationList = await clerk.users.getOrganizationMembershipList({
    userId: session.userId,
  });

  /** No organization created for the user, Redirect to create organization */
  if (orgnanizationList.totalCount == 0) redirect("/create-organization");

  return <React.Fragment>{children}</React.Fragment>;
}

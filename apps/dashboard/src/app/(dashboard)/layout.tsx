import React from "react";
import { redirect } from "next/navigation";
import { clerkClient } from "@clerk/nextjs/server";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const clerk = await clerkClient();
  const orgnanizationList =
    await clerk.organizations.getInstanceOrganizationMembershipList({
      limit: 5,
    });

  /** No organization created for the user, Redirect to create organization */
  if (orgnanizationList.totalCount == 0) redirect("/create-organization");

  return <React.Fragment>{children}</React.Fragment>;
}

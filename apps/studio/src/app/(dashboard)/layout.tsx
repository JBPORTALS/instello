import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { sessionClaims } = await auth();

  if (!sessionClaims?.metadata?.hasCreatorRole) redirect("/no-access");

  return <>{children}</>;
}

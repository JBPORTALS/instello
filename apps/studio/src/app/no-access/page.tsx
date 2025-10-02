import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { LockKeyIcon } from "@phosphor-icons/react/dist/ssr";

export default async function Page() {
  const { sessionClaims } = await auth();

  if (sessionClaims?.metadata.hasCreatorRole) redirect("/");

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-3.5">
      <LockKeyIcon weight="duotone" className="text-muted-foreground size-32"/>
      <h1 className="text-2xl font-semibold">No access to studio</h1>
      <p className="text-muted-foreground text-sm">
        You don't have studio creator role to access studio dashboard
      </p>
    </div>
  );
}

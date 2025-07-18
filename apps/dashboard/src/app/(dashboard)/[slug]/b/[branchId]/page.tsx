import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createQueryClient } from "@/trpc/query-client";
import { trpc } from "@/trpc/server";
import { Spinner } from "@instello/ui/components/spinner";

export default async function Page({
  params,
}: {
  params: Promise<{ branchId: string; slug: string }>;
}) {
  const cookieStore = await cookies();
  const { branchId, slug } = await params;
  const semesterCookieRaw = cookieStore.get("semester")?.value;

  const queryClient = createQueryClient();

  const firstSemester = await queryClient.fetchQuery(
    trpc.branch.getFirstSemester.queryOptions({ branchId }),
  );

  if (!semesterCookieRaw)
    redirect(`/${slug}/b/${branchId}/s/${firstSemester?.id}`);

  const semesterCookie = JSON.parse(semesterCookieRaw) as Record<
    string,
    string
  >;

  const activeSemesterId = semesterCookie[branchId];

  if (activeSemesterId)
    redirect(`/${slug}/b/${branchId}/s/${activeSemesterId}`);

  if (firstSemester) redirect(`/${slug}/b/${branchId}/s/${firstSemester.id}`);

  return (
    <div className="flex h-svh w-full flex-col items-center justify-center gap-2.5">
      <span className="text-muted-foreground text-lg font-medium">
        Setting up your branch...
      </span>
      <Spinner className="text-muted-foreground" />
    </div>
  );
}

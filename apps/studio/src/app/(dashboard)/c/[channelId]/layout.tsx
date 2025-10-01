import { HydrateClient, prefetch, trpc } from "@/trpc/server";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ channelId: string }>;
}) {
  const { channelId } = await params;
  prefetch(trpc.lms.channel.getById.queryOptions({ channelId }));

  return <HydrateClient>{children}</HydrateClient>;
}

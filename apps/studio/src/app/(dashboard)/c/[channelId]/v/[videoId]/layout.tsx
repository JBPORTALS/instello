import { SiteHeader } from "@/components/site-header";
import { VideoSidebar } from "@/components/video-sidebar";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { SidebarInset } from "@instello/ui/components/sidebar";

import { VideoPageBreadcrumb } from "./video-breadcrumb";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ channelId: string; videoId: string }>;
}) {
  const { channelId, videoId } = await params;
  prefetch(trpc.lms.channel.getById.queryOptions({ channelId }));
  prefetch(trpc.lms.video.getById.queryOptions({ videoId }));
  return (
    <HydrateClient>
      <div className="relative">
        <SiteHeader startElement={<VideoPageBreadcrumb />} />

        <VideoSidebar />
        <SidebarInset className="pl-16 pr-52">{children}</SidebarInset>
      </div>
    </HydrateClient>
  );
}

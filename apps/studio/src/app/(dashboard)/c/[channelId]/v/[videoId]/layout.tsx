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
  const { videoId } = await params;
  prefetch(trpc.lms.video.getById.queryOptions({ videoId }));
  return (
    <HydrateClient>
      <SiteHeader startElement={<VideoPageBreadcrumb />} />

      <VideoSidebar />
      <SidebarInset className="@sm:max-w-4xl @md:max-w-5xl @lg:max-w-6xl @xl:max-w-7xl w-full px-16">
        {children}
      </SidebarInset>
    </HydrateClient>
  );
}

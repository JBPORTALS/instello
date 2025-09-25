import { ChannelPageBreadcrumb } from "@/components/channel-breadcrumb";
import { ChannelDetailsSection } from "@/components/channel-details-section";
import Container from "@/components/container";
import { SiteHeader } from "@/components/site-header";
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

  return (
    <HydrateClient>
      <SiteHeader startElement={<ChannelPageBreadcrumb />} />
      <Container className="px-16">
        <div className="grid grid-cols-10 gap-8">
          {children}
          <div className="col-span-3 h-full">
            <ChannelDetailsSection />
          </div>
        </div>
      </Container>
    </HydrateClient>
  );
}

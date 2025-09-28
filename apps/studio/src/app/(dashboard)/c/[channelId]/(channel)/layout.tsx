import { ChannelPageBreadcrumb } from "@/components/channel-breadcrumb";
import { ChannelDetailsSection } from "@/components/channel-details-section";
import Container from "@/components/container";
import { SiteHeader } from "@/components/site-header";
import { HydrateClient } from "@/trpc/server";

export default function ChannelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

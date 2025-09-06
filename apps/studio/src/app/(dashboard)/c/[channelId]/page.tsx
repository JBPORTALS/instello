import { ChannelDetailsSection } from "@/components/channel-details-section";
import { ChapterList } from "@/components/chapters-list";
import Container from "@/components/container";
import { CreateChapterDialog } from "@/components/dialogs/create-chapter-dialog";
import { SiteHeader } from "@/components/site-header";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { Button } from "@instello/ui/components/button";
import { PlusIcon } from "@phosphor-icons/react/dist/ssr";

import { ChannelBreadcrumb } from "./channel-breadcrumb";

export default async function Page({
  params,
}: {
  params: Promise<{ channelId: string }>;
}) {
  const { channelId } = await params;

  prefetch(trpc.lms.channel.getById.queryOptions({ channelId }));
  prefetch(trpc.lms.chapter.list.queryOptions({ channelId }));

  return (
    <HydrateClient>
      <SiteHeader startElement={<ChannelBreadcrumb />} />
      <Container className="px-16">
        <div className="grid grid-cols-10 gap-8">
          <div className="col-span-6 space-y-3.5">
            <div className="flex w-full items-center justify-between">
              <div className="text-lg font-semibold">Chapters</div>

              <CreateChapterDialog>
                <Button>
                  New <PlusIcon />
                </Button>
              </CreateChapterDialog>
            </div>

            <ChapterList />
          </div>
          <div className="col-span-4 h-full">
            <ChannelDetailsSection />
          </div>
        </div>
      </Container>
    </HydrateClient>
  );
}

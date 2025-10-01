import { ChapterList } from "@/components/chapters-list";
import { CreateChapterDialog } from "@/components/dialogs/create-chapter-dialog";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { Button } from "@instello/ui/components/button";
import { PlusIcon } from "@phosphor-icons/react/dist/ssr";

export default async function Page({
  params,
}: {
  params: Promise<{ channelId: string }>;
}) {
  const { channelId } = await params;

  prefetch(trpc.lms.chapter.list.queryOptions({ channelId }));

  return (
    <HydrateClient>
      <div className="col-span-7 space-y-3.5">
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
    </HydrateClient>
  );
}

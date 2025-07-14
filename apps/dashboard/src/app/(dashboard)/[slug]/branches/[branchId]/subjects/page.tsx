import Container from "@/components/container";
import { CreateSubjectDialog } from "@/components/create-subject-dialog";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { Button } from "@instello/ui/components/button";
import { PlusIcon } from "@phosphor-icons/react/ssr";

import DataTableClient from "./data-table.client";

export default async function Page({
  params,
}: {
  params: Promise<{ branchId: string }>;
}) {
  const { branchId } = await params;
  prefetch(trpc.subject.list.queryOptions({ branchId }));

  return (
    <HydrateClient>
      <Container className="px-16">
        <div className="inline-flex w-full justify-between">
          <h2 className="text-3xl font-semibold">Subjects</h2>
          <CreateSubjectDialog>
            <Button>
              <PlusIcon />
              Add
            </Button>
          </CreateSubjectDialog>
        </div>
        <DataTableClient />
      </Container>
    </HydrateClient>
  );
}

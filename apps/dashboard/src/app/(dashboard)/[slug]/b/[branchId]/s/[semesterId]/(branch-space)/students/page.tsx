import Container from "@/components/container";
import { CreateStudentDialog } from "@/components/dialogs/create-student.dialog";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { Protect } from "@clerk/nextjs";
import { Button } from "@instello/ui/components/button";
import { PlusIcon } from "@phosphor-icons/react/ssr";

import DataTableClient from "./data-table.client";

export default async function Page({
  params,
}: {
  params: Promise<{ branchId: string }>;
}) {
  const { branchId } = await params;
  prefetch(trpc.erp.student.list.queryOptions({ branchId }));

  return (
    <HydrateClient>
      <Container className="px-16">
        <div className="inline-flex w-full justify-between">
          <h2 className="text-3xl font-semibold">Students</h2>
          <Protect permission="org:students:create">
            <CreateStudentDialog>
              <Button>
                <PlusIcon />
                Add
              </Button>
            </CreateStudentDialog>
          </Protect>
        </div>
        <DataTableClient />
      </Container>
    </HydrateClient>
  );
}

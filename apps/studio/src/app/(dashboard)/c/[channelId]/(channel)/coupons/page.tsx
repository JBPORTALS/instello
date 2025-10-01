import { Suspense } from "react";
import { CouponList } from "@/components/coupon-list";
import { CreateCouponDialog } from "@/components/dialogs/create-coupon-dialog";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { Button } from "@instello/ui/components/button";
import { PlusIcon } from "@phosphor-icons/react/dist/ssr";

export default async function Page({
  params,
}: {
  params: Promise<{ channelId: string }>;
}) {
  const { channelId } = await params;
  prefetch(trpc.lms.coupon.list.queryOptions({ channelId }));

  return (
    <HydrateClient>
      <div className="col-span-7 space-y-3.5">
        <div className="flex w-full items-center justify-between">
          <div className="text-lg font-semibold">Coupons</div>

          <CreateCouponDialog>
            <Button>
              New <PlusIcon />
            </Button>
          </CreateCouponDialog>
        </div>
        <div className="grid grid-cols-2 gap-3.5">
          <Suspense>
            <CouponList />
          </Suspense>
        </div>
      </div>
    </HydrateClient>
  );
}

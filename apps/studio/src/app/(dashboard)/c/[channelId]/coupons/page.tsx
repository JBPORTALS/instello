import { CreateCouponDialog } from "@/components/dialogs/create-coupon-dialog";
import { Button } from "@instello/ui/components/button";
import { PlusIcon } from "@phosphor-icons/react/dist/ssr";

export default function Page() {
  return (
    <>
      <div className="col-span-7 space-y-3.5">
        <div className="flex w-full items-center justify-between">
          <div className="text-lg font-semibold">Coupons</div>

          <CreateCouponDialog>
            <Button>
              New <PlusIcon />
            </Button>
          </CreateCouponDialog>
        </div>
      </div>
    </>
  );
}

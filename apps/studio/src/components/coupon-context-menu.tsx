"use client";

import type { RouterOutputs } from "@instello/api";
import { EditCouponDialog } from "@/components/dialogs/edit-coupon-dialog";
import { Button } from "@instello/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@instello/ui/components/dropdown-menu";
import { DotsThreeIcon, PenNibIcon, TrashIcon } from "@phosphor-icons/react";

import { DeleteCouponDialog } from "./dialogs/delete-coupon-dialog";

type Coupon = RouterOutputs["lms"]["coupon"]["list"][number];

export function CouponContextMenu({ coupon }: { coupon: Coupon }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <DotsThreeIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <EditCouponDialog coupon={coupon}>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <PenNibIcon />
            Edit Coupon
          </DropdownMenuItem>
        </EditCouponDialog>

        <DropdownMenuSeparator />

        <DeleteCouponDialog couponId={coupon.id}>
          <DropdownMenuItem
            variant="destructive"
            onSelect={(e) => e.preventDefault()}
          >
            <TrashIcon />
            Delete Coupon
          </DropdownMenuItem>
        </DeleteCouponDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

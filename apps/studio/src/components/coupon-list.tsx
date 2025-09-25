"use client";

import type { RouterOutputs } from "@instello/api";
import { useParams } from "next/navigation";
import { useTRPC } from "@/trpc/react";
import { Alert, AlertDescription } from "@instello/ui/components/alert";
import { Badge } from "@instello/ui/components/badge";
import { Button } from "@instello/ui/components/button";
import { Card, CardContent, CardHeader } from "@instello/ui/components/card";
import { Skeleton } from "@instello/ui/components/skeleton";
import { cn } from "@instello/ui/lib/utils";
import {
  CalendarIcon,
  CrownIcon,
  DotsThreeIcon,
  GiftIcon,
  UsersIcon,
} from "@phosphor-icons/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { format } from "date-fns";

type Coupon = RouterOutputs["lms"]["coupon"]["list"][number];

function CouponCard({ coupon }: { coupon: Coupon }) {
  const isExpired = new Date(coupon.validTo) < new Date();
  const isActive = new Date(coupon.validFrom) <= new Date() && !isExpired;

  const formatDate = (date: string | Date) =>
    format(new Date(date), "MMM dd, yyyy");

  return (
    <Card
      className={cn(
        `bg-accent relative overflow-hidden border-0 transition-all hover:shadow-lg`,
        isExpired
          ? "bg-accent/50 border border-dashed shadow-none"
          : isActive
            ? "ring-primary"
            : "",
      )}
    >
      {/* Coupon design with diagonal cut */}
      <div className="relative">
        <div className="to-background/10 absolute right-0 top-0 h-full w-8 bg-gradient-to-br from-transparent via-transparent" />
        <div className="bg-background absolute right-0 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full" />
        <div className="bg-background absolute right-0 top-1/2 h-8 w-8 -translate-y-1/2 translate-x-4 rounded-full" />

        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="mb-2 flex items-center gap-2">
                <Badge
                  variant={
                    isActive ? "default" : isExpired ? "outline" : "secondary"
                  }
                >
                  {isActive ? "Active" : isExpired ? "Expired" : "Upcoming"}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {coupon.type === "general" ? "General" : "Targeted"}
                </Badge>
              </div>
              <div className="text-foreground font-mono text-2xl font-bold tracking-wider">
                {coupon.code}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="space-y-3">
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <CalendarIcon weight="duotone" className="h-4 w-4" />
              <span>
                Valid: {formatDate(coupon.validFrom)} -{" "}
                {formatDate(coupon.validTo)}
              </span>
            </div>

            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <CrownIcon weight="duotone" className="h-4 w-4" />
              <span>{coupon.subscriptionDurationDays} days subscription</span>
            </div>

            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <UsersIcon weight="duotone" className="h-4 w-4" />
              <span>Max {coupon.maxRedemptions} redemptions</span>
            </div>
          </div>

          <div className="mt-4 border-t pt-3">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-xs">
                Created {formatDate(coupon.createdAt)}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  // TODO: Implement delete functionality
                  console.log("Delete coupon:", coupon.id);
                }}
              >
                <DotsThreeIcon />
              </Button>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}

function EmptyState() {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-12">
      <div className="bg-muted mb-4 rounded-full p-6">
        <GiftIcon
          weight="duotone"
          className="text-muted-foreground h-12 w-12"
        />
      </div>
      <h3 className="mb-2 text-lg font-semibold">No coupons yet</h3>
      <p className="text-muted-foreground max-w-sm text-center">
        Create your first coupon to start offering discounts and promotions to
        your students.
      </p>
    </div>
  );
}

export function CouponListSkeleton() {
  return (
    <>
      {Array.from({ length: 10 }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <CardHeader className="pb-3">
            <div className="mb-2 flex items-center gap-2">
              <Skeleton className="h-4 w-4 animate-pulse rounded" />
              <Skeleton className="h-5 w-16 animate-pulse rounded" />
              <Skeleton className="h-5 w-20 animate-pulse rounded" />
            </div>
            <Skeleton className="h-8 w-32 animate-pulse rounded" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              <Skeleton className="h-4 w-full animate-pulse rounded" />
              <Skeleton className="h-4 w-3/4 animate-pulse rounded" />
              <Skeleton className="h-4 w-1/2 animate-pulse rounded" />
            </div>
            <div className="mt-4 border-t pt-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-3 w-24 animate-pulse rounded" />
                <Skeleton className="h-8 w-8 animate-pulse rounded" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
}

export function CouponList() {
  const { channelId } = useParams<{ channelId: string }>();
  const trpc = useTRPC();

  const { data, error } = useSuspenseQuery(
    trpc.lms.coupon.list.queryOptions({ channelId }),
  );

  if (error) {
    return (
      <div className="col-span-full">
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load coupons: {error.message}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (data.length === 0) {
    return <EmptyState />;
  }

  return (
    <>
      {data.map((coupon) => (
        <CouponCard key={coupon.id} coupon={coupon} />
      ))}
    </>
  );
}

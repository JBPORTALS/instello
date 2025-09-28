"use client";

import { useParams, usePathname, useRouter } from "next/navigation";
import { useTRPC } from "@/trpc/react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@instello/ui/components/breadcrumb";
import { Tabs, TabsList, TabsTrigger } from "@instello/ui/components/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@instello/ui/components/tooltip";
import {
  GlobeHemisphereEastIcon,
  ListBulletsIcon,
  LockLaminatedIcon,
  TicketIcon,
} from "@phosphor-icons/react";
import { useSuspenseQuery } from "@tanstack/react-query";

const items = [
  { title: "Chapters", url: "", icon: ListBulletsIcon },
  // { title: "Subscriptions", url: "/subscriptions", icon: CrownIcon },
  { title: "Coupons", url: "/coupons", icon: TicketIcon },
];

export function ChannelPageBreadcrumb() {
  const trpc = useTRPC();
  const { channelId } = useParams<{ channelId: string }>();
  const { data } = useSuspenseQuery(
    trpc.lms.channel.getById.queryOptions({ channelId }),
  );
  const pathname = usePathname();
  const router = useRouter();
  const baseUrl = `/c/${channelId}`;

  return (
    <div className="flex items-center gap-2.5">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage className="flex items-center gap-1.5">
              {data.isPublished ? (
                <GlobeHemisphereEastIcon weight="duotone" />
              ) : (
                <Tooltip>
                  <TooltipTrigger>
                    <LockLaminatedIcon />
                  </TooltipTrigger>
                  <TooltipContent>Private</TooltipContent>
                </Tooltip>
              )}
              {data.title}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Tabs value={pathname}>
        <TabsList className="h-9">
          {items.map((item, i) => (
            <TabsTrigger
              onClick={() => router.push(`${baseUrl}${item.url}`)}
              key={i}
              value={`${baseUrl}${item.url}`}
              className="text-xs"
            >
              <item.icon weight="duotone" />
              {item.title}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}

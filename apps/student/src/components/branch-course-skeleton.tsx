import React from "react";
import { View } from "react-native";

import { Skeleton } from "./ui/skeleton";

export function BranchCourseSkeleton() {
  return (
    <View className="relative gap-3.5">
      <Skeleton className={"h-6 w-[90%]"} />
      <Skeleton className={"h-2 w-full"} />
      <Skeleton className={"h-2 w-[50%]"} />

      <View className="flex-1 gap-2">
        {Array.from({ length: 10 })?.map((_, i) => (
          <Skeleton key={i} className={"h-12 w-full "} />
        ))}
      </View>
    </View>
  );
}

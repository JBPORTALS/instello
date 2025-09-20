import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Redirect, useRouter } from "expo-router";
import { useOnboardingStore } from "@/lib/useOnboardingStore";
import { cn } from "@/lib/utils";
import { trpc } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeftIcon, CheckCircleIcon } from "phosphor-react-native";

import { Button } from "./ui/button";
import { Icon } from "./ui/icon";
import { Text } from "./ui/text";

export function BranchSelectionForm() {
  const router = useRouter();
  const { setField, course, branch } = useOnboardingStore();
  const { data: branches } = useQuery(
    trpc.lms.courseOrBranch.list.queryOptions(
      { byCourseId: course!.id },
      { enabled: !!course },
    ),
  );

  if (!course?.id) return <Redirect href={"/(onboarding)/step-two"} />;

  return (
    <View className="relative gap-3.5">
      <Button
        onPress={() => router.back()}
        size={"icon"}
        variant={"outline"}
        className="mb-4 rounded-full"
      >
        <Icon as={ArrowLeftIcon} />
      </Button>
      <Text variant={"h1"} className="text-left">
        In which branch your studying currenlty
      </Text>
      <Text variant={"lead"}>
        Select branch which you prefer it's yours, and will show more content
        related to that
      </Text>

      <View className="flex-1 gap-2">
        {branches?.map((b) => (
          <TouchableOpacity
            onPress={() => setField("branch", b)}
            key={b.id}
            activeOpacity={0.8}
          >
            <View
              className={cn(
                "border-border w-full flex-row justify-between rounded-lg border p-6",
                b.id === branch?.id && "bg-primary/10 border-primary",
              )}
            >
              <Text variant={"large"}>{b.name}</Text>

              <Icon
                as={CheckCircleIcon}
                className={cn(
                  "text-primary size-6 opacity-0",
                  b.id === branch?.id && "opacity-100",
                )}
              />
            </View>
          </TouchableOpacity>
        ))}
      </View>
      <Button
        disabled={!branch}
        onPress={() => router.push(`/(main)`)}
        size={"lg"}
      >
        <Text>Finish</Text>
        <Icon as={CheckCircleIcon} className="text-primary-foreground size-5" />
      </Button>
    </View>
  );
}

import React from "react";
import { TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { useOnboardingStore } from "@/lib/useOnboardingStore";
import { cn } from "@/lib/utils";
import { trpc } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowCircleRightIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
} from "phosphor-react-native";

import { Button } from "./ui/button";
import { Icon } from "./ui/icon";
import { Text } from "./ui/text";

export function CourseSelectionForm() {
  const router = useRouter();
  const { setField, course } = useOnboardingStore();
  const { data: courses } = useQuery(
    trpc.lms.courseOrBranch.list.queryOptions(),
  );

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
        Tell us which is your course
      </Text>
      <Text variant={"lead"}>
        Select course which you prefer it's yours, and will show more content
        related to that
      </Text>

      <View className="flex-1 gap-2">
        {courses?.map((c) => (
          <TouchableOpacity
            onPress={() => setField("course", c)}
            key={c.id}
            activeOpacity={0.8}
          >
            <View
              className={cn(
                "border-border w-full flex-row justify-between rounded-lg border p-6",
                c.id === course?.id && "bg-primary/10 border-primary",
              )}
            >
              <Text variant={"large"}>{c.name}</Text>

              <Icon
                as={CheckCircleIcon}
                className={cn(
                  "text-primary size-6 opacity-0",
                  c.id === course?.id && "opacity-100",
                )}
              />
            </View>
          </TouchableOpacity>
        ))}
      </View>
      <Button
        disabled={!course}
        onPress={() => router.push(`/(onboarding)/step-three`)}
        size={"lg"}
      >
        <Text>Continue</Text>
        <Icon
          as={ArrowCircleRightIcon}
          className="text-primary-foreground size-5"
        />
      </Button>
    </View>
  );
}

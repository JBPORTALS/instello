import React from "react";
import {
  ActivityIndicator,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import { Redirect, useRouter } from "expo-router";
import { useOnboardingStore } from "@/lib/useOnboardingStore";
import { cn } from "@/lib/utils";
import { trpc } from "@/utils/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ArrowLeftIcon, CheckCircleIcon } from "phosphor-react-native";

import { Button } from "./ui/button";
import { Icon } from "./ui/icon";
import { Text } from "./ui/text";

export function BranchSelectionForm() {
  const router = useRouter();
  const { setField, course, branch, firstName, lastName, dob, reset } =
    useOnboardingStore();
  const { data: branches, isLoading } = useQuery(
    trpc.lms.courseOrBranch.list.queryOptions(
      { byCourseId: course!.id },
      { enabled: !!course },
    ),
  );

  const { mutateAsync: updatePreference, isPending } = useMutation(
    trpc.lms.preference.update.mutationOptions({
      onSuccess() {
        router.replace(`/(main)`);
      },
      onError(error) {
        ToastAndroid.show(error.message, ToastAndroid.SHORT);
      },
    }),
  );

  if (!course?.id) return <Redirect href={"/(onboarding)/step-two"} />;

  if (isLoading)
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size={38} color={"white"} />
      </View>
    );

  async function onSubmit() {
    if (!course || !branch) return;
    await updatePreference({
      firstName,
      lastName,
      dob,
      branchId: branch?.id,
      courseId: course?.id,
    });
  }

  return (
    <View className="relative gap-3.5">
      <Text variant={"h2"} className="text-left">
        In which branch your studying currenlty
      </Text>
      <Text variant={"muted"}>
        Select branch which you prefer it's yours, and will show more content
        related to that
      </Text>

      <View className="flex-1 gap-2">
        {branches?.map((b) => (
          <TouchableOpacity
            disabled={isPending}
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
      <Button disabled={!branch || isPending} onPress={onSubmit} size={"lg"}>
        {isPending ? (
          <Text>Finishing up...</Text>
        ) : (
          <>
            <Text>Finish</Text>
            <Icon
              as={CheckCircleIcon}
              className="text-primary-foreground size-5"
            />
          </>
        )}
      </Button>
    </View>
  );
}

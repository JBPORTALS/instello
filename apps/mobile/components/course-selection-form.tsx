import React from "react";
import { TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { cn } from "@/lib/utils";
import {
  ArrowCircleRightIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
} from "phosphor-react-native";

import { Button } from "./ui/button";
import { Icon } from "./ui/icon";
import { Text } from "./ui/text";

const courses = [
  { id: "2", title: "Diploma" },
  { id: "3", title: "PUC" },
  { id: "4", title: "Engineering" },
];

export function CourseSelectionForm() {
  const router = useRouter();
  const [selectedCouse, setSelectedCourse] = React.useState<
    undefined | (typeof courses)[number]
  >(undefined);

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
        {courses.map((course) => (
          <TouchableOpacity
            onPress={() => setSelectedCourse(course)}
            key={course.id}
            activeOpacity={0.8}
          >
            <View
              className={cn(
                "border-border w-full flex-row justify-between rounded-lg border p-6",
                course.id === selectedCouse?.id &&
                  "bg-primary/10 border-primary",
              )}
            >
              <Text variant={"large"}>{course.title}</Text>

              <Icon
                as={CheckCircleIcon}
                className={cn(
                  "text-primary size-6 opacity-0",
                  course.id === selectedCouse?.id && "opacity-100",
                )}
              />
            </View>
          </TouchableOpacity>
        ))}
      </View>
      <Button
        disabled={!selectedCouse}
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

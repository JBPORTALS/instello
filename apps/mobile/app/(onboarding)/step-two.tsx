import React from "react";
import { ScrollView } from "react-native";
import { Stack } from "expo-router";
import { CourseSelectionForm } from "@/components/course-selection-form";
import { OnboardingProfileForm } from "@/components/onbaording-profile-form";

export default function OnboardingStepTwo() {
  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerClassName="sm:flex-1 items-center p-4"
      keyboardDismissMode="interactive"
    >
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "",
        }}
      />
      <CourseSelectionForm />
    </ScrollView>
  );
}

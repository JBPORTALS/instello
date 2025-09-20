import React from "react";
import { ScrollView } from "react-native";
import { Stack } from "expo-router";
import { BranchSelectionForm } from "@/components/branch-selection-form";

export default function OnboardingStepThree() {
  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerClassName="sm:flex-1 items-center p-4 py-8 sm:py-4 sm:p-6 mt-safe"
      keyboardDismissMode="interactive"
    >
      <Stack.Screen options={{ headerShown: false }} />
      <BranchSelectionForm />
    </ScrollView>
  );
}

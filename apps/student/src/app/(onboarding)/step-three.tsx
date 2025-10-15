import React from "react";
import { ScrollView } from "react-native";
import { Stack } from "expo-router";
import { BranchSelectionForm } from "@/components/branch-selection-form";

export default function OnboardingStepThree() {
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
      <BranchSelectionForm />
    </ScrollView>
  );
}

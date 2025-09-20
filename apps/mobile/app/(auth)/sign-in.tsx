import { ScrollView, View } from "react-native";
import { Stack } from "expo-router";
import { SignInForm } from "@/components/sign-in-form";

export default function SignInScreen() {
  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerClassName="sm:flex-1 items-center p-4 py-8 sm:py-4 sm:p-6 mt-safe"
      keyboardDismissMode="interactive"
    >
      <Stack.Screen
        options={{
          headerLargeTitle: true,
          headerTitle: "Sign in to Instello",
          headerTitleAlign: "center",
        }}
      />
      <View className="w-full max-w-sm">
        <SignInForm />
      </View>
    </ScrollView>
  );
}

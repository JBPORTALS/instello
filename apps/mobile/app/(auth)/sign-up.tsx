import { ScrollView, View } from "react-native";
import { Stack } from "expo-router";
import { SignUpForm } from "@/components/sign-up-form";

export default function SignUpScreen() {
  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerClassName="sm:flex-1 items-center justify-center p-4"
      keyboardDismissMode="interactive"
      automaticallyAdjustKeyboardInsets
    >
      <Stack.Screen
        options={{
          headerLargeTitle: true,
          headerTitle: "Create your account",
          headerTitleAlign: "center",
        }}
      />
      <View className="w-full max-w-sm flex-1">
        <SignUpForm />
      </View>
    </ScrollView>
  );
}

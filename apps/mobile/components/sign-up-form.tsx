import * as React from "react";
import { Alert, Pressable, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import { SocialConnections } from "@/components/social-connections";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";
import { useSignUp } from "@clerk/clerk-expo";

export function SignUpForm() {
  const passwordInputRef = React.useRef<TextInput>(null);
  const router = useRouter();
  const { signUp, setActive, isLoaded } = useSignUp();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  function onEmailSubmitEditing() {
    passwordInputRef.current?.focus();
  }

  async function onSubmit() {
    if (!isLoaded) return;

    setIsLoading(true);

    try {
      const signUpAttempt = await signUp.create({
        emailAddress: email,
        password,
      });

      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        // Navigation will be handled by the auth state in _layout.tsx
      } else {
        // Handle email verification if required
        if (signUpAttempt.status === "missing_requirements") {
          // You might want to navigate to a verification screen
          Alert.alert(
            "Verification Required",
            "Please check your email and verify your account before signing in.",
          );
        }
        console.log("Sign up incomplete:", signUpAttempt.status);
      }
    } catch (err: any) {
      console.error("Sign up error:", err);
      Alert.alert(
        "Sign Up Failed",
        err.errors?.[0]?.message ||
          "An error occurred during sign up. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="border-border/0 sm:border-border shadow-none sm:shadow-sm sm:shadow-black/5">
      <CardHeader>
        <CardDescription className="text-center sm:text-left">
          Welcome! Please fill in the details to get started.
        </CardDescription>
      </CardHeader>
      <CardContent className="gap-6">
        <View className="gap-6">
          <View className="gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="m@example.com"
              keyboardType="email-address"
              autoComplete="email"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              onSubmitEditing={onEmailSubmitEditing}
              returnKeyType="next"
              submitBehavior="submit"
              editable={!isLoading}
            />
          </View>
          <View className="gap-1.5">
            <View className="flex-row items-center">
              <Label htmlFor="password">Password</Label>
            </View>
            <Input
              ref={passwordInputRef}
              id="password"
              secureTextEntry
              returnKeyType="send"
              value={password}
              onChangeText={setPassword}
              onSubmitEditing={onSubmit}
              editable={!isLoading}
            />
          </View>
          <Button
            className="w-full"
            onPress={onSubmit}
            disabled={isLoading || !email || !password}
          >
            <Text>{isLoading ? "Creating account..." : "Continue"}</Text>
          </Button>
        </View>
        <Text className="text-center text-sm">
          Already have an account?{" "}
          <Pressable
            onPress={() => {
              router.replace(`/sign-in`);
            }}
          >
            <Text className="text-sm underline underline-offset-4">
              Sign in
            </Text>
          </Pressable>
        </Text>
        <View className="flex-row items-center">
          <Separator className="flex-1" />
          <Text className="text-muted-foreground px-4 text-sm">or</Text>
          <Separator className="flex-1" />
        </View>
        <SocialConnections />
      </CardContent>
    </Card>
  );
}

import type { TextInput } from "react-native";
import * as React from "react";
import { View } from "react-native";
import { Link } from "expo-router";
import { SocialConnections } from "@/components/social-connections";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";
import { useSignIn } from "@clerk/clerk-expo";

export function SignInForm() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const passwordInputRef = React.useRef<TextInput>(null);
  const [error, setError] = React.useState<{
    email?: string;
    password?: string;
  }>({});

  async function onSubmit() {
    if (!isLoaded) {
      return;
    }

    setIsLoading(true);

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: email,
        password,
      });

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === "complete") {
        setError({ email: "", password: "" });
        await setActive({ session: signInAttempt.createdSessionId });
        return;
      }
      // TODO: Handle other statuses
      console.error(JSON.stringify(signInAttempt, null, 2));
    } catch (err) {
      // See https://go.clerk.com/mRUDrIe for more info on error handling
      if (err instanceof Error) {
        const isEmailMessage =
          err.message.toLowerCase().includes("identifier") ||
          err.message.toLowerCase().includes("email");
        setError(
          isEmailMessage ? { email: err.message } : { password: err.message },
        );
        return;
      }
      console.error(JSON.stringify(err, null, 2));
    }

    setIsLoading(false);
  }

  function onEmailSubmitEditing() {
    passwordInputRef.current?.focus();
  }

  return (
    <View className="gap-6">
      <Card className="border-border/0 sm:border-border shadow-none sm:shadow-sm sm:shadow-black/5">
        <CardHeader>
          <CardTitle className="text-center text-xl sm:text-left">
            Sign in to Instello
          </CardTitle>
          <CardDescription className="text-center sm:text-left">
            Welcome back! Please sign in to continue
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
                onChangeText={setEmail}
                onSubmitEditing={onEmailSubmitEditing}
                returnKeyType="next"
                submitBehavior="submit"
              />
              {error.email ? (
                <Text className="text-destructive text-sm font-medium">
                  {error.email}
                </Text>
              ) : null}
            </View>
            <View className="gap-1.5">
              <View className="flex-row items-center">
                <Label htmlFor="password">Password</Label>
                <Link asChild href={`/(auth)/forgot-password?email=${email}`}>
                  <Button
                    variant="link"
                    size="sm"
                    className="web:h-fit ml-auto h-4 px-1 py-0 sm:h-4"
                  >
                    <Text className="font-normal leading-4">
                      Forgot your password?
                    </Text>
                  </Button>
                </Link>
              </View>
              <Input
                ref={passwordInputRef}
                id="password"
                secureTextEntry
                onChangeText={setPassword}
                returnKeyType="send"
                onSubmitEditing={onSubmit}
              />
              {error.password ? (
                <Text className="text-destructive text-sm font-medium">
                  {error.password}
                </Text>
              ) : null}
            </View>
            <Button className="w-full" disabled={isLoading} onPress={onSubmit}>
              <Text>{isLoading ? "Signing in..." : "Continue"}</Text>
            </Button>
          </View>
          <Text className="text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link
              href="/(auth)/sign-up"
              className="text-sm underline underline-offset-4"
            >
              Sign up
            </Link>
          </Text>
          <View className="flex-row items-center">
            <View className="bg-border h-[1px] flex-1" />
            <Text className="text-muted-foreground px-4 text-sm">or</Text>
            <View className="bg-border h-[1px] flex-1" />
          </View>
          <SocialConnections />
        </CardContent>
      </Card>
    </View>
  );
}

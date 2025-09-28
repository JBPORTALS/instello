import * as React from "react";
import { View } from "react-native";
import { router } from "expo-router";
import { useLocalSearchParams } from "expo-router/build/hooks";
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

export function ForgotPasswordForm() {
  const { email: emailParam = "" } = useLocalSearchParams<{ email?: string }>();
  const [email, setEmail] = React.useState(emailParam);
  const { signIn, isLoaded } = useSignIn();
  const [error, setError] = React.useState<{
    email?: string;
    password?: string;
  }>({});
  const [isLoading, setIsLoading] = React.useState(false);

  const onSubmit = async () => {
    if (!email) {
      setError({ email: "Email is required" });
      return;
    }
    if (!isLoaded) {
      return;
    }

    setIsLoading(true);

    try {
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email,
      });

      router.push(`/(auth)/reset-password?email=${email}`);
    } catch (err) {
      // See https://go.clerk.com/mRUDrIe for more info on error handling
      if (err instanceof Error) {
        setError({ email: err.message });
        return;
      }
      console.error(JSON.stringify(err, null, 2));
    }

    setIsLoading(false);
  };

  return (
    <View className="gap-6">
      <Card className="border-border/0 sm:border-border shadow-none sm:shadow-sm sm:shadow-black/5">
        <CardHeader>
          <CardTitle className="text-center text-xl sm:text-left">
            Forgot password?
          </CardTitle>
          <CardDescription className="text-center sm:text-left">
            Enter your email to reset your password
          </CardDescription>
        </CardHeader>
        <CardContent className="gap-6">
          <View className="gap-6">
            <View className="gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                defaultValue={email}
                placeholder="m@example.com"
                keyboardType="email-address"
                autoComplete="email"
                autoCapitalize="none"
                onChangeText={setEmail}
                onSubmitEditing={onSubmit}
                returnKeyType="send"
              />
              {error.email ? (
                <Text className="text-destructive text-sm font-medium">
                  {error.email}
                </Text>
              ) : null}
            </View>
            <Button
              disabled={isLoading || !email}
              className="w-full"
              onPress={onSubmit}
            >
              <Text>
                {isLoading ? "Please wait..." : "Reset your password"}
              </Text>
            </Button>
          </View>
        </CardContent>
      </Card>
    </View>
  );
}

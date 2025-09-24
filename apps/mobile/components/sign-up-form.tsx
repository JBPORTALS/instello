import * as React from "react";
import { Alert, Pressable, TextInput, TextStyle, View } from "react-native";
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
import { ClerkAPIError } from "@clerk/types";

const TABULAR_NUMBERS_STYLE: TextStyle = { fontVariant: ["tabular-nums"] };

export function SignUpForm() {
  const passwordInputRef = React.useRef<TextInput>(null);
  const router = useRouter();
  const { signUp, setActive, isLoaded } = useSignUp();
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const { countdown, restartCountdown } = useCountdown();
  const [code, setCode] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  function onEmailSubmitEditing() {
    passwordInputRef.current?.focus();
  }

  async function prepareEmailVerification() {
    if (!isLoaded) return;

    try {
      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      setPendingVerification(true);
      restartCountdown();
    } catch (e) {
      console.log(e);
    }
  }

  async function onSubmit() {
    if (!isLoaded) return;

    setIsLoading(true);

    // Start sign-up process using email and password provided
    try {
      await signUp.create({
        emailAddress: email,
        password,
        firstName,
        lastName,
      });

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setPendingVerification(true);
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setIsLoading(false);
    }
  }

  async function onVerifyPress() {
    if (!isLoaded) return;

    setIsLoading(true);

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === "complete") {
        await setActive({
          session: signUpAttempt.createdSessionId,
          navigate: async ({ session }) => {
            if (session?.currentTask) {
              // Check for tasks and navigate to custom UI to help users resolve them
              // See https://clerk.com/docs/custom-flows/overview#session-tasks
              console.log(session?.currentTask);
              return;
            }

            router.replace("/");
          },
        });
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.log(
          signUpAttempt.missingFields,
          signUpAttempt.unverifiedFields,
        );
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      const clerkError = err as ClerkAPIError;
      Alert.alert(clerkError.message, clerkError.longMessage);
    } finally {
      setIsLoading(false);
    }
  }

  if (pendingVerification)
    return (
      <Card className="border-border/0 sm:border-border py-0 shadow-none sm:shadow-sm sm:shadow-black/5">
        <CardHeader>
          <CardDescription className="text-center sm:text-left">
            Verify your email address. We sent you code to verify at {email}
          </CardDescription>
        </CardHeader>
        <CardContent className="gap-6">
          <View className="gap-6">
            <View className="gap-1.5">
              <Label htmlFor="code">Verification Code</Label>
              <Input
                id="code"
                autoComplete="one-time-code"
                autoCapitalize="none"
                value={code}
                onChangeText={setCode}
                submitBehavior="submit"
                editable={!isLoading}
              />
            </View>

            <Button
              variant="link"
              size="sm"
              disabled={countdown > 0}
              onPress={() => {
                // TODO: Resend code
                prepareEmailVerification();
              }}
            >
              <Text className="text-center text-xs">
                Didn&apos;t receive the code? Resend{" "}
                {countdown > 0 ? (
                  <Text className="text-xs" style={TABULAR_NUMBERS_STYLE}>
                    ({countdown})
                  </Text>
                ) : null}
              </Text>
            </Button>

            <Button
              className="w-full"
              onPress={onVerifyPress}
              disabled={isLoading || !code}
            >
              <Text>{isLoading ? "Verifying..." : "Verify"}</Text>
            </Button>
            <Button
              variant={"secondary"}
              className="w-full"
              onPress={() => setPendingVerification(false)}
              disabled={isLoading}
            >
              <Text>Cancel</Text>
            </Button>
          </View>
        </CardContent>
      </Card>
    );

  return (
    <Card className="border-border/0 sm:border-border py-0 shadow-none sm:shadow-sm sm:shadow-black/5">
      <CardHeader>
        <CardDescription className="text-center sm:text-left">
          Welcome! Please fill in the details to get started.
        </CardDescription>
      </CardHeader>
      <CardContent className="gap-6">
        <View className="gap-6">
          <View className="gap-1.5">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstname"
              placeholder="Jhon"
              autoComplete="name-prefix"
              autoCapitalize="none"
              value={firstName}
              onChangeText={setFirstName}
              onSubmitEditing={onEmailSubmitEditing}
              returnKeyType="next"
              submitBehavior="submit"
              editable={!isLoading}
            />
          </View>
          <View className="gap-1.5">
            <Label htmlFor="lastname">Last Name</Label>
            <Input
              id="lastname"
              placeholder="Doe"
              autoComplete="name-suffix"
              autoCapitalize="none"
              value={lastName}
              onChangeText={setLastName}
              onSubmitEditing={onEmailSubmitEditing}
              returnKeyType="next"
              submitBehavior="submit"
              editable={!isLoading}
            />
          </View>
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

        <View className="flex-row items-center justify-center">
          <Text className="text-center text-sm">Already have an account? </Text>
          <Pressable
            onPress={() => {
              router.replace(`/sign-in`);
            }}
          >
            <Text className="text-sm underline underline-offset-4">
              Sign in
            </Text>
          </Pressable>
        </View>
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

function useCountdown(seconds = 30) {
  const [countdown, setCountdown] = React.useState(seconds);
  const intervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  const startCountdown = React.useCallback(() => {
    setCountdown(seconds);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [seconds]);

  React.useEffect(() => {
    startCountdown();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [startCountdown]);

  return { countdown, restartCountdown: startCountdown };
}

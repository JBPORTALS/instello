import React from "react";
import { View } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useOnboardingStore } from "@/lib/useOnboardingStore";
import { cn } from "@/lib/utils";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import { ArrowCircleRightIcon } from "phosphor-react-native";

import { Button } from "./ui/button";
import { Icon } from "./ui/icon";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Text } from "./ui/text";

export function OnboardingProfileForm() {
  const [showPicker, setShowPicker] = React.useState(false);
  const { dob, firstName, lastName, setField } = useOnboardingStore();
  const router = useRouter();

  async function onSubmit() {
    router.push(`/(onboarding)/step-two`);
  }

  return (
    <View className="relative gap-3.5">
      <Image
        source={require("assets/images/instello.png")}
        style={{ width: 130, height: 28, marginBottom: 16 }}
      />
      <Text variant={"h3"} className="text-left">
        We would like to know your profile details
      </Text>
      <Text variant={"muted"}>
        Enter your full name, date of birth so we can know you to show better
        recommendations.
      </Text>

      <View className="gap-3 py-6">
        <View className="gap-1.5">
          <Label>First Name</Label>
          <Input
            value={firstName}
            onChangeText={(text) => setField("firstName", text)}
            className="h-11 px-6 text-base font-semibold"
            placeholder="Jhon"
          />
        </View>

        <View className="gap-1.5">
          <Label>Last Name</Label>
          <Input
            value={lastName}
            onChangeText={(text) => setField("lastName", text)}
            className="h-11 px-6 text-base font-semibold"
            placeholder="Wick"
          />
        </View>

        <View className="gap-1.5">
          <Label>Date of Birth</Label>
          <Button
            variant={"outline"}
            size={"lg"}
            className="justify-start"
            onPress={() => setShowPicker(true)}
          >
            <Text className={cn(!dob && "text-muted-foreground")}>
              {dob ? format(dob, "dd MMM, yyyy") : "Select date..."}
            </Text>
          </Button>

          {showPicker && (
            <DateTimePicker
              display="spinner"
              positiveButton={{ textColor: "white", label: "Select" }}
              negativeButton={{ textColor: "white", label: "Cancel" }}
              mode="date"
              value={dob}
              onChange={(_e, date) => {
                setShowPicker(false);
                date && setField("dob", date);
              }}
            />
          )}
        </View>
      </View>

      <View>
        <Button
          size={"lg"}
          onPress={onSubmit}
          disabled={!firstName || !lastName || !dob}
        >
          <Text>Next</Text>
          <Icon as={ArrowCircleRightIcon} className="text-primary-foreground" />
        </Button>
      </View>
    </View>
  );
}

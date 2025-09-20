import React from "react";
import { View } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
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
  const [date, setDate] = React.useState(new Date());
  const [fullName, setFullName] = React.useState("");
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
      <Text variant={"h1"} className="text-left">
        We want to know more about you
      </Text>
      <Text variant={"lead"}>
        Enter your full name, date of birth so we can know you to show better
        recommendations.
      </Text>

      <View className="gap-3 py-6">
        <View className="gap-1.5">
          <Label>Full Name</Label>
          <Input
            onChangeText={(text) => setFullName(text)}
            className="h-11 px-6 text-base font-semibold"
            placeholder="Jhon Wick"
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
            <Text className={cn(!date && "text-muted-foreground")}>
              {date ? format(date, "dd MMM, yyyy") : "Select date..."}
            </Text>
          </Button>

          {showPicker && (
            <DateTimePicker
              display="spinner"
              positiveButton={{ textColor: "white", label: "Select" }}
              negativeButton={{ textColor: "white", label: "Cancel" }}
              mode="date"
              value={date}
              onChange={(_e, date) => {
                setShowPicker(false);
                date && setDate(date);
              }}
            />
          )}
        </View>
      </View>

      <View>
        <Button size={"lg"} onPress={onSubmit} disabled={!fullName || !date}>
          <Text>Next</Text>
          <Icon as={ArrowCircleRightIcon} className="text-primary-foreground" />
        </Button>
      </View>
    </View>
  );
}

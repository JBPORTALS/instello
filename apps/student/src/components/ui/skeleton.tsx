import { View } from "react-native";
import { cn } from "@/lib/utils";

import { NativeOnlyAnimatedView } from "./native-only-animated-view";

function Skeleton({
  className,
  ...props
}: React.ComponentProps<typeof NativeOnlyAnimatedView> &
  React.RefAttributes<View>) {
  return (
    <NativeOnlyAnimatedView
      className={cn("bg-accent rounded-md", className)}
      {...props}
    />
  );
}

export { Skeleton };

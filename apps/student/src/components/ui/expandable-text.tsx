import React from "react";
import { TouchableOpacity, View } from "react-native";

import { Text } from "./text";

export default function ExapandableText({
  numberOfLines = 2,
  onTextLayout,
  ...props
}: React.ComponentProps<typeof Text>) {
  const [expanded, setExpanded] = React.useState(false);
  const [showMore, setShowMore] = React.useState(false);

  return (
    <View>
      <Text
        className="sr-only"
        onTextLayout={(e) => {
          if (e.nativeEvent.lines.length > numberOfLines) {
            setShowMore(true);
          }
          onTextLayout?.(e);
        }}
      >
        {props.children}
      </Text>

      <Text numberOfLines={expanded ? undefined : numberOfLines} {...props} />

      {showMore && (
        <TouchableOpacity
          activeOpacity={100}
          onPress={() => setExpanded(!expanded)}
        >
          <Text className="mt-0.5 text-xs">
            {expanded ? "Show less" : "Read more"}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

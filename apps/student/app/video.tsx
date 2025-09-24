import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useVideoPlayer, VideoSource, VideoView } from "expo-video";
import { Button } from "@/components/ui/button";
import ExapandableText from "@/components/ui/expandable-text";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { trpc } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";

export default function VideoScreen() {
  const { playbackId } = useLocalSearchParams<{ playbackId: string }>();
  const videoSource: VideoSource = {
    uri: `https://stream.mux.com/${playbackId}.m3u8`,
  };

  return (
    <View className="flex-1">
      <VideoPlayer videoSource={videoSource} />
      <VideoDetails />
    </View>
  );
}

function VideoDetails() {
  const { videoId } = useLocalSearchParams<{ videoId: string }>();
  const { data: video, isLoading } = useQuery(
    trpc.lms.video.getById.queryOptions({ videoId }),
  );

  if (isLoading)
    return (
      <View className="gap-1.5 p-4">
        <View className="gap-1">
          <Skeleton className={"h-3.5 w-full"} />
          <Skeleton className={"h-3.5 w-1/2"} />
        </View>
        <View className="gap-1">
          <Skeleton className={"h-2 w-full"} />
          <Skeleton className={"h-2 w-full"} />
        </View>
      </View>
    );

  return (
    <View className="gap-1.5 p-4">
      <Text variant={"large"} className="font-medium">
        {video?.title}
      </Text>
      <ExapandableText variant={"muted"}>
        {!video?.description ? "No description..." : video.description}{" "}
      </ExapandableText>
    </View>
  );
}

function VideoPlayer({ videoSource }: { videoSource: VideoSource }) {
  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = true;
    player.play();
  });

  return (
    <>
      <VideoView
        style={styles.video}
        player={player}
        allowsFullscreen
        fullscreenOptions={{
          enable: true,
          orientation: "landscape",
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  video: {
    width: "auto",
    height: "auto",
    aspectRatio: 16 / 9,
  },
  controlsContainer: {
    padding: 10,
  },
});

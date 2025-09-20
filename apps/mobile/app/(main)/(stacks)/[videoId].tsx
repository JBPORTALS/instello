import React from "react";
import { View } from "react-native";
import { useEvent } from "expo";
import { Stack } from "expo-router";
import { useVideoPlayer, VideoSource } from "expo-video";
import { VideoPlayer } from "@/components/video-player";

const videoSource: VideoSource = {
  uri: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  metadata: {
    title: "Buck Bunny",
    artist: "by Instello Company",
  },
};

export default function VideoPlayerScreen() {
  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = true;
    player.play();
  });

  const { isPlaying } = useEvent(player, "playingChange", {
    isPlaying: player.playing,
  });

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
          animationMatchesGesture: true,
          orientation: "landscape",
        }}
      />
      <VideoPlayer
        videoId=""
        videoSource={videoSource}
        style={{ width: "auto", height: 400 }}
      />
    </>
  );
}

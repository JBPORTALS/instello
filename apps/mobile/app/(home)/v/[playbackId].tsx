import React from "react";
import { Stack } from "expo-router";
import { VideoPlayer, VideoPlaylistItem } from "@/components/video-player";

// Example playlist data
const playlist: VideoPlaylistItem[] = [
  {
    id: "video-1",
    source: {
      uri: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      metadata: {
        title: "Big Buck Bunny",
        artist: "Blender Foundation",
      },
    },
    metadata: {
      title: "Big Buck Bunny",
      description: "A short animated film by the Blender Foundation",
    },
  },
  {
    id: "video-2",
    source: {
      uri: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      metadata: {
        title: "Elephants Dream",
        artist: "Orange Open Movie Project",
      },
    },
    metadata: {
      title: "Elephants Dream",
      description:
        "The first open movie made entirely with open source software",
    },
  },
  {
    id: "video-3",
    source: {
      uri: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      metadata: {
        title: "For Bigger Blazes",
        artist: "Google",
      },
    },
    metadata: {
      title: "For Bigger Blazes",
      description: "A sample video showcasing high-quality streaming",
    },
  },
];

export default function VideoPlayerScreen() {
  const handleVideoChange = (videoId: string, index: number) => {
    console.log(`Switched to video: ${videoId} at index: ${index}`);
    // You can update the URL or perform other actions here
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
          animationMatchesGesture: true,
        }}
      />
      <VideoPlayer
        videoId={playlist[0]?.id || "default"}
        videoSource={playlist[0]?.source || { uri: "" }}
        playlist={playlist}
        currentIndex={0}
        onVideoChange={handleVideoChange}
        style={{ width: "auto", height: 400 }}
      />
    </>
  );
}

import type { VideoContentFit, VideoMetadata, VideoPlayer } from "expo-video";
import React from "react";
import {
  ActivityIndicator,
  BackHandler,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useEvent } from "expo";
import * as NavigationBar from "expo-navigation-bar";
import { router, useLocalSearchParams } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import { setStatusBarHidden } from "expo-status-bar";
import { useVideoPlayer, VideoSource, VideoView } from "expo-video";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import Slider from "@react-native-community/slider";
import {
  ArrowLeftIcon,
  ArrowsInSimpleIcon,
  ArrowsOutSimpleIcon,
  CaretDownIcon,
  PauseIcon,
  PlayIcon,
} from "phosphor-react-native";

export default function VideoScreen() {
  const { playbackId } = useLocalSearchParams<{ playbackId: string }>();
  const videoSource: VideoSource = {
    uri: `https://stream.mux.com/${playbackId}.m3u8`,
    metadata: {
      title: "What is figma?",
      artist: "Chapter 1: Introduction",
    },
  };

  return (
    <>
      <View className="pt-safe flex-1">
        <NativeVideoPlayer videoSource={videoSource} />
      </View>
    </>
  );
}

function NativeVideoPlayer({ videoSource }: { videoSource: VideoSource }) {
  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = true;
    player.timeUpdateEventInterval = 1;
    player.play();
  });

  const [metadata] = React.useState(
    typeof videoSource === "object" ? videoSource?.metadata : undefined,
  );

  const [fullscreen, setFullscreen] = React.useState(false);
  const [resizeMode, setResizeMode] =
    React.useState<VideoContentFit>("contain");

  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      <View
        style={[
          fullscreen
            ? StyleSheet.absoluteFill // fullscreen covers whole screen
            : { aspectRatio: 16 / 9 }, // inline player
        ]}
      >
        <VideoView
          style={StyleSheet.absoluteFill}
          player={player}
          nativeControls={false}
          contentFit={resizeMode}
        />

        {/* Overlay controls */}
        <NativeVideoControlsOverlay
          {...{ player, fullscreen, resizeMode, metadata }}
          onChangeResizeMode={setResizeMode}
          onChangeFullScreen={setFullscreen}
        />
      </View>
    </View>
  );
}

function NativeVideoControlsOverlay({
  player,
  fullscreen,
  onChangeFullScreen,
  onChangeResizeMode,
  metadata,
}: {
  player: VideoPlayer;
  fullscreen: boolean;
  onChangeFullScreen: (fullscreen: boolean) => void;
  resizeMode: VideoContentFit;
  onChangeResizeMode: (value: VideoContentFit) => void;
  metadata?: VideoMetadata;
}) {
  const [sliding, setSliding] = React.useState(false);
  const [slidingTime, setSlidingTime] = React.useState(player.currentTime);
  const [showControls, setShowControls] = React.useState(true);
  const controlsTimeout = React.useRef<NodeJS.Timeout>(null);

  const startTimeToHideControls = () => {
    // Clear any existing timeout before setting a new one
    if (controlsTimeout.current) {
      clearTimeout(controlsTimeout.current);
    }
    // Set a new timeout to hide the controls after 5 seconds
    controlsTimeout.current = setTimeout(() => {
      setShowControls(false);
      controlsTimeout.current = null; // Reset the timeout reference
    }, 5000) as unknown as NodeJS.Timeout;
  };

  const enterFullscreen = async () => {
    await ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.LANDSCAPE,
    );
    onChangeFullScreen(true);
    setStatusBarHidden(true, "slide");
    await NavigationBar.setVisibilityAsync("hidden");
  };

  const exitFullscreen = async () => {
    await ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.PORTRAIT_UP,
    );
    onChangeFullScreen(false);
    setStatusBarHidden(false, "slide");
    await NavigationBar.setVisibilityAsync("visible");
  };

  const toggleShowControls = () => {
    setShowControls(!showControls);
    if (controlsTimeout.current && showControls)
      clearTimeout(controlsTimeout.current);
    else startTimeToHideControls();
  };

  React.useEffect(() => {
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      if (fullscreen) {
        exitFullscreen();
        return true;
      }
    });

    setShowControls(true);
    startTimeToHideControls();

    return () => sub.remove();
  }, [fullscreen]);

  // Events
  useEvent(player, "timeUpdate", {
    currentTime: player.currentTime,
    bufferedPosition: player.bufferedPosition,
    currentLiveTimestamp: player.currentLiveTimestamp,
    currentOffsetFromLive: player.currentOffsetFromLive,
  });

  const pinchGesture = Gesture.Pinch()

    .onEnd((e) => {
      try {
        // Add safety checks for the gesture event
        if (!e || typeof e.scale !== "number" || isNaN(e.scale)) {
          console.warn("Pinch gesture event is invalid:", e);
          return;
        }

        const scale = e.scale;
        // Use more conservative thresholds to avoid accidental triggers
        if (scale > 1.2) {
          // Pinch-out detected - switch to cover mode
          onChangeResizeMode("cover");
        } else if (scale < 0.8) {
          // Pinch-in detected - switch to contain mode
          onChangeResizeMode("contain");
        }
        // If scale is between 0.8 and 1.2, don't change mode (avoid accidental changes)
      } catch (error) {
        console.error("Error handling pinch gesture:", error);
      }
    })
    .enabled(fullscreen) // Only enable in fullscreen mode
    .runOnJS(true); // Ensure gesture runs on JS thread

  return (
    <GestureDetector gesture={pinchGesture}>
      <TouchableWithoutFeedback onPress={() => toggleShowControls()}>
        <View style={[styles.overlay]}>
          {/** Container */}
          <View
            className="h-full w-full flex-1  items-center justify-between bg-black/20 px-2.5 py-4"
            style={{ opacity: showControls ? 100 : 0 }}
          >
            {/** Controls Header*/}
            <View className="w-full flex-row justify-between">
              <Button
                size={"icon"}
                className={cn("rounded-full bg-black/40 p-5")}
                variant={"ghost"}
                onPress={() => (fullscreen ? exitFullscreen() : router.back())}
              >
                <Icon
                  weight="bold"
                  as={fullscreen ? ArrowLeftIcon : CaretDownIcon}
                  color="white"
                  size={24}
                />
              </Button>

              {/** Video meta info */}
              {fullscreen && (
                <View className="items-center">
                  <Text className="font-bold text-white">
                    {metadata?.title}
                  </Text>
                  <Text variant={"muted"} className="text-white/80">
                    {metadata?.artist}
                  </Text>
                </View>
              )}

              <Button
                size={"icon"}
                className="rounded-full bg-black/40 p-5"
                variant={"ghost"}
                onPress={() =>
                  fullscreen ? exitFullscreen() : enterFullscreen()
                }
              >
                <Icon
                  weight="bold"
                  as={fullscreen ? ArrowsInSimpleIcon : ArrowsOutSimpleIcon}
                  color="white"
                  size={24}
                />
              </Button>
            </View>

            {/** Play Puase & Loading state */}
            <>
              {player.status == "loading" ? (
                <ActivityIndicator size={52} color={"white"} />
              ) : (
                <Button
                  size={"icon"}
                  className={cn("rounded-full bg-black/40 p-8")}
                  variant={"ghost"}
                  onPress={() =>
                    player.playing ? player.pause() : player.play()
                  }
                >
                  <Icon
                    as={player.playing ? PauseIcon : PlayIcon}
                    size={40}
                    color="white"
                    weight="fill"
                  />
                </Button>
              )}
            </>

            {/** Controls footer */}
            <View
              className={cn(
                "w-full flex-row items-center justify-between",
                fullscreen && "bottom-9",
              )}
            >
              <Text className="rounded-full bg-black/20 px-2 py-0.5 text-xs text-white">
                {formatTime(player.currentTime)}
              </Text>
              <Text className="rounded-full bg-black/20 px-2 py-0.5 text-xs text-white">
                {formatTime(player.duration)}
              </Text>
            </View>
          </View>

          {/** Sliding timespamp preview */}
          {sliding && (
            <View className="absolute bottom-16 rounded-full bg-black/30 px-2 py-0.5 backdrop-blur-sm">
              <Text className="text-sm text-white">
                {formatTime(slidingTime)}
              </Text>
            </View>
          )}

          <Slider
            style={{
              height: "auto",
              width: "100%",
              zIndex: 10,
              opacity: fullscreen && !showControls ? 0 : 100,
              position: "absolute",
              bottom: fullscreen ? 24 : -8,
            }}
            minimumTrackTintColor="#F7941D"
            maximumTrackTintColor="white"
            thumbTintColor={showControls ? "#F7941D" : "transparent"}
            maximumValue={player.duration}
            value={player.currentTime}
            onSlidingStart={(time) => {
              setSliding(true);
              setSlidingTime(time);
              player.pause();
              if (controlsTimeout.current)
                clearInterval(controlsTimeout.current);
            }}
            onValueChange={(time) => {
              player.currentTime = time;
              setSlidingTime(time);
            }}
            onSlidingComplete={(time) => {
              setSliding(false);
              setSlidingTime(time);
              if (!player.playing) player.play(); //play if playback is paused
              startTimeToHideControls();
            }}
          />
        </View>
      </TouchableWithoutFeedback>
    </GestureDetector>
  );
}

const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

const styles = StyleSheet.create({
  video: {
    width: "auto",
    height: "auto",
    aspectRatio: 16 / 9,
  },
  controlsContainer: {
    padding: 10,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomBar: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

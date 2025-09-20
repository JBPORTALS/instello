import React, { useEffect } from "react";
import {
  ActivityIndicator,
  BackHandler,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import {
  GestureEvent,
  GestureHandlerRootView,
  PinchGestureHandler,
  PinchGestureHandlerEventPayload,
} from "react-native-gesture-handler";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { useEvent, useEventListener } from "expo";
import { LinearGradient } from "expo-linear-gradient";
import * as NavigationBar from "expo-navigation-bar";
import { router } from "expo-router";
import * as Orientation from "expo-screen-orientation";
import { StatusBar } from "expo-status-bar";
import {
  useVideoPlayer,
  VideoContentFit,
  VideoSource,
  VideoView,
  VideoViewProps,
} from "expo-video";
import Slider from "@react-native-community/slider";
import {
  ArrowLeftIcon,
  PauseCircleIcon,
  PauseIcon,
  PlayCircleIcon,
  PlayIcon,
} from "phosphor-react-native";

import { Button } from "./ui/button";
import { Icon } from "./ui/icon";
import { Text } from "./ui/text";

const PlayCircleIconNative = () => (
  <Icon size={64} weight="fill" as={PlayIcon} />
);
const PauseCircleIconNative = () => (
  <Icon size={52} weight="fill" as={PauseIcon} />
);
const AnimatedPlayCircle =
  Animated.createAnimatedComponent(PlayCircleIconNative);
const AnimatedPauseCircle = Animated.createAnimatedComponent(
  PauseCircleIconNative,
);
const AnimatedLinearGradientView =
  Animated.createAnimatedComponent(LinearGradient);

const { height, width } = Dimensions.get("screen");

type VideoPlayerMetaData = {
  title: string;
  description?: string;
};

type VideoPlayerProps = Omit<VideoViewProps, "player"> & {
  videoSource: VideoSource;
  onProgress?: (currentTime: number) => void;
  onStatusChange?: ({ isPlaying }: { isPlaying: boolean }) => void;
  nextVideoSource?: string;
  /** Identify your video with unique ID */
  videoId: string;
  metadata?:
    | VideoPlayerMetaData
    | ((videoId: string) => Promise<VideoPlayerMetaData> | VideoPlayerMetaData);
  FooterComponent?: React.ReactElement | null;
};

export function VideoPlayer({
  videoSource,
  onProgress,
  onStatusChange,
  nextVideoSource,
  videoId,
  FooterComponent,
  metadata,
  ...videoViewProps
}: VideoPlayerProps) {
  const [isFullScreen, setIsFullScreen] = React.useState(true);
  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = true;
    player.bufferOptions = {
      preferredForwardBufferDuration: 50,
      waitsToMinimizeStalling: true,
      prioritizeTimeOverSizeThreshold: true,
    };
    player.audioMixingMode = "duckOthers";
    player.preservesPitch = true;
    player.currentTime = 0;
    player.timeUpdateEventInterval = 1;
    player.play();
  });
  const [md, setMetadata] = React.useState<undefined | VideoPlayerMetaData>(
    typeof metadata === "object" ? metadata : undefined,
  );

  const [showControls, setShowControls] = React.useState(true);
  const [resizeMode, setResizeMode] =
    React.useState<VideoContentFit>("contain");

  const { isPlaying } = useEvent(player, "playingChange", {
    isPlaying: player.playing,
  });

  const { currentTime } = useEvent(player, "timeUpdate", {
    currentTime: player.currentTime,
    bufferedPosition: player.bufferedPosition,
    currentLiveTimestamp: player.currentLiveTimestamp,
    currentOffsetFromLive: player.currentOffsetFromLive,
  });

  //Set Meta data
  useEffect(() => {
    (async () => {
      if (typeof metadata === "function") {
        const md = await metadata?.(videoId);
        setMetadata(md);
      }
    })();
  }, [videoId]);

  //pass the playing status
  useEffect(() => {
    onStatusChange?.({ isPlaying });
  }, [isPlaying]);

  useEffect(() => {
    onProgress?.(currentTime); //pass the current time
  }, [currentTime]);

  useEventListener(player, "statusChange", (payload) => {
    console.log("Player error", payload.error);
    console.log("player status", payload.status);
  });

  const controlsTimeout = React.useRef<NodeJS.Timeout | null>(null);

  const startTimeToHideControls = () => {
    // Set a new timeout to hide the controls after 5 seconds
    controlsTimeout.current = setTimeout(() => {
      setShowControls(false);
      controlsTimeout.current = null; // Reset the timeout reference
    }, 5000) as unknown as NodeJS.Timeout;
  };

  const handleControlsVisibility = () => {
    if (controlsTimeout.current) {
      clearTimeout(controlsTimeout.current); // Clear the existing timeout
    }

    setShowControls(true); // Show the controls

    startTimeToHideControls();
  };

  const handleControlsClose = () => {
    if (controlsTimeout.current) {
      clearTimeout(controlsTimeout.current); // Clear the existing timeout
    }

    setShowControls(false);
  };

  const enterFullScreen = async () => {
    setIsFullScreen(true);
    await NavigationBar.setVisibilityAsync("hidden");
    Orientation.lockAsync(Orientation.OrientationLock.LANDSCAPE_RIGHT); // Lock to landscape for full-screen mode
  };

  const exitFullScreen = async () => {
    setIsFullScreen(false);
    await NavigationBar.setVisibilityAsync("visible");
    Orientation.lockAsync(Orientation.OrientationLock.DEFAULT); // Reset to portrait when exiting full-screen
  };

  React.useEffect(() => {
    if (isFullScreen) enterFullScreen();
    else exitFullScreen();
  }, [isFullScreen]);

  function handleBackPress() {
    exitFullScreen();
    return false;
  }

  React.useEffect(() => {
    startTimeToHideControls(); //when initally video starts
  }, []);

  //Exit from the full screen if it clicked back
  React.useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackPress,
    );

    return () => {
      backHandler.remove();
      // if (controlsTimeout) clearTimeout(controlsTimeout); // Clear timeout on unmount
    };
  }, [isFullScreen]);

  const onPinchGestureEvent = (
    event: GestureEvent<PinchGestureHandlerEventPayload>,
  ) => {
    const scale = event.nativeEvent.scale;

    if (scale > 1) {
      // Pinch-out detected
      setResizeMode("cover");
    } else if (scale < 1) {
      // Pinch-in detected
      setResizeMode("contain");
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PinchGestureHandler onGestureEvent={onPinchGestureEvent}>
        <View
          style={{
            flex: 1,
            backgroundColor: "black",
            position: "relative",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <StatusBar hidden translucent />
          <TouchableOpacity
            onPress={() => {
              handleControlsVisibility();
            }}
            activeOpacity={1}
            style={styles.contentContainer}
          />
          <VideoView
            {...videoViewProps}
            style={{
              width: "100%",
              flex: 1,
              height,
            }}
            pointerEvents="none"
            player={player}
            nativeControls={false}
            allowsPictureInPicture={false}
            contentFit={resizeMode}
            startsPictureInPictureAutomatically
          />
          {showControls && (
            <AnimatedLinearGradientView
              colors={[
                "rgba(0,0,0,0.8)",
                "rgba(0,0,0,0.4)",
                "rgba(0,0,0,0.2)",
                "rgba(0,0,0,0.4)",
                "rgba(0,0,0,0.8)",
              ]}
              pointerEvents={"box-none"}
              entering={FadeIn}
              exiting={FadeOut}
              style={styles.controlsContainer}
            >
              <TouchableOpacity
                activeOpacity={1}
                onPress={(e) => {
                  e.stopPropagation();
                  handleControlsClose();
                }}
                disabled={!showControls}
                style={styles.controlsInner}
              >
                <Animated.View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                    paddingVertical: 5,
                  }}
                >
                  <Button
                    size={"icon"}
                    variant={"ghost"}
                    className="size-14 rounded-full active:bg-transparent"
                    onPress={() => {
                      router.back();
                      exitFullScreen();
                    }}
                  >
                    <Icon
                      as={ArrowLeftIcon}
                      size={28}
                      weight="fill"
                      className="text-foreground"
                    />
                  </Button>
                  <Animated.View className={"gap-1"}>
                    <Text variant={"small"} className="text-center">
                      {md?.title}
                    </Text>
                    <Text variant={"muted"} className="text-foreground/60">
                      {md?.description}
                    </Text>
                  </Animated.View>
                  <Animated.View className={"w-10"}></Animated.View>
                </Animated.View>
                {player.status === "loading" ? (
                  <ActivityIndicator size={52} color={"white"} />
                ) : (
                  <Button
                    size={"icon"}
                    className="size-32 rounded-full active:bg-transparent"
                    variant={"ghost"}
                    onPress={(e) => {
                      if (isPlaying) {
                        player.pause();
                        if (controlsTimeout.current)
                          clearTimeout(controlsTimeout.current); //prevent closing controls when video is paused
                      } else {
                        if (controlsTimeout.current)
                          clearTimeout(controlsTimeout.current);
                        player.play();
                        startTimeToHideControls();
                      }
                    }}
                  >
                    {isPlaying ? (
                      <AnimatedPauseCircle entering={FadeIn} />
                    ) : (
                      <AnimatedPlayCircle entering={FadeIn} />
                    )}
                  </Button>
                )}
                <Animated.View
                  pointerEvents={"auto"}
                  style={{ width: "100%", flexShrink: 0, gap: 5 }}
                >
                  <Animated.View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                    pointerEvents={"auto"}
                  >
                    <Text variant={"small"}>{formatTime(currentTime)}</Text>
                    <Slider
                      style={{ width: "90%", height: 26 }}
                      minimumValue={0}
                      disabled={player.status === "idle"}
                      maximumValue={player.duration}
                      value={player.currentTime}
                      removeClippedSubviews
                      onSlidingStart={() => {
                        if (controlsTimeout.current)
                          clearInterval(controlsTimeout.current); //prevent closing controls when sliding
                      }}
                      onSlidingComplete={(time) => {
                        player.currentTime = time;
                        if (!isPlaying) player.play(); //play if playback is paused
                        startTimeToHideControls(); //after time seek start to hide
                      }}
                      minimumTrackTintColor="hsl(47.9 95.8% 53.1%)"
                      maximumTrackTintColor="white"
                      thumbTintColor="hsl(47.9 95.8% 53.1%)"
                    />
                    <Text variant={"small"}>{formatTime(player.duration)}</Text>
                  </Animated.View>
                  <Animated.View
                    style={{
                      width: "auto",
                      flexDirection: "row",
                      justifyContent: "flex-end",
                      paddingHorizontal: 20,
                    }}
                  >
                    {FooterComponent}
                  </Animated.View>
                </Animated.View>
              </TouchableOpacity>
            </AnimatedLinearGradientView>
          )}
        </View>
      </PinchGestureHandler>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0)",
    position: "absolute",
    height: "100%",
    width: "100%",
    top: 1,
    zIndex: 10,
  },
  controlsContainer: {
    position: "absolute",
    zIndex: 10,
    flex: 1,
    height: "100%",
    width: "auto",
    paddingVertical: 10,
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  controlsInner: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    flexGrow: 1,
    height: "auto",
    width: "100%",
  },
});

const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

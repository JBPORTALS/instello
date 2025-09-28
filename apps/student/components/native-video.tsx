import type {
  VideoContentFit,
  VideoMetadata,
  VideoPlayer,
  VideoViewProps,
} from "expo-video";
import React from "react";
import {
  ActivityIndicator,
  BackHandler,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  ViewProps,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useEvent } from "expo";
import * as NavigationBar from "expo-navigation-bar";
import { router } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import { setStatusBarHidden } from "expo-status-bar";
import { useVideoPlayer, VideoSource, VideoView } from "expo-video";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import Slider from "@react-native-community/slider";
import mux from "mux-embed";
import {
  ArrowLeftIcon,
  ArrowsInSimpleIcon,
  ArrowsOutSimpleIcon,
  CaretDownIcon,
  ClockClockwiseIcon,
  ClockCounterClockwiseIcon,
  PauseIcon,
  PlayIcon,
} from "phosphor-react-native";

// const MuxVideo = createMuxVideo(VideoView);

const NativeVideoPlayerContext = React.createContext({
  fullscreen: false,
  setFullscreen: (value: boolean) => {},
});

export const NativeVideo = ({ ...props }: ViewProps) => {
  const [fullscreen, setFullscreen] = React.useState(false);

  return (
    <NativeVideoPlayerContext.Provider value={{ fullscreen, setFullscreen }}>
      <View {...props} />
    </NativeVideoPlayerContext.Provider>
  );
};

NativeVideo.Content = ({ ...props }: ViewProps) => {
  const { fullscreen } = React.useContext(NativeVideoPlayerContext);

  if (fullscreen) return null;

  return <View {...props} />;
};

const generateShortId = () => {
  return (
    "000000" + ((Math.random() * Math.pow(36, 6)) << 0).toString(36)
  ).slice(-6);
};

interface MuxVideoProps extends VideoViewProps {
  muxOptions: Parameters<typeof mux.init>[1];
}

const withMuxVideo = <P extends VideoViewProps>(
  WrappedComponent: React.ComponentType<P>,
) => {
  return React.forwardRef<VideoView, MuxVideoProps>((props, ref) => {
    const { muxOptions, ...videoViewProps } = props;
    const muxPlayerId = React.useRef<string>(`mux-player-${generateShortId()}`);
    const muxInitialized = React.useRef<boolean>(false);

    // Initialize Mux analytics
    React.useEffect(() => {
      if (muxOptions && !muxInitialized.current) {
        try {
          mux.init(muxPlayerId.current, muxOptions);
          muxInitialized.current = true;
        } catch (error) {
          console.warn("Failed to initialize Mux analytics:", error);
        }
      }
    }, [muxOptions]);

    // Safe cleanup function that works in React Native
    const cleanupMux = React.useCallback(() => {
      if (muxInitialized.current) {
        try {
          // Try the destroy event first (React Native compatible)
          mux.emit(muxPlayerId.current, "destroy");
        } catch (error) {
          console.warn("Failed to emit destroy event:", error);
        } finally {
          muxInitialized.current = false;
        }
      }
    }, []);

    // Cleanup Mux monitoring on unmount
    React.useEffect(() => {
      return () => {
        cleanupMux();
      };
    }, [cleanupMux]);

    // Additional cleanup when muxOptions change
    React.useEffect(() => {
      return () => {
        if (muxInitialized.current) {
          try {
            mux.emit(muxPlayerId.current, "destroy");
            muxInitialized.current = false;
          } catch (error) {
            console.warn(
              "Failed to cleanup Mux monitor on options change:",
              error,
            );
          }
        }
      };
    }, [muxOptions]);

    // Track video events
    const trackEvent = React.useCallback(
      (eventType: Parameters<typeof mux.emit>[1], data?: any) => {
        if (muxInitialized.current) {
          try {
            mux.emit(muxPlayerId.current, eventType, data);
          } catch (error) {
            console.warn("Failed to emit Mux event:", error);
          }
        }
      },
      [],
    );

    // Track time updates for playhead position
    React.useEffect(() => {
      if (!muxInitialized.current) return;

      const interval = setInterval(() => {
        if (
          videoViewProps.player?.playing &&
          videoViewProps.player?.currentTime > 0
        ) {
          trackEvent("timeupdate", {
            currentTime: videoViewProps.player.currentTime,
            duration: videoViewProps.player.duration,
          });
        }
      }, 1000); // Update every second

      return () => clearInterval(interval);
    }, [
      videoViewProps.player?.playing,
      videoViewProps.player?.currentTime,
      trackEvent,
    ]);

    // Only add event handlers if they exist on the incoming props, to avoid TS errors.
    const eventHandlers: {
      prop: string;
      event: Parameters<typeof mux.emit>[1];
    }[] = [
      { prop: "onLoadStart", event: "viewinit" },
      { prop: "onLoad", event: "loadstart" },
      { prop: "onPlay", event: "play" },
      { prop: "onPause", event: "pause" },
      { prop: "onSeek", event: "seeked" },
      { prop: "onEnd", event: "ended" },
      { prop: "onError", event: "error" },
      { prop: "onBuffer", event: "waiting" },
      { prop: "onCanPlay", event: "playerready" },
      { prop: "onCanPlayThrough", event: "playing" },
      { prop: "onStalled", event: "stalled" },
      { prop: "onWaiting", event: "waiting" },
    ] as const;

    // Build enhancedProps by only overriding handlers that exist on videoViewProps
    const enhancedProps = {
      ...videoViewProps,
      ref,
    } as P & { ref: typeof ref };

    for (const { prop, event } of eventHandlers) {
      // Only override if the prop exists on videoViewProps
      if (
        prop in videoViewProps &&
        typeof (videoViewProps as any)[prop] === "function"
      ) {
        (enhancedProps as any)[prop] = (...args: any[]) => {
          trackEvent(event);
          (videoViewProps as any)[prop]?.(...args);
        };
      }
    }

    return <WrappedComponent {...enhancedProps} />;
  });
};

// Create a Mux-enabled VideoView component
const MuxVideoView = withMuxVideo(VideoView);

NativeVideo.Player = ({
  videoSource,
  videoId,
  muxOptions,
}: {
  videoSource: VideoSource;
  videoId: string;
  muxOptions?: Parameters<typeof mux.init>[1];
}) => {
  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = true;
    player.timeUpdateEventInterval = 1;
    player.play();
  });
  const videoRef = React.useRef<VideoView>(null);

  const [metadata] = React.useState(
    typeof videoSource === "object" ? videoSource?.metadata : undefined,
  );

  const { fullscreen, setFullscreen } = React.useContext(
    NativeVideoPlayerContext,
  );

  const [resizeMode, setResizeMode] =
    React.useState<VideoContentFit>("contain");

  // Default Mux options if not provided
  const defaultMuxOptions: Parameters<typeof mux.init>[1] = {
    data: {
      env_key: process.env.EXPO_PUBLIC_MUX_ENV_KEY,
      player_name: "Instello - Mobile Player",
      player_version: "1.0.0",
      video_id: videoId,
      video_title: metadata?.title,
      video_series: metadata?.artist,
      video_duration: player.duration,
      video_stream_type: "on-demand",
    },
  };

  const finalMuxOptions = muxOptions || defaultMuxOptions;

  return (
    <View style={{ backgroundColor: "black", flex: fullscreen ? 1 : 0 }}>
      <View
        style={[
          fullscreen
            ? StyleSheet.absoluteFill // fullscreen covers whole screen
            : { aspectRatio: 16 / 9 }, // inline player
        ]}
      >
        <MuxVideoView
          ref={videoRef}
          style={StyleSheet.absoluteFill}
          player={player}
          nativeControls={false}
          contentFit={resizeMode}
          muxOptions={finalMuxOptions}
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
};

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

  const stopTimeToHideControls = () => {
    // Clear any existing timeout before setting a new one
    if (controlsTimeout.current) {
      clearTimeout(controlsTimeout.current);
    }
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

  const togglePlaying = () => {
    if (player.playing) {
      player.pause();
      stopTimeToHideControls();
    } else {
      player.play();
      startTimeToHideControls();
    }
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

  // Track time updates for Mux analytics
  React.useEffect(() => {
    const interval = setInterval(() => {
      if (player.playing && player.currentTime > 0) {
        // This will be handled by the MuxVideoView component
      }
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, [player.playing, player.currentTime]);

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
                  className="text-white"
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
                  className="text-white"
                  size={24}
                />
              </Button>
            </View>

            {/** Play Puase & Loading state */}
            <View className="flex-row items-center gap-6 pb-4">
              <Button
                size={"icon"}
                variant={"ghost"}
                className="rounded-full bg-black/40 p-6"
                onPress={() => {
                  player.seekBy(-10);
                  startTimeToHideControls();
                }}
              >
                <Icon
                  as={ClockCounterClockwiseIcon}
                  className="text-white"
                  size={32}
                />
              </Button>

              <Button
                size={"icon"}
                disabled={player.status === "loading"}
                className={cn("rounded-full bg-black/40 p-8")}
                variant={"ghost"}
                onPress={() => togglePlaying()}
                style={{ opacity: player.status !== "loading" ? 100 : 0 }}
              >
                <Icon
                  as={player.playing ? PauseIcon : PlayIcon}
                  size={40}
                  className="text-white"
                  weight="fill"
                />
              </Button>

              <Button
                onPress={() => {
                  player.seekBy(10);
                  startTimeToHideControls();
                }}
                size={"icon"}
                variant={"ghost"}
                className="rounded-full bg-black/40 p-6"
              >
                <Icon
                  as={ClockClockwiseIcon}
                  className="text-white"
                  size={32}
                />
              </Button>
            </View>

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

          {/** Loading indicator */}
          {player.status === "loading" && (
            <ActivityIndicator
              style={{ position: "absolute", top: "auto", bottom: "auto" }}
              size={64}
              color={"white"}
            />
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
              stopTimeToHideControls();
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

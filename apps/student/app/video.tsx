import type { VideoPlayer } from "expo-video";
import React, { useEffect, useLayoutEffect } from "react";
import {
  ActivityIndicator,
  AppState,
  BackHandler,
  Modal,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { useEvent } from "expo";
import * as NavigationBar from "expo-navigation-bar";
import { router, useLocalSearchParams } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import { useVideoPlayer, VideoSource, VideoView } from "expo-video";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import Slider from "@react-native-community/slider";
import { ExpandIcon } from "lucide-react-native";
import {
  ArrowLeftIcon,
  CaretDownIcon,
  MinusIcon,
  PauseIcon,
  PlayIcon,
} from "phosphor-react-native";

export default function VideoScreen() {
  const { playbackId } = useLocalSearchParams<{ playbackId: string }>();
  const videoSource: VideoSource = {
    uri: `https://stream.mux.com/${playbackId}.m3u8`,
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

  const [fullscreen, setFullscreen] = React.useState(false);

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
          contentFit="contain"
        />

        {/* Overlay controls */}
        <VideoControlsOverlay
          {...{ player, fullscreen }}
          onChangeFullScreen={setFullscreen}
        />
      </View>
    </View>
  );
}

function VideoControlsOverlay({
  player,
  fullscreen,
  onChangeFullScreen,
}: {
  player: VideoPlayer;
  fullscreen: boolean;
  onChangeFullScreen: (fullscreen: boolean) => void;
}) {
  const [sliding, setSliding] = React.useState(false);
  const [slidingTime, setSlidingTime] = React.useState(player.currentTime);

  const enterFullscreen = async () => {
    await ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.LANDSCAPE,
    );
    onChangeFullScreen(true);
  };

  const exitFullscreen = async () => {
    await ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.PORTRAIT_UP,
    );
    onChangeFullScreen(false);
  };

  React.useEffect(() => {
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      if (fullscreen) {
        exitFullscreen();
        return true;
      }
    });

    return () => sub.remove();
  }, [fullscreen]);

  // Events
  useEvent(player, "timeUpdate", {
    currentTime: player.currentTime,
    bufferedPosition: player.bufferedPosition,
    currentLiveTimestamp: player.currentLiveTimestamp,
    currentOffsetFromLive: player.currentOffsetFromLive,
  });

  return (
    <View style={styles.overlay}>
      {/** Controls Header*/}
      <View className="absolute left-4 right-4 top-4">
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
            size={18}
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
            onPress={() => (player.playing ? player.pause() : player.play())}
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

      {/** Sliding timespamp preview */}
      {sliding && (
        <View className="absolute bottom-8 rounded-full bg-black/30 px-2 py-0.5 backdrop-blur-sm">
          <Text className="text-sm text-white">{formatTime(slidingTime)}</Text>
        </View>
      )}

      {/** Controls footer */}
      <View
        className={cn(
          "absolute bottom-0 w-full items-center",
          fullscreen && "bottom-4",
        )}
      >
        <View className=" w-full flex-1 flex-row items-center justify-between px-4 py-3.5">
          <Text className="rounded-full bg-black/20 px-1 py-0.5 text-xs text-white">
            {formatTime(player.currentTime)} / {formatTime(player.duration)}
          </Text>
          <Button
            size={"icon"}
            className="rounded-full bg-black/40 p-5"
            variant={"ghost"}
            onPress={() => (fullscreen ? exitFullscreen() : enterFullscreen())}
          >
            <Icon
              weight="bold"
              as={fullscreen ? MinusIcon : ExpandIcon}
              color="white"
              size={18}
            />
          </Button>
        </View>
        <Slider
          style={{
            height: 1,
            width: "100%",
          }}
          minimumTrackTintColor="#F7941D"
          maximumTrackTintColor="white"
          thumbTintColor="#F7941D"
          maximumValue={player.duration}
          value={player.currentTime}
          onSlidingStart={(time) => {
            setSliding(true);
            setSlidingTime(time);
            player.pause();
          }}
          onValueChange={(time) => {
            player.currentTime = time;
            setSlidingTime(time);
          }}
          onSlidingComplete={(time) => {
            setSliding(false);
            setSlidingTime(time);
            if (!player.playing) player.play(); //play if playback is paused
          }}
        />
      </View>
    </View>
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

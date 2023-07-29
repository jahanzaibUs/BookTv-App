import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { Slider, useColorMode } from "native-base";

import { PlayerState } from "@states/PlayerState";
import IconButton from "@components/IconButton";
import { infoStyles } from "./styles";

export const getMinutesSecondsFromMilliseconds = (ms: number) => {
  const totalSeconds = ms / 1000;
  const seconds = String(Math.floor(totalSeconds % 60));
  const minutes = String(Math.floor(totalSeconds / 60));

  return minutes.padStart(1, "0") + ":" + seconds.padStart(2, "0");
};

interface SliderControl {
  playerStatus: PlayerState;
  onSeekVideo: any;
  onTogglePlay: any;
  onToggleFullscreen?: any;
}

export default function SliderControl({
  playerStatus,
  onSeekVideo,
  onTogglePlay,
  onToggleFullscreen,
}: SliderControl) {
  const { colorMode } = useColorMode();
  const { positionMillis, durationMillis, isPlaying, isFullscreen, mode } =
    playerStatus;

  return (
    <View
      style={{
        ...infoStyles.bottomInfoWrapper,
        backgroundColor: colorMode === "dark" ? "#374151" : "white",
        borderBottomColor: colorMode === "dark" ? "coolGray.500" : "#f4f4f5",
      }}
    >
      <View style={infoStyles.rowWrapper}>
        {!!durationMillis ? (
          <Text
            style={{
              ...infoStyles.timeLeft,
              color: colorMode === "dark" ? "white" : "black",
            }}
          >
            {getMinutesSecondsFromMilliseconds(positionMillis)}
          </Text>
        ) : (
          <ActivityIndicator />
        )}

        <Slider
          value={positionMillis || 0}
          colorScheme="orange"
          style={infoStyles.slider}
          minValue={0}
          maxValue={durationMillis}
          onChangeEnd={(v) => {
            if (v !== durationMillis) {
              onSeekVideo({ position: v });
            }
          }}
        >
          <Slider.Track>
            <Slider.FilledTrack />
          </Slider.Track>
          <Slider.Thumb />
        </Slider>

        {!!durationMillis && (
          <Text
            style={{
              ...infoStyles.timeRight,
              color: colorMode === "dark" ? "white" : "black",
            }}
          >
            {getMinutesSecondsFromMilliseconds(durationMillis)}
          </Text>
        )}

        {mode === "video" && (
          <IconButton
            name={isFullscreen ? "fullscreen-exit" : "fullscreen"}
            family="MaterialCommunityIcons"
            size="md"
            onPress={() => onToggleFullscreen()}
          />
        )}
      </View>

      {mode === "audio" && (
        <View style={infoStyles.rowWrapper}>
          <IconButton
            name="rewind-10"
            family="MaterialCommunityIcons"
            size="md"
            color="gray"
            onPress={() => onSeekVideo({ type: "rewind" })}
          />
          <IconButton
            name={isPlaying ? "pause" : "play"}
            family="MaterialCommunityIcons"
            size="xl"
            onPress={onTogglePlay}
            ml={5}
            mr={5}
          />
          <IconButton
            name="fast-forward-10"
            family="MaterialCommunityIcons"
            size="md"
            color="gray"
            onPress={() => onSeekVideo({ type: "forward" })}
          />
        </View>
      )}
    </View>
  );
}

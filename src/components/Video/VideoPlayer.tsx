import React, { useEffect } from "react";
import { View } from "native-base";
import {
  Video,
  VideoProps,
  Audio,
  AVPlaybackStatus,
  ResizeMode,
  InterruptionModeIOS,
  InterruptionModeAndroid,
} from "expo-av";

import { PlayerState } from "@states/PlayerState";
import IconButton from "@components/IconButton";
import SliderControl from "./SliderControl";
import { styles } from "./styles";

interface VideoPlayerProps extends VideoProps {
  playerStatus: PlayerState;
  autoPlay?: boolean;
  onVideoLoad?: (status: AVPlaybackStatus) => void;
}

const VideoPlayer = React.forwardRef<Video, VideoPlayerProps>(
  (props: VideoPlayerProps, ref: any) => {
    const {
      playerStatus,
      posterSource,
      autoPlay = false,
      rate = 1,
      onVideoLoad,
      ...videoProps
    } = props;
    const audioOnly = playerStatus.mode === "audio";
    const [ready, setReady] = React.useState(false);

    useEffect(() => {
      const setAudioMode = async () => {
        await Audio.setIsEnabledAsync(true);
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          allowsRecordingIOS: false,
          staysActiveInBackground: true,
          interruptionModeIOS: InterruptionModeIOS.DoNotMix,
          interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: true,
        });
      };
      setAudioMode();
    }, []);

    const onLoad = async (status: AVPlaybackStatus) => {
      setReady(true);

      // ISSUE - https://github.com/expo/expo/issues/7485#issuecomment-974049816
      if (autoPlay) {
        if (ref && ref.current) {
          await ref.current.playAsync();
        }
      }
      // set max trial time
      if (onVideoLoad) {
        onVideoLoad(status);
      }
    };

    const onSeekVideo = async ({
      type,
      position,
    }: {
      type?: "forward" | "rewind";
      position?: number;
    }) => {
      if (ref && ref.current) {
        const state = await ref.current.getStatusAsync();

        if (state.isLoaded) {
          if (type) {
            const millis = 10000; // 30s
            const update = type === "rewind" ? -millis : millis;
            await ref.current.setStatusAsync({
              shouldPlay: true,
              positionMillis: state.positionMillis + update,
              toleranceMillisBefore: 0,
              toleranceMillisAfter: 0,
            });
          } else if (position) {
            await ref.current.setStatusAsync({
              shouldPlay: true,
              positionMillis: position,
              toleranceMillisBefore: 0,
              toleranceMillisAfter: 0,
            });
          }
          await ref.current.playAsync();
        }
      }
    };

    const onTogglePlay = async () => {
      if (ref && ref.current) {
        if (playerStatus.isPlaying) {
          await ref.current.pauseAsync();
        } else {
          await ref.current.playAsync();
        }
      }
    };

    const onToggleFullscreen = async () => {
      if (ref && ref.current) {
        await ref.current.pauseAsync();

        if (playerStatus.isFullscreen) {
          await ref.current.dismissFullscreenPlayer();
        } else {
          await ref.current.presentFullscreenPlayer();
        }
        ref.current.playAsync();
      }
    };

    const ControlOverlay = () => (
      <View
        style={[
          styles.controlOverlay,
          playerStatus.isPlaying ? styles.inactiveOvelay : styles.activeOvelay,
        ]}
      >
        <IconButton
          name="rewind-10"
          family="MaterialCommunityIcons"
          size="md"
          color={playerStatus.isPlaying ? "#ffffff99" : "#fff"}
          onPress={() => onSeekVideo({ type: "rewind" })}
          m={4}
        />
        <IconButton
          name={playerStatus.isPlaying ? "pause" : "play"}
          family="MaterialCommunityIcons"
          size="2xl"
          color={playerStatus.isPlaying ? "#ffffff00" : "#fff"}
          onPress={() => onTogglePlay()}
          m={8}
        />
        <IconButton
          name="fast-forward-10"
          family="MaterialCommunityIcons"
          size="md"
          color={playerStatus.isPlaying ? "#ffffff99" : "#fff"}
          onPress={() => onSeekVideo({ type: "forward" })}
          m={4}
        />
      </View>
    );

    const hiddenStyle = audioOnly ? styles.hidden : {};
    return (
      <>
        <View style={{ ...styles.videoContainer, ...hiddenStyle }}>
          {ready && !audioOnly && <ControlOverlay />}

          <Video
            ref={ref}
            style={{ ...styles.video, ...hiddenStyle }}
            source={{ uri: playerStatus.url || "" }}
            resizeMode={ResizeMode.CONTAIN}
            rate={rate}
            shouldCorrectPitch
            progressUpdateIntervalMillis={1000} // default 500
            onLoad={onLoad}
            usePoster={!ready && !!posterSource}
            {...videoProps}
          />
        </View>
        <SliderControl
          playerStatus={playerStatus}
          onSeekVideo={onSeekVideo}
          onTogglePlay={onTogglePlay}
          onToggleFullscreen={onToggleFullscreen}
        />
      </>
    );
  }
);

export default VideoPlayer;

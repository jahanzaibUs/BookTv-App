import React, { useRef } from "react";
import { Box, HStack, Text, Pressable } from "native-base";
import { Video, ResizeMode } from "expo-av";
import { useNavigation } from "@react-navigation/native";

import IconButton from "@components/IconButton";
import Layout from "@styles/Layout";
import ROUTES from "@navigation/Routes";
import { useAppDispatch, useAppSelector } from "@hooks/redux";
import { getCurrentLesson } from "@selectors/lessonSelector";
import { getPlayerState } from "@selectors/playerSelector";
import { updatePlayer } from "@actions/playerAction";
import { miniStyles } from "./styles";

const MiniPlayer = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const currentLesson = useAppSelector(getCurrentLesson);
  const player = useAppSelector(getPlayerState);
  const miniRef = useRef<Video | null>(null);
  const bottomMargin = 49;

  const updateVideoPlayer = async (state: string, value: any) => {
    await dispatch(updatePlayer({ [state]: value }));
  };

  const onClosePlayer = () => {
    navigation.navigate(ROUTES.HOME_TAB);
    dispatch(updatePlayer());
  };

  const openFullscreen = () => {
    updateVideoPlayer("isVisible", false);
    navigation.navigate(ROUTES.LESSON_TAB, {
      screen: ROUTES.VIDEO_LESSON,
    });
  };

  const togglePlay = () => {
    updateVideoPlayer("isPlaying", !player.isPlaying);
  };

  if (player.isVisible) {
    return (
      <HStack
        position="absolute"
        zIndex={999}
        left={0}
        right={0}
        bottom={bottomMargin}
        width={Layout.deviceWidth}
        justifyContent="space-between"
        alignItems="center"
        _light={{ bg: "white" }}
        _dark={{ bg: "coolGray.800" }}
        borderTopWidth={1}
        borderColor="gray.200"
      >
        <Pressable flex={1} onPress={openFullscreen} hitSlop={20}>
          <HStack>
            <Video
              ref={miniRef}
              style={miniStyles.video}
              // source={{ uri: player.url || "" }}
              resizeMode={ResizeMode.COVER}
              posterSource={{
                uri: currentLesson.thumbnail?.url,
              }}
              posterStyle={miniStyles.thumbnail}
              usePoster
            />

            <Box px={4} py={2} flex={1}>
              <Text fontSize="sm" fontWeight={500} noOfLines={1}>
                {currentLesson.title}
              </Text>
              {!!currentLesson.author && (
                <Text fontSize="sm" noOfLines={1} mt={-1}>
                  {currentLesson.author}
                </Text>
              )}
            </Box>
          </HStack>
        </Pressable>

        <HStack>
          <IconButton
            name={player.isPlaying ? "pause" : "play"}
            family="MaterialCommunityIcons"
            size="md"
            onPress={() => togglePlay()}
            ml={4}
          />
          <IconButton
            name="close"
            family="MaterialCommunityIcons"
            size="md"
            onPress={() => onClosePlayer()}
            ml={6}
            mr={4}
          />
        </HStack>
      </HStack>
    );
  }
  return null;
};

export default MiniPlayer;

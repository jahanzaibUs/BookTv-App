import React from "react";
import { TouchableOpacity } from "react-native";
import { Heading, Image, HStack, Stack, Text } from "native-base";

import Layout from "@styles/Layout";
import { getFileUrl } from "@utils/file";
import { LessonCollection } from "@store/states/LessonState";
import ProgressBar from "@components/Video/ProgressBar";

interface BookmarkListItemProps {
  imageSource: { url: string };
  title: string;
  desc: string;
  author?: string;
  collection?: LessonCollection;
  onPress?: () => void;
  isFirst?: boolean;
  played: boolean;
  totalTime: number;
  currentTime?: number;
}

const BookmarkListItem = ({
  imageSource,
  title,
  desc,
  onPress,
  author,
  played,
  totalTime,
  currentTime = 0,
}: BookmarkListItemProps) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <HStack
        mb={5}
        _light={{ bg: "white" }}
        _dark={{ bg: "coolGray.900" }}
        height={Layout.scaleHeight(15)}
        minHeight={120}
        justifyContent="space-between"
      >
        <Image
          source={{ uri: getFileUrl(imageSource?.url) }}
          alt={title}
          width={`${Layout.scaleWidth(20)}px`}
          height="100%"
          resizeMode={imageSource ? "contain" : "cover"}
        />

        <Stack mx={5} flex={1}>
          <Heading size="sm" noOfLines={1}>
            {title}
          </Heading>
          <Text
            fontSize="sm"
            noOfLines={1}
            _light={{ color: "gray.500" }}
            _dark={{ color: "coolGray.200" }}
          >
            {desc}
          </Text>
          {!!author && (
            <Text
              fontSize="sm"
              fontWeight="400"
              _light={{ color: "gray.500" }}
              _dark={{ color: "coolGray.200" }}
            >
              {author}
            </Text>
          )}

          <Stack mt={2}>
            <ProgressBar
              played={played}
              total={totalTime}
              current={currentTime}
            />
          </Stack>
        </Stack>
      </HStack>
    </TouchableOpacity>
  );
};

export default BookmarkListItem;

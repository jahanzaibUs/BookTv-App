import React from "react";
import { TouchableOpacity } from "react-native";
import { Box, Heading, Icon, Image, Text, Stack } from "native-base";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import Layout from "@styles/Layout";
import { getFileUrl } from "@utils/file";
import { LessonCollection } from "@store/states/LessonState";

interface VideoPreviewProps {
  imageSource: { url: string };
  title: string;
  onPress?: () => void;
  isFirst?: boolean;
  author?: string;
  duration?: string;
  category: LessonCollection;
}

const SIZE = Layout.scaleWidth(55);

const VideoPreview = (props: VideoPreviewProps) => {
  const { imageSource, onPress, title, isFirst, author, category, duration } =
    props;

  return (
    <Box
      _light={{ bg: "white" }}
      _dark={{ bg: "coolGray.900" }}
      ml={isFirst ? 5 : 0}
      mr={5}
    >
      <TouchableOpacity onPress={onPress}>
        <Box width={SIZE} style={{ aspectRatio: 16 / 9 }}>
          <Image
            source={{ uri: getFileUrl(imageSource?.url) }}
            alt={title}
            resizeMode="cover"
            style={{ aspectRatio: 16 / 9 }}
          />
          <Icon
            as={<MaterialCommunityIcons name="play-circle" />}
            color="primary.600"
            size="xl"
            position="absolute"
            top={45}
            alignSelf="center"
          />
        </Box>

        <Stack mt={2} px={3} pb={3}>
          <Heading size="sm" noOfLines={1}>
            {title}
          </Heading>
          {category && (
            <Heading size="xs" color="primary.400" mt={-1}>
              {category.name}
            </Heading>
          )}
          <Text
            fontSize="sm"
            _light={{ color: "gray.500" }}
            _dark={{ color: "coolGray.200" }}
            mt={-2}
          >
            {!!author && `${author}`}
          </Text>
        </Stack>
      </TouchableOpacity>
    </Box>
  );
};

export default VideoPreview;

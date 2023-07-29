import React from "react";
import { TouchableOpacity } from "react-native";
import { Box, Heading, AspectRatio, Image, Stack, Text } from "native-base";

import Layout from "@styles/Layout";
import { getFileUrl } from "@utils/file";
import { LessonCollection } from "@store/states/LessonState";

interface BookCardProps {
  imageSource: { url: string };
  title: string;
  desc: string;
  author?: string;
  collection?: LessonCollection;
  category: LessonCollection;
  duration?: number;
  onPress?: () => void;
  isFirst?: boolean;
}

const BookCard = (props: BookCardProps) => {
  const { imageSource, title, author, category, onPress, duration, isFirst } =
    props;

  return (
    <Box
      width={`${Layout.scaleWidth(38)}px`}
      ml={isFirst ? 5 : 0}
      mr={5}
      mb={1}
      borderRadius={12}
      _light={{ bg: "white" }}
      _dark={{ bg: "coolGray.900" }}
    >
      <TouchableOpacity onPress={onPress}>
        <AspectRatio ratio={1410 / 2250}>
          <Image source={{ uri: getFileUrl(imageSource?.url) }} alt={title} />
        </AspectRatio>

        <Stack mt={2} px={3} pb={3}>
          <Heading size="sm" noOfLines={1}>
            {title}
          </Heading>
          {category && (
            <Heading size="xs" color="primary.400" mt={-1}>
              {category.name}
            </Heading>
          )}
          <Text fontSize="sm" color="gray.500" mt={-1}>
            {!!author && `${author}`}
          </Text>
        </Stack>
      </TouchableOpacity>
    </Box>
  );
};

export default BookCard;

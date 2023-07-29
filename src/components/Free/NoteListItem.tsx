import React from "react";
import { TouchableOpacity } from "react-native";
import { Heading, Image, Box, Stack } from "native-base";

import Layout from "@styles/Layout";
import { getFileUrl } from "@utils/file";

interface NoteListItemProps {
  imageSource: { url: string };
  title: string;
  onPress?: () => void;
  isFirst?: boolean;
}

const SIZE = Layout.scaleWidth(55);

const NoteListItem = (props: NoteListItemProps) => {
  const { imageSource, title, onPress, isFirst } = props;

  return (
    <TouchableOpacity onPress={onPress}>
      <Box
        _light={{ bg: "white" }}
        _dark={{ bg: "coolGray.900" }}
        width={SIZE}
        ml={isFirst ? 5 : 0}
        mr={5}
      >
        <Image
          source={{ uri: getFileUrl(imageSource?.url) }}
          alt={title}
          resizeMode="cover"
          style={{ aspectRatio: 16 / 9 }}
        />

        <Stack mx={2} mt={2} pb={3}>
          <Heading size="sm" noOfLines={1}>
            {title}
          </Heading>
        </Stack>
      </Box>
    </TouchableOpacity>
  );
};

export default NoteListItem;
